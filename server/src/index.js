const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const RoomManager = require('./rooms/RoomManager');

const app = express();
app.use(cors());
app.get('/health', (req, res) => res.status(200).type('text/plain').send('ok'));

const clientDistPath = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^\/(?!socket\.io\/).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

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

const port = process.env.PORT || 3001;
httpServer.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
