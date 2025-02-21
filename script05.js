document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Initialize Socket.IO
    const socket = io(); // Ensure this works properly with your backend

    // Selecting the button
    const button = document.getElementById("generateCodeButton");
    const codeDisplay = document.getElementById("roomCode");

    if (button && codeDisplay) {
        button.addEventListener("click", generateCode);
    } else {
        console.error("Error: Elements not found!");
    }

    // Function to generate a random room code and send it to the server
    function generateCode() {
        const roomCode = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random code
        codeDisplay.innerText = roomCode;

        // Emit room code to the server
        socket.emit("createRoom", { roomCode });
    }

    // Listening for confirmation from server
    socket.on("roomCreated", (data) => {
        console.log(`Room ${data.roomCode} created successfully.`);
    });
});
