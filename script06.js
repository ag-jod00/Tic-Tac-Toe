const socket = io();

document.getElementById("joinBtn").addEventListener("click", () => {
    let roomId = document.getElementById("roomCodeInput").value.trim();
    console.log("Attempting to join room:", roomId);
    socket.emit("joinRoom", roomId);
});

socket.on("roomError", (message) => {
    alert(message);
    console.log("Room Error:", message);
});

socket.on("roomJoined", (roomId) => {
    console.log("Successfully joined room:", roomId);
    alert(`Joined Room: ${roomId}`);
});

socket.on("startGame", (players) => {
    console.log("Game starting with players:", players);
    alert("Game is starting!");
});
