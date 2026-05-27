'use client'

import Image from 'next/image'

interface HeroProps {
  onBookCall: () => void
}

export default function Hero({ onBookCall }: HeroProps) {
  return (
    <section
      id="hero"
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 3rem',
      }}
    >
      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(to right, rgba(13,10,8,.97) 30%, rgba(13,10,8,.5) 65%, rgba(13,10,8,.75) 100%),
          linear-gradient(to bottom, rgba(13,10,8,.5) 0%, transparent 25%, transparent 72%, rgba(13,10,8,.95) 100%)
        `,
      }} />

      {/* Cinematic bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 66, background: '#0d0a08', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 58, background: '#0d0a08', zIndex: 2 }} />

      {/* Left vertical rule — graphic spine */}
      <div style={{
        position: 'absolute',
        left: '3rem',
        top: 66,
        bottom: 58,
        width: 1,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(214,53,69,.22) 20%, rgba(214,53,69,.22) 80%, transparent 100%)',
        zIndex: 3,
      }} />

      {/* Coordinate labels along vertical rule */}
      <div style={{
        position: 'absolute',
        left: 'calc(3rem + 16px)',
        top: 100,
        zIndex: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        opacity: 0,
        animation: 'fadeIn 1s ease 1.8s forwards',
      }} className="hero-coords">
        {[
          { label: '51.5117° N', sub: 'latitude' },
          { label: '0.1240° W', sub: 'longitude' },
        ].map(({ label, sub }) => (
          <div key={sub} style={{ marginBottom: '1.2rem' }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.55rem', color: 'rgba(214,53,69,.55)',
              letterSpacing: '.14em', textTransform: 'uppercase',
            }}>{label}</div>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.48rem', color: 'rgba(107,85,72,.4)',
              letterSpacing: '.18em', textTransform: 'uppercase',
            }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Watermark logo */}
      <div style={{
        position: 'absolute', right: '4%', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2, opacity: .032, pointerEvents: 'none',
      }}>
        <Image src="/lockup-white.png" alt="Kelriva AI" aria-hidden width={360} height={220} style={{ width: 360, height: 'auto' }} />
      </div>

      {/* Content — offset right of the vertical rule */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: 800, paddingLeft: 'clamp(0px, 4vw, 56px)' }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.65rem',
          color: '#d63545',
          letterSpacing: '.22em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.75rem',
          opacity: 0,
          animation: 'fadeUp 1s ease .35s forwards',
        }}>
          <span style={{ display: 'block', width: 32, height: 1, background: 'linear-gradient(90deg,transparent,#d63545)' }} />
          Enterprise AI · London
          <span style={{ opacity: .35 }}>·</span>
          Est. 2026
          <span style={{ animation: 'blink 1.2s step-end infinite', opacity: .7 }}>_</span>
        </div>

        {/* H1 — editorial weight contrast */}
        <h1 style={{
          margin: 0,
          opacity: 0,
          animation: 'fadeUp 1.1s ease .55s forwards',
        }}>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(3.2rem, 6.5vw, 6rem)',
            color: '#ffffff',
            lineHeight: .97,
            letterSpacing: '-.02em',
          }}>From data</span>
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(3.2rem, 6.5vw, 6rem)',
            color: '#ffffff',
            lineHeight: .97,
            letterSpacing: '-.02em',
            marginBottom: '.2rem',
          }}>to decision.</span>
        </h1>

        {/* Contrast word — outline treatment */}
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-instrument), sans-serif',
          fontStyle: 'normal',
          fontWeight: 800,
          fontSize: 'clamp(2.8rem, 5.8vw, 5.4rem)',
          letterSpacing: '-.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(214,53,69,.5)',
          opacity: 0,
          animation: 'fadeUp 1.1s ease .72s forwards',
          marginBottom: '1.75rem',
        }}>
          Instantly.
        </span>

        <p style={{
          fontSize: '1rem',
          color: 'rgba(237,229,220,.65)',
          maxWidth: 460,
          lineHeight: 1.85,
          marginBottom: '3rem',
          opacity: 0,
          animation: 'fadeUp 1s ease .92s forwards',
        }}>
          We build <strong style={{ color: '#ede5dc', fontWeight: 500 }}>bespoke AI systems</strong> that process
          documents, automate workflows, and surface intelligence —{' '}
          <strong style={{ color: '#ede5dc', fontWeight: 500 }}>fixed-fee, delivered in weeks.</strong>
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap',
          opacity: 0, animation: 'fadeUp 1s ease 1.1s forwards',
        }}>
          <button
            onClick={onBookCall}
            style={{
              background: '#d63545', color: '#0d0a08',
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 700, fontSize: '.8rem',
              letterSpacing: '.12em', textTransform: 'uppercase',
              padding: '1rem 2.4rem', border: 'none',
              cursor: 'pointer',
              transition: 'transform .16s cubic-bezier(0.23,1,0.32,1), background .16s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#e8404f' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#d63545' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          >
            Book a discovery call
          </button>

          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent', color: '#9a7a6a',
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 500, fontSize: '.8rem',
              letterSpacing: '.12em', textTransform: 'uppercase',
              padding: '1rem 2rem',
              border: '1px solid rgba(154,122,106,.18)',
              cursor: 'pointer',
              transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(214,53,69,.4)'
              e.currentTarget.style.color = '#d63545'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(154,122,106,.18)'
              e.currentTarget.style.color = '#9a7a6a'
            }}
          >
            See what we build →
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 76, left: '3rem', zIndex: 3,
        display: 'flex', alignItems: 'center', gap: '.75rem',
        opacity: 0, animation: 'fadeIn 1s ease 2.2s forwards',
      }}>
        <div style={{
          width: 36, height: 1,
          background: 'linear-gradient(90deg,#d63545,transparent)',
          animation: 'scrollLine 2.4s ease infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.58rem', color: 'rgba(107,85,72,.55)',
          letterSpacing: '.22em', textTransform: 'uppercase',
        }}>Scroll</span>
      </div>

      {/* Bottom-right — edition label */}
      <div style={{
        position: 'absolute', bottom: 76, right: '3rem', zIndex: 3,
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '.54rem', color: 'rgba(107,85,72,.35)',
        letterSpacing: '.18em', textTransform: 'uppercase',
        opacity: 0, animation: 'fadeIn 1s ease 2.2s forwards',
        textAlign: 'right',
      }} className="hero-edition">
        kelriva.ai<br />
        <span style={{ opacity: .6 }}>WC2H 9JQ · England</span>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section#hero { padding: 0 1.5rem !important; }
          .hero-coords { display: none !important; }
          .hero-edition { display: none !important; }
        }
      `}</style>
    </section>
  )
}
