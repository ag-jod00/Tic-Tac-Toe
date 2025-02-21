document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // Initialize Socket.IO
    const socket = io();

    // Select elements
    const joinButton = document.getElementById("joinRoomButton");
    const roomCodeInput = document.getElementById("roomCodeInput");

    // Ensure elements exist before adding event listeners
    if (joinButton && roomCodeInput) {
        joinButton.addEventListener("click", joinRoom);
    } else {
        console.error("Error: Elements not found!");
    }

    function joinRoom() {
        const roomCode = roomCodeInput.value.trim();
        if (roomCode.length === 6) {
            console.log(`Attempting to join room: ${roomCode}`);
            socket.emit("joinRoom", { roomCode });
        } else {
            alert("Please enter a valid 6-digit room code.");
        }
    }

    // Listen for server response
    socket.on("roomJoined", (data) => {
        console.log(`Joined room: ${data.roomCode}`);
    });

    socket.on("roomJoinError", (error) => {
        alert(error.message);
    });
});
