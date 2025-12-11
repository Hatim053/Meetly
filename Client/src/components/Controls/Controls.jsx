import React from "react"
import styles from './controls.module.css'


function Controls({ toggleMute , toggleCamera , toggleScreenShare , leaveCall , muted , cameraOff , sharingScreen }) {


    return (
  <div className={styles["controls"]}>
    <button className={styles["control-btn"]} onClick={toggleMute}>{muted ?  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
                                    <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />

                                    {/* <!-- Mic --> */}
                                    <path d="M32 41c5 0 9-4 9-9v-9c0-5-4-9-9-9s-9 4-9 9v9c0 5 4 9 9 9z"
                                          fill="currentColor" opacity=".4" />

                                    {/* <!-- Stem --> */}
                                    <path d="M25 32c0 4 3 7 7 7s7-3 7-7"
                                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".4" />

                                    {/* <!-- Base --> */}
                                    <line x1="32" y1="41" x2="32" y2="50"
                                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".4" />
                                    <line x1="27" y1="50" x2="37" y2="50"
                                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".4" />

                                    {/* <!-- Slash --> */}
                                    <line x1="20" y1="20" x2="44" y2="44"
                                          stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                              </svg> :  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
                                    <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />

                                    {/* <!-- Mic --> */}
                                    <path d="M32 41c5 0 9-4 9-9v-9c0-5-4-9-9-9s-9 4-9 9v9c0 5 4 9 9 9z"
                                          fill="currentColor" />

                                    {/* <!-- Stem --> */}
                                    <path d="M25 32c0 4 3 7 7 7s7-3 7-7"
                                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />

                                    {/* <!-- Base --> */}
                                    <line x1="32" y1="41" x2="32" y2="50"
                                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    <line x1="27" y1="50" x2="37" y2="50"
                                          stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                              </svg>}</button>
    <button className={styles["control-btn"]} onClick={toggleCamera}>{cameraOff ?  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
                                    {/* <!-- Circle Border --> */}
                                    <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />

                                    {/* <!-- Camera Body (dimmed) --> */}
                                    <rect x="20" y="23" width="18" height="18" rx="4" fill="currentColor" opacity=".4" />

                                    {/* <!-- Lens --> */}
                                    <circle cx="29" cy="32" r="4" fill="#fff" opacity=".4" />

                                    {/* <!-- External Lens Part --> */}
                                    <path d="M38 27l8 -4v22l-8 -4z" fill="currentColor" opacity=".4" />

                                    {/* <!-- Slash --> */}
                                    <line x1="20" y1="20" x2="44" y2="44" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                              </svg> :  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
                                    {/* <!-- Circle Border --> */}
                                    <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />

                                    {/* <!-- Camera Body --> */}
                                    <rect x="20" y="23" width="18" height="18" rx="4" fill="currentColor" />

                                    {/* <!-- Lens --> */}
                                    <circle cx="29" cy="32" r="4" fill="#fff" />

                                    {/* <!-- External Lens Part --> */}
                                    <path d="M38 27l8 -4v22l-8 -4z" fill="currentColor" />
                              </svg>}</button>
    <button className={styles["control-btn"]} onClick={toggleScreenShare}>{sharingScreen ? 'Stop Screen' : 'Share Screen'}</button>
    <button className={`${styles["control-btn"]} ${styles["leave"]}`} onClick={leaveCall}>Leave</button>
  </div>
    )
}


export default Controls