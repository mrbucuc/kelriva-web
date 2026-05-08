'use client'

import { motion, type Variants } from 'framer-motion'

const SERVICES = [
  {
    idx: '01 / IDP',
    titleSans: 'Intelligent Document',
    titleItalic: 'Processing',
    badge: '& Decision Systems',
    badgeColor: '#d63545',
    body: 'Extract, classify, and act on data from any document type. Contracts, KYC packets, compliance filings — processed automatically with AI decision layers. Live in production at enterprise clients today.',
    pills: [
      { label: 'Fintech', color: '#d63545', border: 'rgba(214,53,69,.3)' },
      { label: 'ESG',     color: '#00e09c', border: 'rgba(0,224,156,.3)' },
      { label: 'Finance', color: '#f5b642', border: 'rgba(245,182,66,.3)' },
    ],
    pulseDelay: '0s',
  },
  {
    idx: '02 / Agentic AI',
    titleSans: 'AI Workflow',
    titleItalic: 'Automation',
    badge: '& Agentic Systems',
    badgeColor: '#00e09c',
    body: 'Multi-step AI agents that plan, reason, and execute across your systems — replacing manual approval chains end-to-end. Built on LangGraph with full observability and enterprise monitoring.',
    pills: [
      { label: 'Fintech',  color: '#d63545', border: 'rgba(214,53,69,.3)' },
      { label: 'Coaching', color: '#a78bfa', border: 'rgba(167,139,250,.3)' },
      { label: 'ESG',      color: '#00e09c', border: 'rgba(0,224,156,.3)' },
    ],
    pulseDelay: '.8s',
  },
  {
    idx: '03 / Analytics',
    titleSans: 'Data Analytics',
    titleItalic: '& Intelligence',
    badge: 'Business Intelligence',
    badgeColor: '#f5b642',
    body: 'Data pipelines, cloud warehousing, real-time BI dashboards, and predictive analytics. From raw siloed data to decisions that move the business. We design, build, and run the full stack.',
    pills: [
      { label: 'Finance', color: '#f5b642', border: 'rgba(245,182,66,.3)' },
      { label: 'ESG',     color: '#00e09c', border: 'rgba(0,224,156,.3)' },
      { label: 'Fintech', color: '#d63545', border: 'rgba(214,53,69,.3)' },
    ],
    pulseDelay: '1.6s',
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

export default function Services() {
  return (
    <section id="services" style={{ background: '#150f09', padding: '7rem 3rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'end',
          marginBottom: '4.5rem',
        }} className="svc-header-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.66rem', color: '#d63545',
              letterSpacing: '.22em', textTransform: 'uppercase',
              marginBottom: '.9rem', display: 'flex', alignItems: 'center', gap: '.6rem',
            }}>
              <span style={{ opacity: .5 }}>//</span> What we build
            </div>
            <h2 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontSize: 'clamp(2rem,4.5vw,3.6rem)',
              fontWeight: 300, fontStyle: 'italic',
              color: '#ffffff', lineHeight: 1.1, letterSpacing: '-.02em',
            }}>
              Business Process<br />
              <strong style={{ fontStyle: 'normal', fontWeight: 700, fontFamily: 'var(--font-instrument), sans-serif' }}>Automation</strong><br />
              <em>powered by AI</em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
            style={{ fontSize: '.95rem', color: '#6b5548', lineHeight: 1.85 }}
          >
            Three service areas. One outcome: the manual processes slowing your organisation down
            get replaced by systems that work around the clock.
          </motion.p>
        </div>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(214,53,69,.08)',
            border: '1px solid rgba(214,53,69,.08)',
          }}
          className="svc-cards-grid"
        >
          {SERVICES.map((s) => (
            <ServiceCard key={s.idx} {...s} />
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .svc-header-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .svc-cards-grid  { grid-template-columns: 1fr !important; }
          section#services { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}

function ServiceCard({ idx, titleSans, titleItalic, badge, badgeColor, body, pills, pulseDelay }: typeof SERVICES[0]) {
  return (
    <motion.div
      variants={cardVariants}
      style={{
        background: '#150f09',
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background .3s',
      }}
      whileHover={{ backgroundColor: '#1c1610' }}
    >
      {/* Bottom color line on hover via pseudo isn't possible inline — use motion overlay */}
      <div style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '.62rem', color: '#6b5548',
        letterSpacing: '.15em',
        marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span>{idx}</span>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: badgeColor,
          animation: 'pulse 3s ease infinite',
          animationDelay: pulseDelay,
        }} />
      </div>

      <div style={{
        fontFamily: 'var(--font-cormorant), serif',
        fontStyle: 'italic', fontWeight: 300,
        fontSize: '1.45rem', color: '#ffffff',
        lineHeight: 1.2, letterSpacing: '-.01em', marginBottom: '.25rem',
      }}>
        {titleSans}<br />{titleItalic}
      </div>

      <div style={{
        fontFamily: 'var(--font-instrument), sans-serif',
        fontWeight: 700, fontSize: '.88rem',
        color: badgeColor, letterSpacing: '.06em',
        textTransform: 'uppercase', marginBottom: '1.25rem',
      }}>
        {badge}
      </div>

      <p style={{ fontSize: '.84rem', color: '#6b5548', lineHeight: 1.8, marginBottom: '2rem' }}>
        {body}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
        {pills.map(p => (
          <span key={p.label} style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.6rem',
            padding: '.2rem .52rem',
            border: `1px solid ${p.border}`,
            color: p.color,
            opacity: .65,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
          }}>{p.label}</span>
        ))}
      </div>
    </motion.div>
  )
}
