const socket = io(); // Initialize Socket.IO connection

function generateCode() {
    let roomCode = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit room code
    document.getElementById("roomCode").innerText = roomCode;
    socket.emit("createRoom", roomCode); // Emit room creation to server
}

// Wait for DOM to load before adding event listener
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generateBtn").addEventListener("click", generateCode);
});

// Listen for successful room creation
socket.on("roomCreated", (roomCode) => {
    alert(`Room Created: ${roomCode}`);
});
