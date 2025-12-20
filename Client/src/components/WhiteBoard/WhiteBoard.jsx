import React, { useEffect, useRef } from "react"
import styles from "./whiteBoard.module.css"
import socket from '../../../socket.js'
import { useSelector } from "react-redux"
import { current } from "@reduxjs/toolkit"

function WhiteBoard() {
    const canvasRef = useRef(null)
    const ctxRef = useRef(null)
    const xRef = useRef(null)
    const yRef = useRef(null)
    const mouseDownRef = useRef(false)
    const penSizeRef = useRef(3)
    const eraserSizeRef = useRef(65)
    let colorRef = useRef('#000000')
    const erasingRef = useRef(false)
    const roomId = useSelector(state => state.roomId)
    const loggedInUser = useSelector(state => state.loggedInUser)
    const penRef = useRef(null)
    const eraserRef = useRef(null)
    const colorPickerRef = useRef(null)
    const clearBtnRef = useRef(null)
    // console.log(loggedInUser._id)
    // console.log(roomId)
 useEffect(() => {

  const canvas = canvasRef.current;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctxRef.current = canvas.getContext("2d");


  // --- DOM Events ---
  const handleMouseDown = () => {
    mouseDownRef.current = true;
    ctxRef.current.moveTo(xRef.current, yRef.current);
    socket.emit('mouse-down', { x: xRef.current, y: yRef.current, roomId });
  };

  const handleMouseUp = () => {
    mouseDownRef.current = false;
    ctxRef.current.beginPath();
  };

  const handleMouseMove = (e) => {
    xRef.current = e.clientX;
    yRef.current = e.clientY;

    if (!mouseDownRef.current) return;

    ctxRef.current.lineCap = "round";
    ctxRef.current.strokeStyle = erasingRef.current ? "white" : colorRef.current;
    ctxRef.current.lineWidth = erasingRef.current ? eraserSizeRef.current : penSizeRef.current;

    ctxRef.current.lineTo(xRef.current, yRef.current);
    ctxRef.current.stroke();

    socket.emit('draw', { x: xRef.current, y: yRef.current, roomId });
  };

  // Attach Canvas Listeners
  canvas.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);

  // Tool Buttons
  penRef.current.onclick = () => {
    erasingRef.current = false;
    penRef.current.classList.add("active");
    eraserRef.current.classList.remove("active");
  };

  eraserRef.current.onclick = () => {
    erasingRef.current = true;
    eraserRef.current.classList.add("active");
    penRef.current.classList.remove("active");
  };

  colorPickerRef.current.onchange = (e) => {
    colorRef.current = e.target.value;
  };

  clearBtnRef.current.onclick = () => {
    socket.emit('clear' , {roomId})
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Socket listeners
  const drawListener = ({ x, y }) => {
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const mouseDownListener = ({ x, y }) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };
  
  const clearListner = () => {
     ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  }
  socket.on("on-draw", drawListener);
  socket.on("on-mouse-down", mouseDownListener);
  socket.on('on-clear' , clearListner)

  // Cleanup
  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mousemove", handleMouseMove);

    socket.off("on-draw", drawListener);
    socket.off("on-mouse-down", mouseDownListener);
  };

}, []);


   

    return (

        <>
            <div className={styles["toolbar"]}>
                <button className={styles["tool-btn active"]} ref={penRef} id="pen">✏ Pen</button>
                <button className={styles["tool-btn"]} ref={eraserRef} id="eraser">🧽 Eraser</button>

                <input type="color" id="colorPicker" ref={colorPickerRef} value="#000000" />

                <button className={styles["clear-btn"]} ref={clearBtnRef}>🗑 Clear</button>
            </div>
            <canvas ref={canvasRef} id="board"></canvas>
        </>
    )
}


export default WhiteBoard