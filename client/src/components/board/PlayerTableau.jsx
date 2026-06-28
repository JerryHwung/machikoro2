import './PlayerTableau.css';

const COLOR_STYLES = {
  blue:   { text: '#60a5fa' },
  green:  { text: '#34d399' },
  red:    { text: '#f87171' },
  purple: { text: '#a78bfa' },
};

export default function PlayerTableau({ player, isActive, label = 'Your city' }) {
  if (!player) return null;

  const builtLandmarks = player.landmarks.filter((l) => l.built);
  const unbuiltLandmarks = player.landmarks.filter((l) => !l.built);

  return (
    <section className={`tableau ${isActive ? 'active' : ''}`}>
      <div className="tableau-header">
        <h2 className="section-title">{label}</h2>
        <div className="tableau-coins">
          <span>🪙</span>
          <span>{player.coins}</span>
        </div>
      </div>

      {/* Landmarks */}
      <div className="landmarks-row">
        {[...builtLandmarks, ...unbuiltLandmarks].map((lm) => (
          <div
            key={lm.id}
            className={`landmark-chip ${lm.built ? 'built' : 'unbuilt'}`}
            title={lm.effect}
          >
            <span className="landmark-icon">{lm.built ? '🏛️' : '🚧'}</span>
            <span className="landmark-name">{lm.name}</span>
            {!lm.built && (
              <span className="landmark-cost">🪙{lm.cost}</span>
            )}
          </div>
        ))}
      </div>

      {/* Establishments */}
      {player.establishments.length === 0 ? (
        <p className="tableau-empty">No establishments yet</p>
      ) : (
        <div className="establishments-grid">
          {player.establishments.map((card, i) => {
            const style = COLOR_STYLES[card.color] ?? COLOR_STYLES.blue;
            return (
              <div
                key={card.uid ?? `${card.id}-${i}`}
                className="estab-chip"
                style={{ '--chip-color': style.text }}
                title={card.effect}
              >
                <span className="estab-activation">{card.activation.join('-')}</span>
                <span className="estab-name">{card.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}