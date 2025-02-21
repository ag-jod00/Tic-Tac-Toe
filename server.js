const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (CSS, JS)
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

// Socket.IO for real-time functionality (if needed)
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
