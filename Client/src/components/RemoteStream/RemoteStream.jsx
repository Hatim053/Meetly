import React from "react"
import styles from './remoteStream.module.css'

function RemoteStream({remoteVideoRef , hiddenClass}) {
console.log(remoteVideoRef.current)

    return (
  <div className={`${styles["remote-video-wrapper"]} ${hiddenClass && styles['hide']}`} id="remoteWrapper">
    <video ref={remoteVideoRef} id="remoteVideo" muted autoPlay playsInline></video>
  </div>
    )
}

export default RemoteStream