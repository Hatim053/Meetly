import React from "react"
import styles from './menu.module.css'

function Menu() {


    return (
 <div class="top-menu">
  <button className={styles["mode-btn"]} >Call</button>
  <button className={styles["mode-btn"]} >Whiteboard</button>
  <button className={styles["mode-btn"]} >Code Editor</button>
</div>
    )
}


export default Menu