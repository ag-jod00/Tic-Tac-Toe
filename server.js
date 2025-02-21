const express = require("express");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Store active rooms and their players
const rooms = {};

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Serve the main game page
app.get("/game", (req, res) => {
    res.sendFile(path.join(__dirname, "index01.html"));
});

// Socket.io connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle room creation
    socket.on("createRoom", () => {
        let roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        rooms[roomCode] = { players: [socket.id] };
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created.`);
    });

    // Handle room joining
    socket.on("joinRoom", (roomCode) => {
        if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
            rooms[roomCode].players.push(socket.id);
            socket.join(roomCode);
            io.to(roomCode).emit("roomJoined", roomCode);
            console.log(`Player joined room ${roomCode}`);
        } else {
            socket.emit("roomFullOrInvalid");
        }
    });

    // Handle player moves
    socket.on("makeMove", ({ roomCode, cellIndex, player }) => {
        io.to(roomCode).emit("moveMade", { cellIndex, player });
    });

    // Handle player disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (let room in rooms) {
            rooms[room].players = rooms[room].players.filter((id) => id !== socket.id);
            if (rooms[room].players.length === 0) {
                delete rooms[room];
                console.log(`Room ${room} deleted.`);
            }
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
