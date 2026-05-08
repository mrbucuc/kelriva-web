'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'Free Discovery',
    desc: '30-minute call. We ask the right questions — not generic ones. You leave with a clear picture of what\'s possible.',
  },
  {
    n: '02',
    title: 'Proposal in 48hrs',
    desc: 'A written solution with full scope, timeline, and fixed price. No charge until you approve it.',
  },
  {
    n: '03',
    title: 'Build & Deliver',
    desc: 'Modular, reusable components. Full observability and QA built in from day one.',
  },
  {
    n: '04',
    title: 'Case Study & Scale',
    desc: 'We ask for a written testimonial. Your results become the evidence that wins the next engagement.',
  },
]

const containerVariants = {
  hidden:   {},
  visible:  {},
}

export default function Process() {
  return (
    <section id="process" style={{ background: '#0d0a08', padding: '7rem 3rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.66rem', color: '#d63545',
            letterSpacing: '.22em', textTransform: 'uppercase',
            marginBottom: '.9rem', display: 'flex', alignItems: 'center', gap: '.6rem',
          }}
        >
          <span style={{ opacity: .5 }}>//</span> How we work
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(2rem,4.5vw,3.6rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: '#ffffff', lineHeight: 1.1,
            letterSpacing: '-.02em', marginBottom: '4rem',
          }}
        >
          From first call to live system<br />
          <em>in weeks, not months.</em>
        </motion.h2>

        <div style={{ position: 'relative' }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute',
            top: '2rem', left: '8%', right: '8%',
            height: 1,
            background: 'linear-gradient(90deg,transparent,#a01828,#a01828,transparent)',
            pointerEvents: 'none',
          }} className="process-connector" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              border: '1px solid rgba(214,53,69,.08)',
            }}
            className="process-grid"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                style={{
                  padding: '3rem 2rem',
                  borderRight: i < STEPS.length - 1 ? '1px solid rgba(214,53,69,.08)' : 'none',
                  position: 'relative',
                  zIndex: 1,
                  textAlign: 'center',
                  background: '#0d0a08',
                  transition: 'background .25s',
                }}
                whileHover={{ backgroundColor: '#150f09' }}
              >
                <div style={{
                  width: 38, height: 38,
                  borderRadius: '50%',
                  background: '#0d0a08',
                  border: '1px solid #a01828',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.75rem',
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '.75rem', color: '#d63545',
                  transition: 'border-color .3s, box-shadow .3s',
                }}>
                  {step.n}
                </div>

                <div style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontStyle: 'italic', fontSize: '1.3rem',
                  fontWeight: 300, color: '#ffffff', marginBottom: '.5rem',
                }}>
                  {step.title}
                </div>

                <p style={{ fontSize: '.8rem', color: '#6b5548', lineHeight: 1.75 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .process-grid      { grid-template-columns: 1fr 1fr !important; }
          .process-connector { display: none !important; }
          section#process    { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
        @media (max-width: 540px) {
          .process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
