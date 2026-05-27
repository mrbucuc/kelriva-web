'use client'

import { motion, type Variants } from 'framer-motion'

const CASES = [
  {
    index: '01',
    tag: 'Corporate Coaching · AI Matching',
    title: 'AI-Assisted\nCoach Matching',
    client: 'bettercoach',
    status: 'Live',
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
      'Matching time dropped from 7 days to seconds. Match quality became measurable for the first time via rematch rate, acceptance rate, and override rate. The operations team shifted from manual searching to expert review.',
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
      'Onboarding new clients onto a complex software platform required teams to manually read through PDFs, spreadsheets, emails, and discovery call notes — then interpret requirements, identify gaps, and decide what to configure first.',
    solution:
      'We built an AI system that ingests raw client documents across formats, extracts structured requirements, identifies missing information, and maps each requirement to the correct system action — generating a dependency-aware execution plan.',
    impact:
      'Manual effort to prepare a client setup plan dropped from days to hours. Missed steps and rework were eliminated, the client experience improved, and the system created a scalable foundation for automating repeatable onboarding workflows.',
  },
]

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.23, 1, 0.32, 1] } },
}

export default function CaseStudies() {
  return (
    <section id="case-studies" style={{ padding: '8rem 3rem' }}>
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
            letterSpacing: '-.02em', marginBottom: '5rem',
          }}
        >
          Systems already<br />
          <em>running in the real world.</em>
        </motion.h2>

        {/* Case studies — editorial spread layout */}
        <div>
          {CASES.map((c, i) => (
            <CaseSpread key={c.index} {...c} delay={i * 0.1} last={i === CASES.length - 1} />
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          section#case-studies { padding: 5rem 1.5rem !important; }
          .cs-upper { grid-template-columns: 1fr !important; }
          .cs-metrics { grid-template-columns: 1fr 1fr !important; }
          .cs-body { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .cs-metrics { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function CaseSpread({
  index, tag, title, client, status, color,
  metrics, challenge, solution, impact, delay, last,
}: typeof CASES[0] & { delay: number; last: boolean }) {
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay }}
      style={{
        borderTop: '1px solid rgba(214,53,69,.1)',
        paddingTop: '3.5rem',
        paddingBottom: last ? 0 : '4rem',
        borderBottom: last ? 'none' : '1px solid rgba(214,53,69,.05)',
        marginBottom: last ? 0 : '0',
        position: 'relative',
      }}
    >
      {/* Upper section: index + title / tag + status */}
      <div
        className="cs-upper"
        style={{
          display: 'grid',
          gridTemplateColumns: '72px 1fr auto',
          gap: '0 3rem',
          alignItems: 'start',
          marginBottom: '2.5rem',
        }}
      >
        {/* Large index number */}
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.68rem', color,
          letterSpacing: '.14em',
          paddingTop: '.3rem',
          opacity: .8,
        }}>{index}</div>

        {/* Title + tag */}
        <div>
          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.58rem', color: 'rgba(107,85,72,.6)',
            letterSpacing: '.14em', textTransform: 'uppercase',
            marginBottom: '.8rem',
          }}>{tag}</div>
          <h3 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(1.8rem,3vw,2.8rem)',
            color: '#ffffff', lineHeight: 1.08,
            letterSpacing: '-.02em',
            whiteSpace: 'pre-line',
            margin: 0,
          }}>{title}</h3>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.4rem',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.58rem', color: '#00e09c',
          letterSpacing: '.12em', textTransform: 'uppercase',
          paddingTop: '.3rem',
          whiteSpace: 'nowrap',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#00e09c',
            display: 'inline-block',
            flexShrink: 0,
            animation: 'statusBlink 2.4s ease infinite',
          }} />
          {status}
        </div>
      </div>

      {/* Metrics strip */}
      <div
        className="cs-metrics"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          marginBottom: '2.75rem',
          background: `rgba(214,53,69,.06)`,
          borderTop: `1px solid ${color}22`,
          borderBottom: `1px solid ${color}22`,
        }}
      >
        {metrics.map((m, mi) => (
          <div
            key={m.label}
            style={{
              padding: '1.1rem 1.5rem',
              borderLeft: mi > 0 ? `1px solid ${color}18` : 'none',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.9rem', color,
              fontWeight: 400, marginBottom: '.3rem',
              letterSpacing: '-.01em',
            }}>{m.value}</div>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.56rem', color: 'rgba(107,85,72,.7)',
              letterSpacing: '.16em', textTransform: 'uppercase',
            }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Three-column body */}
      <div
        className="cs-body"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '3rem',
          paddingLeft: 'calc(72px + 3rem)',
        }}
      >
        {[
          { label: 'Challenge', body: challenge },
          { label: 'Solution',  body: solution  },
          { label: 'Impact',    body: impact    },
        ].map(({ label, body }) => (
          <div key={label}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.58rem', color,
              letterSpacing: '.2em', textTransform: 'uppercase',
              marginBottom: '.9rem',
              opacity: .8,
            }}>{label}</div>
            <p style={{
              fontSize: '.85rem', color: 'rgba(154,122,106,.75)',
              lineHeight: 1.85, margin: 0,
            }}>{body}</p>
          </div>
        ))}
      </div>
    </motion.article>
  )
}
