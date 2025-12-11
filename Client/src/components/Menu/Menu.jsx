import React from "react"
import styles from './menu.module.css'

function Menu({setMenu , setHiddenClass}) {


    return (
 <div class="top-menu">
  <button className={styles["mode-btn"]} onClick={() => {
    setMenu('call')
    setHiddenClass(false)
  }}>Call</button>
  <button className={styles["mode-btn"]} onClick={() => {
    setMenu('whiteboard')
    setHiddenClass(true)
  }}>Whiteboard</button>
  <button className={styles["mode-btn"]} onClick={() => {
    setMenu('codeeditor')
    setHiddenClass(true)
    }}>Code Editor</button>
</div>
    )
}


export default Menu