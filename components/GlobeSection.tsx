'use client'

import { useEffect, useRef } from 'react'

const CX = 300
const CY = 300
const GR = 272

function polar(angleDeg: number, dist: number) {
  const r = (angleDeg * Math.PI) / 180
  return { x: CX + Math.sin(r) * dist * GR, y: CY - Math.cos(r) * dist * GR }
}

const CITIES = [
  { id: 'paris',   name: 'Paris',        angle: 152, dist: 0.40, r: 3.2, labelSide: 'right' as const },
  { id: 'fra',     name: 'Frankfurt',    angle: 118, dist: 0.46, r: 3.2, labelSide: 'right' as const },
  { id: 'ams',     name: 'Amsterdam',    angle: 102, dist: 0.38, r: 3.0, labelSide: 'right' as const },
  { id: 'rome',    name: 'Rome',         angle: 145, dist: 0.52, r: 3.0, labelSide: 'right' as const },
  { id: 'ny',      name: 'New York',     angle: 287, dist: 0.70, r: 4.0, labelSide: 'left'  as const },
  { id: 'toronto', name: 'Toronto',      angle: 292, dist: 0.71, r: 3.0, labelSide: 'left'  as const },
  { id: 'sf',      name: 'San Francisco',angle: 323, dist: 0.80, r: 3.5, labelSide: 'left'  as const },
  { id: 'dubai',   name: 'Dubai',        angle: 112, dist: 0.70, r: 3.5, labelSide: 'right' as const },
  { id: 'sg',      name: 'Singapore',    angle: 91,  dist: 0.86, r: 3.5, labelSide: 'right' as const },
  { id: 'tokyo',   name: 'Tokyo',        angle: 46,  dist: 0.83, r: 3.5, labelSide: 'right' as const },
  { id: 'sydney',  name: 'Sydney',       angle: 133, dist: 0.96, r: 3.0, labelSide: 'right' as const },
]

const RINGS   = [0.22, 0.40, 0.57, 0.73, 0.88]
const RADIALS = Array.from({ length: 12 }, (_, i) => i * 30)

export default function GlobeSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const svgRef      = useRef<SVGSVGElement>(null)
  const overlayRef  = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef(0)
  const rotDeg      = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const vh   = window.innerHeight
      const dy   = window.scrollY - lastScrollY.current
      lastScrollY.current = window.scrollY

      if (rect.top > -vh && rect.bottom > 0) {
        rotDeg.current += dy * 0.025
        if (svgRef.current) {
          svgRef.current.style.transform = `rotate(${rotDeg.current}deg)`
        }
      }

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
      {/* Globe wrapper — scale-only entrance so globe is visible at first paint (LCP) */}
      <div
        style={{
          width: 'min(88vw, 88vh)',
          height: 'min(88vw, 88vh)',
          position: 'relative',
          animation: 'globeIn 0.9s cubic-bezier(0.23,1,0.32,1) both',
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
            <radialGradient id="londonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#d63545" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#d63545" stopOpacity="0"    />
            </radialGradient>
            <radialGradient id="edgeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="75%"  stopColor="transparent" />
              <stop offset="100%" stopColor="rgba(214,53,69,0.06)" />
            </radialGradient>
          </defs>

          <circle cx={CX} cy={CY} r={GR} fill="rgba(13,10,8,0.94)" />

          {RINGS.map(f => (
            <circle key={f} cx={CX} cy={CY} r={f * GR}
              fill="none" stroke="rgba(214,53,69,0.055)" strokeWidth="1"
            />
          ))}

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

          {/* Connection lines — CSS stroke-dashoffset draw */}
          {CITIES.map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            return (
              <path
                key={`line-${city.id}`}
                d={`M ${CX} ${CY} L ${x} ${y}`}
                pathLength="1"
                stroke="rgba(214,53,69,0.28)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="1"
                strokeDashoffset="1"
                style={{
                  animation: `drawLine 1.4s cubic-bezier(0.23,1,0.32,1) ${(0.6 + i * 0.1).toFixed(2)}s both`,
                }}
              />
            )
          })}

          {/* Pulse dots — SVG SMIL (no JS) */}
          {CITIES.map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            const pathD = `M ${CX} ${CY} L ${x} ${y}`
            const dur   = (1.8 + city.dist * 1.4).toFixed(2)
            const begin = (1.2 + i * 0.22).toFixed(2)
            return (
              <circle key={`pulse-${city.id}`} r={2.2} fill="#d63545" fillOpacity="0.85">
                <animateMotion path={pathD} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
              </circle>
            )
          })}

          {/* City dots — CSS fade in */}
          {CITIES.map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            return (
              <circle
                key={`dot-${city.id}`}
                cx={x} cy={y} r={city.r}
                fill="#d63545"
                fillOpacity="0.65"
                style={{
                  opacity: 0,
                  animation: `fadeIn 0.5s ease ${(1.0 + i * 0.1).toFixed(2)}s both`,
                }}
              />
            )
          })}

          {/* City labels */}
          {CITIES.filter(c => ['ny','sf','dubai','sg','tokyo'].includes(c.id)).map((city, i) => {
            const { x, y } = polar(city.angle, city.dist)
            const dx     = city.labelSide === 'right' ? 8 : -8
            const anchor = city.labelSide === 'right' ? 'start' : 'end'
            return (
              <text
                key={`label-${city.id}`}
                x={x + dx} y={y + 1}
                textAnchor={anchor}
                dominantBaseline="middle"
                fill="rgba(107,85,72,0.6)"
                fontSize="8"
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="1.5"
                style={{
                  textTransform: 'uppercase',
                  opacity: 0,
                  animation: `fadeIn 0.6s ease ${(1.6 + i * 0.1).toFixed(2)}s both`,
                }}
              >
                {city.name.toUpperCase()}
              </text>
            )
          })}

          <circle cx={CX} cy={CY} r={70} fill="url(#londonGlow)" />

          {/* London pulse rings — SVG SMIL loop */}
          {[1, 2].map(ring => (
            <circle
              key={`pulse-ring-${ring}`}
              cx={CX} cy={CY} r={10}
              fill="none"
              stroke="rgba(214,53,69,0.5)"
              strokeWidth="1"
            >
              <animate attributeName="r"       from="10" to="42" dur="2.8s" begin={`${ring * 1.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0" dur="2.8s" begin={`${ring * 1.4}s`} repeatCount="indefinite" />
            </circle>
          ))}

          <circle cx={CX} cy={CY} r={7}   fill="#d63545" />
          <circle cx={CX} cy={CY} r={3.5} fill="#0d0a08" />
          <circle cx={CX} cy={CY} r={1.8} fill="#d63545" />

          <text
            x={CX} y={CY - 16}
            textAnchor="middle"
            fill="rgba(237,229,220,0.55)"
            fontSize="7.5"
            fontFamily="'JetBrains Mono', monospace"
            letterSpacing="2"
            style={{
              opacity: 0,
              animation: 'fadeIn 0.8s ease 1.0s both',
            }}
          >
            LONDON
          </text>

          <circle cx={CX} cy={CY} r={GR} fill="none" stroke="rgba(214,53,69,0.18)" strokeWidth="1" />
          <circle cx={CX} cy={CY} r={GR} fill="url(#edgeGlow)" />
        </svg>
      </div>

      {/* Vignette */}
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

      {/* Exit overlay — opacity driven by scroll JS */}
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

      {/* Top eyebrow */}
      <div
        style={{
          position: 'absolute', top: 86, left: 0, right: 0,
          textAlign: 'center', zIndex: 4, pointerEvents: 'none',
          opacity: 0,
          animation: 'fadeDown 0.85s cubic-bezier(0.23,1,0.32,1) 0.5s both',
        }}
      >
        <div className="t-mono" style={{ color: 'rgba(214,53,69,.55)', fontSize: '.62rem' }}>
          Global Infrastructure
        </div>
      </div>

      {/* Bottom coordinate */}
      <div
        style={{
          position: 'absolute', bottom: 76, left: 0, right: 0,
          textAlign: 'center', zIndex: 4, pointerEvents: 'none',
          opacity: 0,
          animation: 'fadeUp 0.85s cubic-bezier(0.23,1,0.32,1) 1.8s both',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '.8rem' }}>
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
      </div>
    </section>
  )
}
