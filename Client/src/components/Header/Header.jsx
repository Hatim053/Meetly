import React from "react"
import styles from './header.module.css'

function Header() {


    return (
        <>
           <div className={styles["header-container"]}>
        <div className={styles["left-header"]}>
            <svg className={styles["logo-svg"]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00A8FF"/> 
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
  </defs>
  <style>
  </style>
  <text x="0" y="90" fill="url(#grad)">MEETLY</text>
</svg>
   <div className={styles["settings"]}>settings</div>
   <div className={styles["theme"]}>theme</div>
        </div>
        <div className={styles["right-header"]}>
            <button className={styles["login-btn"]}>login</button>
            <button className={styles["signup-btn"]}>signup</button>
        </div>
    </div>
        </>
    )
}


export default Header