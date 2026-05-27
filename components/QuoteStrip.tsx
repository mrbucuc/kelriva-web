'use client'

import { motion } from 'framer-motion'

export default function QuoteStrip() {
  return (
    <div style={{
      padding: '6rem 3rem',
      borderTop: '1px solid rgba(214,53,69,.07)',
      borderBottom: '1px solid rgba(214,53,69,.07)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative rule */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(160,24,40,.4) 40%, rgba(160,24,40,.4) 60%, transparent 100%)',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '0 4rem',
          alignItems: 'start',
        }} className="quote-grid">

          {/* Opening mark — typographic decoration */}
          <div
            aria-hidden
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(6rem, 12vw, 10rem)',
              fontWeight: 300,
              color: 'rgba(214,53,69,.12)',
              lineHeight: .75,
              userSelect: 'none',
              marginTop: '-.5rem',
              flexShrink: 0,
            }}
          >"</div>

          {/* Quote body */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontStyle: 'italic',
                fontSize: 'clamp(1.55rem, 3.5vw, 2.6rem)',
                fontWeight: 300,
                color: '#ffffff',
                lineHeight: 1.32,
                letterSpacing: '-.01em',
                margin: '0 0 2rem',
              }}
            >
              The organisations that win won't have the most data — they'll be those who turn data into{' '}
              <em style={{ fontStyle: 'normal', color: '#d63545', fontWeight: 400 }}>decisions, instantly.</em>
            </motion.p>

            {/* Attribution */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{
                width: 28,
                height: 1,
                background: 'rgba(214,53,69,.4)',
                flexShrink: 0,
              }} />
              <div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '.62rem',
                  color: 'rgba(154,122,106,.7)',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                }}>Kelriva AI · London, 2026</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .quote-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .quote-grid > :first-child {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          div:has(.quote-grid) { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>
    </div>
  )
}
