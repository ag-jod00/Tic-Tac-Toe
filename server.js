const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store rooms and players
const rooms = {};

// Serve static files (Ensure all HTML, CSS, and JS are in the same directory)
app.use(express.static(__dirname));

// Serve index06.html when accessing the root "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index06.html"));
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Create room and generate code
    socket.on("createRoom", () => {
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
        rooms[roomCode] = { players: [] };
        socket.join(roomCode);
        rooms[roomCode].players.push(socket.id);
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created by ${socket.id}`);
    });

    // Join an existing room
    socket.on("joinRoom", (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            socket.join(roomCode);
            rooms[roomCode].players.push(socket.id);
            io.to(roomCode).emit("roomJoined", roomCode);
            console.log(`Player ${socket.id} joined Room ${roomCode}`);
        } else {
            socket.emit("roomFullOrInvalid");
        }
    });

    // Handle player moves
    socket.on("playerMove", ({ roomCode, index }) => {
        socket.to(roomCode).emit("updateGame", index);
    });

    // Handle player disconnecting
    socket.on("disconnect", () => {
        for (const room in rooms) {
            rooms[room].players = rooms[room].players.filter((id) => id !== socket.id);
            if (rooms[room].players.length === 0) {
                delete rooms[room];
                console.log(`Room ${room} deleted`);
            }
        }
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
