const socket = io();

document.getElementById("createRoomBtn").addEventListener("click", () => {
    socket.emit("createRoom");
});

socket.on("roomCreated", (roomCode) => {
    document.getElementById("roomCode").innerText = `Room Code: ${roomCode}`;
});
