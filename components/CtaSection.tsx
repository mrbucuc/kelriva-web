'use client'

import { motion } from 'framer-motion'

interface CtaSectionProps {
  onBookCall: () => void
}

export default function CtaSection({ onBookCall }: CtaSectionProps) {
  return (
    <section id="contact" style={{
      position: 'relative',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      background: 'rgba(21,15,9,0.08)',
    }}>
      {/* Expanding rings */}
      {[200, 400, 650, 900].map((size, i) => (
        <div key={size} style={{
          position: 'absolute',
          width: size, height: size,
          borderRadius: '50%',
          border: '1px solid rgba(214,53,69,.07)',
          top: '50%', left: '50%',
          animation: `ringExpand 4s ease infinite`,
          animationDelay: `${i}s`,
        }} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{ position: 'relative', zIndex: 1, padding: '6rem 2rem' }}
      >
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.68rem', color: '#d63545',
          letterSpacing: '.22em', textTransform: 'uppercase',
          marginBottom: '1.5rem', opacity: .8,
        }}>
          kelriva.ai — London, UK
        </div>

        <h2 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontStyle: 'italic',
          fontSize: 'clamp(2.8rem,6vw,5.2rem)',
          fontWeight: 300,
          color: '#ffffff',
          lineHeight: 1.05,
          letterSpacing: '-.03em',
          marginBottom: '.5rem',
        }}>
          <em>Ready to</em><br />
          <strong style={{
            fontStyle: 'normal',
            fontWeight: 800,
            fontFamily: 'var(--font-instrument), sans-serif',
          }}>automate?</strong>
        </h2>

        <p style={{
          fontSize: '1rem',
          color: '#6b5548',
          maxWidth: 430,
          margin: '0 auto 2.75rem',
          lineHeight: 1.8,
        }}>
          Let's talk about what Kelriva AI can build for your organisation.
          Free 30-minute discovery call. No obligations.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={onBookCall}
            style={{
              background: '#d63545', color: '#0d0a08',
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 700, fontSize: '.82rem',
              letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '1rem 2.4rem', border: 'none', cursor: 'pointer',
              transition: 'transform .16s cubic-bezier(0.23,1,0.32,1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          >
            Book a discovery call
          </button>

          <a
            href="mailto:info@kelriva.ai"
            style={{
              display: 'inline-flex', alignItems: 'center',
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
          >
            info@kelriva.ai
          </a>
        </div>
      </motion.div>
    </section>
  )
}
