const socket = io(); // Connect to the server

function generateCode() {
    socket.emit("createRoom"); // Ask the server to create a room
}

// Listen for the generated room code from the server
socket.on("roomCreated", (roomCode) => {
    document.getElementById("roomCode").innerText = `Room Code: ${roomCode}`;
    alert(`Room created! Share this code: ${roomCode}`);
});

