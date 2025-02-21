const socket = io(); // Initialize Socket.IO connection

function joinRoom() {
    let roomCode = document.getElementById("roomCode").value;
    if (roomCode) {
        socket.emit("joinRoom", roomCode); // Emit room code to server
    }
}

// Add event listener when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("joinBtn").addEventListener("click", joinRoom);
});

// Listen for successful join
socket.on("roomJoined", (roomCode) => {
    alert(`Joined Room: ${roomCode}`);
    window.location.href = "index03.html"; // Redirect to game board
});

// Handle errors (room full or invalid)
socket.on("roomFullOrInvalid", () => {
    alert("Room is full or does not exist!");
});
