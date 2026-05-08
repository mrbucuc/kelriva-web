'use client'

import { motion } from 'framer-motion'

export default function QuoteStrip() {
  return (
    <div style={{
      background: '#150f09',
      padding: '5.5rem 3rem',
      borderTop: '1px solid rgba(214,53,69,.05)',
      borderBottom: '1px solid rgba(214,53,69,.05)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Horizontal gradient line */}
      <div style={{
        position: 'absolute',
        width: 700, height: 1,
        background: 'linear-gradient(90deg,transparent,#a01828,transparent)',
        top: 0, left: '50%', transform: 'translateX(-50%)',
      }} />

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontStyle: 'italic',
          fontSize: 'clamp(1.7rem, 4vw, 3rem)',
          fontWeight: 300,
          color: '#ffffff',
          maxWidth: 800,
          margin: '0 auto',
          lineHeight: 1.3,
          letterSpacing: '-.01em',
        }}
      >
        "The organisations that win won't have the most data — they'll be those who turn data into{' '}
        <em style={{ fontStyle: 'normal', color: '#d63545', fontWeight: 400 }}>decisions, instantly.</em>"
      </motion.p>
    </div>
  )
}
