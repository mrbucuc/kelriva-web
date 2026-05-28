'use client'

import { useEffect, useRef } from 'react'

export default function GlobeValueProp() {
  const outerRef = useRef<HTMLDivElement>(null)

  // Fade out as the user scrolls through GlobeSection
  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / window.innerHeight)
      el.style.opacity = String(Math.max(0, 1 - p * 3))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    // Outer: absolute centering (never animated — preserves centering transform)
    <div
      ref={outerRef}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* Inner: float loop only — no opacity animation so text is LCP-visible at CSS-parse time */}
      <div
        style={{
          animation: 'float 6s ease-in-out 0.5s infinite',
        }}
      >
        <div style={{
          background: 'rgba(13,10,8,0.42)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          padding: '2rem 3rem',
          border: '1px solid rgba(214,53,69,0.1)',
        }}>
          <div style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
            color: 'rgba(237,229,220,0.9)',
            lineHeight: 1.2,
            letterSpacing: '-.02em',
            marginBottom: '.25rem',
          }}>
            Built in London.
          </div>
          <div style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
            color: '#d63545',
            lineHeight: 1.2,
            letterSpacing: '-.02em',
          }}>
            Deployed everywhere.
          </div>
        </div>
      </div>
    </div>
  )
}
