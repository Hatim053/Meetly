import React, { useEffect, useRef } from "react"
import styles from './hostControls.module.css'
import socket from '../../../socket.js'
import { useSelector } from "react-redux"

function HostControls({toggleCamera}) {
 
  const panelRef = useRef(null)
  const loggedInUser = useSelector(state => state.loggedInUser)
  const host = useSelector(state => state.host)
  const roomId = useSelector(state => state.roomId)
    function toggleControls(e) {
        e.stopPropagation()
      panelRef.current.classList.toggle(styles.minimized)
      console.log('clicked')
    }
     
    function handleHostControls() {
      if(!host) return; 
      socket?.emit('control-camera' , ({roomId , hostId : host.id}))
      // console.log('socket event emitted')
    }

    
    return (
         <div ref={panelRef} className={`${styles["host-controls"]} ${styles["minimized"]}`} id="hostControls" onClick={toggleControls}>
    <div className={styles["minimized-icon"]}>⚙️</div>

    <div className={styles["hc-header"]}>
      <span className={styles["hc-title"]}>Host Controls</span>
      <button className={styles["toggle-btn"]} onClick={toggleControls}>—</button>
    </div>

    <div className={styles["participant"]}>
      <div className={styles["avatar"]}>A</div>
      <div className={styles["info"]}>
        <div className={styles["name"]}>participant</div>
        <div className={styles["status"]}>Mic On • Camera On</div>
      </div>
    </div>

    <div className={styles["controls"]}>
      <button className={styles["btn"]}>Mute Mic</button>
      <button className={styles["btn"]} onClick={handleHostControls}>Cam Off</button>
      <button className={`${styles["btn"]} ${styles["danger"]}`}>Remove From Call</button>
    </div>
  </div>
    )
}

export default HostControls