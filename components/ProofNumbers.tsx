'use client'

// Duplicated so the seamless loop works — CSS handles the animation
const ITEMS = [
  { value: '2',      label: 'AI Systems in Production' },
  { value: '48h',    label: 'Proposal Turnaround'       },
  { value: '100%',   label: 'Fixed-Fee Delivery'        },
  { value: '£1.17B', label: 'UK Gov AI Spend · 2025'   },
]

export default function ProofNumbers() {
  return (
    <div style={{
      borderTop:    '1px solid rgba(214,53,69,.1)',
      borderBottom: '1px solid rgba(214,53,69,.1)',
      padding: '1.6rem 0',
      overflow: 'hidden',
      background: 'rgba(10,7,6,.55)',
      position: 'relative',
    }}>
      {/* Fade left edge */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(90deg, #0d0a08 30%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Fade right edge */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
        background: 'linear-gradient(-90deg, #0d0a08 30%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Ticker track — doubled for seamless loop */}
      <div className="ticker-track">
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="ticker-item">
            <span className="ticker-value">{item.value}</span>
            <span className="ticker-sep">—</span>
            <span className="ticker-label">{item.label}</span>
            <span className="ticker-dot">·</span>
          </div>
        ))}
      </div>

      <style>{`
        .ticker-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          animation: ticker-scroll 32s linear infinite;
          gap: 0;
        }
        .ticker-track:hover { animation-play-state: paused; }

        .ticker-item {
          display: inline-flex;
          align-items: baseline;
          gap: .75rem;
          padding: 0 2.5rem;
        }

        .ticker-value {
          font-family: var(--font-cormorant), serif;
          font-style: italic;
          font-weight: 300;
          font-size: 1.5rem;
          color: #ffffff;
          line-height: 1;
        }

        .ticker-sep {
          font-family: var(--font-jetbrains), monospace;
          font-size: .55rem;
          color: rgba(214,53,69,.4);
          letter-spacing: .1em;
        }

        .ticker-label {
          font-family: var(--font-jetbrains), monospace;
          font-size: .6rem;
          color: #6b5548;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .ticker-dot {
          color: rgba(214,53,69,.35);
          font-size: 1.2rem;
          padding-left: 2.5rem;
        }

        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
