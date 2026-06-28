import { create } from 'zustand';

const useGameStore = create((set) => ({
  playerName: '',
  playerId: null,
  room: null,
  gameState: null,
  error: null,

  setPlayerName: (name) => set({ playerName: name }),
  setPlayerId: (id) => set({ playerId: id }),
  setRoom: (room) => set({ room }),
  setGameState: (gameState) => set({ gameState }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({ room: null, gameState: null, error: null }),
}));

export default useGameStore;