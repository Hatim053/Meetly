import React, { useRef, useState , useEffect } from "react"
import styles from "./chatBox.module.css"
import socket from "../../../socket"
import { useSelector } from 'react-redux'
import { data } from "react-router-dom"



function ChatBox({}) {
   const [chatList , setChatList] = useState([]) // {senderName , message}
   const messageRef = useRef(null)
   const loggedInUser =  useSelector(state => state.loggedInUser)
   const roomId = useSelector(state => state.roomId)

   socket.on('receiveMessage' , (data) => {
    setChatList([...chatList , data])
   })

   function sendMessage() {
    const message = messageRef.current.value.trim()
    if(! message) return
    socket.emit('sendMessage' , {senderName : loggedInUser?.name || 'john' , roomId , message})
   }

    useEffect(() => {
    const element = document.getElementById("chat-body");
    if (element) element.scrollTop = element.scrollHeight;
}, [chatList]);

    return (
           <div className={styles["chat-container"]}>
    <div className={styles["chat-header"]}>
        <h3>In Call Messages</h3>
    </div>

    <div className={styles["chat-body"]} id="chat-body">
     {chatList.map((chat) => (
            <div className={loggedInUser?.name == chat.senderName ? `${styles["message"]} ${styles["own"]}`:`${styles["message"]} ${styles["other"]}`}>
            <p className={styles["text"]}>{chat.message}</p>
            <span className={styles["sender-name"]}>{chat.senderName}</span>
        </div>
     ))}
    </div>

    <div className={styles["chat-input-area"]}>
        <input ref={messageRef} type="text" placeholder="Type a message..." id="chatInput" />
        <button className={styles["send-btn"]}>➤</button>
    </div>
</div>
    )
}


export default ChatBox