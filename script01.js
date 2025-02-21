const socket = io();

// Create Room
document.getElementById("createRoom").addEventListener("click", () => {
    socket.emit("create_room");
});

// Join Room
document.getElementById("joinRoom").addEventListener("click", () => {
    const roomId = document.getElementById("roomCode").value;
    if (roomId) {
        socket.emit("join_room", roomId);
    }
});

// Room Created
socket.on("room_created", (roomId) => {
    alert(`Room Created: ${roomId}`);
    window.location.href = `index02.html?room=${roomId}`;
});

// Room Joined
socket.on("room_joined", (roomId) => {
    alert(`Joined Room: ${roomId}`);
    window.location.href = `index02.html?room=${roomId}`;
});

// Room Full
socket.on("room_full", () => {
    alert("Room is full! Try another code.");
});
