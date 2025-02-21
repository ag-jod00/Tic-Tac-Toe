const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {}; // Stores room codes and their players

app.use(express.static(__dirname)); // Serve static files

io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle room creation
    socket.on("createRoom", () => {
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
        rooms[roomCode] = { players: [] }; // Initialize room
        socket.emit("roomCreated", roomCode);
        console.log(`Room created: ${roomCode}`);
    });

    // Handle joining a room
    socket.on("joinRoom", (roomCode) => {
        console.log(`Join request for room: ${roomCode} from ${socket.id}`);

        if (!rooms[roomCode]) {
            console.log("Room not found!");
            socket.emit("roomFullOrInvalid");
            return;
        }

        if (rooms[roomCode].players.length >= 2) {
            console.log("Room is full!");
            socket.emit("roomFullOrInvalid");
            return;
        }

        rooms[roomCode].players.push(socket.id);
        socket.join(roomCode);
        socket.emit("roomJoined", roomCode);
        console.log(`Player joined room: ${roomCode}`);

        // If 2 players are in the room, start the game
        if (rooms[roomCode].players.length === 2) {
            io.to(roomCode).emit("gameStart");
            console.log(`Game started in room: ${roomCode}`);
        }
    });

    // Handle game moves
    socket.on("makeMove", ({ roomCode, cellIndex, symbol }) => {
        console.log(`Move in room ${roomCode}: Cell ${cellIndex}, Symbol: ${symbol}`);
        io.to(roomCode).emit("moveMade", { cellIndex, symbol });
    });

    // Handle disconnects
    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        for (const roomCode in rooms) {
            rooms[roomCode].players = rooms[roomCode].players.filter(id => id !== socket.id);
            if (rooms[roomCode].players.length === 0) {
                delete rooms[roomCode]; // Remove empty rooms
                console.log(`Room ${roomCode} deleted`);
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
