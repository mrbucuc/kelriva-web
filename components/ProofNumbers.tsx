'use client'

import { motion, type Variants } from 'framer-motion'

const STATS = [
  { value: '2',     em: true,  suffix: '',    label: 'Live production\nAI systems' },
  { value: '£1.17', em: true,  suffix: 'B',   label: 'UK Gov AI\nspend 2025' },
  { value: '48',    em: true,  suffix: 'h',   label: 'Proposal\nturnaround' },
  { value: '100',   em: true,  suffix: '%',   label: 'Fixed-fee\ndelivery' },
]

const containerVariants: Variants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.1 } },
}

const numVariants: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

export default function ProofNumbers() {
  return (
    <div style={{
      background: 'rgba(13,10,8,0.12)',
      padding: '6rem 3rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background watermark */}
      <div style={{
        position: 'absolute',
        fontFamily: 'var(--font-instrument), sans-serif',
        fontWeight: 800,
        fontSize: 'clamp(8rem,20vw,18rem)',
        color: 'rgba(214,53,69,.025)',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        whiteSpace: 'nowrap',
        letterSpacing: '-.04em',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>KELRIVA</div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '5.5rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
        className="proof-nums"
      >
        {STATS.map((s, i) => (
          <motion.div key={s.label} variants={numVariants} style={{ position: 'relative' }}>
            <span style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic',
              fontSize: 'clamp(3rem,7vw,5.8rem)',
              fontWeight: 300,
              color: '#ffffff',
              display: 'block',
              lineHeight: 1,
              marginBottom: '.4rem',
            }}>
              <em style={{ fontStyle: 'normal', color: '#d63545' }}>{s.value}</em>
              {s.suffix}
            </span>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.66rem',
              color: '#6b5548',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              whiteSpace: 'pre-line',
            }}>{s.label}</span>

            {/* Divider except last */}
            {i < STATS.length - 1 && (
              <div style={{
                position: 'absolute',
                right: '-2.8rem', top: '50%',
                transform: 'translateY(-50%)',
                width: 1, height: 55,
                background: 'linear-gradient(transparent,#a01828,transparent)',
              }} className="proof-divider" />
            )}
          </motion.div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          .proof-nums    { gap: 2.5rem !important; }
          .proof-divider { display: none !important; }
        }
      `}</style>
    </div>
  )
}
