import { Server } from "socket.io"
import "dotenv/config"
import connectDb from "./src/db/index.js"
import server from "./app.js"



const rooms = {} // roomId -> [socketId1, socketId2]
const userSocketMap = {} // userId -> socketId


// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_SIDE_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
})


// Socket.io connection logic 

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // ---------------------------
  // Join Room
  // ---------------------------
  socket.on("join-room", ({ roomId, userId, name }) => {
    socket.data.roomId = roomId;
    socket.data.userId = userId;
//  console.log("JOIN:", typeof socket.data.roomId, socket.data.roomId);

    userSocketMap[userId] = socket.id;
    console.log('at the time of joining room',userSocketMap[userId] , userId)
    if (!rooms[roomId]) rooms[roomId] = [];
    if (!rooms[roomId].includes(socket.id)) rooms[roomId].push(socket.id);
    console.log(rooms[roomId])

    socket.join(roomId);

    // Send existing users to the joining client
    const otherSocketIds = rooms[roomId].filter((id) => id !== socket.id);
    const otherUserIds = otherSocketIds
      .map((sockId) => Object.keys(userSocketMap).find((uId) => userSocketMap[uId] === sockId))
      .filter(Boolean);
    socket.emit("room-users", { users: otherUserIds });

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


  socket.on("ice-candidate", ({ to, from, candidate }) => {
  const targetSocket = userSocketMap[to];
  if (targetSocket) {
    io.to(targetSocket).emit("ice-candidate", { from, candidate });
  }
});




   // live chats : 
   socket.on('sendMessage' , ({ roomId , senderId , senderName , message }) => {
    const room = rooms[roomId]
    if(room) { /// if room exist's then emit message
      io.to(roomId).emit('receiveMessage' , {
        senderName, 
        senderId ,
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

   // white-board events logic
   // as someone start drawing 
   socket.on('draw' , ({x,y , roomId , userId}) => {
      const users = rooms[roomId]
    //  console.log('at the time of draw event',userSocketMap[userId] , userId)
    //  console.log(rooms[roomId])
     const others = rooms[roomId].filter((id) => id != userSocketMap[userId])
    socket.to(others).emit('on-draw' , {x , y})
   }) 

  socket.on('mouse-down' , ({x , y , roomId}) => {
    const users = rooms[roomId]
    const others = users.filter((id) => id != socket.id)
    socket.to(others).emit('on-mouse-down' , {x , y})
  })

  socket.on('clear' , ({roomId}) => {
    const users = rooms[roomId]
    const others = users.filter((id) => id != socket.id)
    socket.to(others).emit('on-clear')
  })  
  


  // code editor events logic
  // socket event when someone is writing code
  socket.on('code-change' , ({code , roomId , userId}) => {
    const users = rooms[roomId]
    console.log(users)
    const others = users.filter((id) => id != userSocketMap[userId])
    socket.to(others).emit('on-code-change' , ({codeValue : code}))
  })

  // socket event when someone changes language
  socket.on('language-change' , ({language , roomId}) => {
    const users = rooms[roomId]
    const others = users.filter((id) => id != socket.id)
    socket.to(others).emit('on-language-change' , ({languageValue : language}))
  })

  // socket event when someone starts typing
  socket.on('typing' , ({name , roomId}) => {
    const users = rooms[roomId]
    const others = users.filter((id) => id != socket.id)
    socket.to('on-typing' , ({name}))
  })
  
  // socket event when code gets complied
  socket.on('run' , ({roomId , outputValue}) => {
    const users = rooms[roomId]
    const others = users.filter((id) => id != socket.id)
    console.log(outputValue)
    socket.to(others).emit('on-run' , ({outputValue}))
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
const PORT = process.env.PORT || 5000
const URL = process.env.MONGODB_URL

connectDb(URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((err) => console.error("DB connection error:", err))
