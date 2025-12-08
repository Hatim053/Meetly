import React, { useEffect, useRef } from "react"
import styles from "./whiteBoard.module.css"
import socket from '../../../socket.js'
import { useSelector } from "react-redux"

function WhiteBoard() {
const canvasRef = useRef(null)
const ctxRef = useRef(null)
let xRef = useRef(null)
let yRef = useRef(null)
let mouseDownRef = useRef(false)
const roomId = useSelector(state => state.roomId)
const loggedInUser = useSelector(state => state.loggedInUser)
console.log(loggedInUser._id)
// console.log(roomId)
useEffect(() => {
    const canvas = canvasRef.current
        canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if(! canvas) return
     ctxRef.current = canvas.getContext("2d")
socket.emit("join-room", { roomId, userId : loggedInUser._id, name : loggedInUser.name });
     canvasRef.current.addEventListener('mousedown' , (e) => {
        socket.emit('mouse-down' , ({x : xRef.current , y: yRef.current , roomId}))
ctxRef.current.moveTo(xRef.current , yRef.current)
mouseDownRef.current = true
})
} , [])

socket.on('on-draw' , ({x , y}) => {
    ctxRef.current.lineTo(x , y)
        ctxRef.current.stroke()
})
 socket.on('on-mouse-down' , ({x , y}) => {
    ctxRef.current.moveTo(x , y)
 })

window.addEventListener('mouseup' , (e) => {
mouseDownRef.current = false
})

window.addEventListener('mousemove' , (e) => {
    xRef.current = e.clientX
    yRef.current = e.clientY
    // console.log(xRef.current , yRef.current)
    if(mouseDownRef.current) {
        socket.emit('draw' , ({x : xRef.current , y : yRef.current , roomId , userId : loggedInUser._id}))
        ctxRef.current.lineTo(xRef.current , yRef.current)
        ctxRef.current.stroke()
    }

})

    return (

  <div className={styles["canvas-container"]}>
      <canvas ref={canvasRef} className={styles["canvas"]}>
    
  </canvas>
  </div>
    )
} 


export default WhiteBoard