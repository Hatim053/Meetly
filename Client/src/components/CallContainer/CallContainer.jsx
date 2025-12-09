import React from "react"
import styles from './callContainer.module.css'
import RemoteStream from "../RemoteStream/RemoteStream"
import LocalStream from "../LocalStream/LocalStream"
import Controls from "../Controls/Controls"

function CallContainer() {


    return (
<div className={styles["call-container"]} id="callContainer">
   <RemoteStream />
   <LocalStream />
   <Controls />
</div>

    )
}


export default CallContainer