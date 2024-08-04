const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("user-message", (message) => {
    io.emit("message", message); // Broadcast the message to all connected clients
  });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
