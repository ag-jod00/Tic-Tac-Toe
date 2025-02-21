const socket = io();
let playerSymbol = "X"; // Default
let roomId = localStorage.getItem("roomId"); // Store room ID

// Handle move clicks
document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        let index = cell.getAttribute("data-index");
        socket.emit("makeMove", { roomId, index, symbol: playerSymbol });
    });
});

// Update board on move
socket.on("updateBoard", ({ index, symbol }) => {
    document.querySelector(`.cell[data-index='${index}']`).innerText = symbol;
});
