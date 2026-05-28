'use client'

import { useEffect, useRef } from 'react'
import { checkReducedMotion } from '@/lib/animations'

// Cursor states driven by data-cursor attributes on elements:
//   data-cursor="cta"   → ring expands to 56px, light fill
//   data-cursor="text"  → ring flattens to reading line
//   data-cursor="link"  → ring rotates 45deg (diamond)
// Default: 8px dot + 36px ring

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch/reduced-motion devices
    if (checkReducedMotion()) return
    if (typeof window === 'undefined') return
    // Only activate on pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Show cursor elements
    dot.style.opacity  = '1'
    ring.style.opacity = '1'

    let mx = -999, my = -999
    let rx = -999, ry = -999
    let raf: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'

      // Detect cursor context from target element
      const el   = e.target as HTMLElement
      const mode = el?.closest('[data-cursor]')?.getAttribute('data-cursor') ?? ''

      ring.className = 'cursor-ring' + (mode ? ` cursor-ring--${mode}` : '')
    }

    const onLeave = () => {
      dot.style.opacity  = '0'
      ring.style.opacity = '0'
    }
    const onEnter = () => {
      dot.style.opacity  = '1'
      ring.style.opacity = '1'
    }

    const loop = () => {
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Inner dot — snaps to cursor */}
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden
      />
      {/* Outer ring — lerp follows */}
      <div
        ref={ringRef}
        className="cursor-ring"
        aria-hidden
      />

      <style>{`
        /* Hide system cursor while custom cursor is active */
        @media (pointer: fine) {
          * { cursor: none !important; }
        }

        .cursor-dot {
          position: fixed;
          width: 8px;
          height: 8px;
          background: #ede5dc;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: opacity 200ms;
          opacity: 0;
          will-change: transform;
        }

        .cursor-ring {
          position: fixed;
          width: 36px;
          height: 36px;
          border: 1.5px solid #d63545;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition:
            width 200ms var(--ease-out),
            height 200ms var(--ease-out),
            background 200ms var(--ease-out),
            transform 200ms var(--ease-out),
            border-radius 200ms var(--ease-out),
            opacity 200ms;
          opacity: 0;
          will-change: transform;
        }

        /* CTA hover — ring expands, gets light fill */
        .cursor-ring--cta {
          width: 56px;
          height: 56px;
          background: rgba(214,53,69,0.12);
        }

        /* Text hover — flattens to reading line */
        .cursor-ring--text {
          width: 64px;
          height: 6px;
          border-radius: 2px;
        }

        /* Link hover — diamond shape */
        .cursor-ring--link {
          transform: translate(-50%, -50%) rotate(45deg);
          border-radius: 4px;
        }
      `}</style>
    </>
  )
}
