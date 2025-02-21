const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const rooms = {}; // Stores active rooms and players

app.use(express.static(__dirname)); // Serve static files from project folder

// Serve the main room creation page on root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index05.html"));
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("createRoom", () => {
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        rooms[roomCode] = { players: [socket.id], board: ["", "", "", "", "", "", "", "", ""] };

        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created by ${socket.id}`);
    });

    socket.on("joinRoom", (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            socket.emit("roomJoined", roomCode);
            io.to(roomCode).emit("startGame", rooms[roomCode].players);
            console.log(`Player ${socket.id} joined room ${roomCode}`);
        } else {
            socket.emit("roomError", "Room is full or does not exist!");
        }
    });

    socket.on("makeMove", ({ roomCode, index, symbol }) => {
        if (rooms[roomCode]) {
            rooms[roomCode].board[index] = symbol;
            io.to(roomCode).emit("updateBoard", rooms[roomCode].board);
        }
    });

    socket.on("disconnect", () => {
        for (const roomCode in rooms) {
            const players = rooms[roomCode].players;
            if (players.includes(socket.id)) {
                rooms[roomCode].players = players.filter((id) => id !== socket.id);
                if (rooms[roomCode].players.length === 0) {
                    delete rooms[roomCode];
                    console.log(`Room ${roomCode} deleted`);
                }
            }
        }
        console.log("User disconnected:", socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
