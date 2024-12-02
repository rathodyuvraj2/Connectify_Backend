// // backend/server.js
// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --------------------------------------------------------------------------------

// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const cors = require('cors');

// dotenv.config();
// connectDB();

// const app = express();
// app.use(express.json());

// // Configure CORS with specific options
// const corsOptions = {
//   origin: 'http://localhost:5173', // Replace with your frontend's origin
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions)); // Use the cors middleware with options

// // Define your routes
// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --------------------------------------------------------------------------------

// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const Message = require("./models/Message");
// const cors = require('cors');
// const socketIO = require('socket.io');
// const http = require('http');

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }, // Adjust the origin to match your frontend
// });

// app.use(cors());
// app.use(express.json());

// // Define your routes
// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);

// // // Real-time chat with Socket.IO
// // const onlineUsers = new Set();
// // io.on('connection', (socket) => {
// //   socket.on('join', ({ userId }) => {
// //     onlineUsers.add(userId);
// //     io.emit('onlineUsers', Array.from(onlineUsers));
// //   });

// //   socket.on('disconnect', () => {
// //     onlineUsers.delete(socket.userId);
// //     io.emit('onlineUsers', Array.from(onlineUsers));
// //   });

// //   socket.on('sendMessage', (message) => {
// //     io.emit('message', message);
// //   });
// // });

// // Track online users
// const onlineUsers = new Set();

// // Socket.IO Connection
// io.on('connection', (socket) => {
//   console.log('User connected');

//   socket.on('join', async ({ userId }) => {
//     socket.userId = userId;
//     onlineUsers.add(userId);
//     io.emit('onlineUsers', Array.from(onlineUsers));
//   });

//   socket.on('joinConversation', async ({ conversationId }) => {
//     // Leave previous conversations
//     socket.rooms.forEach(room => {
//       if (room !== socket.id) {
//         socket.leave(room);
//       }
//     });

//     socket.join(conversationId);
//     // Load previous messages for this conversation
//     const messages = await Message.find({ conversationId })
//       .sort({ timestamp: 1 })
//       .limit(50);

//     socket.emit('previousMessages', { conversationId, messages });
//   });

//   socket.on('sendMessage', async (message) => {
//     const newMessage = new Message({
//       conversationId: message.conversationId,
//       senderId: message.senderId,
//       receiverId: message.receiverId,
//       text: message.text,
//       senderName: message.senderName
//     });

//     await newMessage.save();
//     io.to(message.conversationId).emit('message', newMessage);
//   });

//   socket.on('disconnect', () => {
//     if (socket.userId) {
//       onlineUsers.delete(socket.userId);
//       io.emit('onlineUsers', Array.from(onlineUsers));
//     }
//     console.log('User disconnected');
//   });
// });


// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --------------------------------------------------------------------------------

// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const cors = require('cors');
// const socketIO = require('socket.io');
// const http = require('http');
// const Message = require('./models/Message'); // Ensure the Message model is imported

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }, // Adjust the origin to match your frontend
// });

// app.use(cors());
// app.use(express.json());

// // Define your routes
// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);

// // // Real-time chat with Socket.IO
// // const onlineUsers = new Set();
// // io.on('connection', (socket) => {
// //   socket.on('join', ({ userId }) => {
// //     onlineUsers.add(userId);
// //     io.emit('onlineUsers', Array.from(onlineUsers));
// //   });

// //   socket.on('disconnect', () => {
// //     onlineUsers.delete(socket.userId);
// //     io.emit('onlineUsers', Array.from(onlineUsers));
// //   });

// //   socket.on('sendMessage', async (messageData) => {
// //     const message = new Message(messageData);
// //     await message.save();
// //     io.emit('message', message);
// //   });

// //   socket.on('fetchMessages', async ({ conversationId }) => {
// //     try {
// //       const messages = await Message.find({ conversationId })
// //         .sort({ timestamp: 1 })
// //         .limit(50);

// //       socket.emit('previousMessages', { conversationId, messages });
// //     } catch (error) {
// //       console.error('Error fetching messages:', error);
// //     }
// //   });
// // });


// // Real-time chat with Socket.IO
// const onlineUsers = new Set();
// io.on('connection', (socket) => {
//   socket.on('join', ({ userId }) => {
//     onlineUsers.add(userId);
//     io.emit('onlineUsers', Array.from(onlineUsers));
//   });

//   socket.on('disconnect', () => {
//     onlineUsers.delete(socket.userId);
//     io.emit('onlineUsers', Array.from(onlineUsers));
//   });

//   socket.on("joinConversation", ({ conversationId }) => {
//     socket.join(conversationId);
//   });

//   socket.on('sendMessage', async (messageData) => {
//     const message = new Message(messageData);
//     await message.save();
//     io.emit('message', message);
//   });

//   socket.on('fetchMessages', async ({ conversationId }) => {
//     try {
//       const messages = await Message.find({ conversationId })
//         .sort({ timestamp: 1 })
//         .limit(50);

//       socket.emit('previousMessages', { conversationId, messages });
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// --------------------------------------------------------------------------------

// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const cors = require('cors');
// const socketIO = require('socket.io');
// const http = require('http');
// const Message = require('./models/Message'); // Ensure the Message model is imported

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server, {
//   cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }, // Adjust the origin to match your frontend
// });

// app.use(cors());
// app.use(express.json());

// // Define your routes
// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);

// // Real-time chat with Socket.IO
// const onlineUsers = new Set();
// io.on('connection', (socket) => {
//   socket.on('join', ({ userId }) => {
//     onlineUsers.add(userId);
//     io.emit('onlineUsers', Array.from(onlineUsers));
//   });

//   socket.on('disconnect', () => {
//     onlineUsers.delete(socket.userId);
//     io.emit('onlineUsers', Array.from(onlineUsers));
//   });

//   socket.on('joinConversation', ({ conversationId }) => {
//     socket.join(conversationId);
//   });

//   socket.on('sendMessage', async (messageData) => {
//     const message = new Message(messageData);
//     await message.save();
//     io.to(messageData.conversationId).emit('message', message);
//   });

//   socket.on('fetchMessages', async ({ conversationId }) => {
//     try {
//       const messages = await Message.find({ conversationId })
//         .sort({ timestamp: 1 })
//         .limit(50);

//       socket.emit('previousMessages', { conversationId, messages });
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ---------------------------------------------------------------------------

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const Message = require('./models/Message');
const announcementRoutes = require("./routes/announcementRoutes");
const groupRoutes = require('./routes/groupRoutes');
const Group = require('./models/Group');
const GroupMessage = require('./models/GroupMessage');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');


// Load environment variables
dotenv.config();

// Initialize Express app and create HTTP server
const app = express();
const server = http.createServer(app);

// Configure CORS for both Express and Socket.IO
const corsOptions = {
  origin: ['http://localhost:5173', `${process.env.FRONTEND_URL}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
// Initialize Socket.IO with proper configuration
const io = socketIO(server, {
  cors: corsOptions,
  pingTimeout: 60000,
  connectTimeout: 60000
});

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/resumes', resumeRoutes);
app.use('/announcements', announcementRoutes);
app.use('/groups', groupRoutes);
app.use('/faculty', facultyRoutes);
app.use("/admin",adminRoutes);

// Store online users with their socket IDs
const onlineUsers = new Map();

// // Socket.IO connection handling
// io.on('connection', (socket) => {
//   console.log('New client connected:', socket.id);

//   socket.on('join', ({ userId }) => {
//     if (!userId) {
//       console.error('Join event received without userId');
//       return;
//     }

//     // Store both userId and socketId
//     onlineUsers.set(userId, socket.id);
//     socket.userId = userId; // Store userId in socket for disconnect handling

//     // Broadcast updated online users list
//     io.emit('onlineUsers', Array.from(onlineUsers.keys()));
//     console.log('User joined:', userId);
//   });

//   socket.on('disconnect', () => {
//     if (socket.userId) {
//       onlineUsers.delete(socket.userId);
//       io.emit('onlineUsers', Array.from(onlineUsers.keys()));
//       console.log('User disconnected:', socket.userId);
//     }
//   });

//   socket.on('joinConversation', ({ conversationId }) => {
//     if (!conversationId) {
//       console.error('Join conversation event received without conversationId');
//       return;
//     }

//     socket.join(conversationId);
//     console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
//   });

//   socket.on('sendMessage', async (messageData) => {
//     try {
//       if (!messageData || !messageData.conversationId) {
//         console.error('Invalid message data received');
//         return;
//       }

//       const message = new Message(messageData);
//       await message.save();

//       io.to(messageData.conversationId).emit('message', message);
//       console.log('Message sent in conversation:', messageData.conversationId);
//     } catch (error) {
//       console.error('Error saving message:', error);
//       socket.emit('messageError', { error: 'Failed to send message' });
//     }
//   });

//   socket.on('fetchMessages', async ({ conversationId }) => {
//     try {
//       if (!conversationId) {
//         console.error('Fetch messages event received without conversationId');
//         return;
//       }

//       const messages = await Message.find({ conversationId })
//         .sort({ timestamp: 1 })
//         .limit(50);

//       socket.emit('previousMessages', { conversationId, messages });
//       console.log(`Fetched ${messages.length} messages for conversation:`, conversationId);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//       socket.emit('fetchError', { error: 'Failed to fetch messages' });
//     }
//   });
// });

// ... (previous imports remain the same)

// Helper function to generate consistent conversation ID
const getConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join', ({ userId }) => {
    if (!userId) {
      console.error('Join event received without userId');
      return;
    }

    socket.userId = userId;
    onlineUsers.set(userId, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    console.log('User joined:', userId);
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log('User disconnected:', socket.userId);
    }
  });

  socket.on('joinGroup', ({ groupId }) => {
    socket.join(groupId);
  });

  socket.on('sendGroupMessage', async (messageData) => {
    console.log("mESSAGE DATA SOCKET: ",messageData);
    const message = new GroupMessage(messageData);
    await message.save();
    io.to(messageData.groupId).emit('groupMessage', message);
  });

  socket.on('createGroup', async ({ groupName, userId, members }) => {
    try {
      const group = new Group({
        name: groupName,
        createdBy: userId,
        members,
      });
      await group.save();
      members.forEach(memberId => {
        const socketId = onlineUsers.get(memberId);
        if (socketId) {
          io.to(socketId).emit('groupCreated', group);
        }
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  });

  socket.on('joinConversation', ({ conversationId }) => {
    if (!conversationId) {
      console.error('Join conversation event received without conversationId');
      return;
    }

    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation: ${conversationId}`);
  });

  socket.on('sendMessage', async (messageData) => {
    try {
      if (!messageData || !messageData.senderId || !messageData.receiverId) {
        console.error('Invalid message data received');
        return;
      }

      // Ensure consistent conversation ID
      const conversationId = getConversationId(messageData.senderId, messageData.receiverId);
      messageData.conversationId = conversationId;

      const message = new Message(messageData);
      await message.save();

      // Emit to all sockets in the conversation
      io.to(conversationId).emit('message', message);

      // Also emit directly to sender and receiver sockets
      const receiverSocketId = onlineUsers.get(messageData.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message', message);
      }

      console.log('Message sent in conversation:', conversationId);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('messageError', { error: 'Failed to send message' });
    }
  });

  socket.on('fetchMessages', async ({ conversationId }) => {
    try {
      if (!conversationId) {
        console.error('Fetch messages event received without conversationId');
        return;
      }

      const messages = await Message.find({ conversationId })
        .sort({ timestamp: 1 })
        .limit(50);

      socket.emit('previousMessages', { conversationId, messages });
      console.log(`Fetched ${messages.length} messages for conversation:`, conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      socket.emit('fetchError', { error: 'Failed to fetch messages' });
    }
  });

  // socket.on('fetchGroupMessages', async ({ groupId }) => {
  //   try {
  //     if (!groupId) {
  //       console.error('Fetch group messages event received without conversationId')
  //       return
  //     }

  //     const messages = await GroupMessage.find({ groupId })
  //       .sort({ timestamp: 1 })
  //       .populate('senderId', 'username') // Populate sender details
  //       .limit(50)

  //     socket.emit('previousGroupMessages', { groupId, messages })
  //     console.log(`Fetched ${messages.length} group messages for conversation:`, groupId)
  //   } catch (error) {
  //     console.error('Error fetching group messages:', error)
  //     socket.emit('fetchError', { error: 'Failed to fetch group messages' })
  //   }
  // })

   socket.on('fetchGroupMessages', async ({ groupId }) => {
    try {
      if (!groupId) {
        console.error('Fetch group messages event received without groupId');
        return;
      }

      const messages = await GroupMessage.find({ groupId })
        .sort({ timestamp: 1 })
        .populate('senderId', 'username') // Populate sender details
        .limit(50);

      socket.emit('previousGroupMessages', { groupId, messages });
      console.log(`Fetched ${messages.length} group messages for group:`, groupId);
    } catch (error) {
      console.error('Error fetching group messages:', error);
      socket.emit('fetchError', { error: 'Failed to fetch group messages' });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server configured with CORS origin: ${corsOptions.origin}`);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});