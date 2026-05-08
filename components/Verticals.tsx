'use client'

import { motion, type Variants } from 'framer-motion'

const VERTICALS = [
  {
    priority: 'Priority 1 · Fintech',
    status:   'Active pipeline',
    title:    'Fintech &\nFinancial Services',
    who:      'Heads of Operations, CCOs, CTOs at banks, challenger banks, payment processors, and FCA-regulated investment firms',
    items: [
      'Intelligent document processing for KYC/AML',
      'Trade surveillance & PAD monitoring AI',
      'Automated best execution reporting',
      'Regulatory filing automation',
    ],
    entry:  'Warm referral: senior compliance professional at a central London investment firm',
    color:  '#d63545',
  },
  {
    priority: 'Priority 1 · ESG',
    status:   'Regulatory tailwind',
    title:    'Sustainability\n& ESG',
    who:      'Chief Sustainability Officers, ESG Directors, Operations leads with CSRD, TCFD, and UK SDR obligations',
    items: [
      'ESG data pipeline automation',
      'Supplier document ingestion & scoring',
      'Carbon reporting AI dashboards',
      'CSRD / TCFD compliance workflows',
    ],
    entry:  'Every listed UK company faces regulatory pressure — timing is perfect',
    color:  '#00e09c',
  },
  {
    priority: 'Growth · Finance',
    status:   'High LTV',
    title:    'Corporate Finance\n& Private Equity',
    who:      'CFOs, Finance Directors, Portfolio Operations leads at PE-backed companies, mid-market corporates, family offices',
    items: [
      'AI-powered financial document processing',
      'Automated management reporting',
      'Deal document intelligence & extraction',
      'Portfolio BI dashboards & forecasting',
    ],
    entry:  'PE portfolio companies under constant pressure to cut overhead and grow EBITDA',
    color:  '#f5b642',
  },
  {
    priority: 'Proven · Coaching',
    status:   'Live reference',
    title:    'Corporate Coaching\n& L&D',
    who:      'Chief People Officers, L&D Directors, Executive Coaches, HR Technology leaders at mid-to-large enterprises',
    items: [
      'AI coaching assistant & RAG knowledge base',
      'Automated session note processing',
      'Coachee progress tracking & analytics',
      'L&D content intelligence workflows',
    ],
    entry:  'bettercoach (Berlin) — our live AI system is direct proof-of-concept',
    color:  '#a78bfa',
  },
]

const containerVariants: Variants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

export default function Verticals() {
  return (
    <section id="verticals" style={{ background: '#150f09', padding: '7rem 3rem' }}>
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
          <span style={{ opacity: .5 }}>//</span> Target markets
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
          Four verticals.{' '}
          <em>Each with<br />a proven entry point.</em>
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5px',
            background: 'rgba(214,53,69,.07)',
            border: '1px solid rgba(214,53,69,.07)',
          }}
          className="vert-grid"
        >
          {VERTICALS.map(v => (
            <VertCard key={v.priority} {...v} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .vert-grid { grid-template-columns: 1fr !important; }
          section#verticals { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}

function VertCard({ priority, status, title, who, items, entry, color }: typeof VERTICALS[0]) {
  return (
    <motion.div
      variants={cardVariants}
      style={{
        background: '#150f09',
        padding: '3rem 2.75rem',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `1px solid ${color}22`,
      }}
      whileHover={{ backgroundColor: 'rgba(214,53,69,.02)' }}
    >
      {/* Head */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.6rem', color, letterSpacing: '.16em',
          textTransform: 'uppercase',
          border: `1px solid ${color}`,
          padding: '.2rem .6rem', opacity: .8,
        }}>{priority}</span>

        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.58rem', color: '#00e09c',
          display: 'flex', alignItems: 'center', gap: '.3rem',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#00e09c',
            boxShadow: '0 0 6px #00e09c',
            animation: 'statusBlink 2s ease infinite',
            display: 'inline-block',
          }} />
          {status}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-cormorant), serif',
        fontStyle: 'italic', fontWeight: 300,
        fontSize: '1.85rem', color: '#ffffff',
        lineHeight: 1.12, letterSpacing: '-.02em',
        marginBottom: '.7rem',
        whiteSpace: 'pre-line',
      }}>{title}</h3>

      <p style={{
        fontSize: '.8rem', color: '#6b5548',
        fontStyle: 'italic', lineHeight: 1.7,
        marginBottom: '1.2rem',
        paddingBottom: '1.2rem',
        borderBottom: '1px solid rgba(255,255,255,.04)',
      }}>{who}</p>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
        {items.map(item => (
          <li key={item} style={{
            fontSize: '.83rem', color: '#ede5dc',
            display: 'flex', gap: '.65rem', alignItems: 'flex-start', lineHeight: 1.5,
          }}>
            <span style={{ color, fontSize: '1.1rem', flexShrink: 0, fontWeight: 700, marginTop: '-.05rem' }}>›</span>
            {item}
          </li>
        ))}
      </ul>

      <div style={{
        marginTop: '1.4rem',
        padding: '.65rem .85rem',
        background: 'rgba(214,53,69,.02)',
        borderLeft: `2px solid ${color}`,
        fontSize: '.77rem', color: '#6b5548',
        fontStyle: 'italic', lineHeight: 1.6,
      }}>{entry}</div>
    </motion.div>
  )
}
