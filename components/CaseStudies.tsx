'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { counterAnimation, checkReducedMotion } from '@/lib/animations'

const CASES = [
  {
    index: '01',
    tag: 'Corporate Coaching · AI Matching',
    title: 'AI-Assisted Coach Matching',
    client: 'bettercoach',
    status: 'Live',
    color: '#d63545',
    metrics: [
      { display: '7 days → seconds', label: 'Processing Time Reduction', isText: true },
      { display: '100%', label: 'Match Quality Measurable', isText: false, from: 0, to: 100, suffix: '%' },
      { display: '0', label: 'Extra Headcount to Scale', isText: false, from: 0, to: 0, suffix: '' },
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
    title: 'IDP-Powered Client Setup',
    client: 'Enterprise SaaS',
    status: 'Delivered',
    color: '#f5b642',
    metrics: [
      { display: 'Days → hours', label: 'Setup Preparation Time', isText: true },
      { display: '0', label: 'Missed Steps', isText: false, from: 0, to: 0, suffix: '' },
      { display: '100%', label: 'Consistent Across Clients', isText: false, from: 0, to: 100, suffix: '%' },
    ],
    challenge:
      'Onboarding new clients onto a complex software platform required teams to manually read through PDFs, spreadsheets, emails, and discovery call notes — then interpret requirements, identify gaps, and decide what to configure first.',
    solution:
      'We built an AI system that ingests raw client documents across formats, extracts structured requirements, identifies missing information, and maps each requirement to the correct system action — generating a dependency-aware execution plan.',
    impact:
      'Manual effort to prepare a client setup plan dropped from days to hours. Missed steps and rework were eliminated, the client experience improved, and the system created a scalable foundation for automating repeatable onboarding workflows.',
  },
]

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered]   = useState(false)

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
      id="case-studies"
      ref={sectionRef}
      style={{ padding: '9rem 3rem', background: 'var(--color-ink)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          style={{ marginBottom: '5.5rem' }}
        >
          <div className="t-mono" style={{ color: '#6b5548', marginBottom: '1.2rem' }}>
            Proof of work
          </div>
          <h2 className="t-section" style={{ color: '#ffffff', margin: 0 }}>
            Systems already<br />
            <em>running in the real world.</em>
          </h2>
        </motion.div>

        {/* Case study spreads */}
        <div>
          {CASES.map((c, i) => (
            <CaseSpread key={c.index} {...c} delay={i * 0.1} last={i === CASES.length - 1} entered={entered} />
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          section#case-studies { padding: 5rem 1.5rem !important; }
          .cs-split { grid-template-columns: 1fr !important; }
          .cs-metrics { grid-template-columns: 1fr !important; }
          .cs-body { grid-template-columns: 1fr !important; padding-left: 0 !important; }
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
  metrics, challenge, solution, impact, delay, last, entered,
}: typeof CASES[0] & { delay: number; last: boolean; entered: boolean }) {

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={entered ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      style={{
        borderTop: `1px solid ${color}22`,
        paddingTop: '4rem',
        paddingBottom: last ? 0 : '5rem',
        position: 'relative',
      }}
    >
      {/* Split enter: left ← / right → */}
      <div
        className="cs-split"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0 4rem',
          alignItems: 'start',
          marginBottom: '3.5rem',
        }}
      >
        {/* Left half */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={entered ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: delay + 0.05, ease: [0.23, 1, 0.32, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.2rem' }}>
            <span className="t-mono" style={{ color: 'rgba(107,85,72,0.6)', fontSize: '.65rem' }}>
              {index}
            </span>
            <span className="t-mono" style={{ color: 'rgba(107,85,72,0.6)', fontSize: '.65rem' }}>
              {tag}
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            color: '#ffffff',
            lineHeight: 1.08,
            letterSpacing: '-.02em',
            margin: '0 0 .6rem',
          }}>{title}</h3>
          <div className="t-mono" style={{ color, fontSize: '.65rem' }}>
            {client}
          </div>
        </motion.div>

        {/* Right half — status + metrics hero */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={entered ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: delay + 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.5rem',
            marginBottom: '2rem',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#00e09c',
              display: 'inline-block',
              animation: 'statusBlink 2.4s ease infinite',
              flexShrink: 0,
            }} />
            <span className="t-mono" style={{ color: '#00e09c', fontSize: '.65rem' }}>
              {status}
            </span>
          </div>

          {/* Metrics — hero size */}
          <div
            className="cs-metrics"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: '1.5rem',
            }}
          >
            {metrics.map((m, mi) => (
              <MetricBlock key={m.label} {...m} color={color} entered={entered} delay={delay + 0.2 + mi * 0.08} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Three-column body */}
      <div
        className="cs-body"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '3rem',
          paddingLeft: '0',
          borderTop: '1px solid rgba(214,53,69,0.06)',
          paddingTop: '2.5rem',
        }}
      >
        {[
          { label: 'Challenge', body: challenge },
          { label: 'Solution',  body: solution  },
          { label: 'Impact',    body: impact    },
        ].map(({ label, body }) => (
          <div key={label}>
            <div className="t-mono" style={{ color, fontSize: '.65rem', marginBottom: '.9rem', opacity: .8 }}>
              {label}
            </div>
            <p className="t-body" style={{ color: 'rgba(154,122,106,0.75)', margin: 0 }}>
              {body}
            </p>
          </div>
        ))}
      </div>
    </motion.article>
  )
}

type MetricBlockProps = {
  display: string
  label: string
  isText: boolean
  from?: number
  to?: number
  suffix?: string
  color: string
  entered: boolean
  delay: number
}

function MetricBlock({ display, label, isText, from = 0, to = 0, suffix = '', color, entered, delay }: MetricBlockProps) {
  const [value, setValue]   = useState(isText ? display : String(from) + suffix)
  const [glowing, setGlowing] = useState(false)
  const fired = useRef(false)

  useEffect(() => {
    if (!entered || fired.current || isText) return
    fired.current = true

    const ms = checkReducedMotion() ? 0 : delay * 1000
    const t = setTimeout(() => {
      const cleanup = counterAnimation(from, to, 1400, (v) => {
        setValue(Math.round(v) + suffix)
      }, () => {
        setGlowing(true)
        setTimeout(() => setGlowing(false), 800)
      })
      return cleanup
    }, ms)
    return () => clearTimeout(t)
  }, [entered, isText, from, to, suffix, delay])

  return (
    <div>
      <div
        className="t-metric"
        style={{
          color,
          textShadow: glowing ? `0 0 30px ${color}99` : 'none',
          transition: 'text-shadow 800ms ease',
          marginBottom: '.4rem',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div className="t-mono" style={{ color: '#6b5548', fontSize: '.6rem' }}>
        {label}
      </div>
    </div>
  )
}
