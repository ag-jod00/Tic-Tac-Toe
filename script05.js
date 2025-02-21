const socket = io();

document.getElementById("generateBtn").addEventListener("click", () => {
    socket.emit("createRoom");
});

socket.on("roomCreated", (roomId) => {
    console.log("Room created successfully:", roomId);
    document.getElementById("roomCodeDisplay").innerText = roomId;
});
