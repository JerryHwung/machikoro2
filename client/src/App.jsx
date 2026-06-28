import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSocket } from './hooks/useSocket';
import useGameStore from './store/gameStore';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';

function AppShell() {
  const { createRoom, joinRoom, startGame, sendAction } = useSocket();
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);

  useEffect(() => {
    if (gameState && window.location.pathname !== '/game') {
      navigate('/game');
    }
  }, [gameState, navigate]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LobbyPage
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
              onStartGame={startGame}
            />
          }
        />
        <Route
          path="/game"
          element={<GamePage onAction={sendAction} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* PWA install prompt — shown on top of everything */}
      <PWAInstallPrompt />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}