const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (none in this example, but useful for future extensions)
app.use(express.static(path.join(__dirname)));

// Serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('user-message', (message) => {
    io.emit('message', message); // Broadcast the message to all connected clients
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
