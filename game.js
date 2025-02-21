const socket = io();
const cells = document.querySelectorAll(".cell");

cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        socket.emit("makeMove", { index: cell.dataset.index, symbol: "X" });
    });
});

socket.on("updateBoard", (board) => {
    board.forEach((mark, index) => {
        cells[index].innerText = mark;
    });
});
