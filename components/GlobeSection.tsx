'use client'

import { useEffect, useRef } from 'react'
import { geoOrthographic, geoPath, geoGraticule, geoDistance } from 'd3-geo'
import { feature } from 'topojson-client'

// ── City coordinates (real lat/lon) ───────────────────────────────────────────
const CITIES = [
  { id: 'london',  name: 'London',        lon: -0.1278,  lat:  51.5074, r: 5.0 },
  { id: 'paris',   name: 'Paris',         lon:  2.3522,  lat:  48.8566, r: 3.0 },
  { id: 'fra',     name: 'Frankfurt',     lon:  8.6821,  lat:  50.1109, r: 3.0 },
  { id: 'ams',     name: 'Amsterdam',     lon:  4.9041,  lat:  52.3676, r: 3.0 },
  { id: 'ny',      name: 'New York',      lon: -74.0060, lat:  40.7128, r: 4.0 },
  { id: 'toronto', name: 'Toronto',       lon: -79.3832, lat:  43.6532, r: 3.0 },
  { id: 'sf',      name: 'San Francisco', lon: -122.419, lat:  37.7749, r: 3.5 },
  { id: 'dubai',   name: 'Dubai',         lon:  55.2708, lat:  25.2048, r: 3.5 },
  { id: 'sg',      name: 'Singapore',     lon: 103.8198, lat:   1.3521, r: 3.5 },
  { id: 'tokyo',   name: 'Tokyo',         lon: 139.6917, lat:  35.6762, r: 3.5 },
  { id: 'sydney',  name: 'Sydney',        lon: 151.2093, lat: -33.8688, r: 3.0 },
]

const BG_CITY_IDS    = new Set(['paris', 'fra', 'ams', 'toronto', 'sydney'])
const LABEL_CITY_IDS = new Set(['ny', 'sf', 'dubai', 'sg', 'tokyo'])

// ── Card metadata — no alwaysVisible ──────────────────────────────────────────
const CARD_META: Record<string, { label: string; city: string; detail: string }> = {
  london: { label: 'HQ',            city: 'London',        detail: 'GMT · Primary hub'     },
  ny:     { label: 'Financial Hub', city: 'New York',      detail: 'EST · Trading desks'   },
  sf:     { label: 'Tech Cluster',  city: 'San Francisco', detail: 'PST · Engineering'     },
  dubai:  { label: 'MENA Gateway',  city: 'Dubai',         detail: 'GST · Regional bridge' },
  sg:     { label: 'APAC Centre',   city: 'Singapore',     detail: 'SGT · Asia office'     },
  tokyo:  { label: 'Asia Pacific',  city: 'Tokyo',         detail: 'JST · Markets desk'    },
}
const CARD_IDS = new Set(Object.keys(CARD_META))

// Scroll reveal stages — london has no stage (hover-only)
const REVEAL_STAGES = [
  { id: 'ny',    enter: 0.15, exit: 0.30 },
  { id: 'sf',    enter: 0.30, exit: 0.42 },
  { id: 'dubai', enter: 0.42, exit: 0.55 },
  { id: 'sg',    enter: 0.55, exit: 0.68 },
  { id: 'tokyo', enter: 0.68, exit: 0.82 },
] as const

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

type CardSide = 'right' | 'left' | 'below'

// base = transform when card is visible (positions relative to dot)
// slide = extra offset added when hidden
const CARD_BASE: Record<CardSide, string> = {
  right: 'translateY(-50%)',
  left:  'translateY(-50%) translateX(-100%)',
  below: 'translateX(-50%)',
}
const CARD_SLIDE: Record<CardSide, string> = {
  right: ' translateX(8px)',
  left:  ' translateX(-8px)',
  below: ' translateY(8px)',
}

// ── Scroll keyframes: tilt + translate ───────────────────────────────────────
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

export default function GlobeSection() {
  const outerRef     = useRef<HTMLDivElement>(null)
  const sectionRef   = useRef<HTMLElement>(null)
  const globeWrapRef = useRef<HTMLDivElement>(null)
  const overlayRef   = useRef<HTMLDivElement>(null)
  const finaleRef    = useRef<HTMLDivElement>(null)

  // Canvas + SVG refs
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const svgOverlayRef  = useRef<SVGSVGElement>(null)
  const londonPulseRef = useRef<SVGGElement>(null)

  // D3 state — all stored in refs, never triggers re-render
  const projRef    = useRef<ReturnType<typeof geoOrthographic> | null>(null)
  const topoRef    = useRef<any>(null)
  const ctxRef     = useRef<CanvasRenderingContext2D | null>(null)
  const pathGenRef = useRef<any>(null)

  // Transform state
  const rotYBase = useRef(0)
  const tiltX    = useRef(0);  const tiltXTgt  = useRef(0)
  const tx       = useRef(0);  const txTgt     = useRef(0)
  const mouseX   = useRef(0);  const mouseXTgt = useRef(0)
  const mouseY   = useRef(0);  const mouseYTgt = useRef(0)

  const scrollProg = useRef(0)
  const rafId      = useRef(0)
  const inView     = useRef(false)

  // SVG element refs (populated by callback refs in JSX)
  const dotRefs         = useRef<Map<string, SVGCircleElement>>(new Map())
  const labelRefs       = useRef<Map<string, SVGTextElement>>(new Map())
  const drawnLines      = useRef<Set<string>>(new Set())
  const lineProgressRef = useRef<Map<string, number>>(new Map())

  // Card refs
  const cardOuterRefs  = useRef<Map<string, HTMLDivElement>>(new Map())
  const cardInnerRefs  = useRef<Map<string, HTMLDivElement>>(new Map())
  const connectorRefs  = useRef<Map<string, HTMLDivElement>>(new Map())
  const cardVisibleRef = useRef<Map<string, boolean>>(new Map())
  const cardSideRef    = useRef<Map<string, CardSide>>(new Map())
  const hoveredCity    = useRef<string | null>(null)

  const progressFillRef = useRef<HTMLDivElement>(null)
  const counterRef      = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer    = outerRef.current
    const section  = sectionRef.current
    const globeDiv = globeWrapRef.current
    const canvas   = canvasRef.current
    if (!outer || !section || !globeDiv || !canvas) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasHover     = window.matchMedia('(hover: hover)').matches

    // ── D3 projection ──────────────────────────────────────────────────────────
    const proj = geoOrthographic()
      .scale(272)
      .translate([300, 300])
      .clipAngle(90)
    projRef.current = proj

    // ── Canvas setup ───────────────────────────────────────────────────────────
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width  = 600 * dpr
    canvas.height = 600 * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctxRef.current = ctx
    pathGenRef.current = geoPath(proj, ctx)

    // Fetch world topology — globe works (just outline) if this fails
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json')
      .then(r => r.json())
      .then((data: any) => { topoRef.current = data })
      .catch(() => {})

    // ── Globe rendering (canvas) ───────────────────────────────────────────────
    const renderGlobe = () => {
      const c = ctxRef.current
      const pathGen = pathGenRef.current
      if (!c || !pathGen) return

      c.clearRect(0, 0, 600, 600)

      // Ocean fill
      c.beginPath()
      pathGen({ type: 'Sphere' })
      c.fillStyle = 'rgba(214,53,69,0.03)'
      c.fill()

      // Graticule
      c.beginPath()
      pathGen(geoGraticule()())
      c.strokeStyle = 'rgba(214,53,69,0.12)'
      c.lineWidth = 0.5
      c.stroke()

      // Land masses
      if (topoRef.current) {
        const land = feature(topoRef.current, topoRef.current.objects.land)
        c.beginPath()
        pathGen(land as any)
        c.fillStyle = '#1c1610'
        c.fill()
        c.strokeStyle = 'rgba(214,53,69,0.22)'
        c.lineWidth = 0.5
        c.stroke()
      }

      // Connection lines — animated draw via lineProgressRef
      const isFinale = scrollProg.current >= 0.82
      CITIES.forEach(city => {
        if (city.id === 'london' || !drawnLines.current.has(city.id)) return
        const londonPt = proj([-0.1278, 51.5074])
        const cityPt   = proj([city.lon, city.lat])
        if (!londonPt || !cityPt) return
        const prog = lineProgressRef.current.get(city.id) ?? 0
        if (prog <= 0) return
        const [lx, ly] = londonPt
        const [cx2, cy2] = cityPt
        c.beginPath()
        c.moveTo(lx, ly)
        c.lineTo(lx + (cx2 - lx) * prog, ly + (cy2 - ly) * prog)
        c.strokeStyle = isFinale ? 'rgba(214,53,69,0.55)' : 'rgba(214,53,69,0.28)'
        c.lineWidth = 0.8
        c.stroke()
      })

      // Globe outline
      c.beginPath()
      pathGen({ type: 'Sphere' })
      c.strokeStyle = 'rgba(214,53,69,0.4)'
      c.lineWidth = 1
      c.stroke()
    }

    // ── Visibility check for back-hemisphere ──────────────────────────────────
    const isCityVisible = (lon: number, lat: number): boolean => {
      const rot = proj.rotate()
      const vizCenter: [number, number] = [-rot[0], -rot[1]]
      return geoDistance([lon, lat], vizCenter) < Math.PI / 2 - 0.02
    }

    // ── Update city dot/label positions from D3 projection ────────────────────
    const updateDotPositions = () => {
      CITIES.forEach(city => {
        const projected = proj([city.lon, city.lat])
        if (!projected) return
        const [px, py] = projected
        const visible = isCityVisible(city.lon, city.lat)

        if (city.id === 'london') {
          // Update London pulse group position
          if (londonPulseRef.current) {
            londonPulseRef.current.setAttribute('transform', `translate(${px.toFixed(1)}, ${py.toFixed(1)})`)
          }
        } else {
          const dot = dotRefs.current.get(city.id)
          if (dot) {
            dot.setAttribute('cx', px.toFixed(1))
            dot.setAttribute('cy', py.toFixed(1))
            dot.style.visibility = visible ? 'visible' : 'hidden'
          }
        }

        // Labels
        const label = labelRefs.current.get(city.id)
        if (label && LABEL_CITY_IDS.has(city.id)) {
          const dx = px > 300 ? 8 : -8
          label.setAttribute('x', (px + dx).toFixed(1))
          label.setAttribute('y', (py + 1).toFixed(1))
          label.setAttribute('text-anchor', px > 300 ? 'start' : 'end')
          label.style.visibility = visible ? 'visible' : 'hidden'
        }

        // Reposition visible cards
        if (CARD_IDS.has(city.id) && cardVisibleRef.current.get(city.id)) {
          positionCard(city.id, px, py)
        }
      })

      // Advance line draw progress each frame
      CITIES.forEach(city => {
        if (!drawnLines.current.has(city.id)) return
        const prog = lineProgressRef.current.get(city.id) ?? 0
        if (prog < 1) lineProgressRef.current.set(city.id, Math.min(1, prog + 0.015))
      })
    }

    // ── Card position: outer tracks dot, inner handles visual offset ──────────
    const positionCard = (id: string, px: number, py: number) => {
      const outer = cardOuterRefs.current.get(id)
      if (!outer) return

      outer.style.left = `${(px / 600 * 100).toFixed(2)}%`
      outer.style.top  = `${(py / 600 * 100).toFixed(2)}%`

      const newSide: CardSide = id === 'london' ? 'below' : px > 300 ? 'right' : 'left'
      const prevSide = cardSideRef.current.get(id)
      if (newSide !== prevSide) {
        cardSideRef.current.set(id, newSide)
        const inner = cardInnerRefs.current.get(id)
        const conn  = connectorRefs.current.get(id)
        if (inner) {
          inner.style.flexDirection =
            newSide === 'below' ? 'column' : newSide === 'left' ? 'row-reverse' : 'row'
          const show = cardVisibleRef.current.get(id) ?? false
          inner.style.transform = show
            ? CARD_BASE[newSide]
            : CARD_BASE[newSide] + CARD_SLIDE[newSide]
        }
        if (conn) {
          if (newSide === 'below') {
            conn.style.width  = '1px'
            conn.style.height = '10px'
            conn.style.transformOrigin = 'top center'
          } else {
            conn.style.width  = '10px'
            conn.style.height = '1px'
            conn.style.transformOrigin = newSide === 'left' ? 'right center' : 'left center'
          }
        }
      }
    }

    // ── Show / hide a card ────────────────────────────────────────────────────
    const setCardVisible = (id: string, show: boolean) => {
      const wasVisible = cardVisibleRef.current.get(id) ?? false
      if (show === wasVisible) return
      cardVisibleRef.current.set(id, show)

      // Snap position before showing so the card doesn't slide from wrong coords
      if (show) {
        const city = CITIES.find(c => c.id === id)
        if (city) {
          const projected = proj([city.lon, city.lat])
          if (projected) positionCard(id, projected[0], projected[1])
        }
      }

      const inner = cardInnerRefs.current.get(id)
      if (!inner) return
      const side = cardSideRef.current.get(id) ?? 'right'
      inner.style.opacity   = show ? '1' : '0'
      inner.style.transform = show
        ? CARD_BASE[side]
        : CARD_BASE[side] + CARD_SLIDE[side]
    }

    // ── CSS transform (tilt + mouse parallax only — rotYBase feeds D3, not CSS) ─
    const applyTransform = () => {
      const rX = tiltX.current + mouseY.current
      globeDiv.style.transform =
        `perspective(1200px) rotateX(${rX.toFixed(3)}deg) rotateY(${mouseX.current.toFixed(3)}deg) translateX(${tx.current.toFixed(2)}px)`
    }

    // ── RAF tick ──────────────────────────────────────────────────────────────
    const tick = () => {
      rotYBase.current += 0.15
      tiltX.current  = lerp(tiltX.current,  tiltXTgt.current,  0.08)
      tx.current     = lerp(tx.current,     txTgt.current,     0.08)
      mouseX.current = lerp(mouseX.current, mouseXTgt.current, 0.05)
      mouseY.current = lerp(mouseY.current, mouseYTgt.current, 0.05)

      const phi = -20 + tiltX.current * 0.3
      proj.rotate([-rotYBase.current, phi, 0])

      renderGlobe()
      updateDotPositions()
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

    // ── City node reveal (scroll-driven) ──────────────────────────────────────
    const updateCityNodes = (p: number) => {
      if (reduceMotion) {
        CITIES.forEach(city => {
          const dot   = dotRefs.current.get(city.id)
          const label = labelRefs.current.get(city.id)
          if (dot)  { dot.style.opacity = '0.8'; dot.style.filter = 'none' }
          if (label) label.style.opacity = '1'
          if (city.id !== 'london') drawnLines.current.add(city.id)
        })
        const finaleDiv = finaleRef.current
        if (finaleDiv) {
          finaleDiv.style.transition = 'none'
          finaleDiv.style.opacity    = '1'
          finaleDiv.style.transform  = 'translateY(-50%)'
        }
        CARD_IDS.forEach(id => setCardVisible(id, true))
        return
      }

      const isFinale = p >= 0.82

      // Background cities
      CITIES.forEach(city => {
        if (!BG_CITY_IDS.has(city.id)) return
        const dot = dotRefs.current.get(city.id)
        if (dot) {
          dot.style.opacity = isFinale
            ? '0.8'
            : p < 0.05 ? String((p / 0.05) * 0.3) : '0.3'
        }
        if (p >= 0.05 && !drawnLines.current.has(city.id)) drawnLines.current.add(city.id)
      })

      // Featured cities
      REVEAL_STAGES.forEach(({ id, enter, exit }) => {
        const isActive = p >= enter && p < exit
        const isPast   = p >= exit
        const dot      = dotRefs.current.get(id)
        const label    = labelRefs.current.get(id)
        const baseR    = CITIES.find(c => c.id === id)!.r

        if (dot) {
          if (isFinale) {
            dot.style.opacity = '1'
            dot.style.filter  = 'drop-shadow(0 0 5px rgba(214,53,69,0.65))'
            dot.setAttribute('r', String(baseR))
          } else if (isActive) {
            dot.style.opacity = '1'
            dot.style.filter  = 'none'
            dot.setAttribute('r', (baseR * 1.7).toFixed(1))
          } else if (isPast) {
            dot.style.opacity = '0.45'
            dot.style.filter  = 'none'
            dot.setAttribute('r', String(baseR))
          } else {
            dot.style.opacity = p > 0 ? '0.15' : '0'
            dot.style.filter  = 'none'
            dot.setAttribute('r', String(baseR))
          }
        }

        if (label) label.style.opacity = (isFinale || isPast || isActive) ? '1' : '0'
        if ((isActive || isPast || isFinale) && !drawnLines.current.has(id)) drawnLines.current.add(id)
      })

      // Cards — hidden by default, show on scroll window OR hover
      CARD_IDS.forEach(id => {
        const isScrollActive = REVEAL_STAGES.some(s => s.id === id && p >= s.enter && p < s.exit)
        const isHovered      = hoveredCity.current === id
        setCardVisible(id, isScrollActive || isHovered)
      })

      // Finale tagline
      const finaleDiv = finaleRef.current
      if (finaleDiv) {
        finaleDiv.style.opacity   = isFinale ? '1' : '0'
        finaleDiv.style.transform = isFinale
          ? 'translateY(-50%)'
          : 'translateY(calc(-50% + 14px))'
      }

      // Progress thread
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

    // ── Initial render ────────────────────────────────────────────────────────
    proj.rotate([0, -20, 0])
    renderGlobe()
    updateDotPositions()
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

    // ── Mouse parallax (desktop only) ─────────────────────────────────────────
    let mouseRafId = 0
    if (hasHover && !reduceMotion) {
      const onMouseMove = (e: MouseEvent) => {
        if (mouseRafId) return
        mouseRafId = requestAnimationFrame(() => {
          mouseRafId = 0
          const rect = section.getBoundingClientRect()
          mouseXTgt.current = ((e.clientX - rect.left) / rect.width  * 2 - 1) * 12
          mouseYTgt.current = ((e.clientY - rect.top)  / rect.height * 2 - 1) * 8
        })
      }
      const onMouseLeave = () => { mouseXTgt.current = 0; mouseYTgt.current = 0 }
      section.addEventListener('mousemove', onMouseMove)
      section.addEventListener('mouseleave', onMouseLeave)
    }

    // ── Hover detection on city dots ──────────────────────────────────────────
    const onPointerMove = (e: PointerEvent) => {
      const svgEl = svgOverlayRef.current
      if (!svgEl) return
      const ctm = svgEl.getScreenCTM()
      if (!ctm) return
      const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())

      let closest: string | null = null
      let minDist = 18
      CITIES.forEach(city => {
        const dot = dotRefs.current.get(city.id)
        if (!dot || dot.style.visibility === 'hidden') return
        const cx = parseFloat(dot.getAttribute('cx') || '0')
        const cy = parseFloat(dot.getAttribute('cy') || '0')
        const d = Math.hypot(pt.x - cx, pt.y - cy)
        if (d < minDist) { minDist = d; closest = city.id }
      })
      // also check london pulse group
      if (londonPulseRef.current) {
        const transform = londonPulseRef.current.getAttribute('transform') || 'translate(300, 300)'
        const match = transform.match(/translate\(([\d.]+),\s*([\d.]+)\)/)
        if (match) {
          const d = Math.hypot(pt.x - parseFloat(match[1]), pt.y - parseFloat(match[2]))
          if (d < minDist) { closest = 'london' }
        }
      }

      if (closest !== hoveredCity.current) {
        hoveredCity.current = closest
        updateCityNodes(scrollProg.current)
      }
    }

    const onPointerLeave = () => {
      if (hoveredCity.current !== null) {
        hoveredCity.current = null
        updateCityNodes(scrollProg.current)
      }
    }

    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', onPointerLeave)

    return () => {
      stopRaf()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('scroll', onScroll)
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
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
        {/* Globe container — receives CSS 3D tilt + mouse parallax */}
        <div
          style={{
            width: 'min(88vw, 88vh)', height: 'min(88vw, 88vh)',
            position: 'relative',
            animation: 'globeIn 0.9s cubic-bezier(0.23,1,0.32,1) both',
          }}
        >
          <div
            ref={globeWrapRef}
            style={{
              width: '100%', height: '100%',
              position: 'relative',
              willChange: 'transform',
              transformOrigin: 'center center',
            }}
          >
            {/* Canvas — D3 renders land, graticule, connection lines */}
            <canvas
              ref={canvasRef}
              aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />

            {/* SVG overlay — city dots, labels, London pulse */}
            <svg
              ref={svgOverlayRef}
              viewBox="0 0 600 600"
              role="img"
              aria-label="Globe showing Kelriva AI's global reach from London to major financial hubs"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
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

              {/* Ambient glow around London */}
              <circle cx={300} cy={300} r={70} fill="url(#londonGlow)" />

              {/* London pulse group — translate updated each frame */}
              <g ref={londonPulseRef} transform="translate(300, 300)">
                {[1, 2].map(ring => (
                  <circle
                    key={`pulse-ring-${ring}`}
                    cx={0} cy={0} r={10}
                    fill="none" stroke="rgba(214,53,69,0.5)" strokeWidth="1"
                  >
                    <animate attributeName="r"       from="10" to="42" dur="2.8s" begin={`${ring * 1.4}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0"  dur="2.8s" begin={`${ring * 1.4}s`} repeatCount="indefinite" />
                  </circle>
                ))}
                <circle cx={0} cy={0} r={7}   fill="#d63545" />
                <circle cx={0} cy={0} r={3.5} fill="#0d0a08" />
                <circle cx={0} cy={0} r={1.8} fill="#d63545" />
              </g>

              {/* City dots — cx/cy updated each frame via updateDotPositions */}
              {CITIES.filter(c => c.id !== 'london').map(city => (
                <circle
                  key={`dot-${city.id}`}
                  ref={(el: SVGCircleElement | null) => { if (el) dotRefs.current.set(city.id, el) }}
                  cx={300} cy={300} r={city.r}
                  fill="#d63545"
                  fillOpacity="0.65"
                  style={{
                    opacity: 0,
                    transition: 'opacity 0.35s ease, filter 0.3s ease',
                  }}
                />
              ))}

              {/* City labels — x/y updated each frame */}
              {CITIES.filter(c => LABEL_CITY_IDS.has(c.id)).map(city => (
                <text
                  key={`label-${city.id}`}
                  ref={(el: SVGTextElement | null) => { if (el) labelRefs.current.set(city.id, el) }}
                  x={308} y={301}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="rgba(107,85,72,0.6)"
                  fontSize="8"
                  fontFamily="'JetBrains Mono', monospace"
                  letterSpacing="1.5"
                  style={{ textTransform: 'uppercase', opacity: 0, transition: 'opacity 0.4s ease' }}
                >
                  {city.name.toUpperCase()}
                </text>
              ))}

              {/* London label */}
              <text
                x={300} y={284}
                textAnchor="middle"
                fill="rgba(237,229,220,0.55)"
                fontSize="7.5"
                fontFamily="'JetBrains Mono', monospace"
                letterSpacing="2"
                style={{ opacity: 0, animation: 'fadeIn 0.8s ease 1.0s both' }}
              >
                LONDON
              </text>
            </svg>

            {/* Card layer — absolute within globeWrapRef, so cards follow CSS 3D tilt */}
            <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}>
              {Object.entries(CARD_META).map(([id, meta]) => (
                <div
                  key={id}
                  ref={(el: HTMLDivElement | null) => { if (el) cardOuterRefs.current.set(id, el) }}
                  style={{ position: 'absolute', left: '50%', top: '50%' }}
                >
                  <div
                    ref={(el: HTMLDivElement | null) => { if (el) cardInnerRefs.current.set(id, el) }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      opacity: 0,
                      transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.23,1,0.32,1)',
                      transform: CARD_BASE.right + CARD_SLIDE.right,
                    }}
                  >
                    <div
                      ref={(el: HTMLDivElement | null) => { if (el) connectorRefs.current.set(id, el) }}
                      style={{
                        flexShrink: 0,
                        width: 10, height: 1,
                        background: 'rgba(214,53,69,0.35)',
                        transformOrigin: 'left center',
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
                        {meta.label}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-instrument), sans-serif',
                        fontSize: '.88rem',
                        fontWeight: 600,
                        color: '#ede5dc',
                      }}>
                        {meta.city}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-instrument), sans-serif',
                        fontSize: '.72rem',
                        color: 'rgba(107,85,72,0.75)',
                        marginTop: 2,
                      }}>
                        {meta.detail}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left-edge scroll progress thread + city counter */}
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

        {/* Finale tagline */}
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
