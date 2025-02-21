function generateCode() {
    let code = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit code
    document.getElementById("roomCode").innerText = code;
}