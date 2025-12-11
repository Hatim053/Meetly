import React, { useEffect, useRef, useState } from "react"
import styles from './callPage.module.css'
import { useParams, useLocation } from "react-router-dom"
import { io } from "socket.io-client"
import { v4 as uuidv4 } from "uuid"
import CallContainer from "../CallContainer/CallContainer.jsx"
import { useDispatch , useSelector } from "react-redux"
import { addRoomId } from '../../../user/roomSlice.js'
import ChatBox from '../ChatBox/ChatBox.jsx'

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};


function CallPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const name = location.state?.name || "Anonymous";
  const dispatch = useDispatch();
  dispatch(addRoomId(roomId));

  const loggedInUser = useSelector((s) => s.loggedInUser);
const pendingCandidatesRef = useRef([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const pcRef = useRef(null);
  const socketRef = useRef(null);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const userIdRef = useRef(uuidv4());
  const remoteUserIdRef = useRef(null);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);

  // ---------- Mount: get media & connect socket ----------
  useEffect(() => {
    let mounted = true;

  async function start() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = stream;
    localVideoRef.current.srcObject = stream;
  } catch (err) {
    alert("Camera/Mic error: " + err.message);
    return;
  }

  // SOCKET CONNECTION
  socketRef.current = io(import.meta.env.VITE_SERVER_SIDE_URL);
  const socket = socketRef.current;

  socket.on("connect", () => {
    userIdRef.current = loggedInUser._id;

    socket.emit("join-room", {
      roomId,
      userId: userIdRef.current,
      name: loggedInUser.name
    });
  });

  // Get existing users on join
  socket.on("room-users", async ({ users }) => {
    const other = users.find((u) => u !== userIdRef.current);

    if (other) {
      console.log("Found remote user:", other);
      remoteUserIdRef.current = other;

      // Create PeerConnection
      await ensurePeerConnection();

      // YOU create the offer only if you're initiator
      const isInitiator = String(userIdRef.current) < String(other);

      if (isInitiator) {
        console.log("I am initiator → creating offer");
        const offer = await pcRef.current.createOffer();
        await pcRef.current.setLocalDescription(offer);

        socket.emit("offer", {
          to: other,
          from: userIdRef.current,
          sdp: offer
        });
      }
    }
  });

  // When new user joins the room
  socket.on("user-joined", async ({ userId: otherId }) => {
    console.log("User joined:", otherId);
    remoteUserIdRef.current = otherId;
    await ensurePeerConnection();
  });

  // RECEIVED OFFER
  socket.on("offer", async ({ from, sdp }) => {
    console.log("Received Offer from:", from);

    remoteUserIdRef.current = from;
    await ensurePeerConnection();

    await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));

    const answer = await pcRef.current.createAnswer();
    await pcRef.current.setLocalDescription(answer);

    socket.emit("answer", {
      to: from,
      from: userIdRef.current,
      sdp: answer
    });
  });

  // RECEIVED ANSWER
  socket.on("answer", async ({ from, sdp }) => {
    console.log("Received Answer from:", from);

    if (!pcRef.current.currentRemoteDescription) {
      await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    }

    // Apply pending ICE candidates
    while (pendingCandidatesRef.current.length > 0) {
      const candidate = pendingCandidatesRef.current.shift();
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  // RECEIVED ICE CANDIDATE
  socket.on("ice-candidate", async ({ candidate }) => {
    if (!candidate) return;

    if (!pcRef.current || !pcRef.current.remoteDescription) {
      // remoteDescription not ready — buffer candidate
      pendingCandidatesRef.current.push(candidate);
      return;
    }

    await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
  });

  socket.on("user-left", () => {
    cleanup();
    alert("User disconnected");
  });
}


    if (mounted) start();

    return () => {
      mounted = false;
      // full cleanup
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // ---------- create PeerConnection & wiring ----------
 async function ensurePeerConnection() {
  if (pcRef.current) return;

  console.log("PeerConnection created");

  pcRef.current = new RTCPeerConnection(ICE_SERVERS);

  // Show ICE state
  pcRef.current.oniceconnectionstatechange = () => {
    console.log("ICE State:", pcRef.current.iceConnectionState);
  };

  // Setup remote stream
  if (!remoteStreamRef.current) {
    remoteStreamRef.current = new MediaStream();
    remoteVideoRef.current.srcObject = remoteStreamRef.current;
  }

  // Add ALL your local tracks
  localStreamRef.current.getTracks().forEach((track) => {
    pcRef.current.addTrack(track, localStreamRef.current);
  });

  // Remote tracks
  pcRef.current.ontrack = (event) => {
    console.log("Remote track received", event);

    event.streams[0].getTracks().forEach((t) => {
      remoteStreamRef.current.addTrack(t);
    });

    remoteVideoRef.current.srcObject = remoteStreamRef.current;
  };

  // ICE candidates
  pcRef.current.onicecandidate = (event) => {
    if (event.candidate) {
      socketRef.current.emit("ice-candidate", {
        candidate: event.candidate,
        to: remoteUserIdRef.current,
        from: userIdRef.current
      });
    }
  };
}


  // ---------- toggles ----------
  function toggleMute() {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMuted((p) => !p);
  }

  function toggleCamera() {
    localStreamRef.current?.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCameraOff((p) => !p);
  }

  async function toggleScreenShare() {
    if (!pcRef.current || !localStreamRef.current) return;
    if (!sharingScreen) {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screen.getVideoTracks()[0];

        // find sender and replace
        const sender = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }

        // locally swap track so your preview shows screen
        localStreamRef.current.getVideoTracks().forEach((t) => {
          localStreamRef.current.removeTrack(t);
          t.stop();
        });
        localStreamRef.current.addTrack(screenTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;

        screenTrack.onended = async () => {
          // restore camera
          const cam = await navigator.mediaDevices.getUserMedia({ video: true });
          const camTrack = cam.getVideoTracks()[0];
          const sender2 = pcRef.current.getSenders().find((s) => s.track?.kind === "video");
          if (sender2) await sender2.replaceTrack(camTrack);

          localStreamRef.current.getVideoTracks().forEach((t) => {
            localStreamRef.current.removeTrack(t);
            t.stop();
          });
          localStreamRef.current.addTrack(camTrack);
          if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
          setSharingScreen(false);
        };

        setSharingScreen(true);
      } catch (err) {
        console.error("Screen share failed", err);
      }
    }
  }

  // ---------- cleanup helpers ----------
  function cleanupPeer() {
    try {
      pcRef.current?.close();
    } catch (e) {
      console.warn("PC close error", e);
    }
    pcRef.current = null;

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((t) => t.stop());
      remoteStreamRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }

  function cleanup() {
    cleanupPeer();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;

    try {
      socketRef.current?.disconnect();
    } catch (e) {
      console.warn("Socket disconnect error", e);
    }
    socketRef.current = null;
  }

  function leaveCall() {
    try {
      socketRef.current?.emit("leave-room", { roomId, userId: userIdRef.current });
    } catch (e) {}
    cleanup();
    window.location.href = "/";
  }

  function controlCamera() {
    socketRef.current?.emit("control-camera", { roomId });
  }

  // ---------- UI ----------
  return (
    <>
      <div className={styles["call-page-container"]}>
         <CallContainer
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          toggleCamera={toggleCamera}
          toggleMute={toggleMute}
          toggleScreenShare={toggleScreenShare}
          leaveCall={leaveCall}
          muted={muted}
          cameraOff={cameraOff}
          sharingScreen={sharingScreen}
        />
        <ChatBox />
      </div>
    </>
  );
}

export default CallPage;
