[machikoro2-scaffold.md](https://github.com/user-attachments/files/29433489/machikoro2-scaffold.md)
# Machi Koro 2 — Project Scaffold

## Folder Structure

```
machikoro2/
├── client/                  # Vite + React frontend
│   ├── public/
│   │   ├── icons/           # PWA icons (192x192, 512x512)
│   │   └── manifest.json    # PWA manifest
│   ├── src/
│   │   ├── assets/          # Card images, dice SVGs, sounds
│   │   ├── components/
│   │   │   ├── board/
│   │   │   │   ├── Marketplace.jsx
│   │   │   │   ├── PlayerTableau.jsx
│   │   │   │   └── DiceArea.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Coin.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   └── GameLog.jsx
│   │   │   └── lobby/
│   │   │       ├── CreateRoom.jsx
│   │   │       └── JoinRoom.jsx
│   │   ├── hooks/
│   │   │   ├── useSocket.js      # Socket.io connection hook
│   │   │   └── useGameState.js   # Local game state subscription
│   │   ├── store/
│   │   │   └── gameStore.js      # Zustand store
│   │   ├── pages/
│   │   │   ├── LobbyPage.jsx
│   │   │   └── GamePage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── socket.js            # Socket.io client instance
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Node.js + Socket.io backend
│   ├── src/
│   │   ├── game/
│   │   │   ├── GameState.js      # Core game state class
│   │   │   ├── cards.js          # All card definitions
│   │   │   ├── rules.js          # Income resolution, win condition
│   │   │   └── deck.js           # Marketplace deck management
│   │   ├── rooms/
│   │   │   └── RoomManager.js    # Create/join/leave rooms
│   │   └── index.js              # Express + Socket.io entry point
│   └── package.json
│
├── shared/                  # Shared constants between client & server
│   └── constants.js         # Card types, game phases, event names
│
└── README.md
```

---

## Step 1 — Bootstrap the Project

```bash
mkdir machikoro2 && cd machikoro2
git init
```

Create a root `.gitignore`:
```
node_modules/
dist/
.env
.env.local
```

---

## Step 2 — Set Up the Server

```bash
mkdir server && cd server
npm init -y
npm install express socket.io cors
npm install -D nodemon
```

Edit `server/package.json` scripts:
```json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js"
}
```

**`server/src/index.js`** (entry point):
```js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const RoomManager = require('./rooms/RoomManager');

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
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

httpServer.listen(3001, () => console.log('Server running on port 3001'));
```

---

## Step 3 — Set Up the Client

```bash
cd ..
npm create vite@latest client -- --template react
cd client
npm install
npm install socket.io-client zustand react-router-dom
npm install -D vite-plugin-pwa tailwindcss @tailwindcss/vite
```

**`client/vite.config.js`**:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Machi Koro 2',
        short_name: 'MachiKoro',
        theme_color: '#1a1a2e',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: {
    port: 5173
  }
});
```

**`client/src/socket.js`** (single shared instance):
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', { autoConnect: false });
export default socket;
```

---

## Step 4 — Shared Constants

```bash
cd .. && mkdir shared
```

**`shared/constants.js`**:
```js
// Socket event names — single source of truth for client & server
const EVENTS = {
  ROOM_CREATE: 'room:create',
  ROOM_JOIN: 'room:join',
  ROOM_UPDATE: 'room:update',
  GAME_START: 'game:start',
  GAME_STATE: 'game:state',
  GAME_ACTION: 'game:action',
  GAME_LOG: 'game:log',
  ERROR: 'error',
};

// Game phases (state machine)
const PHASES = {
  LOBBY: 'lobby',
  ROLL_DICE: 'roll_dice',
  RESOLVE_INCOME: 'resolve_income',
  CONSTRUCT: 'construct',
  END_TURN: 'end_turn',
  GAME_OVER: 'game_over',
};

// Card activation colours
const CARD_COLOR = {
  BLUE: 'blue',     // activates on anyone's roll
  GREEN: 'green',   // activates only on your roll
  RED: 'red',       // activates on other players' rolls
  PURPLE: 'purple', // activates on your roll (major establishments)
};

module.exports = { EVENTS, PHASES, CARD_COLOR };
```

---

## Step 5 — First Run

Open two terminals:

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Visit `http://localhost:5173` — you should see the Vite + React default page, confirming the stack is wired up.

---

## What's Next (Build Order)

1. **`GameState.js`** — define the state shape and card data
2. **`RoomManager.js`** — room creation, join, and player list sync
3. **Lobby UI** — create/join room forms with room code display
4. **Game board layout** — marketplace + player tableaus
5. **Dice roll flow** — roll → broadcast → income resolution
6. **Card purchase flow** — validate coins, update state, replenish marketplace
7. **Win condition** — check all landmarks built after each construction phase
8. **PWA polish** — offline fallback page, "Add to Home Screen" prompt
