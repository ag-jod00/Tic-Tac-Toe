document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    const socket = io(); // Initialize Socket.IO connection

    // Ensure elements exist
    const joinButton = document.getElementById("joinRoomButton");
    const roomCodeInput = document.getElementById("roomCodeInput");

    if (!joinButton || !roomCodeInput) {
        console.error("Error: joinRoomButton or roomCodeInput not found!");
        return;
    }

    // Attach event listener
    joinButton.addEventListener("click", () => {
        const roomCode = roomCodeInput.value.trim();
        if (roomCode.length === 6) {
            console.log(`Attempting to join room: ${roomCode}`);
            socket.emit("joinRoom", { roomCode });
        } else {
            alert("Please enter a valid 6-digit room code.");
        }
    });

    // Listen for successful room join
    socket.on("roomJoined", (data) => {
        alert(`Joined Room: ${data.roomCode}`);
        window.location.href = "index03.html"; // Redirect to game board
    });

    // Handle room full or invalid error
    socket.on("roomFullOrInvalid", () => {
        alert("Room is full or does not exist!");
    });
});
