const socket = io();

document.getElementById("joinRoomBtn").addEventListener("click", () => {
    const roomCode = document.getElementById("roomInput").value.trim();
    if (roomCode) {
        socket.emit("joinRoom", roomCode);
    }
});

socket.on("roomJoined", (roomCode) => {
    alert(`Joined Room: ${roomCode}`);
});

socket.on("roomError", (message) => {
    alert(message);
});
