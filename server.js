const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {}; // Store active rooms

// ✅ **Force `index01.html` to be the homepage**
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index01.html'));
});

// ✅ **Serve ALL static files (HTML, CSS, JS) from the current directory**
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('createRoom', () => {
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        rooms[roomCode] = { players: [socket.id] };
        socket.join(roomCode);
        socket.emit('roomCreated', roomCode);
        console.log(`Room created: ${roomCode}`);
    });

    socket.on('joinRoom', (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            io.to(roomCode).emit('roomJoined', roomCode);
            console.log(`Player joined room: ${roomCode}`);
        } else {
            socket.emit('roomError', 'Room is full or does not exist!');
        }
    });

    socket.on('disconnect', () => {
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== socket.id);
            if (rooms[roomCode].players.length === 0) {
                delete rooms[roomCode];
            }
        }
        console.log('A user disconnected:', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
