const socket = io();

// Function to join a room
function joinRoom() {
    const roomCode = document.getElementById('roomCode').value.trim();
    
    if (roomCode.length === 6) {
        socket.emit('joinRoom', roomCode);
    } else {
        alert('Please enter a valid 6-digit room code.');
    }
}

// Listen for a successful join event
socket.on('roomJoined', (roomCode) => {
    alert(`Successfully joined room: ${roomCode}`);
    window.location.href = 'index04.html'; // Redirect to the game page
});

// Handle errors (e.g., if the room is full or does not exist)
socket.on('roomError', (message) => {
    alert(message);
});
