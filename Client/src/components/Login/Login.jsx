import React from "react"
import styles from './login.module.css'
import { useRef } from "react"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addUser } from '../../../user/userSlice.js'

function Login() {

const emailRef = useRef(null)
const passwordRef = useRef(null)

const navigate = useNavigate()
const dispatch = useDispatch()

const loginUser = async (e) => {
  e.preventDefault()
  console.log('clicked')
const response = await fetch(`${import.meta.env.VITE_SERVER_SIDE_URL}/user/login` , {
  method : 'POST',
  headers : {
    "Content-Type" : "application/json",
  },
  credentials : 'include',
  body : JSON.stringify({
  email : emailRef.current.value,
  password : passwordRef.current.value,
  })
})

const data = await response.json()
console.log(data)
if(data.status == 200) {
dispatch(addUser(data.user)) 
navigate('/')
}
if(data.status == 405) {
  navigate('/signup')
}
}

    return (
      <div className={styles["login-page-wrapper"]}>
 <div className={styles["login-container"]}>

    {/*LEFT SIDE*/}
    <div className={styles["login-left"]}>
        <div className={styles["image-overlay"]}></div>
     <div className={styles["brand-name"]}>
  <svg className={styles["logo-svg"]} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 120">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00A8FF"/> 
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
  </defs>
  {/* <style>
    text {
      font-family: 'Inter', sans-serif;
      font-weight: 800;
      font-size: 50px;
      letter-spacing: -2px;
    }
  </style> */}
  <text x="0" y="90" fill="url(#grad)">MEETLY</text>
</svg>
<span className={styles["tagline"]}>Train. Connect. Grow.</span>
     </div>
     
    
    </div>

    {/* RIGHT SIDE */}
    <div className={styles["login-right"]}>

        <div className={styles["login-box"]}>
            <h1 className={styles["welcome-text"]}>Welcome Back</h1>
            <form>
                <label>Email Address</label>
                <input ref={emailRef} type="email" placeholder="Enter your email" />

                <label>Password</label>
                <div className={styles["input-password"]}>
                    <input ref={passwordRef} type="password" placeholder="Enter password" />
                    👁️
                </div>

                <button onClick={loginUser} className={styles["login-btn"]}>Login</button>

                <p className={styles["account-status"]}>
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </form>
        </div>

        <div className={styles["social-icons"]}>
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



export default Login