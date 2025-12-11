import React from "react"
import styles from './banner.module.css'
import bannerImg from './img_index_banner.03ccd64.png'
import { useNavigate } from "react-router-dom"
import { useSelector } from 'react-redux'

function Banner() {

  const navigate = useNavigate()
  const loggedInUser = useSelector(state => state.loggedInUser)

  function redirectToMeet() {
    if(! loggedInUser) {
     navigate('/login')
    } else {
     navigate('/create')
    }
    
  }

    return (
 <div className={styles["home-container"]}>
  <div className={styles["hero-content"]}>
    <h1>Interview Better. Train Better.<br/>Hire Better.</h1>
    <p>
      1:1 video calls, live chat, shared code editor, whiteboard, and<br/>
      host-controlled tools — everything designed for hiring and training.
    </p>
     <button className={styles["cta-btn"]} onClick={redirectToMeet}>Create / Join Meeting</button>
  </div>

  <div className={styles["hero-image"]}>
    <img src={bannerImg} alt="Platform Preview" />
  </div>
</div>
    )
}


export default Banner