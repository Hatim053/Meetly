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
  const host = useSelector((s) => s.host);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const pcRef = useRef(null);
  const socketRef = useRef(null);

  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const videoSenderRef = useRef(null); 

  const pendingCandidatesRef = useRef([]);
  const userIdRef = useRef(uuidv4());
  const remoteUserIdRef = useRef(null);

  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);

 

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
      } catch (err) {
        alert("Camera/Mic error: " + err.message);
        return;
      }

      await ensurePeerConnection();

      socketRef.current = io(import.meta.env.VITE_SERVER_SIDE_URL);
      const socket = socketRef.current;

      socket.on("connect", () => {
        userIdRef.current = loggedInUser._id;

        socket.emit("join-room", {
          roomId,
          userId: userIdRef.current,
          name: loggedInUser.name,
        });
      });

      socket.on("room-users", async ({ users }) => {
        const other = users.find((u) => u !== userIdRef.current);
        if (!other) return;

        remoteUserIdRef.current = other;

        const isInitiator =
          String(userIdRef.current) < String(other);

        if (isInitiator) {
          const offer = await pcRef.current.createOffer();
          await pcRef.current.setLocalDescription(offer);

          socket.emit("offer", {
            to: other,
            from: userIdRef.current,
            sdp: offer,
          });
        }
      });

      socket.on("offer", async ({ from, sdp }) => {
        remoteUserIdRef.current = from;

        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(sdp)
        );

        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);

        socket.emit("answer", {
          to: from,
          from: userIdRef.current,
          sdp: answer,
        });
      });

      socket.on("answer", async ({ sdp }) => {
        if (!pcRef.current.currentRemoteDescription) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );
        }

        while (pendingCandidatesRef.current.length) {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(pendingCandidatesRef.current.shift())
          );
        }
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        if (!candidate) return;

        if (!pcRef.current?.remoteDescription) {
          pendingCandidatesRef.current.push(candidate);
          return;
        }

        await pcRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      });

     

      socket.on("user-left", cleanup);
    }

    if (mounted) start();
    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  //Peer Connection
  async function ensurePeerConnection() {
    if (pcRef.current) return;

    pcRef.current = new RTCPeerConnection(ICE_SERVERS);

    remoteStreamRef.current = new MediaStream();
    remoteVideoRef.current.srcObject = remoteStreamRef.current;

    localStreamRef.current.getTracks().forEach((track) => {
      const sender = pcRef.current.addTrack(
        track,
        localStreamRef.current
      );

      if (track.kind === "video") {
        videoSenderRef.current = sender; // STORE VIDEO SENDER
      }
    });

    pcRef.current.ontrack = (event) => {
      event.streams[0].getTracks().forEach((t) =>
        remoteStreamRef.current.addTrack(t)
      );
    };

    pcRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", {
          candidate: event.candidate,
          to: remoteUserIdRef.current,
          from: userIdRef.current,
        });
      }
    };
  }


//controls
  function toggleMute() {
    localStreamRef.current
      ?.getAudioTracks()
      .forEach((t) => (t.enabled = !t.enabled));
    setMuted((p) => !p);
  }

  function toggleCamera() {
    const sender = videoSenderRef.current;
    if (!sender || !sender.track) return;

    sender.track.enabled = !sender.track.enabled;
    setCameraOff(!sender.track.enabled);
  }

  async function toggleScreenShare() {
    if (!pcRef.current || !videoSenderRef.current) return;

    if (!sharingScreen) {
      const screen = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screen.getVideoTracks()[0];

      await videoSenderRef.current.replaceTrack(screenTrack);

      localVideoRef.current.srcObject = screen;
      setSharingScreen(true);

      screenTrack.onended = async () => {
        const cam = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const camTrack = cam.getVideoTracks()[0];

        await videoSenderRef.current.replaceTrack(camTrack);
        localVideoRef.current.srcObject = cam;
        setSharingScreen(false);
      };
    }
  }

  function cleanup() {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    remoteStreamRef.current?.getTracks().forEach((t) => t.stop());

    socketRef.current?.disconnect();
  }

  function leaveCall() {
    cleanup();
    window.location.href = "/";
  }

  
 
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
