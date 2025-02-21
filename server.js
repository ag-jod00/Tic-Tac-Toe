const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (CSS, JS, HTML)
app.use(express.static(__dirname));

let rooms = {}; // Stores active game rooms

// Routes for each HTML page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index01.html")));
app.get("/page2", (req, res) => res.sendFile(path.join(__dirname, "index02.html")));
app.get("/page3", (req, res) => res.sendFile(path.join(__dirname, "index03.html")));
app.get("/page4", (req, res) => res.sendFile(path.join(__dirname, "index04.html")));
app.get("/page5", (req, res) => res.sendFile(path.join(__dirname, "index05.html")));
app.get("/page6", (req, res) => res.sendFile(path.join(__dirname, "index06.html")));

// Socket.IO Connection Handling
io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Create a room
    socket.on("createRoom", () => {
        let roomCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a random 6-character room code
        rooms[roomCode] = { players: [socket.id] };
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created by ${socket.id}`);
    });

    // Join a room
    socket.on("joinRoom", (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            io.to(roomCode).emit("roomJoined", roomCode);
            console.log(`Player ${socket.id} joined Room ${roomCode}`);
        } else {
            socket.emit("roomFullOrInvalid");
        }
    });

    // Handle game moves
    socket.on("move", ({ roomCode, index, player }) => {
        io.to(roomCode).emit("updateBoard", { index, player });
    });

    // Disconnect event
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter((id) => id !== socket.id);
            if (rooms[roomCode].players.length === 0) delete rooms[roomCode];
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
