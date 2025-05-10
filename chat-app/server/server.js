const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store connected users
const users = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Handle user joining
  socket.on('join', (username) => {
    users[socket.id] = username;
    
    // Broadcast to all clients that a new user joined
    io.emit('userJoined', { 
      users: Object.values(users),
      message: `${username} has joined the chat!` 
    });
    
    // Send current user list to the new user
    socket.emit('userList', Object.values(users));
  });
  
  // Handle chat messages
  socket.on('sendMessage', (data) => {
    const { message } = data;
    const username = users[socket.id];
    
    // Send message to all connected clients
    io.emit('message', { 
      id: Date.now(), 
      user: username, 
      text: message,
      time: new Date().toLocaleTimeString()
    });
  });
  
  // Handle typing indicator
  socket.on('typing', () => {
    const username = users[socket.id];
    socket.broadcast.emit('userTyping', username);
  });
  
  socket.on('stopTyping', () => {
    socket.broadcast.emit('userStoppedTyping');
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (users[socket.id]) {
      const username = users[socket.id];
      delete users[socket.id];
      
      // Notify all users that someone has left
      io.emit('userLeft', { 
        users: Object.values(users),
        message: `${username} has left the chat.` 
      });
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});