import React from "react"
import styles from './featureCard.module.css'
import codeEditorImg from './images/codeeditor.png'
import whiteBoardImg from './images/whiteboard.png'
import hostControlImg from './images/hostcontrols.png'
import messageImg from './images/messages.png'
import videCallingImg from './images/videocall.png'
import screenSharingImg from './images/screensharing.png'

function FeatureCard() {


    return (
<div className={styles["banner"]}>
  <div
    className={styles["slider"]}
    style={{ "--quantity": 6 }}
  >
    <div className={styles["item"]} style={{ "--position": 1 }}>
      <img src={codeEditorImg} alt="" />
    </div>

    <div className={styles["item"]} style={{ "--position": 2 }}>
      <img src={whiteBoardImg} alt="" />
    </div>

    <div className={styles["item"]} style={{ "--position": 3 }}>
      <img src={hostControlImg} alt="" />
    </div>

    <div className={styles["item"]} style={{ "--position": 4 }}>
      <img src={messageImg} alt="" />
    </div>

    <div className={styles["item"]} style={{ "--position": 5 }}>
      <img src={videCallingImg} alt="" />
    </div>

    <div className={styles["item"]} style={{ "--position": 6 }}>
      <img src={screenSharingImg} alt="" />
    </div>
  </div>

  <div className={styles["content"]}>
    <h1 data-content="">
      Everything you need for seamless collaboration
    </h1>
  </div>
</div>

    )
}


export default FeatureCard