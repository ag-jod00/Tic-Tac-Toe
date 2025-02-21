const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const rooms = {}; // Store rooms and players

app.use(express.static(__dirname)); // Serve files from the same directory

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Create a new room
    socket.on("createRoom", () => {
        let roomId = Math.floor(100000 + Math.random() * 900000).toString();
        rooms[roomId] = { players: [socket.id], board: Array(9).fill(null) };

        console.log(`Room ${roomId} created by ${socket.id}`);
        socket.join(roomId);
        socket.emit("roomCreated", roomId);
    });

    // Join an existing room
    socket.on("joinRoom", (roomId) => {
        console.log(`Join request for room: ${roomId}`);

        if (!rooms[roomId]) {
            console.log(`Room ${roomId} does NOT exist.`);
            socket.emit("roomError", "Room does not exist!");
            return;
        }

        if (rooms[roomId].players.length >= 2) {
            console.log(`Room ${roomId} is full.`);
            socket.emit("roomError", "Room is full!");
            return;
        }

        rooms[roomId].players.push(socket.id);
        socket.join(roomId);
        socket.emit("roomJoined", roomId);
        console.log(`Player ${socket.id} joined room: ${roomId}`);

        // Notify both players the game is starting
        io.to(roomId).emit("startGame", rooms[roomId].players);
    });

    // Handle player moves
    socket.on("makeMove", ({ roomId, index, symbol }) => {
        if (rooms[roomId]) {
            rooms[roomId].board[index] = symbol;
            io.to(roomId).emit("updateBoard", { index, symbol });
        }
    });

    // Disconnect handling
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const roomId in rooms) {
            rooms[roomId].players = rooms[roomId].players.filter(id => id !== socket.id);

            if (rooms[roomId].players.length === 0) {
                delete rooms[roomId]; // Delete empty room
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
