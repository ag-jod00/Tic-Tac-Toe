const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(__dirname));

// Store active game rooms
const rooms = {};

// Routes for each HTML page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index01.html")));
app.get("/page2", (req, res) => res.sendFile(path.join(__dirname, "index02.html")));
app.get("/page3", (req, res) => res.sendFile(path.join(__dirname, "index03.html")));
app.get("/page4", (req, res) => res.sendFile(path.join(__dirname, "index04.html")));
app.get("/page5", (req, res) => res.sendFile(path.join(__dirname, "index05.html")));
app.get("/page6", (req, res) => res.sendFile(path.join(__dirname, "index06.html")));

// Socket.IO connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle room creation
    socket.on("createRoom", () => {
        const roomCode = Math.random().toString(36).substr(2, 6).toUpperCase(); // Generate a random room code
        rooms[roomCode] = { players: [socket.id], board: ["", "", "", "", "", "", "", "", ""] };
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created by ${socket.id}`);
    });

    // Handle joining a room
    socket.on("joinRoom", (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            io.to(roomCode).emit("startGame", roomCode);
            
            // Assign X to the first player and O to the second
            io.to(rooms[roomCode].players[0]).emit("assignSymbol", { symbol: "X", roomCode });
            io.to(rooms[roomCode].players[1]).emit("assignSymbol", { symbol: "O", roomCode });

            console.log(`Player ${socket.id} joined room ${roomCode}`);
        } else {
            socket.emit("roomFull");
        }
    });

    // Handle game moves
    socket.on("move", ({ roomCode, board }) => {
        if (rooms[roomCode]) {
            rooms[roomCode].board = board;
            io.to(roomCode).emit("updateBoard", board);
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        
        // Remove player from any room they were in
        for (let roomCode in rooms) {
            const room = rooms[roomCode];
            if (room.players.includes(socket.id)) {
                room.players = room.players.filter(player => player !== socket.id);
                if (room.players.length === 0) {
                    delete rooms[roomCode]; // Remove empty room
                }
            }
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
