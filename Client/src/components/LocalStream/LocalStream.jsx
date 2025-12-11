import React from "react"
import styles from './localStream.module.css'


function LocalStream({localVideoRef}) {
//  console.log("local stream localVideoRef:", localVideoRef);
//     console.log(localVideoRef)

    return (
  <div className={styles["local-video-wrapper"]} id="localWrapper">
    <video ref={localVideoRef} id="localVideo" muted autoPlay playsInline></video>
  </div>
    )
}


export default LocalStream