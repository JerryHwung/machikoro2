import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import GameHeader from '../components/board/GameHeader';
import Marketplace from '../components/board/Marketplace';
import PlayerTableau from '../components/board/PlayerTableau';
import OpponentSidebar from '../components/board/Opponentsidebar';
import ActionBar from '../components/board/Actionbar';
import GameLog from '../components/board/Gamelog';
import WinScreen from '../components/ui/WinScreen';
import './GamePage.css';

export default function GamePage({ onAction }) {
  const { gameState, playerId, reset } = useGameStore();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logOpen, setLogOpen] = useState(false);

  if (!gameState) {
    return (
      <div className="game-no-state">
        <p>No active game found.</p>
        <button className="btn primary" onClick={() => navigate('/')}>
          Back to lobby
        </button>
      </div>
    );
  }

  const me = gameState.players.find((p) => p.id === playerId);
  const opponents = gameState.players.filter((p) => p.id !== playerId);
  const activePlayer = gameState.players[gameState.turn];
  const isMyTurn = activePlayer?.id === playerId;
  const isGameOver = gameState.phase === 'game_over';

  function handlePlayAgain() {
    // Reset local state and go back to lobby
    // Host can start a new game from there
    reset();
    navigate('/');
  }

  return (
    <div className="game-page">
      <GameHeader
        gameState={gameState}
        me={me}
        activePlayer={activePlayer}
        isMyTurn={isMyTurn}
        logOpen={logOpen}
        onToggleLog={() => setLogOpen((o) => !o)}
      />
      <div className="game-body">
        <div className="game-main">
          <Marketplace
            marketplace={gameState.marketplace}
            deckCount={gameState.deckCount}
            myCoins={me?.coins ?? 0}
            isMyTurn={isMyTurn}
            phase={gameState.phase}
            onBuy={(uid) => onAction({ type: 'buy_establishment', cardUid: uid })}
          />
          <PlayerTableau
            player={me}
            isActive={isMyTurn}
            label="Your city"
          />
        </div>
        <OpponentSidebar
          opponents={opponents}
          activePlayerId={activePlayer?.id}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />
      </div>
      {!isGameOver && (
        <ActionBar
          gameState={gameState}
          me={me}
          isMyTurn={isMyTurn}
          onAction={onAction}
        />
      )}

      <GameLog
        log={gameState.log}
        isOpen={logOpen}
        onClose={() => setLogOpen(false)}
      />

      {isGameOver && (
        <WinScreen
          gameState={gameState}
          playerId={playerId}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}
