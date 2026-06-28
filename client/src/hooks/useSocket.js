import { useEffect } from 'react';
import socket from '../socket';
import useGameStore from '../store/gameStore';

export function useSocket() {
  const { setRoom, setGameState, setError, setPlayerId } = useGameStore();

  useEffect(() => {
    socket.on('connect', () => {
      setPlayerId(socket.id);
    });

    socket.on('room:update', (room) => {
      setRoom(room);
    });

    socket.on('game:state', (gameState) => {
      setGameState(gameState);
    });

    socket.on('error', (message) => {
      setError(message);
    });

    return () => {
      socket.off('connect');
      socket.off('room:update');
      socket.off('game:state');
      socket.off('error');
    };
  });

  const createRoom = (playerName) => socket.emit('room:create', playerName);
  const joinRoom = (roomCode, playerName) => socket.emit('room:join', { roomCode, playerName });
  const startGame = (roomCode) => socket.emit('game:start', roomCode);
  const sendAction = (action) => socket.emit('game:action', action);

  return { createRoom, joinRoom, startGame, sendAction };
}