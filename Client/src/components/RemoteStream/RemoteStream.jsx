import React from "react"
import styles from './remoteStream.module.css'

function RemoteStream({remoteVideoRef}) {


    return (
  <div className={styles["remote-video-wrapper"]} id="remoteWrapper">
    <video ref={remoteVideoRef} id="remoteVideo" autoplay playsinline></video>
  </div>
    )
}

export default RemoteStream