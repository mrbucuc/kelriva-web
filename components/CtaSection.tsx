'use client'

import { motion } from 'framer-motion'

interface CtaSectionProps {
  onBookCall: () => void
}

export default function CtaSection({ onBookCall }: CtaSectionProps) {
  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#d63545',
      }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          zIndex: 0,
          pointerEvents: 'none',
          mixBlendMode: 'multiply',
          opacity: .35,
        }}
      />

      {/* Large background typographic watermark */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '-2rem',
          bottom: '-1.5rem',
          fontFamily: 'var(--font-cormorant), serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(9rem, 20vw, 18rem)',
          color: 'rgba(160,24,40,.3)',
          lineHeight: 1,
          letterSpacing: '-.04em',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
          whiteSpace: 'nowrap',
        }}
      >Act.</div>

      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 3rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Upper rule */}
        <div style={{
          borderTop: '1px solid rgba(160,24,40,.35)',
          marginBottom: 0,
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '4rem',
          alignItems: 'center',
          padding: '5rem 0',
        }} className="cta-inner">

          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.62rem', color: 'rgba(13,10,8,.55)',
              letterSpacing: '.22em', textTransform: 'uppercase',
              marginBottom: '1.4rem',
            }}>
              kelriva.ai — London, UK
            </div>

            <h2 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic',
              fontSize: 'clamp(2.6rem,5.5vw,5rem)',
              fontWeight: 300,
              color: '#0d0a08',
              lineHeight: 1.0,
              letterSpacing: '-.03em',
              margin: '0 0 1rem',
            }}>
              Ready to build<br />
              <em style={{ fontStyle: 'normal', fontWeight: 600 }}>something that ships?</em>
            </h2>

            <p style={{
              fontSize: '.95rem',
              color: 'rgba(13,10,8,.6)',
              maxWidth: 440,
              lineHeight: 1.8,
              margin: 0,
            }}>
              Free 30-minute discovery call. We ask the right questions, give you a clear picture of what's possible, and quote you a fixed price — all before you commit to anything.
            </p>
          </motion.div>

          {/* Right — CTA stack */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '.85rem',
              minWidth: 220,
            }}
          >
            <button
              onClick={onBookCall}
              style={{
                background: '#0d0a08',
                color: '#ede5dc',
                fontFamily: 'var(--font-instrument), sans-serif',
                fontWeight: 700,
                fontSize: '.8rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                padding: '1.1rem 2.2rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform .16s cubic-bezier(0.23,1,0.32,1), background .16s',
                whiteSpace: 'nowrap',
                textAlign: 'center',
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
              style={{
                display: 'block',
                textAlign: 'center',
                background: 'transparent',
                color: '#0d0a08',
                fontFamily: 'var(--font-instrument), sans-serif',
                fontWeight: 500,
                fontSize: '.8rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                padding: '1.1rem 2.2rem',
                border: '1px solid rgba(13,10,8,.3)',
                cursor: 'pointer',
                transition: 'border-color .2s, background .2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(13,10,8,.7)'
                e.currentTarget.style.background = 'rgba(13,10,8,.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(13,10,8,.3)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              info@kelriva.ai
            </a>

            {/* Trust footnote */}
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.54rem', color: 'rgba(13,10,8,.4)',
              letterSpacing: '.1em',
              textAlign: 'center',
              paddingTop: '.25rem',
            }}>
              No obligations · 48h proposal · Fixed-fee
            </div>
          </motion.div>
        </div>

        {/* Lower rule */}
        <div style={{ borderTop: '1px solid rgba(160,24,40,.35)' }} />
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cta-inner {
            grid-template-columns: 1fr !important;
            padding: 3.5rem 0 !important;
            gap: 2.5rem !important;
          }
          section#contact { }
        }
      `}</style>
    </section>
  )
}
