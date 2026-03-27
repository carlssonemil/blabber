const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const { formatMessage, formatNotice } = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Upload proxy — forwards files to uguu.se server-side to avoid CORS issues
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('file', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

    const response = await fetch('https://uguu.se/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    const data = await response.json();
    res.send(data.files[0].url);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Run when client connects
io.on('connection', async socket => {
  socket.on('join', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('messageChannel', formatNotice('Welcome to Blabber! 👋'));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit(
      'messageChannel', 
      formatNotice(`${user.username} has joined the chat`)
    );

    // Send users and room info
    io.to(user.room).emit('users', getRoomUsers(user.room));
  });

  // Listen for message
  socket.on('message', async ({ message, attachment }) => {
    const user = getCurrentUser(socket.id);

    if (user) {
      let messages = await formatMessage(user, message, attachment);
      messages.forEach(formattedMessage => {
        io.to(user.room).emit(
          'messageChannel', 
          formattedMessage
        );
      });
    }
  });

  // Listen for typing event
  socket.on('typing', (isTyping) => {
    const user = getCurrentUser(socket.id);

    if (user) {
      const users = getRoomUsers(user.room);
  
      users.map(u => {
        if (u.id === user.id) {
          u.typing = isTyping;
        }
      });
  
      // Send users and room info
      socket.broadcast.to(user.room).emit('users', users);
    }
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
      formatNotice(`${user.username} has left the chat`)
    );

    // Send users and room info
    io.to(user.room).emit('users', getRoomUsers(user.room));
  }
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});