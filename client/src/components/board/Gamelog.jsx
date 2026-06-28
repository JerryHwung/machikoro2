import { useEffect, useRef } from 'react';
import './GameLog.css';

export default function GameLog({ log, isOpen, onClose }) {
  const listRef = useRef(null);

  // Auto-scroll to bottom when new entries arrive
  useEffect(() => {
    if (isOpen && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [log, isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="log-backdrop" onClick={onClose} aria-hidden="true" />
      )}

      {/* Drawer */}
      <div className={`log-drawer ${isOpen ? 'open' : ''}`} role="dialog" aria-label="Game log">
        <div className="log-handle-row">
          <div className="log-handle" />
          <span className="log-title">Game Log</span>
          <button className="log-close" onClick={onClose} aria-label="Close log">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="log-list" ref={listRef}>
          {log.length === 0 && (
            <p className="log-empty">Nothing yet — game hasn't started.</p>
          )}
          {log.map((entry, i) => (
            <LogEntry key={i} entry={entry} />
          ))}
        </div>
      </div>
    </>
  );
}

function LogEntry({ entry }) {
  // Categorise entry for colour coding
  const isTurn    = entry.message.startsWith('---');
  const isWin     = entry.message.includes('wins');
  const isIncome  = entry.message.includes('activated');
  const isBuild   = entry.message.includes('bought') || entry.message.includes('built');

  const cls = isTurn   ? 'log-turn'
            : isWin    ? 'log-win'
            : isIncome ? 'log-income'
            : isBuild  ? 'log-build'
            : 'log-default';

  return (
    <div className={`log-entry ${cls}`}>
      <span className="log-time">
        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
      <span className="log-message">{entry.message}</span>
    </div>
  );
}