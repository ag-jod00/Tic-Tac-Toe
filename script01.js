const socket = io();

// Create Room
document.getElementById("createRoomBtn")?.addEventListener("click", () => {
    const roomId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit room ID
    socket.emit("createRoom", roomId);
    alert(`Room Created: ${roomId}`);
    window.location.href = `index03.html?room=${roomId}`; // Redirect to the game page
});

// Join Room
document.getElementById("joinRoomBtn")?.addEventListener("click", () => {
    const roomId = document.getElementById("roomIdInput")?.value;
    if (roomId) {
        socket.emit("joinRoom", roomId);
    } else {
        alert("Please enter a valid Room ID.");
    }
});

// Listen for successful room join
socket.on("roomJoined", (roomId) => {
    alert(`Joined Room: ${roomId}`);
    window.location.href = `index03.html?room=${roomId}`; // Redirect to the game page
});

// Error handling
socket.on("roomFull", () => {
    alert("Room is full. Try another room.");
});
socket.on("roomNotFound", () => {
    alert("Room not found. Check the Room ID.");
});
