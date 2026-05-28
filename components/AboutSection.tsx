'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParallax, checkReducedMotion } from '@/lib/animations'

const TEAM = [
  {
    label: 'AI ENGINEER · SOLUTION ARCHITECT',
    bio: 'Certified data scientist. 10+ years delivering RAG systems, AI chatbots, and enterprise data pipelines. UK-based.',
    tags: ['RAG Pipelines', 'Vector Indexing', 'Data Engineering', 'AWS'],
  },
  {
    label: 'SENIOR GENERATIVE AI · NLP ENGINEER',
    bio: '7+ years in LLM deployment and production AI infrastructure. Published researcher, ICLR 2026. London.',
    tags: ['LLM Deployment', 'NLP', 'MLOps', 'ICLR 2026'],
  },
  {
    label: 'AI RESEARCH ENGINEER',
    bio: 'Research-to-production generative AI. Accepted at ICLR 2026. Specialises in scaling AI from prototype to live system.',
    tags: ['GenAI', 'Production ML', 'ICLR 2026'],
  },
]

const HEADING_LINES = ['The team behind', 'the infrastructure.']

// ── Magnetic card wrapper ────────────────────────────────────────────────────
function MagneticCard({
  children,
  visible,
  delay,
}: {
  children: React.ReactNode
  visible: boolean
  delay: number
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [mag, setMag]       = useState({ x: 0, y: 0 })
  const [spring, setSpring] = useState(false)
  const [wc, setWc]         = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = innerRef.current
    if (!el) return
    const r   = el.getBoundingClientRect()
    const MAX = 8
    if (!wc) setWc(true)
    setSpring(false)
    setMag({
      x: Math.max(-MAX, Math.min(MAX, ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) * MAX)),
      y: Math.max(-MAX, Math.min(MAX, ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * MAX)),
    })
  }

  const onLeave = () => {
    setSpring(true)
    setMag({ x: 0, y: 0 })
    setTimeout(() => setWc(false), 350)
  }

  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'none' : 'translateY(30px)',
        transition: `opacity 600ms var(--ease-out) ${delay}ms, transform 600ms var(--ease-out) ${delay}ms`,
      }}
    >
      <div
        ref={innerRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          transform:  `translate(${mag.x}px, ${mag.y}px)`,
          transition: `transform ${spring ? '300ms cubic-bezier(0.23,1,0.32,1)' : '50ms linear'}`,
          willChange: wc ? 'transform' : 'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered,     setEntered]     = useState(false)
  const [kRotation,   setKRotation]   = useState(0)
  const reduced = checkReducedMotion()

  // Three parallax depth layers
  const { ref: bgRef,  offset: bgOffset  } = useParallax<HTMLDivElement>(0.12)
  const { ref: midRef, offset: midOffset } = useParallax<HTMLDivElement>(0.35)
  const { ref: fgRef,  offset: fgOffset  } = useParallax<HTMLDivElement>(0.15)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (reduced) { setEntered(true); return }

    const entryObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setEntered(true); entryObs.disconnect() } },
      { threshold: 0.08 },
    )
    entryObs.observe(section)

    const onScroll = () => {
      const rect  = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      const p = Math.max(0, Math.min(1, total > 0 ? -rect.top / total : 0))
      setKRotation(p * 15)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      entryObs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-ink-warm)' }}
    >
      {/* Layer 1 — K watermark, slow parallax + rotation ─────────────────── */}
      <div
        ref={bgRef}
        aria-hidden
        style={{
          position: 'absolute', right: '-8%', top: '50%',
          transform: `translateY(calc(-50% + ${bgOffset}px)) rotate(${kRotation}deg)`,
          opacity: 0.03, pointerEvents: 'none', zIndex: 0,
        }}
      >
        <Image src="/mark-kelriva.png" alt="" width={560} height={612} />
      </div>

      {/* Layer 2 — mid accent line, medium parallax ─────────────────────── */}
      <div
        ref={midRef}
        aria-hidden
        style={{
          position: 'absolute', left: '3rem', top: 0, bottom: 0, width: 1,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(214,53,69,0.12) 20%, rgba(214,53,69,0.12) 80%, transparent 100%)',
          transform: `translateY(${midOffset}px)`,
          pointerEvents: 'none', zIndex: 0,
        }}
      />

      {/* Layer 3 — foreground content, gentle parallax ──────────────────── */}
      <div
        ref={fgRef}
        style={{ position: 'relative', zIndex: 1, transform: `translateY(${reduced ? 0 : fgOffset}px)` }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '8rem 3rem' }}>

          {/* Eyebrow */}
          <div
            className="t-mono"
            style={{
              color: '#9a7a6a', marginBottom: '1.2rem',
              opacity: entered ? 1 : 0,
              transform: entered ? 'none' : 'translateY(12px)',
              transition: 'opacity 500ms var(--ease-out), transform 500ms var(--ease-out)',
            }}
          >
            Who we are
          </div>

          {/* Heading — clip-path line-by-line reveal */}
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
              lineHeight: 1.06, letterSpacing: '-.02em',
              color: '#ede5dc', margin: '0 0 4rem',
            }}
          >
            {HEADING_LINES.map((line, i) => (
              <span
                key={line}
                style={{
                  display: 'block',
                  clipPath: entered ? undefined : 'inset(0 100% 0 0)',
                  animation: entered ? `textReveal 700ms var(--ease-out) ${i * 100}ms both` : 'none',
                }}
              >
                {line}
              </span>
            ))}
          </h2>

          {/* Team grid */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}
            className="about-grid"
          >
            {TEAM.map((member, i) => (
              <MagneticCard key={member.label} visible={entered} delay={i * 120}>
                <div style={{ borderTop: '1px solid rgba(214,53,69,0.15)', paddingTop: '1.8rem' }}>

                  {/* Role label */}
                  <div
                    className="t-mono"
                    style={{ color: '#d63545', fontSize: '.62rem', marginBottom: '1.2rem', opacity: .75 }}
                  >
                    {member.label}
                  </div>

                  {/* Bio */}
                  <p
                    style={{
                      fontFamily: 'var(--font-instrument), sans-serif',
                      fontWeight: 400, fontSize: '1rem',
                      color: '#ede5dc', lineHeight: 1.65,
                      margin: '0 0 1.5rem',
                    }}
                  >
                    {member.bio}
                  </p>

                  {/* Credential tags — stagger fade in */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.45rem' }}>
                    {member.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        style={{
                          border: '1px solid rgba(214,53,69,0.3)',
                          color: '#d63545',
                          fontFamily: 'var(--font-jetbrains), monospace',
                          fontSize: '.62rem', letterSpacing: '.08em',
                          padding: '.24rem .65rem',
                          opacity: entered ? 1 : 0,
                          transition: `opacity 300ms var(--ease-out) ${(i * 120) + 350 + (ti * 60)}ms`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </MagneticCard>
            ))}
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          section#about > div:last-child > div {
            padding: 5rem 1.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}
