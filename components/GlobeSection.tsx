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
  { id: 'paris',   name: 'Paris',         angle: 152, dist: 0.40, r: 3.2, labelSide: 'right' as const },
  { id: 'fra',     name: 'Frankfurt',     angle: 118, dist: 0.46, r: 3.2, labelSide: 'right' as const },
  { id: 'ams',     name: 'Amsterdam',     angle: 102, dist: 0.38, r: 3.0, labelSide: 'right' as const },
  { id: 'rome',    name: 'Rome',          angle: 145, dist: 0.52, r: 3.0, labelSide: 'right' as const },
  { id: 'ny',      name: 'New York',      angle: 287, dist: 0.70, r: 4.0, labelSide: 'left'  as const },
  { id: 'toronto', name: 'Toronto',       angle: 292, dist: 0.71, r: 3.0, labelSide: 'left'  as const },
  { id: 'sf',      name: 'San Francisco', angle: 323, dist: 0.80, r: 3.5, labelSide: 'left'  as const },
  { id: 'dubai',   name: 'Dubai',         angle: 112, dist: 0.70, r: 3.5, labelSide: 'right' as const },
  { id: 'sg',      name: 'Singapore',     angle: 91,  dist: 0.86, r: 3.5, labelSide: 'right' as const },
  { id: 'tokyo',   name: 'Tokyo',         angle: 46,  dist: 0.83, r: 3.5, labelSide: 'right' as const },
  { id: 'sydney',  name: 'Sydney',        angle: 133, dist: 0.96, r: 3.0, labelSide: 'right' as const },
]

const RINGS   = [0.22, 0.40, 0.57, 0.73, 0.88]
const RADIALS = Array.from({ length: 12 }, (_, i) => i * 30)

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// ── Scroll keyframes: tilt + translate (Step 4) ───────────────────────────────
const SCROLL_KEYS: [number, number, number][] = [
  [0.00,  -8, -60],
  [0.20,   0,   0],
  [0.40,   8,  60],
  [0.60,  -5, -40],
  [0.80,   0,   0],
  [1.00,   0,   0],
]
function scrollToTilt(p: number): { tiltX: number; tx: number } {
  for (let i = 0; i < SCROLL_KEYS.length - 1; i++) {
    const [p0, x0, t0] = SCROLL_KEYS[i]
    const [p1, x1, t1] = SCROLL_KEYS[i + 1]
    if (p <= p1) {
      const frac = (p - p0) / (p1 - p0)
      return { tiltX: x0 + (x1 - x0) * frac, tx: t0 + (t1 - t0) * frac }
    }
  }
  return { tiltX: 0, tx: 0 }
}

// ── City reveal sequence (Step 6) ─────────────────────────────────────────────
const REVEAL_STAGES = [
  { id: 'ny',    enter: 0.15, exit: 0.30 },
  { id: 'sf',    enter: 0.30, exit: 0.42 },
  { id: 'dubai', enter: 0.42, exit: 0.55 },
  { id: 'sg',    enter: 0.55, exit: 0.68 },
  { id: 'tokyo', enter: 0.68, exit: 0.82 },
] as const

const BG_CITY_IDS    = new Set(['paris', 'fra', 'ams', 'rome', 'toronto', 'sydney'])
const LABEL_CITY_IDS = new Set(['ny', 'sf', 'dubai', 'sg', 'tokyo'])

type CardSide = 'right' | 'left' | 'below'

const CARD_CITIES = [
  { id: 'london', label: 'HQ',           city: 'London',        detail: 'GMT · Primary hub',     nodeXpct: 50.00, nodeYpct: 50.00, side: 'below' as CardSide, enter: 0,    exit: 0.82, alwaysVisible: true  },
  { id: 'ny',     label: 'Financial Hub', city: 'New York',      detail: 'EST · Trading desks',   nodeXpct: 19.65, nodeYpct: 40.72, side: 'right' as CardSide, enter: 0.15, exit: 0.30, alwaysVisible: false },
  { id: 'sf',     label: 'Tech Cluster',  city: 'San Francisco', detail: 'PST · Engineering',     nodeXpct: 28.18, nodeYpct: 21.03, side: 'right' as CardSide, enter: 0.30, exit: 0.42, alwaysVisible: false },
  { id: 'dubai',  label: 'MENA Gateway',  city: 'Dubai',         detail: 'GST · Regional bridge', nodeXpct: 79.43, nodeYpct: 61.90, side: 'left'  as CardSide, enter: 0.42, exit: 0.55, alwaysVisible: false },
  { id: 'sg',     label: 'APAC Centre',   city: 'Singapore',     detail: 'SGT · Asia office',     nodeXpct: 89.00, nodeYpct: 50.68, side: 'left'  as CardSide, enter: 0.55, exit: 0.68, alwaysVisible: false },
  { id: 'tokyo',  label: 'Asia Pacific',  city: 'Tokyo',         detail: 'JST · Markets desk',    nodeXpct: 77.10, nodeYpct: 23.83, side: 'left'  as CardSide, enter: 0.68, exit: 0.82, alwaysVisible: false },
]

const CARD_BASE: Record<CardSide, string> = {
  right: 'translateY(-50%)',
  left:  'translateY(-50%)',
  below: 'translateX(-50%)',
}
const CARD_SLIDE: Record<CardSide, string> = {
  right: ' translateX(8px)',
  left:  ' translateX(-8px)',
  below: ' translateY(8px)',
}

export default function GlobeSection() {
  const outerRef     = useRef<HTMLDivElement>(null)
  const sectionRef   = useRef<HTMLElement>(null)
  const globeWrapRef = useRef<HTMLDivElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const finaleRef    = useRef<HTMLDivElement>(null)

  // Transform state
  const rotYBase  = useRef(0)
  const tiltX     = useRef(0);  const tiltXTgt  = useRef(0)
  const tx        = useRef(0);  const txTgt      = useRef(0)
  const mouseX    = useRef(0);  const mouseXTgt  = useRef(0)
  const mouseY    = useRef(0);  const mouseYTgt  = useRef(0)

  const scrollProg = useRef(0)
  const rafId      = useRef(0)
  const inView     = useRef(false)

  // SVG element refs — populated via callback refs in JSX
  const dotRefs    = useRef<Map<string, SVGCircleElement>>(new Map())
  const lineRefs   = useRef<Map<string, SVGPathElement>>(new Map())
  const labelRefs  = useRef<Map<string, SVGTextElement>>(new Map())
  // Track which lines have been triggered (they stay drawn once drawn)
  const drawnLines = useRef<Set<string>>(new Set())

  const cardRefs        = useRef<Map<string, HTMLDivElement>>(new Map())
  const connRefs        = useRef<Map<string, HTMLDivElement>>(new Map())
  const progressFillRef = useRef<HTMLDivElement>(null)
  const counterRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer    = outerRef.current
    const section  = sectionRef.current
    const globeDiv = globeWrapRef.current
    if (!outer || !section || !globeDiv) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasHover     = window.matchMedia('(hover: hover)').matches

    // ── Transform ─────────────────────────────────────────────────────────────
    const applyTransform = () => {
      const rX = tiltX.current + mouseY.current
      const rY = rotYBase.current + mouseX.current
      globeDiv.style.transform =
        `perspective(1200px) rotateX(${rX.toFixed(3)}deg) rotateY(${rY.toFixed(3)}deg) translateX(${tx.current.toFixed(2)}px)`
    }

    const tick = () => {
      rotYBase.current += 0.15
      tiltX.current  = lerp(tiltX.current,  tiltXTgt.current,  0.08)
      tx.current     = lerp(tx.current,     txTgt.current,     0.08)
      mouseX.current = lerp(mouseX.current, mouseXTgt.current, 0.05)
      mouseY.current = lerp(mouseY.current, mouseYTgt.current, 0.05)
      applyTransform()
      rafId.current = requestAnimationFrame(tick)
    }

    const startRaf = () => {
      if (!rafId.current && !reduceMotion) rafId.current = requestAnimationFrame(tick)
    }
    const stopRaf = () => {
      if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = 0 }
    }

    const observer = new IntersectionObserver(
      ([entry]) => { inView.current = entry.isIntersecting; entry.isIntersecting ? startRaf() : stopRaf() },
      { threshold: 0 }
    )
    observer.observe(outer)

    const onVisibility = () => {
      if (document.hidden) stopRaf(); else if (inView.current) startRaf()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // ── City node reveal ──────────────────────────────────────────────────────
    const updateCityNodes = (p: number) => {
      // Reduced-motion: reveal all cities statically, skip scroll-driven sequence
      if (reduceMotion) {
        CITIES.forEach(city => {
          const dot   = dotRefs.current.get(city.id)
          const line  = lineRefs.current.get(city.id)
          const label = labelRefs.current.get(city.id)
          if (dot)  { dot.style.opacity = '0.8'; dot.style.transform = 'scale(1)'; dot.style.filter = 'none' }
          if (line && !drawnLines.current.has(city.id)) {
            line.style.strokeDashoffset = '0'
            drawnLines.current.add(city.id)
          }
          if (label) label.style.opacity = '1'
        })
        const finaleDiv = finaleRef.current
        if (finaleDiv) {
          finaleDiv.style.transition = 'none'
          finaleDiv.style.opacity    = '1'
          finaleDiv.style.transform  = 'translateY(-50%)'
        }
        return
      }

      const isFinale = p >= 0.82

      // Background cities — fade in at scroll start, stay dimmed through the sequence
      CITIES.forEach(city => {
        if (!BG_CITY_IDS.has(city.id)) return
        const dot  = dotRefs.current.get(city.id)
        const line = lineRefs.current.get(city.id)
        if (dot) {
          dot.style.opacity = isFinale
            ? '0.8'
            : p < 0.05 ? String((p / 0.05) * 0.3) : '0.3'
        }
        if (line && p >= 0.05 && !drawnLines.current.has(city.id)) {
          line.style.strokeDashoffset = '0'
          drawnLines.current.add(city.id)
        }
      })

      // Featured cities — pre / active / past / finale states
      REVEAL_STAGES.forEach(({ id, enter, exit }) => {
        const isActive = p >= enter && p < exit
        const isPast   = p >= exit
        const dot      = dotRefs.current.get(id)
        const label    = labelRefs.current.get(id)
        const line     = lineRefs.current.get(id)

        if (dot) {
          if (isFinale) {
            dot.style.opacity   = '1'
            dot.style.transform = 'scale(1)'
            dot.style.filter    = 'drop-shadow(0 0 5px rgba(214,53,69,0.65))'
          } else if (isActive) {
            dot.style.opacity   = '1'
            dot.style.transform = 'scale(1.7)'
            dot.style.filter    = 'none'
          } else if (isPast) {
            dot.style.opacity   = '0.45'
            dot.style.transform = 'scale(1)'
            dot.style.filter    = 'none'
          } else {
            // Pre-reveal: ghost hint once scroll has started
            dot.style.opacity   = p > 0 ? '0.15' : '0'
            dot.style.transform = 'scale(1)'
            dot.style.filter    = 'none'
          }
        }

        if (label) {
          label.style.opacity = (isFinale || isPast || isActive) ? '1' : '0'
        }

        // Draw connection line the moment the city becomes active (one-way — stays drawn)
        if ((isActive || isPast || isFinale) && !drawnLines.current.has(id)) {
          if (line) line.style.strokeDashoffset = '0'
          drawnLines.current.add(id)
        }
      })

      // Card + connector visibility
      CARD_CITIES.forEach(card => {
        const wrapper = cardRefs.current.get(card.id)
        const conn    = connRefs.current.get(card.id)
        if (!wrapper) return

        const show = card.alwaysVisible ? p < card.exit : (p >= card.enter && p < card.exit)

        const base  = CARD_BASE[card.side]
        const slide = CARD_SLIDE[card.side]

        wrapper.style.opacity   = show ? '1' : '0'
        wrapper.style.transform = show ? base : base + slide

        if (conn) {
          const isHoriz = card.side !== 'below'
          conn.style.transform = show
            ? (isHoriz ? 'scaleX(1)' : 'scaleY(1)')
            : (isHoriz ? 'scaleX(0)' : 'scaleY(0)')
        }
      })

      // Brighten all drawn lines in finale
      CITIES.forEach(city => {
        const line = lineRefs.current.get(city.id)
        if (line && drawnLines.current.has(city.id)) {
          line.style.stroke = isFinale ? 'rgba(214,53,69,0.55)' : ''
        }
      })

      // Finale tagline
      const finaleDiv = finaleRef.current
      if (finaleDiv) {
        finaleDiv.style.opacity   = isFinale ? '1' : '0'
        finaleDiv.style.transform = isFinale
          ? 'translateY(-50%)'
          : 'translateY(calc(-50% + 14px))'
      }

      // Progress thread fill
      const fill = progressFillRef.current
      if (fill) fill.style.transform = `scaleY(${p.toFixed(3)})`

      // City counter
      const counterEl = counterRef.current
      if (counterEl) {
        let idx = 0
        REVEAL_STAGES.forEach(({ enter }, i) => { if (p >= enter) idx = i + 1 })
        counterEl.textContent = `${String(idx).padStart(2, '0')} / 05`
      }
    }

    // Initialise all nodes to their p=0 state
    updateCityNodes(0)

    // ── Scroll ────────────────────────────────────────────────────────────────
    const onScroll = () => {
      const vh       = window.innerHeight
      const outerTop = outer.getBoundingClientRect().top + window.scrollY
      const scrolled = window.scrollY - outerTop
      const travel   = outer.offsetHeight - vh
      const p        = Math.max(0, Math.min(1, scrolled / travel))
      scrollProg.current = p

      const { tiltX: tx_, tx: txv } = scrollToTilt(p)
      tiltXTgt.current = tx_
      txTgt.current    = txv

      updateCityNodes(p)

      if (overlayRef.current) {
        overlayRef.current.style.opacity = Math.max(0, (p - 0.9) / 0.1).toFixed(3)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── Mouse (desktop only) ──────────────────────────────────────────────────
    let mouseRafId = 0
    if (hasHover && !reduceMotion) {
      const onMouseMove = (e: MouseEvent) => {
        if (mouseRafId) return
        mouseRafId = requestAnimationFrame(() => {
          mouseRafId = 0
          const rect = section.getBoundingClientRect()
          const nx = (e.clientX - rect.left) / rect.width  * 2 - 1
          const ny = (e.clientY - rect.top)  / rect.height * 2 - 1
          mouseXTgt.current =  nx * 12
          mouseYTgt.current =  ny * 8
        })
      }
      const onMouseLeave = () => { mouseXTgt.current = 0; mouseYTgt.current = 0 }
      section.addEventListener('mousemove', onMouseMove)
      section.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      stopRaf()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', onScroll)
      if (mouseRafId) cancelAnimationFrame(mouseRafId)
    }
  }, [])

  return (
    <div ref={outerRef} style={{ height: '500vh' }}>
      <section
        ref={sectionRef}
        aria-label="Kelriva AI — London as global enterprise hub"
        style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', background: '#0d0a08',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 'min(88vw, 88vh)', height: 'min(88vw, 88vh)',
            position: 'relative',
            animation: 'globeIn 0.9s cubic-bezier(0.23,1,0.32,1) both',
          }}
        >
          <div
            ref={globeWrapRef}
            style={{ width: '100%', height: '100%', willChange: 'transform', transformOrigin: 'center center' }}
          >
            <svg
              viewBox="0 0 600 600"
              role="img"
              aria-label="Globe showing Kelriva AI's global reach from London to major financial hubs"
              style={{ width: '100%', height: '100%', transformOrigin: 'center center' }}
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

              {/* Connection lines — JS-controlled draw via scroll (Step 6) */}
              {CITIES.map(city => {
                const { x, y } = polar(city.angle, city.dist)
                return (
                  <path
                    key={`line-${city.id}`}
                    ref={(el: SVGPathElement | null) => { if (el) lineRefs.current.set(city.id, el) }}
                    d={`M ${CX} ${CY} L ${x} ${y}`}
                    pathLength="1"
                    stroke="rgba(214,53,69,0.28)"
                    strokeWidth="1"
                    fill="none"
                    style={{
                      strokeDasharray: '1',
                      strokeDashoffset: '1',
                      transition: 'stroke-dashoffset 0.9s cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                )
              })}

              {/* Pulse travel dots — SMIL, always running */}
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

              {/* City dots — JS-controlled opacity + scale (Step 6) */}
              {CITIES.map(city => {
                const { x, y } = polar(city.angle, city.dist)
                return (
                  <circle
                    key={`dot-${city.id}`}
                    ref={(el: SVGCircleElement | null) => { if (el) dotRefs.current.set(city.id, el) }}
                    cx={x} cy={y} r={city.r}
                    fill="#d63545"
                    fillOpacity="0.65"
                    style={{
                      opacity: 0,
                      transform: 'scale(1)',
                      transition: 'opacity 0.35s ease, transform 0.3s cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                )
              })}

              {/* City labels — JS-controlled opacity (Step 6) */}
              {CITIES.filter(c => LABEL_CITY_IDS.has(c.id)).map(city => {
                const { x, y } = polar(city.angle, city.dist)
                const dx     = city.labelSide === 'right' ? 8 : -8
                const anchor = city.labelSide === 'right' ? 'start' : 'end'
                return (
                  <text
                    key={`label-${city.id}`}
                    ref={(el: SVGTextElement | null) => { if (el) labelRefs.current.set(city.id, el) }}
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
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    {city.name.toUpperCase()}
                  </text>
                )
              })}

              <circle cx={CX} cy={CY} r={70} fill="url(#londonGlow)" />

              {/* London pulse rings — SMIL, always running */}
              {[1, 2].map(ring => (
                <circle
                  key={`pulse-ring-${ring}`}
                  cx={CX} cy={CY} r={10}
                  fill="none" stroke="rgba(214,53,69,0.5)" strokeWidth="1"
                >
                  <animate attributeName="r"       from="10" to="42" dur="2.8s" begin={`${ring * 1.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0"  dur="2.8s" begin={`${ring * 1.4}s`} repeatCount="indefinite" />
                </circle>
              ))}

              {/* London dot — always visible, no JS control needed */}
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
                style={{ opacity: 0, animation: 'fadeIn 0.8s ease 1.0s both' }}
              >
                LONDON
              </text>

              <circle cx={CX} cy={CY} r={GR} fill="none" stroke="rgba(214,53,69,0.18)" strokeWidth="1" />
              <circle cx={CX} cy={CY} r={GR} fill="url(#edgeGlow)" />
            </svg>
          </div>
        </div>

        {/* Card layer — city info cards (Step 7) */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 'min(88vw, 88vh)', height: 'min(88vw, 88vh)',
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', zIndex: 6,
          }}
        >
          {CARD_CITIES.map(card => (
            <div
              key={card.id}
              ref={(el: HTMLDivElement | null) => { if (el) cardRefs.current.set(card.id, el) }}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                flexDirection: card.side === 'below' ? 'column' : card.side === 'left' ? 'row-reverse' : 'row',
                opacity: 0,
                transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.23,1,0.32,1)',
                transform: CARD_BASE[card.side] + CARD_SLIDE[card.side],
                ...(card.side === 'left'
                  ? { right: `${100 - card.nodeXpct}%`, top: `${card.nodeYpct}%` }
                  : { left: `${card.nodeXpct}%`, top: `${card.nodeYpct}%` }
                ),
              }}
            >
              <div
                ref={(el: HTMLDivElement | null) => { if (el) connRefs.current.set(card.id, el) }}
                style={{
                  flexShrink: 0,
                  transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1)',
                  ...(card.side === 'below'
                    ? { width: 1, height: 10, background: 'rgba(214,53,69,0.35)', transform: 'scaleY(0)', transformOrigin: 'top center' }
                    : { width: 10, height: 1, background: 'rgba(214,53,69,0.35)', transform: 'scaleX(0)', transformOrigin: card.side === 'left' ? 'right center' : 'left center' }
                  ),
                }}
              />
              <div style={{
                background: 'rgba(13,10,8,0.88)',
                border: '1px solid rgba(214,53,69,0.22)',
                backdropFilter: 'blur(8px)',
                padding: '9px 13px',
                borderRadius: 2,
                minWidth: 130,
              }}>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '.58rem',
                  letterSpacing: '.15em',
                  color: '#d63545',
                  textTransform: 'uppercase',
                  marginBottom: 3,
                }}>
                  {card.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-instrument), sans-serif',
                  fontSize: '.88rem',
                  fontWeight: 600,
                  color: '#ede5dc',
                }}>
                  {card.city}
                </div>
                <div style={{
                  fontFamily: 'var(--font-instrument), sans-serif',
                  fontSize: '.72rem',
                  color: 'rgba(107,85,72,0.75)',
                  marginTop: 2,
                }}>
                  {card.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left-edge scroll progress thread + city counter (Step 9) */}
        <div
          aria-hidden
          style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 4, pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            opacity: 0,
            animation: 'fadeIn 0.5s ease 1.8s both',
          }}
        >
          <div style={{ position: 'relative', width: 1, height: 160 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(214,53,69,0.1)' }} />
            <div
              ref={progressFillRef}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(214,53,69,0.7)',
                transform: 'scaleY(0)',
                transformOrigin: 'top center',
              }}
            />
          </div>
          <div
            ref={counterRef}
            style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.48rem',
              letterSpacing: '.12em',
              color: 'rgba(214,53,69,0.45)',
            }}
          >
            00 / 05
          </div>
        </div>

        {/* Finale tagline (Step 8) */}
        <div
          ref={finaleRef}
          style={{
            position: 'absolute',
            top: '50%', left: 0, right: 0,
            textAlign: 'center',
            zIndex: 5, pointerEvents: 'none',
            opacity: 0,
            transform: 'translateY(calc(-50% + 14px))',
            transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.55rem',
            letterSpacing: '.2em',
            color: 'rgba(214,53,69,0.65)',
            textTransform: 'uppercase',
            marginBottom: '.6rem',
          }}>
            Built in London
          </div>
          <div style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            color: 'rgba(237,229,220,0.88)',
            lineHeight: 1.15,
            textShadow: '0 0 48px rgba(214,53,69,0.2)',
          }}>
            Deployed everywhere.
          </div>
        </div>

        {/* Vignette */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
            background: `linear-gradient(to bottom,
              rgba(13,10,8,1)  0%, rgba(13,10,8,0) 10%,
              rgba(13,10,8,0) 88%, rgba(13,10,8,1) 100%)`,
          }}
        />

        {/* Exit overlay */}
        <div
          ref={overlayRef}
          aria-hidden
          style={{
            position: 'absolute', inset: 0, background: '#0d0a08',
            opacity: 0, zIndex: 8, pointerEvents: 'none',
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
    </div>
  )
}
