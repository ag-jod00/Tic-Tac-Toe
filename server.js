const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(__dirname));

// Routes for each HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index01.html'));
});

app.get('/page2', (req, res) => {
  res.sendFile(path.join(__dirname, 'index02.html'));
});

app.get('/page3', (req, res) => {
  res.sendFile(path.join(__dirname, 'index03.html'));
});

app.get('/page4', (req, res) => {
  res.sendFile(path.join(__dirname, 'index04.html'));
});

app.get('/page5', (req, res) => {
  res.sendFile(path.join(__dirname, 'index05.html'));
});

app.get('/page6', (req, res) => {
  res.sendFile(path.join(__dirname, 'index06.html'));
});

// Multiplayer Room System
const rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Create Room
  socket.on('createRoom', () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate room code
    rooms[roomCode] = { players: [socket.id] };
    socket.join(roomCode);
    socket.emit('roomCreated', roomCode);
    console.log(`Room ${roomCode} created by ${socket.id}`);
  });

  // Join Room
  socket.on('joinRoom', (roomCode) => {
    if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
      rooms[roomCode].players.push(socket.id);
      socket.join(roomCode);
      io.to(roomCode).emit('startGame', roomCode);
      console.log(`User ${socket.id} joined room ${roomCode}`);
    } else {
      socket.emit('roomFull');
    }
  });

  // Handle Game Moves
  socket.on('move', ({ roomCode, board }) => {
    socket.to(roomCode).emit('updateBoard', board);
  });

  // Handle Disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    for (const room in rooms) {
      rooms[room].players = rooms[room].players.filter((id) => id !== socket.id);
      if (rooms[room].players.length === 0) {
        delete rooms[room];
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
