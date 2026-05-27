'use client'

import { useEffect, useRef, useCallback } from 'react'
import createGlobe from 'cobe'
import { motion } from 'framer-motion'

export default function GlobeSection() {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const phiRef       = useRef(0.08)          // slight eastward start — London near centre
  const pointerDownX = useRef<number | null>(null)
  const dragDelta    = useRef(0)
  const rafRef       = useRef<number>(0)
  const globeRef     = useRef<ReturnType<typeof createGlobe> | null>(null)

  const setCursor = useCallback((grabbing: boolean) => {
    if (canvasRef.current) canvasRef.current.style.cursor = grabbing ? 'grabbing' : 'grab'
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const size = () => canvas.offsetWidth

    // Build / rebuild globe (also called on resize)
    const init = () => {
      globeRef.current?.destroy()
      cancelAnimationFrame(rafRef.current)

      const s = size()
      if (!s) return

      const globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width:  s * 2,
        height: s * 2,
        phi:   phiRef.current,
        theta: -0.30,           // tilt — Northern Europe prominent
        dark:   1,
        diffuse: 1.6,
        mapSamples:    16_000,
        mapBrightness: 1.4,
        baseColor:   [0.10, 0.05, 0.03],   // #0d0a08 warm dark
        markerColor: [0.84, 0.21, 0.27],   // #d63545 crimson
        glowColor:   [0.42, 0.10, 0.14],   // deep crimson ambient glow
        markers: [
          // London — Kelriva HQ (largest dot)
          { location: [51.5074, -0.1278], size: 0.09 },
          // Europe
          { location: [48.8566,  2.3522], size: 0.033 }, // Paris
          { location: [50.1109,  8.6821], size: 0.038 }, // Frankfurt
          { location: [52.3676,  4.9041], size: 0.028 }, // Amsterdam
          { location: [41.9028, 12.4964], size: 0.028 }, // Rome
          // Americas
          { location: [40.7128, -74.006 ], size: 0.048 }, // New York
          { location: [43.6532, -79.3832], size: 0.028 }, // Toronto
          { location: [37.7749,-122.4194], size: 0.033 }, // San Francisco
          // Middle East & Africa
          { location: [25.2048, 55.2708], size: 0.038 }, // Dubai
          // Asia-Pacific
          { location: [ 1.3521,103.8198], size: 0.038 }, // Singapore
          { location: [35.6762,139.6503], size: 0.033 }, // Tokyo
          { location: [-33.865,151.2099], size: 0.028 }, // Sydney
        ],
        arcs: [
          // Connections from London to enterprise hubs
          { from: [51.5074, -0.1278], to: [40.7128, -74.006 ] },
          { from: [51.5074, -0.1278], to: [25.2048,  55.2708] },
          { from: [51.5074, -0.1278], to: [ 1.3521, 103.8198] },
          { from: [51.5074, -0.1278], to: [50.1109,   8.6821] },
          { from: [51.5074, -0.1278], to: [37.7749,-122.4194] },
        ],
        arcColor: [0.84, 0.21, 0.27],
        arcWidth: 1.2,
        arcHeight: 0.4,
      })
      globeRef.current = globe

      // Animation loop
      const tick = () => {
        if (pointerDownX.current === null) {
          phiRef.current += 0.0028      // slow auto-rotation
        }
        globe.update({
          phi:    phiRef.current + dragDelta.current,
          width:  size() * 2,
          height: size() * 2,
        })
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)

      // Fade in
      requestAnimationFrame(() => { canvas.style.opacity = '1' })
    }

    init()

    const onResize = () => init()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      globeRef.current?.destroy()
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const onPointerDown = useCallback((clientX: number) => {
    pointerDownX.current = clientX
    setCursor(true)
  }, [setCursor])

  const onPointerMove = useCallback((clientX: number) => {
    if (pointerDownX.current === null) return
    dragDelta.current = (clientX - pointerDownX.current) / 180
  }, [])

  const onPointerUp = useCallback(() => {
    if (pointerDownX.current !== null) {
      phiRef.current += dragDelta.current
      dragDelta.current = 0
      pointerDownX.current = null
    }
    setCursor(false)
  }, [setCursor])

  return (
    <section
      aria-label="Kelriva AI — London headquarters globe"
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#0d0a08',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── Globe canvas ─────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          width:  'min(90vw, 90vh)',
          height: 'min(90vw, 90vh)',
          opacity: 0,
          transition: 'opacity 1.2s ease',
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onPointerDown={e => onPointerDown(e.clientX)}
        onPointerMove={e => onPointerMove(e.clientX)}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={e => onPointerDown(e.touches[0]?.clientX ?? 0)}
        onTouchMove={e => onPointerMove(e.touches[0]?.clientX ?? 0)}
        onTouchEnd={onPointerUp}
      />

      {/* ── Vignette — bleeds globe into dark bg ─────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 68% 68% at 50% 50%, transparent 35%, rgba(13,10,8,.5) 72%, rgba(13,10,8,.92) 100%),
            linear-gradient(to bottom,
              rgba(13,10,8,1)   0%,
              rgba(13,10,8,0)  11%,
              rgba(13,10,8,0)  83%,
              rgba(13,10,8,1) 100%
            )
          `,
        }}
      />

      {/* ── Top eyebrow ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute', top: 86, left: 0, right: 0,
          textAlign: 'center', zIndex: 4, pointerEvents: 'none',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.62rem', color: 'rgba(214,53,69,.6)',
          letterSpacing: '.28em', textTransform: 'uppercase',
        }}>
          Kelriva AI · Enterprise AI Consultancy
        </div>
      </motion.div>

      {/* ── Bottom coordinate strip ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 1.1, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute', bottom: 76, left: 0, right: 0,
          textAlign: 'center', zIndex: 4, pointerEvents: 'none',
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '.8rem',
        }}>
          <span style={{
            display: 'block', width: 28, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(214,53,69,.35))',
          }} />
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.56rem', color: 'rgba(107,85,72,.45)',
            letterSpacing: '.2em', textTransform: 'uppercase',
          }}>51.5074° N · 0.1278° W · London, UK</span>
          <span style={{
            display: 'block', width: 28, height: 1,
            background: 'linear-gradient(90deg, rgba(214,53,69,.35), transparent)',
          }} />
        </div>
        <div style={{
          marginTop: '.6rem',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.5rem', color: 'rgba(74,96,112,.28)',
          letterSpacing: '.16em', textTransform: 'uppercase',
        }}>
          Drag to explore · Enterprise AI · Built in London
        </div>
      </motion.div>
    </section>
  )
}
