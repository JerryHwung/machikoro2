import './Marketplace.css';

const COLOR_STYLES = {
  blue:   { bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)',  text: '#60a5fa' },
  green:  { bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.25)',  text: '#34d399' },
  red:    { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.25)', text: '#f87171' },
  purple: { bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.25)', text: '#a78bfa' },
};

export default function Marketplace({ marketplace, deckCount, myCoins, isMyTurn, phase, onBuy }) {
  const canBuy = isMyTurn && phase === 'construct';

  return (
    <section className="marketplace">
      <div className="marketplace-header">
        <h2 className="section-title">Marketplace</h2>
        <span className="deck-count">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
          </svg>
          {deckCount} in deck
        </span>
      </div>

      <div className="marketplace-cards">
        {marketplace.map((card) => (
          <MarketCard
            key={card.uid}
            card={card}
            myCoins={myCoins}
            canBuy={canBuy}
            onBuy={onBuy}
          />
        ))}
        {marketplace.length === 0 && (
          <p className="marketplace-empty">Deck exhausted</p>
        )}
      </div>
    </section>
  );
}

function MarketCard({ card, myCoins, canBuy, onBuy }) {
  const style = COLOR_STYLES[card.color] ?? COLOR_STYLES.blue;
  const affordable = myCoins >= card.cost;
  const buyable = canBuy && affordable;

  return (
    <div
      className={`market-card ${buyable ? 'buyable' : ''} ${canBuy && !affordable ? 'too-expensive' : ''}`}
      style={{
        '--card-bg': style.bg,
        '--card-border': style.border,
        '--card-text': style.text,
      }}
      title={card.effect}
    >
      {/* Stack count badge */}
      {card.stackCount > 1 && (
        <span className="stack-badge">×{card.stackCount}</span>
      )}

      {/* Activation numbers */}
      <div className="card-activation">
        {card.activation.join('-')}
      </div>

      {/* Card name */}
      <div className="card-name">{card.name}</div>

      {/* Effect */}
      <div className="card-effect">{card.effect}</div>

      {/* Footer — color tag + cost + buy button */}
      <div className="card-footer">
        <span className="card-color-tag" style={{ color: style.text }}>
          {card.color}
        </span>
        <div className="card-cost">
          <span className="coin-icon">🪙</span>
          {card.cost}
        </div>
      </div>

      {buyable && (
        <button
          className="buy-btn"
          onClick={() => onBuy(card.uid)}
        >
          Buy
        </button>
      )}
    </div>
  );
}