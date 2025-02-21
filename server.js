const express = require("express");
const app = express();
const path = require("path");

// Serve static files from the same folder
app.use(express.static(__dirname));

// Route to serve the main HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index01.html"));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
