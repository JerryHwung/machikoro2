const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const RoomManager = require('./rooms/RoomManager');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

const roomManager = new RoomManager(io);

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  socket.on('room:create', (playerName) => roomManager.createRoom(socket, playerName));
  socket.on('room:join', ({ roomCode, playerName }) => roomManager.joinRoom(socket, roomCode, playerName));
  socket.on('game:start', (roomCode) => roomManager.startGame(socket, roomCode));
  socket.on('game:action', (action) => roomManager.handleAction(socket, action));
  socket.on('disconnect', () => roomManager.handleDisconnect(socket));
});

httpServer.listen(3001, '0.0.0.0', () => console.log('Server running on port 3001'));