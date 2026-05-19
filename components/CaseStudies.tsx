'use client'

import { motion, type Variants } from 'framer-motion'

const CASES = [
  {
    index: '01',
    tag: 'Corporate Coaching · AI Matching',
    title: 'AI-Assisted\nCoach Matching',
    client: 'bettercoach',
    status: 'Live system',
    color: '#d63545',
    metrics: [
      { value: '7 days → seconds', label: 'Matching time' },
      { value: 'First time', label: 'Quality measurable' },
      { value: 'Scaled', label: 'Without extra headcount' },
    ],
    challenge:
      'A corporate coaching provider matched clients to coaches entirely by hand — reviewing enquiries, interpreting needs, and searching profiles across language, seniority, location, and topic. The process was slow, inconsistent, and constrained by strict data privacy requirements.',
    solution:
      'We built a privacy-aware matching engine combining semantic search, RAG-based retrieval, keyword scoring, and proximity signals. The system surfaces ranked coach shortlists from unstructured, multilingual client inputs — with every match explainable and reviewable by a human operator.',
    impact:
      'Matching time dropped from 7 days to seconds. Match quality became measurable for the first time via rematch rate, acceptance rate, and override rate. The operations team shifted from manual searching to expert review — and the system is now a reusable AI platform extensible into triage, intake, and profile enrichment.',
  },
  {
    index: '02',
    tag: 'Intelligent Document Processing · Client Onboarding',
    title: 'IDP-Powered\nClient Setup',
    client: 'Enterprise SaaS',
    status: 'Delivered',
    color: '#f5b642',
    metrics: [
      { value: 'Days → hours', label: 'Setup preparation' },
      { value: 'Zero missed steps', label: 'Dependency mapping' },
      { value: 'Consistent', label: 'Across every client' },
    ],
    challenge:
      'Onboarding new clients onto a complex software platform required teams to manually read through PDFs, spreadsheets, emails, and discovery call notes — then interpret requirements, identify gaps, and decide what to configure first. With many dependencies, the process was slow, error-prone, and impossible to scale.',
    solution:
      'We built an AI system that ingests raw client documents across formats, extracts structured requirements, identifies missing information, and maps each requirement to the correct system action. It then generates a dependency-aware execution plan showing what to build, update, link, validate, or escalate — in the right order.',
    impact:
      'Manual effort to prepare a client setup plan dropped from days to hours. Teams started from a structured, reviewable plan rather than blank-page interpretation. Missed steps and rework were eliminated, the client experience improved, and the system created a scalable foundation for automating repeatable onboarding workflows.',
  },
]

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] } },
}

export default function CaseStudies() {
  return (
    <section id="case-studies" style={{ background: 'transparent', padding: '7rem 3rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.66rem', color: '#d63545',
            letterSpacing: '.22em', textTransform: 'uppercase',
            marginBottom: '.9rem', display: 'flex', alignItems: 'center', gap: '.6rem',
          }}
        >
          <span style={{ opacity: .5 }}>//</span> Proof of work
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
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
          Systems already<br />
          <em>running in the real world.</em>
        </motion.h2>

        {/* Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {CASES.map((c, i) => (
            <CaseCard key={c.index} {...c} delay={i * 0.12} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section#case-studies { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
          .case-cols { grid-template-columns: 1fr !important; }
          .case-metrics { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function CaseCard({
  index, tag, title, client, status, color,
  metrics, challenge, solution, impact, delay,
}: typeof CASES[0] & { delay: number }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay }}
      style={{
        background: 'rgba(13,10,8,0.80)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,.05)',
        borderTop: `2px solid ${color}`,
        padding: '3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Large background index */}
      <div style={{
        position: 'absolute', top: '1.5rem', right: '2rem',
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '7rem', fontWeight: 700,
        color: 'rgba(255,255,255,.02)',
        lineHeight: 1, pointerEvents: 'none',
        userSelect: 'none',
      }}>{index}</div>

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.6rem', color,
            letterSpacing: '.18em', textTransform: 'uppercase',
            border: `1px solid ${color}44`,
            padding: '.22rem .7rem',
          }}>{index}</span>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.6rem', color: '#6b5548',
            letterSpacing: '.12em', textTransform: 'uppercase',
          }}>{tag}</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.58rem', color: '#00e09c',
          display: 'flex', alignItems: 'center', gap: '.35rem',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#00e09c',
            display: 'inline-block',
          }} />
          {status} · {client}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-cormorant), serif',
        fontStyle: 'italic', fontWeight: 300,
        fontSize: 'clamp(1.8rem,3vw,2.6rem)',
        color: '#ffffff', lineHeight: 1.1,
        letterSpacing: '-.02em', marginBottom: '2rem',
        whiteSpace: 'pre-line',
      }}>{title}</h3>

      {/* Metrics strip */}
      <div
        className="case-metrics"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: `${color}15`,
          marginBottom: '2.5rem',
          border: `1px solid ${color}15`,
        }}
      >
        {metrics.map(m => (
          <div key={m.label} style={{ padding: '1.2rem 1.4rem', background: 'rgba(13,10,8,0.88)' }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.95rem', color,
              fontWeight: 400, marginBottom: '.3rem',
              letterSpacing: '-.01em',
            }}>{m.value}</div>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.58rem', color: '#6b5548',
              letterSpacing: '.14em', textTransform: 'uppercase',
            }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Three columns */}
      <div
        className="case-cols"
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}
      >
        {[
          { label: 'Challenge', body: challenge },
          { label: 'Solution',  body: solution  },
          { label: 'Impact',    body: impact    },
        ].map(({ label, body }) => (
          <div key={label}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.6rem', color,
              letterSpacing: '.2em', textTransform: 'uppercase',
              marginBottom: '.75rem',
              display: 'flex', alignItems: 'center', gap: '.4rem',
            }}>
              <span style={{
                display: 'inline-block', width: 20, height: 1,
                background: `linear-gradient(90deg,${color},transparent)`,
              }} />
              {label}
            </div>
            <p style={{
              fontSize: '.84rem', color: 'rgba(237,229,220,.6)',
              lineHeight: 1.8, margin: 0,
            }}>{body}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
