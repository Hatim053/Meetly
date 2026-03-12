# Meetly – Real-Time Video Interview Platform

Meetly is a real-time **1:1 video meeting platform** designed for technical interviews and collaborative coding sessions.  
It enables two users to communicate through **video, chat, a collaborative whiteboard, and a real-time code editor** within the same meeting room.

The platform leverages **WebRTC for peer-to-peer video communication** and **Socket.io for real-time data synchronization**, enabling seamless collaboration with minimal latency.

---

## Live Demo

https://meetly-tan.vercel.app/

---

## Features

### Real-Time Video Calling
- 1:1 peer-to-peer video communication
- Built using WebRTC
- Low latency video streaming

### Secure Authentication
- JWT-based authentication
- Secure login and session management

### Real-Time Chat
- In-call messaging between participants
- Instant communication during meetings

### Collaborative Whiteboard
- Built using HTML Canvas
- Both participants can draw in real-time
- Useful for explaining concepts visually

### Real-Time Code Editor
- Powered by Monaco Editor
- Both users can write and edit code simultaneously
- Ideal for coding interviews and pair programming

### Meeting Rooms
- Create and join meetings using a unique room ID
- Real-time room communication using Socket.io

### Media Controls
- Toggle microphone on/off
- Toggle camera on/off
- Smooth WebRTC stream handling

---

## Tech Stack

### Frontend
- React.js
- WebRTC
- Socket.io Client
- Monaco Editor
- HTML Canvas
- CSS

### Backend
- Node.js
- Express.js
- Socket.io
- JWT Authentication

### Database
- MongoDB

---

## Architecture Overview

The application follows a **real-time event-driven architecture**.

1. Users authenticate using JWT.
2. A meeting room is created or joined.
3. Socket.io manages real-time communication between participants.
4. WebRTC establishes a peer-to-peer connection for video streaming.
5. Socket events synchronize:
   - Chat messages
   - Whiteboard drawings
   - Code editor changes

This enables **low-latency real-time collaboration** between participants.

---

## Installation

Clone the repository
npm install
npm start
npm run dev

```bash
git clone https://github.com/YOUR_USERNAME/Meetly.git
cd Meetly
