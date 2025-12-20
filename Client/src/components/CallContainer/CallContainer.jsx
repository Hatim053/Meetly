import React from "react"
import { useState } from "react"
import styles from './callContainer.module.css'
import RemoteStream from "../RemoteStream/RemoteStream"
import LocalStream from "../LocalStream/LocalStream"
import Controls from "../Controls/Controls"
import Menu from '../Menu/Menu.jsx'
import CodeEditor from '../CodeEditor/CodeEditor.jsx'
import WhiteBoard from '../WhiteBoard/WhiteBoard.jsx'
import MeetingUrl from "../MeetingUrl/MeetingUrl.jsx"
import { useSelector } from "react-redux"

function CallContainer({ localVideoRef , remoteVideoRef , toggleMute , toggleCamera , leaveCall , toggleScreenShare , muted , cameraOff , sharingScreen }) {
  const [menu, setMenu] = useState("call"); // call | codeeditor | whiteboard
  const [hiddenClass , setHiddenClass] = useState(false)
  const host = useSelector(state => state.host)
  const loggedInUser = useSelector(state => state.loggedInUser)
  // console.log('call container ' , remoteVideoRef.current)
  console.log('Id' , host?.id , 'loggedInUserId' , loggedInUser._id)
    return (
        <> 
        <div className={styles["call-container-wrapper"]}>
        <Menu setMenu={setMenu} setHiddenClass = {setHiddenClass} />
        {host?.id === loggedInUser._id && <MeetingUrl />}
<div className={`${styles["call-container"]}`} id="callContainer">
    {/* {agar menu call nahi he to local stream me remote strwam pass gogi and remote hide hogi } */}
   <RemoteStream remoteVideoRef = {hiddenClass ? localVideoRef : remoteVideoRef} hiddenClass = {hiddenClass} />
   {menu == 'whiteboard' && <WhiteBoard />}
   {menu == 'codeeditor' && <CodeEditor />}
   <LocalStream localVideoRef = {hiddenClass ? remoteVideoRef : localVideoRef} />
   <Controls toggleCamera={toggleCamera} toggleMute={toggleMute} toggleScreenShare={toggleScreenShare} leaveCall={leaveCall} muted = {muted} cameraOff = {cameraOff} sharingScreen = {sharingScreen} />
</div>
        </div>

</>
    )
}


export default CallContainer