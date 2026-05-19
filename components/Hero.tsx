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
      {/* Gradient overlays — darken the global particle canvas for text readability */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(to right, rgba(13,10,8,.96) 25%, rgba(13,10,8,.45) 65%, rgba(13,10,8,.7) 100%),
          linear-gradient(to bottom, rgba(13,10,8,.45) 0%, transparent 22%, transparent 70%, rgba(13,10,8,.9) 100%)
        `,
      }} />

      {/* Cinematic bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 58, background: '#0d0a08', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 58, background: '#0d0a08', zIndex: 2 }} />

      {/* Corner brackets */}
      {(['tl','tr','bl','br'] as const).map(pos => (
        <div key={pos} style={{
          position: 'absolute',
          width: 38, height: 38,
          zIndex: 3,
          top:    pos.startsWith('t') ? 72  : undefined,
          bottom: pos.startsWith('b') ? 68  : undefined,
          left:   pos.endsWith('l')   ? '3rem' : undefined,
          right:  pos.endsWith('r')   ? '3rem' : undefined,
          borderTop:    pos.startsWith('t') ? '1px solid #d63545' : undefined,
          borderBottom: pos.startsWith('b') ? '1px solid #d63545' : undefined,
          borderLeft:   pos.endsWith('l')   ? '1px solid #d63545' : undefined,
          borderRight:  pos.endsWith('r')   ? '1px solid #d63545' : undefined,
        }} />
      ))}

      {/* Watermark logo */}
      <div style={{
        position: 'absolute', right: '5%', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2, opacity: .04, pointerEvents: 'none',
      }}>
        <Image src="/lockup-white.png" alt="Kelriva AI" aria-hidden width={320} height={200} style={{ width: 320, height: 'auto' }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: 780 }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.68rem',
          color: '#d63545',
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          marginBottom: '1.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.75rem',
          opacity: 0,
          animation: 'fadeUp 1s ease .3s forwards',
        }}>
          <span style={{ display: 'block', width: 44, height: 1, background: 'linear-gradient(90deg,transparent,#d63545)' }} />
          London, UK
          <span style={{ opacity: .4 }}>·</span>
          Est. 2026
          <span style={{ animation: 'blink 1.2s step-end infinite' }}>_</span>
        </div>

        {/* H1 */}
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
          color: '#ffffff',
          lineHeight: .96,
          letterSpacing: '-.02em',
          marginBottom: '.4rem',
          opacity: 0,
          animation: 'fadeUp 1.1s ease .5s forwards',
        }}>
          <span>From data</span><br />
          <span>to decision.</span>
        </h1>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-instrument), sans-serif',
          fontStyle: 'normal',
          fontWeight: 800,
          fontSize: 'clamp(3rem, 6vw, 5.8rem)',
          letterSpacing: '-.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(214,53,69,.55)',
          opacity: 0,
          animation: 'fadeUp 1.1s ease .7s forwards',
          marginBottom: '1.65rem',
        }}>
          Instantly.
        </span>

        <p style={{
          fontSize: '1.05rem',
          color: 'rgba(237,229,220,.7)',
          maxWidth: 480,
          lineHeight: 1.8,
          marginBottom: '3rem',
          opacity: 0,
          animation: 'fadeUp 1s ease .9s forwards',
        }}>
          We build <strong style={{ color: '#ede5dc', fontWeight: 500 }}>AI systems</strong> that process
          documents, automate workflows, and surface intelligence —{' '}
          <strong style={{ color: '#ede5dc', fontWeight: 500 }}>delivered in weeks, not months.</strong>
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
              fontWeight: 700, fontSize: '.82rem',
              letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '1rem 2.4rem', border: 'none',
              cursor: 'pointer',
              transition: 'transform .16s cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          >
            Book a discovery call
          </button>

          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent', color: '#ede5dc',
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 500, fontSize: '.82rem',
              letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '1rem 2rem',
              border: '1px solid rgba(237,229,220,.15)',
              cursor: 'pointer',
              transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d63545'
              e.currentTarget.style.color = '#d63545'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(237,229,220,.15)'
              e.currentTarget.style.color = '#ede5dc'
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'none' }}
          >
            See what we build →
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 78, left: '3rem', zIndex: 3,
        display: 'flex', alignItems: 'center', gap: '.75rem',
        opacity: 0, animation: 'fadeIn 1s ease 2s forwards',
      }}>
        <div style={{
          width: 40, height: 1,
          background: 'linear-gradient(90deg,#d63545,transparent)',
          animation: 'scrollLine 2.2s ease infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.6rem', color: '#6b5548',
          letterSpacing: '.2em', textTransform: 'uppercase',
        }}>Scroll to explore</span>
      </div>

      {/* Stats */}
      <div style={{
        position: 'absolute', right: '3rem', bottom: 78, zIndex: 3,
        display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'right',
        opacity: 0, animation: 'fadeUp 1s ease 1.5s forwards',
      }} className="hero-stats">
        {[
          { n: '£1.17B', l: 'UK Gov AI spend' },
          { n: '48h',    l: 'Proposal turnaround' },
          { n: '100%',   l: 'Fixed-fee delivery' },
        ].map(({ n, l }) => (
          <div key={l}>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '1.65rem', color: '#d63545', fontWeight: 400,
              lineHeight: 1, display: 'block',
            }}>{n}</span>
            <span style={{
              fontSize: '.66rem', color: '#6b5548',
              letterSpacing: '.1em', textTransform: 'uppercase',
            }}>{l}</span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-stats { display: none !important; }
          section#hero { padding: 0 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}
