'use client'

import { useEffect, useRef, useCallback } from 'react'
import createGlobe from 'cobe'
import { motion } from 'framer-motion'

export default function GlobeSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)

  // Phi state — three independent contributors summed each frame
  const phiAuto      = useRef(0.08)   // slow continuous auto-rotation
  const phiScroll    = useRef(0)      // scroll-driven extra spin
  const phiDrag      = useRef(0)      // user drag offset (accumulates)
  const dragStartX   = useRef<number | null>(null)
  const dragLive     = useRef(0)      // live drag delta (resets to 0 on release)

  const rafRef       = useRef<number>(0)
  const globeRef     = useRef<ReturnType<typeof createGlobe> | null>(null)
  const lastScrollY  = useRef(0)

  const setCursor = useCallback((grabbing: boolean) => {
    if (canvasRef.current) canvasRef.current.style.cursor = grabbing ? 'grabbing' : 'grab'
  }, [])

  // ── Scroll handler ──────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh   = window.innerHeight

      // ── 1. Scroll-reactive spin (while globe is visible) ───────────────
      // How much the section has scrolled out upward: 0 (section top at viewport top) → 1 (section fully gone)
      const exitProgress = Math.max(0, Math.min(1, -rect.top / vh))

      // Delta scroll this frame → add proportional phi spin
      const dy = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY
      // Only spin when section is intersecting viewport (rect.top between -vh and vh)
      if (rect.top > -vh && rect.bottom > 0) {
        phiScroll.current += dy * 0.003   // 0.003 radians per pixel scrolled
      }

      // ── 2. Exit bind — canvas zoom-out + dark overlay ─────────────────
      const canvas = canvasRef.current
      if (canvas) {
        // Scale up subtly (globe "zooms into space" as you scroll away)
        const scale = 1 + exitProgress * 0.08
        canvas.style.transform = `scale(${scale})`
      }

      // Dark overlay fades in, merging into the Hero's identical dark bg (#0d0a08)
      if (overlayRef.current) {
        // Fast fade: fully opaque by 60% exit
        const opacity = Math.min(1, exitProgress * 1.7)
        overlayRef.current.style.opacity = opacity.toString()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Globe init ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const size = () => canvas.offsetWidth

    const build = () => {
      globeRef.current?.destroy()
      cancelAnimationFrame(rafRef.current)

      const s = size()
      if (!s) return

      const globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio, 2),
        width:  s * 2,
        height: s * 2,
        phi:    phiAuto.current,
        theta:  -0.30,           // Northern Europe in frame
        dark:    1,
        diffuse: 1.6,
        mapSamples:    16_000,
        mapBrightness: 1.4,
        baseColor:   [0.10, 0.05, 0.03],
        markerColor: [0.84, 0.21, 0.27],
        glowColor:   [0.42, 0.10, 0.14],
        markers: [
          // London — Kelriva HQ
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
          // Middle East
          { location: [25.2048,  55.2708], size: 0.038 }, // Dubai
          // Asia-Pacific
          { location: [ 1.3521, 103.8198], size: 0.038 }, // Singapore
          { location: [35.6762, 139.6503], size: 0.033 }, // Tokyo
          { location: [-33.865, 151.2099], size: 0.028 }, // Sydney
        ],
        arcs: [
          { from: [51.5074, -0.1278], to: [40.7128, -74.006 ] }, // London → NY
          { from: [51.5074, -0.1278], to: [25.2048,  55.2708] }, // London → Dubai
          { from: [51.5074, -0.1278], to: [ 1.3521, 103.8198] }, // London → Singapore
          { from: [51.5074, -0.1278], to: [50.1109,   8.6821] }, // London → Frankfurt
          { from: [51.5074, -0.1278], to: [37.7749,-122.4194] }, // London → SF
        ],
        arcColor:  [0.84, 0.21, 0.27],
        arcWidth:  1.2,
        arcHeight: 0.4,
      })
      globeRef.current = globe

      // rAF loop — sum all phi contributors each frame
      const tick = () => {
        if (dragStartX.current === null) {
          phiAuto.current += 0.0025
        }
        globe.update({
          phi:    phiAuto.current + phiDrag.current + dragLive.current + phiScroll.current,
          width:  size() * 2,
          height: size() * 2,
        })
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)

      requestAnimationFrame(() => { canvas.style.opacity = '1' })
    }

    build()

    const onResize = () => build()
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      globeRef.current?.destroy()
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ── Drag handlers ────────────────────────────────────────────────────────
  const onPointerDown = useCallback((clientX: number) => {
    dragStartX.current = clientX
    setCursor(true)
  }, [setCursor])

  const onPointerMove = useCallback((clientX: number) => {
    if (dragStartX.current === null) return
    dragLive.current = (clientX - dragStartX.current) / 180
  }, [])

  const onPointerUp = useCallback(() => {
    if (dragStartX.current !== null) {
      // Commit drag into permanent phi
      phiDrag.current += dragLive.current
      dragLive.current  = 0
      dragStartX.current = null
    }
    setCursor(false)
  }, [setCursor])

  return (
    <section
      ref={sectionRef}
      aria-label="Kelriva AI — global presence globe"
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
      {/* ── Globe canvas ─────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          width:  'min(90vw, 90vh)',
          height: 'min(90vw, 90vh)',
          opacity: 0,
          transition: 'opacity 1.2s ease',   // only opacity; transform updated directly for zero lag
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none',
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        onPointerDown={e => onPointerDown(e.clientX)}
        onPointerMove={e => onPointerMove(e.clientX)}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={e => onPointerDown(e.touches[0]?.clientX ?? 0)}
        onTouchMove={e => onPointerMove(e.touches[0]?.clientX ?? 0)}
        onTouchEnd={onPointerUp}
      />

      {/* ── Radial + vertical vignette ────────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: `
            radial-gradient(ellipse 68% 68% at 50% 50%,
              transparent 35%,
              rgba(13,10,8,.5) 72%,
              rgba(13,10,8,.94) 100%
            ),
            linear-gradient(to bottom,
              rgba(13,10,8,1)  0%,
              rgba(13,10,8,0) 11%,
              rgba(13,10,8,0) 83%,
              rgba(13,10,8,1) 100%
            )
          `,
        }}
      />

      {/* ── Scroll-exit bind overlay — fades to #0d0a08 (same as Hero bg) ── */}
      <div
        ref={overlayRef}
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: '#0d0a08',
          opacity: 0,
          zIndex: 8,
          pointerEvents: 'none',
        }}
      />

      {/* ── Top eyebrow ───────────────────────────────────────────────────── */}
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

      {/* ── Bottom coordinate + hint ──────────────────────────────────────── */}
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
          Drag to explore · Scroll to continue
        </div>
      </motion.div>
    </section>
  )
}
