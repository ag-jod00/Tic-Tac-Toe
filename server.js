const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const rooms = {}; // Stores active rooms and players

// Serve static files (HTML, JS, CSS)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index01.html"); // Home page
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Create Room
    socket.on("create_room", () => {
        const roomId = Math.floor(100000 + Math.random() * 900000).toString();
        rooms[roomId] = { players: [socket.id], board: Array(9).fill(null), turn: "X" };
        socket.join(roomId);
        socket.emit("room_created", roomId);
    });

    // Join Room
    socket.on("join_room", (roomId) => {
        if (rooms[roomId] && rooms[roomId].players.length < 2) {
            rooms[roomId].players.push(socket.id);
            socket.join(roomId);
            io.to(roomId).emit("room_joined", roomId);

            // Start game when 2 players join
            if (rooms[roomId].players.length === 2) {
                io.to(roomId).emit("start_game", { board: rooms[roomId].board, turn: rooms[roomId].turn });
            }
        } else {
            socket.emit("room_full");
        }
    });

    // Handle Moves
    socket.on("make_move", ({ roomId, index, symbol }) => {
        if (rooms[roomId] && rooms[roomId].board[index] === null) {
            rooms[roomId].board[index] = symbol;
            rooms[roomId].turn = symbol === "X" ? "O" : "X";
            io.to(roomId).emit("update_board", { board: rooms[roomId].board, turn: rooms[roomId].turn });
        }
    });

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (const roomId in rooms) {
            rooms[roomId].players = rooms[roomId].players.filter((id) => id !== socket.id);
            if (rooms[roomId].players.length === 0) {
                delete rooms[roomId];
            }
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
