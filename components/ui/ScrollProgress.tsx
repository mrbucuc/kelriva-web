'use client'

import { useEffect, useRef, useState } from 'react'
import { checkReducedMotion } from '@/lib/animations'

export default function ScrollProgress() {
  const barRef    = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (checkReducedMotion()) {
      setVisible(true)
      return
    }

    const bar = barRef.current
    if (!bar) return

    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop  = window.scrollY
          const docHeight  = document.documentElement.scrollHeight - window.innerHeight
          const progress   = docHeight > 0 ? scrollTop / docHeight : 0

          if (bar) bar.style.width = `${progress * 100}%`

          if (!visible && scrollTop > 0) setVisible(true)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        right:      0,
        height:     '2px',
        zIndex:     9998,
        background: 'transparent',
        pointerEvents: 'none',
      }}
      aria-hidden
    >
      <div
        ref={barRef}
        style={{
          height:     '100%',
          width:      '0%',
          background: '#d63545',
          boxShadow:  '0 0 8px rgba(214,53,69,0.5)',
          opacity:    visible ? 1 : 0,
          transition: 'opacity 400ms var(--ease-out)',
          willChange: 'width',
        }}
      />
    </div>
  )
}
