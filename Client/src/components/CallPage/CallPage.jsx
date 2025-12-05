import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function CallPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name || "Anonymous";

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(new MediaStream());
  const userIdRef = useRef(uuidv4());
  const remoteUserIdRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);

  useEffect(() => {
    start();
    return () => cleanup();
  }, []);

  socketRef.current?.on('control' , () => {
    toggleCamera()
  })
  async function start() {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = localStream;
      localVideoRef.current.srcObject = localStream;
    } catch (err) {
      alert("Could not access camera/mic: " + err.message);
      return;
    }

    socketRef.current = io(import.meta.env.VITE_SERVER_SIDE_URL);
    const socket = socketRef.current;
    const myId = userIdRef.current;

    socket.on("connect", () => {
      socket.emit("join-room", { roomId, userId: myId, name });
    });

    // Who is already in the room
    socket.on("room-users", ({ users }) => {
      const remoteId = users.find((id) => id !== userIdRef.current);
      if (remoteId) remoteUserIdRef.current = remoteId;
    });

    // New user joined -> this user creates offer
    socket.on("user-joined", async ({ userId: otherUserId }) => {
      if (otherUserId === userIdRef.current) return;
      remoteUserIdRef.current = otherUserId;
      await ensurePeerConnection();

      const offer = await pcRef.current.createOffer();
      await pcRef.current.setLocalDescription(offer);

      socket.emit("offer", {
        to: otherUserId,
        from: userIdRef.current,
        sdp: offer,
      });
    });

    socket.on("offer", async ({ from, sdp }) => {
      remoteUserIdRef.current = from;
      await ensurePeerConnection();
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("answer", { to: from, from: userIdRef.current, sdp: answer });
    });

    socket.on("answer", async ({ from, sdp }) => {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (candidate && pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error("Failed to add ICE candidate", err);
        }
      }
    })

  

    socket.on("user-left", () => {
      cleanup();
      alert("User disconnected.");
    });
  }

  async function ensurePeerConnection() {
    if (pcRef.current) return;

    pcRef.current = new RTCPeerConnection(ICE_SERVERS);

    // Add local tracks
    localStreamRef.current.getTracks().forEach((track) => {
      pcRef.current.addTrack(track, localStreamRef.current);
    });

    // Set remote stream
    remoteVideoRef.current.srcObject = remoteStreamRef.current;

    pcRef.current.ontrack = (event) => {
      remoteStreamRef.current = event.streams[0];
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate && remoteUserIdRef.current) {
        socketRef.current.emit("ice-candidate", {
          to: remoteUserIdRef.current,
          from: userIdRef.current,
          candidate: event.candidate,
        });
      }
    };
  }

  async function toggleScreenShare() {
    if (!sharingScreen) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(screenTrack);

        screenTrack.onended = async () => {
          const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const camTrack = camStream.getVideoTracks()[0];
          if (sender) sender.replaceTrack(camTrack);

          localStreamRef.current.removeTrack(localStreamRef.current.getVideoTracks()[0]);
          localStreamRef.current.addTrack(camTrack);
          localVideoRef.current.srcObject = localStreamRef.current;
          setSharingScreen(false);
        };

        localStreamRef.current.removeTrack(localStreamRef.current.getVideoTracks()[0]);
        localStreamRef.current.addTrack(screenTrack);
        localVideoRef.current.srcObject = localStreamRef.current;
        setSharingScreen(true);
      } catch (err) {
        console.error("Screen share failed", err);
      }
    }
  }

  function toggleMute() {
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMuted((prev) => !prev);
  }

  function toggleCamera() {
    localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCameraOff((prev) => !prev);
  }

  function leaveCall() {
    socketRef.current?.emit("leave-room", { roomId, userId: userIdRef.current });
    cleanup();
    window.location.href = "/";
  }

  function cleanup() {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    remoteStreamRef.current?.getTracks().forEach((t) => t.stop());

    socketRef.current?.disconnect();
  }


  function controlCamera() {
    socketRef.current?.emit('control-camera' , {roomId})
  }
  
  return (
    <div style={{ padding: 10 }}>
      <h2>Room: {roomId}</h2>

      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <h4>You</h4>
          <video ref={localVideoRef} autoPlay muted playsInline width="300" />
        </div>

        <div>
          <h4>Remote</h4>
          <video ref={remoteVideoRef} autoPlay playsInline width="300" />
        </div>
      </div>

      <div style={{ marginTop: 15 }}>
        <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>
        <button onClick={toggleCamera}>{cameraOff ? "Turn Camera On" : "Turn Camera Off"}</button>
        <button onClick={toggleScreenShare}>
          {sharingScreen ? "Stop Screen" : "Share Screen"}
        </button>
        <button onClick={leaveCall} style={{ marginLeft: 20 }}>
          Leave Call
        </button>
      </div>

      <div style={{ marginTop: 15 }}>
        <p>Share this link:</p>
        <input readOnly value={`${window.location.origin}/call/${roomId}`} style={{ width: "80%" }} />
      </div>
    </div>
  );
}

export default CallPage;
