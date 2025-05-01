const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // When a client sends an action, broadcast it to others
  socket.on('action', (data) => {
    console.log('Received action:', data.type);
    socket.broadcast.emit('action', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(4000, () => {
  console.log('WebSocket server running on http://localhost:4000');
});
