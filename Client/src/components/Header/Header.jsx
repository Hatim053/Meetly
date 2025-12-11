import React from "react"
import styles from './header.module.css'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

function Header() {
const navigate = useNavigate()
const loggedInUser = useSelector(state => state.loggedInUser)
  
async function handleUserLogout() {
const response = await fetch(`${import.meta.env.VITE_SERVER_SIDE_URL}/user/logout` , {
  method : 'POST',
  credentials : 'include'
})
const data = await response.json()
if(data.status == 200) navigate('/login')
}

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
           {!loggedInUser && <button className={styles["login-btn"]} onClick={() => navigate('/login')}>login</button>} 
           {!loggedInUser && <button className={styles["signup-btn"]} onClick={() => navigate('/signup')}>signup</button>} 
           {loggedInUser && <button className={styles["signup-btn"]} onClick={handleUserLogout}>logout</button>}
        </div>
    </div>
        </>
    )
}


export default Header