'use client'

import { useEffect, useRef, useState } from 'react'
import { checkReducedMotion } from '@/lib/animations'

const ITEMS = [
  'Fixed-Fee Delivery',
  '48h Proposal Turnaround',
  'London, United Kingdom',
  'Est. 2026',
  'Enterprise-Grade Builds',
  'AWS-Powered Infrastructure',
  'UK-Registered Company',
  'Model-Agnostic Architecture',
  'Vector RAG Specialists',
  'No Retainers. No Surprises.',
]

// Normal speed: 35px/s. Slow speed on enter: 12px/s for 2s then back to 35px/s.
const SPEED_NORMAL = 35
const SPEED_SLOW   = 12

export default function ProofNumbers() {
  const trackRef   = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const posRef     = useRef(0)
  const speedRef   = useRef(SPEED_SLOW)
  const pausedRef  = useRef(false)
  const lastTimeRef = useRef<number | null>(null)
  const rafRef     = useRef<number>(0)
  const [entered, setEntered] = useState(false)

  // Triple the items so the seamless loop works at any viewport width
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS]
  const segLen   = ITEMS.length

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    if (checkReducedMotion()) { setEntered(true); return }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          // Slow-in on enter: 12px/s for 2s then ramp to 35px/s
          speedRef.current = SPEED_SLOW
          setTimeout(() => { speedRef.current = SPEED_NORMAL }, 2000)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Measure one segment width after render
    const getSegWidth = () => {
      const items = track.querySelectorAll<HTMLElement>('.ticker-item')
      let w = 0
      for (let i = 0; i < segLen; i++) w += items[i]?.offsetWidth ?? 0
      return w
    }

    let segWidth = 0

    const tick = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time
      const dt = (time - lastTimeRef.current) / 1000
      lastTimeRef.current = time

      if (!pausedRef.current) {
        if (segWidth === 0) segWidth = getSegWidth()
        posRef.current += speedRef.current * dt
        if (segWidth > 0 && posRef.current >= segWidth) posRef.current -= segWidth
        track.style.transform = `translateX(${-posRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const onVisible = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
        lastTimeRef.current = null
      } else {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [segLen])

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-label="Kelriva AI credentials"
      style={{
        borderTop:    '1px solid rgba(214,53,69,0.1)',
        borderBottom: '1px solid rgba(214,53,69,0.1)',
        padding: '1.4rem 0',
        overflow: 'hidden',
        background: 'rgba(10,7,6,0.6)',
        position: 'relative',
      }}
      onMouseEnter={() => { pausedRef.current = true  }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {/* Screen-reader summary — hidden visually, announced once */}
      <p className="sr-only">
        Fixed-Fee Delivery · 48h Proposal Turnaround · London, United Kingdom ·
        UK-Registered Company · AWS-Powered Infrastructure · Model-Agnostic Architecture
      </p>
      {/* Left vignette */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 140,
        background: 'linear-gradient(90deg, #0d0a08 10%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      {/* Right vignette */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 140,
        background: 'linear-gradient(-90deg, #0d0a08 10%, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Track — aria-hidden, SR content provided above */}
      <div
        ref={trackRef}
        aria-hidden="true"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          opacity: entered ? 1 : 0,
          transition: 'opacity 600ms var(--ease-out)',
        }}
      >
        {repeated.map((item, i) => (
          <div key={i} className="ticker-item" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {/* Separator diamond */}
            <span style={{
              color: '#d63545',
              fontSize: '.7rem',
              padding: '0 1.4rem',
              opacity: .7,
            }}>✦</span>
            {/* Label */}
            <span style={{
              fontFamily: 'var(--font-instrument), sans-serif',
              fontSize: '.85rem',
              fontWeight: 500,
              color: '#6b5548',
            }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
