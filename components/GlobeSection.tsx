'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// ── Geometry constants ────────────────────────────────────────────────────────
const CX = 300          // SVG center x
const CY = 300          // SVG center y
const GR = 272          // globe radius

// Convert (bearing from North clockwise, fraction of GR) → SVG x,y
function polar(angleDeg: number, dist: number) {
  const r = (angleDeg * Math.PI) / 180
  return { x: CX + Math.sin(r) * dist * GR, y: CY - Math.cos(r) * dist * GR }
}

// ── Cities ─────────────────────────────────────────────────────────────────────
// angle = great-circle bearing from London (degrees clockwise from North)
// dist  = scaled radius fraction (0–1). Uses sqrt-ish scale so nearby cities aren't cramped.
const CITIES = [
  { id: 'paris',    name: 'Paris',          angle: 152, dist: 0.40, r: 3.2, labelSide: 'right' as const },
  { id: 'fra',      name: 'Frankfurt',       angle: 118, dist: 0.46, r: 3.2, labelSide: 'right' as const },
  { id: 'ams',      name: 'Amsterdam',       angle: 102, dist: 0.38, r: 3.0, labelSide: 'right' as const },
  { id: 'rome',     name: 'Rome',            angle: 145, dist: 0.52, r: 3.0, labelSide: 'right' as const },
  { id: 'ny',       name: 'New York',        angle: 287, dist: 0.70, r: 4.0, labelSide: 'left'  as const },
  { id: 'toronto',  name: 'Toronto',         angle: 292, dist: 0.71, r: 3.0, labelSide: 'left'  as const },
  { id: 'sf',       name: 'San Francisco',   angle: 323, dist: 0.80, r: 3.5, labelSide: 'left'  as const },
  { id: 'dubai',    name: 'Dubai',           angle: 112, dist: 0.70, r: 3.5, labelSide: 'right' as const },
  { id: 'sg',       name: 'Singapore',       angle: 91,  dist: 0.86, r: 3.5, labelSide: 'right' as const },
  { id: 'tokyo',    name: 'Tokyo',           angle: 46,  dist: 0.83, r: 3.5, labelSide: 'right' as const },
  { id: 'sydney',   name: 'Sydney',          angle: 133, dist: 0.96, r: 3.0, labelSide: 'right' as const },
]

// Concentric rings (% of GR) for the "latitude" grid
const RINGS = [0.22, 0.40, 0.57, 0.73, 0.88]
// Radial "longitude" lines at every 30°
const RADIALS = Array.from({ length: 12 }, (_, i) => i * 30)

// ── Component ──────────────────────────────────────────────────────────────────
export default function GlobeSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const svgRef      = useRef<SVGSVGElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const rotDeg      = useRef(0)   // accumulated CSS rotation of the SVG (scroll-driven spin)

  // ── Scroll: spin + exit bind ────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh   = window.innerHeight

      // ① Spin while visible — delta scroll → rotate SVG
      const dy = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY

      if (rect.top > -vh && rect.bottom > 0) {
        rotDeg.current += dy * 0.025      // 0.025° per pixel scrolled
        if (svgRef.current) {
          svgRef.current.style.transform = `rotate(${rotDeg.current}deg)`
        }
      }

      // ② Exit bind — overlay fades to #0d0a08 (matches Hero background exactly)
      const exitProgress = Math.max(0, Math.min(1, -rect.top / vh))
      if (overlayRef.current) {
        overlayRef.current.style.opacity = Math.min(1, exitProgress * 1.7).toString()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Kelriva AI — London as global enterprise hub"
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
      {/* ── Network globe SVG ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{
          width: 'min(88vw, 88vh)',
          height: 'min(88vw, 88vh)',
          position: 'relative',
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 600 600"
          style={{
            width: '100%', height: '100%',
            willChange: 'transform',
            transformOrigin: 'center center',
          }}
          aria-hidden
        >
          <defs>
            {/* Radial glow behind London */}
            <radialGradient id="londonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#d63545" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#d63545" stopOpacity="0"    />
            </radialGradient>
            {/* Subtle outer glow on globe edge */}
            <radialGradient id="edgeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="75%"  stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(214,53,69,0.06)" />
            </radialGradient>
          </defs>

          {/* Globe background disc */}
          <circle cx={CX} cy={CY} r={GR}
            fill="rgba(13,10,8,0.94)"
          />

          {/* Concentric rings — latitude grid */}
          {RINGS.map(f => (
            <circle key={f} cx={CX} cy={CY} r={f * GR}
              fill="none" stroke="rgba(214,53,69,0.055)" strokeWidth="1"
            />
          ))}

          {/* Radial lines — longitude grid */}
          {RADIALS.map(a => {
            const rad = (a * Math.PI) / 180
            return (
              <line key={a}
                x1={CX} y1={CY}
                x2={CX + Math.sin(rad) * GR}
                y2={CY - Math.cos(rad) * GR}
                stroke="rgba(214,53,69,0.04)" strokeWidth="1"
              />
            )
          })}

          {/* ── Connection lines: London → each city ──────────────────── */}
          {CITIES.map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            const pathD = `M ${CX} ${CY} L ${x} ${y}`
            return (
              <motion.path
                key={`line-${city.id}`}
                d={pathD}
                stroke="rgba(214,53,69,0.28)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 1.4, delay: 0.6 + i * 0.1, ease: [0.23, 1, 0.32, 1] },
                  opacity:    { duration: 0.4, delay: 0.6 + i * 0.1 },
                }}
              />
            )
          })}

          {/* ── Traveling pulse dots ───────────────────────────────────── */}
          {CITIES.map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            const pathD = `M ${CX} ${CY} L ${x} ${y}`
            const dur = (1.8 + city.dist * 1.4).toFixed(2)
            const begin = (1.2 + i * 0.22).toFixed(2)
            return (
              <circle key={`pulse-${city.id}`} r={2.2} fill="#d63545" fillOpacity="0.85">
                <animateMotion
                  path={pathD}
                  dur={`${dur}s`}
                  begin={`${begin}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )
          })}

          {/* ── City dots ─────────────────────────────────────────────── */}
          {CITIES.map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            return (
              <motion.circle
                key={`dot-${city.id}`}
                cx={x} cy={y} r={city.r}
                fill="#d63545"
                fillOpacity="0.65"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              />
            )
          })}

          {/* ── City name labels (shown for primary hubs) ─────────────── */}
          {CITIES.filter(c => ['ny','sf','dubai','sg','tokyo'].includes(c.id)).map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            const dx = city.labelSide === 'right' ? 8 : -8
            const anchor = city.labelSide === 'right' ? 'start' : 'end'
            return (
              <motion.text
                key={`label-${city.id}`}
                x={x + dx} y={y + 1}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill="rgba(107,85,72,0.6)"
                fontSize="8"
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="1.5"
                style={{ textTransform: 'uppercase' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 + i * 0.1 }}
              >
                {city.name.toUpperCase()}
              </motion.text>
            )
          })}

          {/* ── London glow halo ──────────────────────────────────────── */}
          <circle cx={CX} cy={CY} r={70} fill="url(#londonGlow)" />

          {/* ── London pulse rings (animated) ─────────────────────────── */}
          {[1, 2].map(ring => (
            <motion.circle
              key={`pulse-ring-${ring}`}
              cx={CX} cy={CY}
              r={10}
              fill="none"
              stroke="rgba(214,53,69,0.5)"
              strokeWidth="1"
              animate={{ r: [10, 42, 10], opacity: [0.6, 0, 0.6] }}
              transition={{
                duration: 2.8,
                delay: ring * 1.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* ── London dot ────────────────────────────────────────────── */}
          <circle cx={CX} cy={CY} r={7}   fill="#d63545" />
          <circle cx={CX} cy={CY} r={3.5} fill="#0d0a08" />
          <circle cx={CX} cy={CY} r={1.8} fill="#d63545" />

          {/* ── London label ──────────────────────────────────────────── */}
          <motion.text
            x={CX} y={CY - 16}
            textAnchor="middle"
            fill="rgba(237,229,220,0.55)"
            fontSize="7.5"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            LONDON
          </motion.text>

          {/* ── Globe border ring ─────────────────────────────────────── */}
          <circle cx={CX} cy={CY} r={GR}
            fill="none"
            stroke="rgba(214,53,69,0.18)"
            strokeWidth="1"
          />

          {/* Edge glow */}
          <circle cx={CX} cy={CY} r={GR}
            fill="url(#edgeGlow)"
          />
        </svg>
      </motion.div>

      {/* ── Vignette — merges globe into dark page ───────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: `
            linear-gradient(to bottom,
              rgba(13,10,8,1)  0%,
              rgba(13,10,8,0) 10%,
              rgba(13,10,8,0) 88%,
              rgba(13,10,8,1) 100%
            )
          `,
        }}
      />

      {/* ── Scroll-exit bind overlay ─────────────────────────────────────── */}
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

      {/* ── Top eyebrow ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute', top: 86, left: 0, right: 0,
          textAlign: 'center', zIndex: 4, pointerEvents: 'none',
        }}
      >
        <div className="t-mono" style={{ color: 'rgba(214,53,69,.55)', fontSize: '.62rem' }}>
          Global Infrastructure
        </div>
      </motion.div>

      {/* ── Value proposition overlay ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          textAlign: 'center',
          pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite',
          animationDelay: '1.5s',
        }}
      >
        {/* Frosted pill behind text */}
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
      </motion.div>

      {/* ── Bottom coordinate ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, delay: 1.8, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'absolute', bottom: 76, left: 0, right: 0,
          textAlign: 'center', zIndex: 4, pointerEvents: 'none',
        }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '.8rem',
        }}>
          <span style={{ display: 'block', width: 28, height: 1, background: 'linear-gradient(90deg, transparent, rgba(214,53,69,.35))' }} />
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.56rem', color: 'rgba(107,85,72,.45)',
            letterSpacing: '.2em', textTransform: 'uppercase',
          }}>51.5074° N · 0.1278° W · London, UK</span>
          <span style={{ display: 'block', width: 28, height: 1, background: 'linear-gradient(90deg, rgba(214,53,69,.35), transparent)' }} />
        </div>
        <div style={{
          marginTop: '.6rem',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.5rem', color: 'rgba(74,96,112,.28)',
          letterSpacing: '.16em', textTransform: 'uppercase',
        }}>
          Scroll to continue
        </div>
      </motion.div>
    </section>
  )
}
