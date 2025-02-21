const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("room");
let symbol = "X"; // Default

// Wait for game to start
socket.on("start_game", ({ board, turn }) => {
    alert("Game Started!");
    updateBoard(board);
});

// Handle Moves
document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.addEventListener("click", () => {
        if (!cell.innerText) {
            socket.emit("make_move", { roomId, index, symbol });
        }
    });
});

// Update Board
socket.on("update_board", ({ board, turn }) => {
    updateBoard(board);
    symbol = turn; // Update turn
});

// Update Board Function
function updateBoard(board) {
    document.querySelectorAll(".cell").forEach((cell, index) => {
        cell.innerText = board[index] || "";
    });
}
