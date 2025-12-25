import React, { useState } from "react"
import styles from './meetingEntry.module.css'
import { useNavigate } from "react-router-dom"
import { useSelector , useDispatch } from 'react-redux'
import { addHost } from '../../../user/hostSlice.js'

function MeetingEntry() {
      const loggedInUser = useSelector(state => state.loggedInUser)
      const [joinId, setJoinId] = useState('')
      const [mute , setMute] = useState(false)
      const [camera , setCamera] = useState(false)
      const navigate = useNavigate()
      const dispatch = useDispatch()
      async function createMeeting() {

            const response = await fetch(`${import.meta.env.VITE_SERVER_SIDE_URL}/meetly/create-meeting`, {
                  method: 'POST',
                  credentials: 'include',
            })

            const data = await response.json()
            if (data.status == 200) {
                  console.log('roomId' , data.meeting.roomId)
                  dispatch(addHost({id : loggedInUser._id , name : loggedInUser.name}))
                  navigate(`/call/:${data.meeting.roomId}`, { state: { name: loggedInUser.name || 'Host', isHost: true } })
            }
      }

      function joinMeeting() {
            console.log('joinId'  , joinId.substring(27))
            if (!joinId) return alert('Enter Meeting Id or Url')
            navigate(`/call/${joinId.substring(36)}`, { state: { name: loggedInUser?.name || 'Guest', isHost: false } })
      }

      return (
            <div className={styles["create-room-container"]}>
                  
                  <div className={styles["right-hand-room"]}>
                        <button className={styles["meeting-create-btn"]} onClick={createMeeting}>Host A Meeting</button>
                        <span>or</span>
                        <div className={styles["meeting-join"]}>
                              <span>Join Meeting</span>
                              <input placeholder="paste link here" value={joinId} onChange={(e) => setJoinId(e.target.value)} className={styles["meeting-link-input"]} type="text" />
                              <button className={styles["meeting-join-btn"]} onClick={joinMeeting}>join</button>
                        </div>
                  </div>
            </div>
      )

}


export default MeetingEntry