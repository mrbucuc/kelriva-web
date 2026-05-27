'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    title: 'Free Discovery',
    desc: '30-minute call. We ask the right questions, not generic ones. You leave with a clear picture of what is possible and what it costs to build it.',
  },
  {
    n: '02',
    title: 'Proposal in 48h',
    desc: 'A written solution with full scope, timeline, and fixed price. No ambiguity. No charge until you approve it.',
  },
  {
    n: '03',
    title: 'Build & Deliver',
    desc: 'Modular, reusable components. Full observability and QA built in from day one. You see progress weekly.',
  },
  {
    n: '04',
    title: 'Case Study & Scale',
    desc: 'We document your results and ask for a testimonial. Your outcomes become the evidence that wins the next engagement.',
  },
]

export default function Process() {
  return (
    <section id="process" style={{ padding: '8rem 3rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
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
            letterSpacing: '-.02em', marginBottom: '4.5rem',
          }}
        >
          From first call to live system<br />
          <em>in weeks, not months.</em>
        </motion.h2>

        {/* Steps — editorial numbered rows */}
        <div style={{ borderTop: '1px solid rgba(214,53,69,.08)' }}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr 1fr',
                gap: '0 3rem',
                padding: '2.75rem 0',
                borderBottom: '1px solid rgba(214,53,69,.08)',
                alignItems: 'start',
              }}
              className="proc-row"
            >
              {/* Step number */}
              <div style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '.68rem',
                color: '#d63545',
                letterSpacing: '.14em',
                paddingTop: '.2rem',
                opacity: .7,
              }}>
                {step.n}
              </div>

              {/* Title */}
              <div style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(1.3rem, 2vw, 1.75rem)',
                color: '#ffffff',
                lineHeight: 1.2,
                letterSpacing: '-.01em',
              }}>
                {step.title}
              </div>

              {/* Description */}
              <p style={{
                fontSize: '.88rem',
                color: '#9a7a6a',
                lineHeight: 1.85,
              }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          section#process { padding: 5rem 1.5rem !important; }
          .proc-row { grid-template-columns: 48px 1fr !important; gap: 0 1.5rem !important; }
          .proc-row > :last-child { grid-column: 1 / -1 !important; margin-top: 1rem !important; }
        }
      `}</style>
    </section>
  )
}
