'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTextScramble, checkReducedMotion } from '@/lib/animations'

const SERVICES = [
  {
    idx: '01',
    title: 'Intelligent Document Processing',
    sub: 'IDP & Decision Systems',
    accent: '#d63545',
    body: 'Extract, classify, and act on data from any document type. Contracts, KYC packets, compliance filings — processed automatically with AI decision layers. Live in production at enterprise clients today.',
    verticals: ['Fintech', 'ESG', 'Finance'],
  },
  {
    idx: '02',
    title: 'AI Workflow Automation',
    sub: 'Agentic Systems',
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
  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)

  // Heading scramble on section enter
  const scrambled = useTextScramble('Three capabilities. One outcome.', entered, 900)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    if (checkReducedMotion()) { setEntered(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setEntered(true); observer.disconnect() } },
      { threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ padding: '9rem 3rem', background: 'var(--color-ink-warm)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ marginBottom: '5rem' }} className="svc-header">

          {/* Red rule — draws left→right on enter */}
          <div style={{
            width: 40, height: 2,
            background: '#d63545',
            marginBottom: '2rem',
            transformOrigin: 'left',
            transform: entered ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform 600ms var(--ease-out) ${checkReducedMotion() ? '0ms' : '100ms'}`,
          }} />

          <div ref={headingRef}>
            <div className="t-mono" style={{ color: '#9a7a6a', marginBottom: '1.2rem' }}>
              What we build
            </div>

            {/* Scramble heading */}
            <h2 style={{
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              color: '#ffffff',
              letterSpacing: '-.02em',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
              fontStyle: 'normal',
              // During scramble: monospace render for even char widths
              fontFamilyOverride: entered ? undefined : 'var(--font-jetbrains)',
            } as React.CSSProperties}
            >
              <span style={{
                fontFamily: entered && scrambled === 'Three capabilities. One outcome.'
                  ? 'var(--font-instrument), sans-serif'
                  : 'var(--font-jetbrains), monospace',
                transition: 'font-family 200ms',
              }}>
                {scrambled}
              </span>
            </h2>
          </div>
        </div>

        {/* Service rows */}
        <div style={{ borderTop: '1px solid rgba(214,53,69,0.08)' }}>
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.idx} {...s} index={i} total={SERVICES.length} entered={entered} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section#services { padding: 5rem 1.5rem !important; }
          .svc-row-grid { grid-template-columns: 1fr !important; gap: 1.5rem 0 !important; }
          .svc-divider { display: none !important; }
          .svc-body { padding-left: 0 !important; }
        }
      `}</style>
    </section>
  )
}

function ServiceRow({
  idx, title, sub, accent, body, verticals, index, entered,
}: typeof SERVICES[0] & { index: number; total: number; entered: boolean }) {
  const [hovered, setHovered] = useState(false)
  const delay = checkReducedMotion() ? 0 : index * 120

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={entered ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="link"
      style={{
        position: 'relative',
        borderBottom: '1px solid rgba(214,53,69,0.08)',
        background: hovered ? 'rgba(214,53,69,0.025)' : 'transparent',
        transition: 'background 250ms var(--ease-out)',
        overflow: 'hidden',
      }}
    >
      {/* Left accent bar — clip-path slides down on hover */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 2,
        background: accent,
        clipPath: hovered ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
        transition: `clip-path 450ms var(--ease-out)`,
      }} />

      {/* Large typographic index anchor */}
      <div style={{
        position: 'absolute',
        top: '-1rem',
        right: '2rem',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}>
        <span className="t-index" style={{
          opacity: hovered ? 0.55 : 0.25,
          transition: 'opacity 250ms var(--ease-out)',
        }}>
          {idx}
        </span>
      </div>

      <div
        className="svc-row-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1.1fr',
          gap: '0 3.5rem',
          padding: '3.5rem 1.5rem 3.5rem 2rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left: title + sub + verticals */}
        <div>
          <div className="t-mono" style={{ color: accent, marginBottom: '1rem', opacity: .8 }}>
            {idx} — {sub}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-instrument), sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(1.3rem, 2vw, 1.75rem)',
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-.01em',
            marginBottom: '1.5rem',
          }}>
            {title}
          </h3>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
            {verticals.map(v => (
              <span key={v} className="t-mono" style={{ color: '#9a7a6a', fontSize: '.65rem' }}>
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="svc-divider" style={{ background: 'rgba(214,53,69,0.07)', alignSelf: 'stretch' }} />

        {/* Right: body */}
        <div className="svc-body" style={{ paddingLeft: '1rem' }}>
          <p className="t-body" style={{ color: '#9a7a6a', margin: 0 }}>
            {body}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
