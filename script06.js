const socket = io(); // Connect to the server

function joinRoom() {
    const roomCode = document.getElementById("roomCode").value.trim(); // Get the room code

    if (roomCode === "") {
        alert("Please enter a valid room code.");
        return;
    }

    socket.emit("joinRoom", roomCode); // Send room code to the server
}

// Listen for game start when the player joins successfully
socket.on("startGame", (roomCode) => {
    alert(`Joined Room: ${roomCode}. Game is starting!`);
    window.location.href = "index01.html"; // Redirect both players to the game page
});

// If the room is full
socket.on("roomFull", () => {
    alert("Room is full! Try another code.");
});
