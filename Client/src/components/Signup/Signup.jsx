import React from "react"
import styles from './signup.module.css'
import { useRef } from "react"
import { useNavigate , Link } from 'react-router-dom'

function Signup() {
  
  const emailRef = useRef(null)
  const nameRef = useRef(null)
  const passwordRef = useRef(null)
  
  const navigate = useNavigate()

  const signupUser = async (e) => {
    e.preventDefault()
  const response = await fetch(`${import.meta.env.VITE_SERVER_SIDE_URL}/user/signup` , {
    method : 'POST',
    headers : {
        "Content-Type": "application/json",
    },
    body : JSON.stringify({
        email : emailRef.current.value,
        name : nameRef.current.value,
        password : passwordRef.current.value,
    })
  })
  
  const data = await response.json()
  console.log(data)
  if(data.status == 201 || 405 ) navigate('/login')

  }

    return (
        <div className={styles["signup-page-wrapper"]}>
<div className={styles["signup-container"]}>

    {/* LEFT SECTION */}
    <div className={styles["left-section"]}>
        <div class={styles["overlay"]}></div>
        <div class={styles["content"]}>
                      <svg className={styles["logo-svg"]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00A8FF"/> 
      <stop offset="100%" stop-color="#000000"/> 
    </linearGradient>
  </defs>
 

  <text x="0" y="90" fill="url(#grad)">MEETLY</text>
</svg>

            <span className={styles["tagline"]}>Train. Connect. Grow.</span>
        </div>
    </div>

    {/*RIGHT SECTION */}
    <div className={styles["right-section"]}>
        <div className={styles["form-box"]}>

            <h2>Create an Account</h2>

            <form>
                <label>Email Address</label>
                <input ref={emailRef} type="email" placeholder="Enter your email" />

                <label>Full Name</label>
                <input ref={nameRef} type="text" placeholder="Enter your full name" />

                <label>Password</label>
                <div className={styles["input-password"]}>
                    <input ref={passwordRef} type="password" placeholder="Create password" />
                    👁️
                </div>

                <button onClick={signupUser} className={styles["primary-btn"]}>Create account</button>

                <p className={styles["login-text"]}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>

        <div className={styles["social-links"]}>
            <i>🌐</i>
            <i>🐦</i>
            <i>📷</i>
            <i>💼</i>
        </div>
    </div>

</div>
        </div>


    )
}


export default Signup