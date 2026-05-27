'use client'

import { motion } from 'framer-motion'

const SERVICES = [
  {
    idx: '01',
    title: 'Intelligent Document Processing',
    sub: '& Decision Systems',
    accent: '#d63545',
    body: 'Extract, classify, and act on data from any document type. Contracts, KYC packets, compliance filings — processed automatically with AI decision layers. Live in production at enterprise clients today.',
    verticals: ['Fintech', 'ESG', 'Finance'],
  },
  {
    idx: '02',
    title: 'AI Workflow Automation',
    sub: '& Agentic Systems',
    accent: '#00e09c',
    body: 'Multi-step AI agents that plan, reason, and execute across your systems — replacing manual approval chains end-to-end. Built on LangGraph with full observability and enterprise monitoring.',
    verticals: ['Fintech', 'Coaching', 'ESG'],
  },
  {
    idx: '03',
    title: 'Data Analytics & Intelligence',
    sub: 'Business Intelligence',
    accent: '#f5b642',
    body: 'Data pipelines, cloud warehousing, real-time BI dashboards, and predictive analytics. From raw siloed data to decisions that move the business. We design, build, and run the full stack.',
    verticals: ['Finance', 'ESG', 'Fintech'],
  },
]

export default function Services() {
  return (
    <section id="services" style={{ padding: '8rem 3rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'end', marginBottom: '5rem' }} className="svc-header">
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
              Three capabilities.<br />
              <strong style={{ fontStyle: 'normal', fontFamily: 'var(--font-sans), sans-serif', fontWeight: 700 }}>One outcome.</strong>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.23, 1, 0.32, 1] }}
            style={{ fontSize: '.95rem', color: '#9a7a6a', lineHeight: 1.85 }}
          >
            The manual processes slowing your organisation down get replaced
            by systems that work around the clock.
          </motion.p>
        </div>

        {/* Service rows */}
        <div>
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.idx} {...s} index={i} total={SERVICES.length} />
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .svc-header { grid-template-columns: 1fr !important; gap: 2rem !important; }
          section#services { padding: 5rem 1.5rem !important; }
          .svc-row-inner { grid-template-columns: 48px 1fr !important; }
          .svc-divider-col { display: none !important; }
          .svc-body-col { grid-column: 1 / -1 !important; margin-top: 1.5rem !important; padding-left: 0 !important; }
        }
      `}</style>
    </section>
  )
}

function ServiceRow({ idx, title, sub, accent, body, verticals, index, total }: typeof SERVICES[0] & { index: number; total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="svc-row"
      style={{
        borderTop: '1px solid rgba(214,53,69,.08)',
        borderBottom: index === total - 1 ? '1px solid rgba(214,53,69,.08)' : 'none',
        position: 'relative',
        transition: 'background .35s',
      }}
    >
      {/* Left accent line — revealed on hover */}
      <div className="svc-accent-line" style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: '2px',
        background: accent,
        transform: 'scaleY(0)',
        transformOrigin: 'top',
        transition: 'transform .45s cubic-bezier(0.23,1,0.32,1)',
      }} />

      <div
        className="svc-row-inner"
        style={{
          display: 'grid',
          gridTemplateColumns: '72px 1fr 1px 1.1fr',
          gap: '0 3rem',
          padding: '3.5rem 0 3.5rem 1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Number */}
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.68rem',
          color: accent,
          letterSpacing: '.14em',
          paddingTop: '.35rem',
          opacity: .8,
        }}>
          {idx}
        </div>

        {/* Title + sub */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)',
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-.01em',
            marginBottom: '.5rem',
          }}>
            {title}
          </h3>
          <div style={{
            fontFamily: 'var(--font-instrument), sans-serif',
            fontWeight: 600,
            fontSize: '.78rem',
            color: accent,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
          }}>
            {sub}
          </div>
        </div>

        {/* Vertical divider */}
        <div className="svc-divider-col" style={{ background: 'rgba(214,53,69,.08)', alignSelf: 'stretch' }} />

        {/* Body + verticals */}
        <div className="svc-body-col">
          <p style={{
            fontSize: '.88rem',
            color: '#9a7a6a',
            lineHeight: 1.9,
            marginBottom: '1.75rem',
          }}>
            {body}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {verticals.map((v, i) => (
              <span key={v} style={{
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: '.58rem',
                color: '#6b5548',
                letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}>
                {i > 0 && <span style={{ marginRight: '1.5rem', opacity: .3 }}>·</span>}
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .svc-row:hover { background: rgba(21,15,9,.5) !important; }
        .svc-row:hover .svc-accent-line { transform: scaleY(1) !important; }
      `}</style>
    </motion.div>
  )
}
