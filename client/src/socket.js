import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL
  || (import.meta.env.PROD
    ? window.location.origin
    : `${window.location.protocol}//${window.location.hostname}:3001`);

const socket = io(socketUrl, {
  autoConnect: true,
  reconnection: false,
});

export default socket;
