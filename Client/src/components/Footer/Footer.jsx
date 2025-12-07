import React from "react"
import styles from './footer.module.css'

function Footer() {


    return (
   <footer className={styles["meetly-footer"]}>

  <div className={styles["footer-grid"]}>

   
    <div className={styles["footer-section"]}>
      <h2 className={styles["footer-logo"]}>Meetly</h2>
      <p className={styles["footer-desc"]}>The future of seamless virtual collaboration.</p>
    </div>

   
    <div className={styles["footer-section"]}>
      <h4>Explore</h4>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Support</a></li>
      </ul>
    </div>

  
    <div className={styles["footer-section"]}>
      <h4>Company</h4>
      <ul>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Careers</a></li>
      </ul>
    </div>

  
    <div className={styles["footer-section"]}>
      <h4>Connect</h4>
      <div className={styles["footer-links"]}>
        <a href="https://linkedin.com" target="_blank">LinkedIn ↗</a>
        <a href="https://twitter.com" target="_blank">Twitter ↗</a>
      </div>
    </div>

  </div>

  <div className={styles["footer-bottom"]}>
    © 2025 Meetly — Built for the future 🚀
  </div>

</footer>
    )
}

export default Footer