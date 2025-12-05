import { Server } from "socket.io";
import "dotenv/config";
import connectDb from "./src/db/index.js";
import server from "./app.js";



const rooms = {}; // roomId -> [socketId1, socketId2]
const userSocketMap = {}; // userId -> socketId


// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_SIDE_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


// Socket.io connection logic 

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // ---------------------------
  // Join Room
  // ---------------------------
  socket.on("join-room", ({ roomId, userId, name }) => {
    socket.data.roomId = roomId;
    socket.data.userId = userId;

    userSocketMap[userId] = socket.id;

    if (!rooms[roomId]) rooms[roomId] = [];
    if (!rooms[roomId].includes(socket.id)) rooms[roomId].push(socket.id);

    socket.join(roomId);

    // Send existing users to the joining client
    const others = rooms[roomId].filter((id) => id !== socket.id);
    socket.emit("room-users", { users: others });

    // Notify other users in the room
    socket.to(roomId).emit("user-joined", { userId, name });
  });


  // Offer

  socket.on("offer", ({ to, from, sdp }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) {
      io.to(targetSocket).emit("offer", { from, sdp });
    }
  });

  // Answer

  socket.on("answer", ({ to, from, sdp }) => {
    const targetSocket = userSocketMap[to];
    if (targetSocket) {
      io.to(targetSocket).emit("answer", { from, sdp });
    }
  });


  // ICE Candidate

  socket.on("ice-candidate", ({ from, candidate }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;

    // Find the other socket in the room
    const otherSocket = rooms[roomId].find((id) => id !== socket.id);
    if (otherSocket) {
      io.to(otherSocket).emit("ice-candidate", { from, candidate });
    }
  });


   // live chats : 
   socket.on('sendMessage' , ({ roomId , senderName , message }) => {
    const room = rooms[roomId]
    if(room) { /// if room exist's then emit message
      io.to(roomId).emit('receiveMessage' , {
        senderName, 
        message
      })
    }
   })


   socket.on('control-camera' , ({ roomId }) => {
    const opponentsocketId = rooms[roomId].filter((id) => id != socket.id)
    if(opponentsocketId) {
      socket.to(opponentsocketId).emit('control')
    }
   })

  // Leave Room
  socket.on("leave-room", ({ roomId, userId }) => {
    socket.leave(roomId);

    // Remove socket from room
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }

    delete userSocketMap[userId];

    // Notify others
    socket.to(roomId).emit("user-left", { userId });
    console.log(`User ${userId} left room ${roomId}`);
  });


  // Disconnect

  socket.on("disconnect", () => {
    const { roomId, userId } = socket.data || {};

    if (roomId) {
      // Remove from room
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
        if (rooms[roomId].length === 0) delete rooms[roomId];
      }
      socket.to(roomId).emit("user-left", { userId });
    }

    if (userId) delete userSocketMap[userId];

    console.log("Socket disconnected:", socket.id);
  });
});


// Connect to DB & Start server
const PORT = process.env.PORT || 5000;
const URL = process.env.MONGODB_URL;

connectDb(URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => console.error("DB connection error:", err));
