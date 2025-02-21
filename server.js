const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Store active rooms
const rooms = {};

app.use(express.static(__dirname)); // Serve static files from current directory

// Default route (should load index01.html)
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index01.html");
});

// Socket.io Connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle room creation
    socket.on("createRoom", () => {
        let roomId = Math.floor(100000 + Math.random() * 900000).toString();
        rooms[roomId] = { players: [socket.id] }; // Store room with first player
        socket.join(roomId);
        console.log(`Room Created: ${roomId} by ${socket.id}`);
        socket.emit("roomCreated", roomId);
    });

    // Handle joining room
    socket.on("joinRoom", (roomId) => {
        console.log(`Player ${socket.id} trying to join Room: ${roomId}`);
        
        if (rooms[roomId] && rooms[roomId].players.length < 2) {
            rooms[roomId].players.push(socket.id);
            socket.join(roomId);
            console.log(`Player ${socket.id} joined Room: ${roomId}`);
            socket.emit("roomJoined", roomId);
            io.to(roomId).emit("startGame", roomId);
        } else {
            console.log(`Room ${roomId} is invalid or full`);
            socket.emit("invalidRoom");
        }
    });

    // Handle player moves
    socket.on("makeMove", ({ roomId, cellIndex }) => {
        console.log(`Move in Room ${roomId} by ${socket.id} at Cell ${cellIndex}`);
        io.to(roomId).emit("updateBoard", { cellIndex, playerId: socket.id });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
        
        // Remove player from rooms
        for (let roomId in rooms) {
            let index = rooms[roomId].players.indexOf(socket.id);
            if (index !== -1) {
                rooms[roomId].players.splice(index, 1);
                console.log(`User ${socket.id} removed from Room: ${roomId}`);
                if (rooms[roomId].players.length === 0) delete rooms[roomId]; // Delete empty rooms
            }
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
