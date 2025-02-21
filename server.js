const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change this for security)
  },
});

const rooms = {}; // Store active rooms

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle creating a new room
  socket.on("createRoom", (roomCode) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = { players: [socket.id] };
      socket.join(roomCode);
      console.log(`Room ${roomCode} created`);
      socket.emit("roomCreated", roomCode);
    } else {
      socket.emit("error", "Room already exists");
    }
  });

  // Handle joining an existing room
  socket.on("joinRoom", (roomCode) => {
    if (rooms[roomCode] && rooms[roomCode].players.length < 2) {
      rooms[roomCode].players.push(socket.id);
      socket.join(roomCode);
      console.log(`User ${socket.id} joined room ${roomCode}`);
      io.to(roomCode).emit("startGame", roomCode);
    } else {
      socket.emit("error", "Room is full or does not exist");
    }
  });

  socket.on("makeMove", ({ roomCode, boardState }) => {
    socket.to(roomCode).emit("updateBoard", boardState);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
    for (let roomCode in rooms) {
      rooms[roomCode].players = rooms[roomCode].players.filter(
        (id) => id !== socket.id
      );
      if (rooms[roomCode].players.length === 0) {
        delete rooms[roomCode];
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
