'use client'

import { useEffect, useRef, useState } from 'react'
import { checkReducedMotion } from '@/lib/animations'

const CARDS = [
  {
    index: '01',
    title: 'Vector RAG',
    description: 'Retrieval-Augmented Generation pipelines that ground your AI in your actual business data.',
    tag: 'Core Infrastructure',
  },
  {
    index: '02',
    title: 'AI Workflow Automation',
    description: 'End-to-end automation of business processes — contracts, reports, decisions, approvals.',
    tag: 'Process Layer',
  },
  {
    index: '03',
    title: 'Vector Indexing',
    description: 'Embedding architecture and index design that determines how fast and accurately your AI retrieves.',
    tag: 'Data Layer',
  },
  {
    index: '04',
    title: 'Model-Agnostic Infrastructure',
    description: 'No lock-in. Swap models without rebuilding. Built around your data, not a vendor.',
    tag: 'Architecture',
  },
  {
    index: '05',
    title: 'Data Engineering',
    description: 'Clean, structured, retrieval-ready data foundations before any AI is deployed.',
    tag: 'Foundation',
  },
  {
    index: '06',
    title: 'Analytics & Intelligence',
    description: 'Turn AI outputs into dashboards, decisions, and measurable business outcomes.',
    tag: 'Output Layer',
  },
]

const CARD_W = 380
const GAP    = 32

export default function CapabilitiesSection() {
  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress,  setProgress]  = useState(0)
  const [entered,   setEntered]   = useState(false)
  const [pinned,    setPinned]    = useState(false)
  const [maxTx,     setMaxTx]     = useState(0)
  const reduced = checkReducedMotion()

  // Scroll progress + pin state
  useEffect(() => {
    const outer = outerRef.current
    if (!outer) return
    if (reduced) { setEntered(true); setProgress(1); return }

    const entryObs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setEntered(true); entryObs.disconnect() } },
      { threshold: 0.01 },
    )
    entryObs.observe(outer)

    const onScroll = () => {
      const rect  = outer.getBoundingClientRect()
      const vh    = window.innerHeight
      const total = outer.offsetHeight - vh
      setProgress(Math.max(0, Math.min(1, total > 0 ? -rect.top / total : 0)))
      setPinned(rect.top <= 0 && rect.bottom > vh)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { entryObs.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [reduced])

  // Measure total horizontal translation distance
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      const pad = 48 // 3rem
      setMaxTx(Math.max(0, track.scrollWidth - window.innerWidth + pad))
    }
    const t = setTimeout(measure, 80)
    window.addEventListener('resize', measure)
    return () => { clearTimeout(t); window.removeEventListener('resize', measure) }
  }, [])

  const translateX  = reduced ? 0 : -(progress * maxTx)
  const activeIndex = reduced
    ? 0
    : Math.max(0, Math.min(CARDS.length - 1,
        maxTx > 0 ? Math.round((Math.abs(translateX) / maxTx) * (CARDS.length - 1)) : 0,
      ))

  return (
    <div
      ref={outerRef}
      style={{ height: reduced ? 'auto' : '300vh', position: 'relative' }}
    >
      {/* Sticky / fixed / absolute panel ─────────────────────────────────── */}
      <div
        id="capabilities"
        style={{
          position: reduced ? 'relative' : (pinned ? 'fixed' : progress >= 1 ? 'absolute' : 'sticky'),
          top:    reduced ? 'auto' : (progress >= 1 ? 'auto' : 0),
          bottom: reduced ? 'auto' : (progress >= 1 ? 0      : 'auto'),
          left: 0, right: 0,
          height: reduced ? 'auto' : '100vh',
          background: 'var(--color-ink)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Section header */}
        <div style={{ padding: '0 3rem', maxWidth: 1100, margin: '0 auto', width: '100%', marginBottom: '2.5rem' }}>
          <div
            className="t-mono"
            style={{
              color: '#9a7a6a', marginBottom: '1rem',
              opacity: entered ? 1 : 0,
              transition: 'opacity 500ms var(--ease-out)',
            }}
          >
            What we build
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
              lineHeight: 1.06, letterSpacing: '-.02em',
              color: '#ede5dc', margin: 0,
              opacity: entered ? 1 : 0,
              transform: entered ? 'none' : 'translateY(20px)',
              transition: 'opacity 600ms var(--ease-out) 100ms, transform 600ms var(--ease-out) 100ms',
            }}
          >
            Every capability.<br />
            One infrastructure.
          </h2>
        </div>

        {/* Horizontal card track */}
        <div style={{ perspective: '1000px', overflow: 'visible' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              gap: GAP,
              padding: '1rem 3rem 2rem',
              transform: `translateX(${translateX}px)`,
              transition: reduced ? 'none' : 'transform 50ms linear',
              willChange: reduced ? 'auto' : 'transform',
            }}
            className="cap-track"
          >
            {CARDS.map((card, i) => {
              const isActive = i === activeIndex
              const dist     = i - activeIndex  // positive = to the right (upcoming)

              // Cards very far ahead fade to 0 so they don't crowd the viewport
              const opacity = isActive ? 1
                : dist > 2   ? 0
                : dist < 0   ? 0.6
                : 0.6

              return (
                <div
                  key={card.index}
                  style={{
                    flexShrink: 0,
                    width: CARD_W,
                    background: '#1c1610',
                    borderLeft: `2px solid ${isActive ? 'rgba(214,53,69,0.8)' : 'rgba(214,53,69,0.2)'}`,
                    padding: '2.5rem',
                    opacity,
                    transform: [
                      `scale(${isActive ? 1.04 : 0.96})`,
                      `rotateY(${dist > 0 ? Math.min(8, dist * 3) : 0}deg)`,
                    ].join(' '),
                    transition: 'transform 300ms var(--ease-out), opacity 300ms var(--ease-out), border-color 300ms',
                    transformOrigin: 'left center',
                  }}
                >
                  {/* Index */}
                  <div style={{
                    fontFamily: 'var(--font-cormorant), serif',
                    fontWeight: 300, fontSize: '5rem',
                    lineHeight: 1, color: 'rgba(214,53,69,0.3)',
                    letterSpacing: '-.02em', marginBottom: '.8rem',
                  }}>
                    {card.index}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--font-instrument), sans-serif',
                    fontWeight: 600, fontSize: '1.6rem',
                    color: '#ede5dc', letterSpacing: '-.01em',
                    marginBottom: '1rem',
                  }}>
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontFamily: 'var(--font-instrument), sans-serif',
                    fontWeight: 400, fontSize: '.95rem',
                    color: '#ede5dc', lineHeight: 1.7,
                    margin: '0 0 1.8rem',
                  }}>
                    {card.description}
                  </p>

                  {/* Tag */}
                  <span style={{
                    border: '1px solid rgba(214,53,69,0.25)',
                    color: '#d63545',
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: '.7rem', letterSpacing: '.1em',
                    textTransform: 'uppercase', padding: '.3rem .7rem',
                    display: 'inline-block',
                  }}>
                    {card.tag}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll hint — only visible while pinned */}
        {!reduced && (
          <div
            style={{
              position: 'absolute', bottom: '2rem', left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: '.6rem',
              opacity: pinned && progress < 0.9 ? 1 : 0,
              transition: 'opacity 400ms var(--ease-out)',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 36, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(214,53,69,.35))',
            }} />
            <span className="t-mono" style={{ color: 'rgba(107,85,72,.45)', fontSize: '.55rem' }}>
              Scroll to explore
            </span>
            <div style={{
              width: 36, height: 1,
              background: 'linear-gradient(90deg, rgba(214,53,69,.35), transparent)',
            }} />
          </div>
        )}
      </div>

      {/* Mobile fallback — vertical card list */}
      <style>{`
        @media (max-width: 900px) {
          #capabilities {
            height: auto !important;
            position: relative !important;
            top: auto !important;
            bottom: auto !important;
            overflow: visible !important;
            padding: 5rem 0 !important;
          }
          .cap-track {
            flex-direction: column !important;
            transform: none !important;
            padding: 0 1.5rem !important;
            gap: 1.5rem !important;
          }
          .cap-track > div {
            width: 100% !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  )
}
