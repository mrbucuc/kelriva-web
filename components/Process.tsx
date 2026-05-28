'use client'

import { useEffect, useRef, useState } from 'react'
import { checkReducedMotion } from '@/lib/animations'

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
  const sectionRef  = useRef<HTMLDivElement>(null)
  const threadRef   = useRef<HTMLDivElement>(null)
  const [progress, setProgress]   = useState(0)
  const [entered, setEntered]     = useState(false)
  const [pinned, setPinned]       = useState(false)

  const reduced = checkReducedMotion()

  // Active step index from progress 0→1
  const activeStep = reduced ? STEPS.length - 1 : Math.min(
    STEPS.length - 1,
    Math.floor(progress * STEPS.length),
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (reduced) { setEntered(true); setProgress(1); return }

    // Entry observer
    const entryObs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEntered(true) },
      { threshold: 0.05 },
    )
    entryObs.observe(section)

    // Scroll progress mapped to section height
    const onScroll = () => {
      const rect  = section.getBoundingClientRect()
      const vh    = window.innerHeight
      // Section is 300vh tall; track from when top hits viewport to when bottom leaves
      const total = section.offsetHeight - vh
      const entered = -rect.top
      const p = Math.max(0, Math.min(1, total > 0 ? entered / total : 0))
      setProgress(p)
      setPinned(rect.top <= 0 && rect.bottom > vh)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      entryObs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [reduced])

  // Thread height fills with progress
  const threadFill = `${progress * 100}%`

  return (
    // Outer tall container — 300vh creates scroll room for sticky panel
    <div
      ref={sectionRef}
      style={{ height: reduced ? 'auto' : '300vh', position: 'relative' }}
    >
      {/* Sticky panel */}
      <div style={{
        position: reduced ? 'relative' : (pinned ? 'fixed' : progress >= 1 ? 'absolute' : 'sticky'),
        top: reduced ? 'auto' : (progress >= 1 ? 'auto' : 0),
        bottom: reduced ? 'auto' : (progress >= 1 ? 0 : 'auto'),
        left: 0, right: 0,
        height: reduced ? 'auto' : '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'var(--color-ink-warm)',
        overflow: 'hidden',
      }}>
        <section id="process" style={{ width: '100%', padding: '8rem 3rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* Header */}
            <div
              style={{
                opacity: entered ? 1 : 0,
                transform: entered ? 'none' : 'translateY(24px)',
                transition: `opacity 600ms var(--ease-out), transform 600ms var(--ease-out)`,
                marginBottom: '5rem',
              }}
            >
              <div className="t-mono" style={{ color: '#9a7a6a', marginBottom: '1.2rem' }}>
                How we work
              </div>
              <h2 className="t-section" style={{ color: '#ffffff', margin: 0 }}>
                From first call to live system<br />
                <em>in weeks, not months.</em>
              </h2>
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', gap: '4rem' }} className="proc-layout">

              {/* Left: red thread + step numbers */}
              <div style={{ position: 'relative', width: 2, flexShrink: 0, alignSelf: 'stretch' }}
                   className="proc-thread-col">
                {/* Track background */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0, left: 0,
                  width: 2,
                  background: 'rgba(214,53,69,0.1)',
                }} />
                {/* Fill — maps to scroll progress */}
                <div
                  ref={threadRef}
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: 2,
                    height: reduced ? '100%' : threadFill,
                    background: '#d63545',
                    boxShadow: '0 0 10px rgba(214,53,69,0.6)',
                    transition: reduced ? 'none' : 'height 80ms linear',
                  }}
                />
              </div>

              {/* Right: steps */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {STEPS.map((step, i) => {
                  const isActive = i <= activeStep
                  const isCurrent = i === activeStep && !reduced

                  return (
                    <div
                      key={step.n}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '5rem 1fr',
                        gap: '0 2.5rem',
                        alignItems: 'start',
                        opacity: isActive ? 1 : 0.28,
                        transform: isCurrent ? 'translateX(0)' : (entered && isActive ? 'none' : 'translateX(-20px)'),
                        transition: `opacity 500ms var(--ease-out), transform 500ms var(--ease-out)`,
                      }}
                      className="proc-row"
                    >
                      {/* Large step number */}
                      <div style={{
                        fontFamily: 'var(--font-cormorant), serif',
                        fontWeight: 300,
                        fontSize: 'clamp(3rem, 4.5vw, 4.5rem)',
                        lineHeight: 1,
                        color: isActive ? '#d63545' : 'rgba(214,53,69,0.25)',
                        letterSpacing: '-.02em',
                        transition: 'color 400ms var(--ease-out)',
                        paddingTop: '.1rem',
                      }}>
                        {step.n}
                      </div>

                      {/* Content */}
                      <div>
                        {/* Active indicator */}
                        {isCurrent && (
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '.4rem',
                            marginBottom: '.4rem',
                          }}>
                            <span style={{
                              width: 5, height: 5, borderRadius: '50%',
                              background: '#00e09c',
                              animation: 'statusBlink 2s ease infinite',
                              display: 'inline-block',
                            }} />
                            <span className="t-mono" style={{ color: '#00e09c', fontSize: '.58rem' }}>
                              Current
                            </span>
                          </div>
                        )}
                        <h3 style={{
                          fontFamily: 'var(--font-instrument), sans-serif',
                          fontWeight: 600,
                          fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)',
                          color: isActive ? '#ffffff' : '#9a7a6a',
                          letterSpacing: '-.01em',
                          marginBottom: '.6rem',
                          transition: 'color 400ms var(--ease-out)',
                        }}>
                          {step.title}
                        </h3>
                        <p className="t-body" style={{
                          color: isActive ? '#ede5dc' : '#9a7a6a',
                          margin: 0,
                          transition: 'color 400ms var(--ease-out)',
                        }}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  )
}
