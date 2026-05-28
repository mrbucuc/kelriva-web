'use client'

import Image from 'next/image'
import { checkReducedMotion } from '@/lib/animations'

interface HeroProps {
  onBookCall: () => void
}

// Headline split into words for stagger sequence
const HEADLINE_LINES = [
  { words: ['From', 'Data', 'to'], color: '#ede5dc' },
  { words: ['Decisions,'],         color: '#ede5dc' },
  { words: ['Instantly.'],         color: '#d63545' },
]

// 70ms stagger per word, starting at 900ms after mount
const WORD_BASE_DELAY = 900
const WORD_STAGGER    = 70

let wordIndex = 0
const wordDelay = (lineI: number, wordI: number) => {
  void lineI
  void wordI
  return WORD_BASE_DELAY + wordIndex++ * WORD_STAGGER
}

// Reset counter each render (module-level counter resets on re-import in dev)
export default function Hero({ onBookCall }: HeroProps) {
  wordIndex = 0

  const reduced = checkReducedMotion()

  // Pre-compute all delays so JSX stays clean
  const delays: number[][][] = HEADLINE_LINES.map(line =>
    line.words.map((_, wi) => {
      const d = wordDelay(0, wi)
      return [d]
    }),
  )
  // Reset so delays are consistent
  wordIndex = 0

  const allDelays: number[] = []
  HEADLINE_LINES.forEach(line => {
    line.words.forEach(() => {
      allDelays.push(reduced ? 0 : WORD_BASE_DELAY + allDelays.length * WORD_STAGGER)
    })
  })

  let wi = 0

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
        background: 'var(--color-ink)',
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

      {/* Cinematic letterbox bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 66, background: '#0d0a08', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 58, background: '#0d0a08', zIndex: 2 }} />

      {/* Left vertical rule */}
      <div style={{
        position: 'absolute',
        left: '3rem', top: 66, bottom: 58,
        width: 1,
        background: 'linear-gradient(to bottom, transparent 0%, rgba(214,53,69,.22) 20%, rgba(214,53,69,.22) 80%, transparent 100%)',
        zIndex: 3,
      }} />

      {/* Coordinate labels */}
      <div
        className="hero-coords"
        style={{
          position: 'absolute',
          left: 'calc(3rem + 16px)',
          top: 100,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          opacity: 0,
          animation: `fadeIn 1s ease ${reduced ? '0ms' : '1.8s'} forwards`,
        }}
      >
        {[
          { label: '51.5117° N', sub: 'latitude'  },
          { label: '0.1240° W',  sub: 'longitude' },
        ].map(({ label, sub }) => (
          <div key={sub} style={{ marginBottom: '1.2rem' }}>
            <div className="t-mono" style={{ color: 'rgba(214,53,69,.55)', fontSize: '.55rem' }}>{label}</div>
            <div className="t-mono" style={{ color: 'rgba(107,85,72,.4)',  fontSize: '.48rem' }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Watermark logo */}
      <div style={{
        position: 'absolute', right: '4%', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2, opacity: .032, pointerEvents: 'none',
      }}>
        <Image src="/lockup-white.png" alt="" aria-hidden width={360} height={220} style={{ width: 360, height: 'auto' }} />
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: 860, paddingLeft: 'clamp(0px, 4vw, 56px)' }}>

        {/* Headline — word-by-word stagger */}
        <h1 style={{ margin: '0 0 1.6rem' }} aria-label="From Data to Decisions, Instantly.">
          {HEADLINE_LINES.map((line, li) => (
            <div key={li} style={{ display: 'block', lineHeight: .97 }}>
              {line.words.map((word) => {
                const delay = reduced ? 0 : WORD_BASE_DELAY + wi++ * WORD_STAGGER
                return (
                  <span
                    key={word + li}
                    style={{
                      display: 'inline-block',
                      marginRight: '.28em',
                      fontFamily: 'var(--font-instrument), sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(3.5rem, 8vw, 8.5rem)',
                      color: line.color,
                      letterSpacing: '-.03em',
                      opacity: 0,
                      animation: `fadeUp 0.7s var(--ease-out) ${delay}ms forwards`,
                    }}
                  >
                    {word}
                  </span>
                )
              })}
            </div>
          ))}
        </h1>
        {/* Reset counter for next call */}
        {(wi = 0) as unknown as null}

        {/* Red horizontal rule — draws after headline */}
        <div style={{
          width: 40, height: 2,
          background: '#d63545',
          marginBottom: '1.6rem',
          transformOrigin: 'left',
          opacity: 0,
          animation: `fadeIn 0.4s var(--ease-out) ${reduced ? '0ms' : '1500ms'} forwards`,
        }} />

        {/* Sub-headline */}
        <p
          style={{
            fontFamily: 'var(--font-instrument), sans-serif',
            fontWeight: 400,
            fontSize: '1.15rem',
            color: '#9a7a6a',
            lineHeight: 1.6,
            maxWidth: 460,
            margin: '0 0 2.8rem',
            opacity: 0,
            animation: `fadeUp 0.7s var(--ease-out) ${reduced ? '0ms' : '1600ms'} forwards`,
          }}
        >
          AI Consultancy that builds, not just advises.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap',
            opacity: 0,
            animation: `fadeUp 0.7s var(--ease-out) ${reduced ? '0ms' : '1750ms'} forwards`,
          }}
        >
          <button
            onClick={onBookCall}
            data-cursor="cta"
            style={{
              background: '#d63545', color: '#0d0a08',
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 700, fontSize: '.8rem',
              letterSpacing: '.12em', textTransform: 'uppercase',
              padding: '1rem 2.4rem', border: 'none',
              cursor: 'pointer',
              transition: 'transform .16s var(--ease-out), background .16s',
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
            data-cursor="link"
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
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(214,53,69,.4)'; e.currentTarget.style.color = '#d63545' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(154,122,106,.18)'; e.currentTarget.style.color = '#9a7a6a' }}
          >
            See what we build →
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 76, left: '3rem', zIndex: 3,
        display: 'flex', alignItems: 'center', gap: '.75rem',
        opacity: 0, animation: `fadeIn 1s ease ${reduced ? '0ms' : '2200ms'} forwards`,
      }}>
        <div style={{
          width: 36, height: 1,
          background: 'linear-gradient(90deg,#d63545,transparent)',
          animation: 'scrollLine 2.4s ease infinite',
        }} />
        <span className="t-mono" style={{ color: 'rgba(107,85,72,.55)', fontSize: '.58rem' }}>
          Scroll
        </span>
      </div>

      {/* Edition label */}
      <div
        className="hero-edition"
        style={{
          position: 'absolute', bottom: 76, right: '3rem', zIndex: 3,
          opacity: 0, animation: `fadeIn 1s ease ${reduced ? '0ms' : '2200ms'} forwards`,
          textAlign: 'right',
        }}
      >
        <div className="t-mono" style={{ color: 'rgba(107,85,72,.35)', fontSize: '.54rem' }}>
          kelriva.ai<br />
          <span style={{ opacity: .6 }}>WC2H 9JQ · England</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section#hero { padding: 0 1.5rem !important; }
          .hero-coords  { display: none !important; }
          .hero-edition { display: none !important; }
        }
      `}</style>
    </section>
  )
}
