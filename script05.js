const socket = io();

// Function to generate a random 6-digit room code
function generateCode() {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    document.getElementById('roomCode').innerText = roomCode;

    // Emit the room creation event to the server
    socket.emit('createRoom', roomCode);
}
