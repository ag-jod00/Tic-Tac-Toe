function joinRoom() {
    let code = document.getElementById("roomCode").value;
    if (code.length === 6) {
        alert("Joining room: " + code);
        // Redirect or handle room join logic here
    } else {
        alert("Please enter a valid 6-digit room code.");
    }
}