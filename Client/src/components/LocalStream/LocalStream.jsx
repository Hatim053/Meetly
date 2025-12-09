import React from "react"
import styles from './localStream.module.css'


function LocalStream({localVideoRef}) {



    return (
  <div className={styles["local-video-wrapper"]} id="localWrapper">
    <video ref={localVideoRef} id="localVideo" muted autoplay playsinline></video>
  </div>
    )
}


export default LocalStream