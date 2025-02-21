const buttons = document.querySelectorAll(".box");
const resetButton = document.querySelector(".reset");
const winnerText = document.querySelector("h2");
let player = "X"; 
let gameOver = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
        if (button.innerText !== "" || gameOver) return; // Prevent overwriting or continuing after win
        button.innerText = player;
        
        if (checkWin()) {
            winnerText.innerText = `Winner : ${player}`;
            gameOver = true;
            return;
        }

        player = player === "X" ? "O" : "X"; // Switch player
    });
});

resetButton.addEventListener("click", () => {
    buttons.forEach(button => button.innerText = "");
    winnerText.innerText = "Winner : _______";
    player = "X";
    gameOver = false;
});

function checkWin() {
    return winPatterns.some(pattern => {
        return pattern.every(index => buttons[index].innerText === player);
    });
}
