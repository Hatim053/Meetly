import React from "react"
import styles from './controls.module.css'


function Controls() {


    return (
  <div className={styles["controls"]}>
    <button className={styles["control-btn"]}>🎤</button>
    <button className={styles["control-btn"]}>🎧</button>
    <button className={styles["control-btn"]}>🖥️</button>
    <button className={styles["control-btn leave"]}>Leave</button>
  </div>
    )
}


export default Controls