import { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import CreateRoom from '../components/lobby/CreateRoom';
import JoinRoom from '../components/lobby/JoinRoom';
import './LobbyPage.css';

export default function LobbyPage({ onCreateRoom, onJoinRoom, onStartGame }) {
  const { error, clearError } = useGameStore();

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(clearError, 4000);
    return () => clearTimeout(t);
  }, [error, clearError]);

  return (
    <main className="lobby-page">
      <div className="lobby-hero">
        <h1 className="lobby-title">
          Machi Koro <span className="accent">2</span>
        </h1>
        <p className="lobby-subtitle">Gather your city builders</p>
        <div className="dice-row" aria-hidden="true">
          <Die face={5} delay={0} />
          <Die face={3} delay={80} />
        </div>
      </div>

      {error && (
        <div className="error-banner" role="alert">{error}</div>
      )}

      <div className="lobby-cards">
        <CreateRoom onCreateRoom={onCreateRoom} onStartGame={onStartGame} />
        <div className="lobby-divider"><span>or</span></div>
        <JoinRoom onJoinRoom={onJoinRoom} />
      </div>

      <footer className="lobby-footer">2–5 players · Base game</footer>
    </main>
  );
}

function Die({ face, delay }) {
  const dots = {
    1: ['center'],
    2: ['top-right', 'bottom-left'],
    3: ['top-right', 'center', 'bottom-left'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
  };
  return (
    <div className="die" style={{ animationDelay: `${delay}ms` }}>
      {dots[face].map((pos) => (
        <span key={pos} className={`dot dot-${pos}`} />
      ))}
    </div>
  );
}