const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const formatMessage = require('./utils/messages');
const { 
  userJoin, 
  getCurrentUser, 
  userLeave, 
  getRoomUsers 
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(cors());
app.use(express.json());

// Handle production 
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const botUser = {
  id: 1,
  username: 'Blabber Bot'
}

// Run when client connects
io.on('connection', socket => {
  socket.on('join', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('messageChannel', formatMessage(botUser, 'Welcome to Blabber! 👋', 'notice'));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit(
      'messageChannel', 
      formatMessage(botUser, `${user.username} has joined the chat`, 'notice')
    );

    // Send users and room info
    io.to(user.room).emit('users', getRoomUsers(user.room));
  });

  // Listen for message
  socket.on('message', (message) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit(
      'messageChannel', 
      formatMessage(user, message)
    );
  });

  // Listen for typing event
  socket.on('typing', (isTyping) => {
    const user = getCurrentUser(socket.id);
    const users = getRoomUsers(user.room);

    users.map(u => {
      if (u.id === user.id) {
        u.typing = isTyping;
      }
    });

    // Send users and room info
    socket.broadcast.to(user.room).emit('users', users);
  });

  // Listen for forceDisconnect
  socket.on('leave', () => {
    disconnectUser(socket.id, socket);
  });
  
  // Runs when client disconnects
  socket.on('disconnect', () => {
    disconnectUser(socket.id, socket);
  });
});

function disconnectUser(id) {
  const user = getCurrentUser(id);
  userLeave(id);

  if (user) {
    io.to(user.room).emit(
      'messageChannel', 
      formatMessage(botUser, `${user.username} has left the chat`, 'notice')
    );

    // Send users and room info
    io.to(user.room).emit('users', getRoomUsers(user.room));
  }
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});