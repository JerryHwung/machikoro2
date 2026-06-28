import './GameHeader.css';

export default function GameHeader({
  gameState,
  me,
  activePlayer,
  isMyTurn,
  logOpen,
  onToggleLog,
}) {
  return (
    <header className="game-header">
      {/* Left — round + turn info */}
      <div className="header-left">
        <span className="header-round">Round {gameState.round}</span>
        <span className="header-divider">·</span>
        <span className={`header-turn ${isMyTurn ? 'my-turn' : ''}`}>
          {isMyTurn ? '⚡ Your turn' : `${activePlayer?.name}'s turn`}
        </span>
      </div>

      {/* Centre — phase badge */}
      <div className="header-center">
        <PhaseBadge phase={gameState.phase} />
      </div>

      {/* Right — my coins + log toggle */}
      <div className="header-right">
        <div className="coin-display">
          <span className="coin-icon">🪙</span>
          <span className="coin-count">{me?.coins ?? 0}</span>
        </div>
        <button
          className={`log-toggle ${logOpen ? 'active' : ''}`}
          onClick={onToggleLog}
          aria-label="Toggle game log"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Log
        </button>
      </div>
    </header>
  );
}

function PhaseBadge({ phase }) {
  const labels = {
    roll_dice:       { text: 'Roll dice',    color: '#60a5fa' },
    resolve_income:  { text: 'Resolving…',   color: '#f59e0b' },
    construct:       { text: 'Build phase',  color: '#34d399' },
    game_over:       { text: 'Game over',    color: '#f0a500' },
  };
  const { text, color } = labels[phase] ?? { text: phase, color: '#9ca3af' };

  return (
    <span className="phase-badge" style={{ '--phase-color': color }}>
      {text}
    </span>
  );
}