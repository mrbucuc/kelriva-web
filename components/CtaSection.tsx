'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { checkReducedMotion } from '@/lib/animations'

interface CtaSectionProps {
  onBookCall: () => void
}

const CREDENTIALS = [
  { icon: '🇬🇧', text: 'UK-Registered' },
  { icon: '☁',   text: 'AWS-Powered'   },
  { icon: '£',   text: 'Fixed-Fee'     },
  { icon: '⚡',   text: '48h Proposal' },
]

// Corner fly-in origins
const CORNERS = [
  { x: -30, y: -30 }, // TL
  { x:  30, y: -30 }, // TR
  { x: -30, y:  30 }, // BL
  { x:  30, y:  30 }, // BR
]

export default function CtaSection({ onBookCall }: CtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  const reduced = checkReducedMotion()

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (reduced) { setEntered(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setEntered(true); observer.disconnect() } },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ position: 'relative', overflow: 'hidden', background: '#d63545' }}
    >
      {/* Grain texture */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          zIndex: 0, pointerEvents: 'none',
          mixBlendMode: 'multiply', opacity: .35,
        }}
      />

      {/* Typographic watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute', right: '-2rem', bottom: '-1.5rem',
          fontFamily: 'var(--font-cormorant), serif',
          fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(9rem, 20vw, 18rem)',
          color: 'rgba(160,24,40,.25)',
          lineHeight: 1, letterSpacing: '-.04em',
          pointerEvents: 'none', userSelect: 'none',
          zIndex: 0, whiteSpace: 'nowrap',
        }}
      >Decide.</div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ borderTop: '1px solid rgba(160,24,40,.35)' }} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '4rem',
            alignItems: 'center',
            padding: '5rem 0',
          }}
          className="cta-inner"
        >
          {/* Left — corner fly-in elements */}
          <div>
            {/* Headline — TL corner origin */}
            <motion.h2
              initial={{ opacity: 0, x: CORNERS[0].x, y: CORNERS[0].y }}
              animate={entered ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0, ease: [0.23, 1, 0.32, 1] }}
              style={{
                fontFamily: 'var(--font-instrument), sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                color: '#0d0a08',
                lineHeight: 1.0,
                letterSpacing: '-.03em',
                margin: '0 0 1.2rem',
              }}
            >
              Ready to decide faster?
            </motion.h2>

            {/* Sub-copy — TR corner origin */}
            <motion.p
              initial={{ opacity: 0, x: CORNERS[1].x, y: CORNERS[1].y }}
              animate={entered ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
              style={{
                fontSize: '1rem',
                color: 'rgba(13,10,8,0.6)',
                maxWidth: 420,
                lineHeight: 1.7,
                margin: '0 0 2.2rem',
              }}
            >
              Fixed fee. No retainer. First conversation free.
            </motion.p>

            {/* Credentials strip — BL corner origin */}
            <motion.div
              initial={{ opacity: 0, x: CORNERS[2].x, y: CORNERS[2].y }}
              animate={entered ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
              style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}
            >
              {CREDENTIALS.map(c => (
                <div key={c.text} style={{
                  display: 'flex', alignItems: 'center', gap: '.4rem',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '.6rem',
                  color: 'rgba(13,10,8,0.5)',
                  letterSpacing: '.08em',
                }}>
                  <span style={{ opacity: .7 }}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — CTA stack, BR corner origin */}
          <motion.div
            initial={{ opacity: 0, x: CORNERS[3].x, y: CORNERS[3].y }}
            animate={entered ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', flexDirection: 'column', gap: '.85rem', minWidth: 220 }}
          >
            <button
              onClick={onBookCall}
              data-cursor="cta"
              style={{
                background: '#0d0a08', color: '#ede5dc',
                fontFamily: 'var(--font-instrument), sans-serif',
                fontWeight: 700, fontSize: '.8rem',
                letterSpacing: '.12em', textTransform: 'uppercase',
                padding: '1.1rem 2.2rem', border: 'none',
                cursor: 'pointer',
                transition: 'transform .16s var(--ease-out), background .16s',
                whiteSpace: 'nowrap', textAlign: 'center',
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#150f09' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.background = '#0d0a08' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            >
              Book a discovery call
            </button>

            <a
              href="mailto:info@kelriva.ai"
              data-cursor="link"
              style={{
                display: 'block', textAlign: 'center',
                background: 'transparent', color: '#0d0a08',
                fontFamily: 'var(--font-instrument), sans-serif',
                fontWeight: 500, fontSize: '.8rem',
                letterSpacing: '.12em', textTransform: 'uppercase',
                padding: '1.1rem 2.2rem',
                border: '1px solid rgba(13,10,8,.3)',
                cursor: 'pointer',
                transition: 'border-color .2s, background .2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(13,10,8,.7)'; e.currentTarget.style.background = 'rgba(13,10,8,.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(13,10,8,.3)'; e.currentTarget.style.background = 'transparent' }}
            >
              info@kelriva.ai
            </a>

            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.54rem', color: 'rgba(13,10,8,.4)',
              letterSpacing: '.1em', textAlign: 'center', paddingTop: '.25rem',
            }}>
              No obligations · 48h proposal · Fixed-fee
            </div>
          </motion.div>
        </div>

        <div style={{ borderTop: '1px solid rgba(160,24,40,.35)' }} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cta-inner {
            grid-template-columns: 1fr !important;
            padding: 3.5rem 0 !important;
            gap: 2.5rem !important;
          }
          section#contact { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>
    </section>
  )
}
