import { useState } from 'react';
import './ActionBar.css';

export default function ActionBar({ gameState, me, isMyTurn, onAction }) {
  const [rolling, setRolling] = useState(false);
  const [numDice, setNumDice] = useState(1);

  const { phase, lastRoll, pendingTarget } = gameState;
  const hasTrainStation = me?.landmarks.find((l) => l.id === 'train_station')?.built;
  const hasHarbor = me?.landmarks.find((l) => l.id === 'harbor')?.built;
  const hasRadioTower = me?.landmarks.find((l) => l.id === 'radio_tower')?.built;

  function handleRoll() {
    setRolling(true);
    onAction({ type: 'roll_dice', numDice });
    setTimeout(() => setRolling(false), 600);
  }

  function handleReroll() {
    setRolling(true);
    onAction({ type: 'reroll_dice', numDice });
    setTimeout(() => setRolling(false), 600);
  }

  // ── Roll phase ────────────────────────────────────────────────────
  if (isMyTurn && phase === 'roll_dice') {
    return (
      <div className="action-bar">
        {hasTrainStation && (
          <div className="dice-toggle">
            <button
              className={`dice-btn ${numDice === 1 ? 'active' : ''}`}
              onClick={() => setNumDice(1)}
            >
              1 die
            </button>
            <button
              className={`dice-btn ${numDice === 2 ? 'active' : ''}`}
              onClick={() => setNumDice(2)}
            >
              2 dice
            </button>
          </div>
        )}
        <button
          className={`action-primary ${rolling ? 'rolling' : ''}`}
          onClick={handleRoll}
          disabled={rolling}
        >
          {rolling ? (
            <DiceSpinner />
          ) : (
            <>
              <DiceIcon /> Roll {numDice === 2 ? '2 dice' : '1 die'}
            </>
          )}
        </button>
      </div>
    );
  }

  // ── Resolve phase — show last roll result + optional harbor/reroll ─
  if (phase === 'resolve_income') {
    return (
      <div className="action-bar">
        {lastRoll && (
          <div className="roll-result">
            {lastRoll.dice.map((d, i) => (
              <DiceFace key={i} value={d} />
            ))}
            <span className="roll-total">= {lastRoll.total}</span>
            {lastRoll.isDoubles && (
              <span className="doubles-badge">Doubles!</span>
            )}
          </div>
        )}

        <div className="action-group">
          {isMyTurn && hasHarbor && lastRoll?.dice.length === 2 && (
            <button
              className="action-secondary"
              onClick={() => onAction({ type: 'apply_harbor_bonus' })}
            >
              +2 Harbor bonus
            </button>
          )}
          {isMyTurn && hasRadioTower && me?.canReroll && (
            <button className="action-secondary" onClick={handleReroll}>
              Reroll (Radio Tower)
            </button>
          )}
          {isMyTurn && !pendingTarget && (
            <button
              className="action-primary"
              onClick={() => onAction({ type: 'resolve_income' })}
            >
              Resolve income
            </button>
          )}
          {pendingTarget && isMyTurn && (
            <span className="pending-note">
              Choose a target player for {pendingTarget.cardId.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      </div>
    );
  }

  // ── Construct phase ───────────────────────────────────────────────
  if (isMyTurn && phase === 'construct') {
    return (
      <div className="action-bar">
        <span className="action-hint">
          Buy a card from the marketplace, build a landmark, or skip.
        </span>
        <div className="action-group">
          {/* Unbuilt landmarks the player can afford */}
          {me?.landmarks
            .filter((l) => !l.built && me.coins >= l.cost)
            .map((lm) => (
              <button
                key={lm.id}
                className="action-secondary"
                onClick={() => onAction({ type: 'build_landmark', landmarkId: lm.id })}
              >
                Build {lm.name} 🪙{lm.cost}
              </button>
            ))}
          <button
            className="action-skip"
            onClick={() => onAction({ type: 'skip_construction' })}
          >
            Skip / End turn
          </button>
        </div>
      </div>
    );
  }

  // ── Not your turn ─────────────────────────────────────────────────
  if (!isMyTurn) {
    return (
      <div className="action-bar waiting">
        <span className="waiting-text">
          Waiting for {gameState.players[gameState.turn]?.name}…
        </span>
        {lastRoll && (
          <div className="roll-result">
            {lastRoll.dice.map((d, i) => (
              <DiceFace key={i} value={d} />
            ))}
            <span className="roll-total">= {lastRoll.total}</span>
          </div>
        )}
      </div>
    );
  }

  // ── Game over ─────────────────────────────────────────────────────
  if (phase === 'game_over') {
    const winner = gameState.players.find((p) => p.id === gameState.winner);
    return (
      <div className="action-bar game-over">
        <span className="game-over-text">
          🎉 {winner?.name ?? 'Someone'} wins!
        </span>
      </div>
    );
  }

  return null;
}

// ── Small helpers ──────────────────────────────────────────────────

function DiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="4" ry="4" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function DiceSpinner() {
  return <span className="dice-spinner">⚄</span>;
}

function DiceFace({ value }) {
  const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  return <span className="dice-face">{faces[value - 1] ?? value}</span>;
}