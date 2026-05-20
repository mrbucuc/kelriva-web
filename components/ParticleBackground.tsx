'use client'

import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    let W = 0, H = 0

    const resize = () => {
      W = cv.width  = window.innerWidth
      H = cv.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Node config ──────────────────────────────────────────────────────────
    const LINK_DIST  = 210
    const MOUSE_DIST = 240

    type Node = {
      x: number; y: number
      vx: number; vy: number
      r: number
      o: number
      hub: boolean
      phase: number
      speed: number
    }

    const makeNode = (hub: boolean): Node => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - .5) * (hub ? .18 : .32),
      vy:    (Math.random() - .5) * (hub ? .18 : .32),
      r:     hub ? Math.random() * 3.5 + 3.5 : Math.random() * 2 + .8,
      o:     hub ? Math.random() * .28 + .68  : Math.random() * .48 + .22,
      hub,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * .9 + .5,
    })

    const nodes: Node[] = [
      ...Array.from({ length: 130 }, () => makeNode(false)),
      ...Array.from({ length: 18  }, () => makeNode(true)),
    ]

    let mX = -999, mY = -999
    let scrollY = 0

    const onMouse      = (e: MouseEvent) => { mX = e.clientX; mY = e.clientY }
    const onMouseLeave = ()               => { mX = -999; mY = -999 }
    const onScroll     = ()               => { scrollY = window.scrollY }
    const onTouch      = (e: TouchEvent) => {
      if (e.touches.length > 0) { mX = e.touches[0].clientX; mY = e.touches[0].clientY }
    }
    const onTouchEnd   = () => { mX = -999; mY = -999 }

    window.addEventListener('mousemove',  onMouse)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('scroll',     onScroll, { passive: true })
    window.addEventListener('touchmove',  onTouch,  { passive: true })
    window.addEventListener('touchend',   onTouchEnd)

    // ── Draw helpers ─────────────────────────────────────────────────────────
    const drawGlowDot = (x: number, y: number, r: number, alpha: number, hub: boolean) => {
      // Soft outer halo
      const haloR     = hub ? r * 6.5 : r * 5
      const haloAlpha = hub ? alpha * .24 : alpha * .12
      const grad = ctx.createRadialGradient(x, y, 0, x, y, haloR)
      grad.addColorStop(0,   `rgba(214,53,69,${Math.min(haloAlpha * 3.2, 1)})`)
      grad.addColorStop(.35, `rgba(214,53,69,${haloAlpha})`)
      grad.addColorStop(1,   'rgba(214,53,69,0)')
      ctx.beginPath()
      ctx.arc(x, y, haloR, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Bright core
      ctx.save()
      ctx.shadowColor = hub ? '#ff1122' : '#d63545'
      ctx.shadowBlur  = hub ? 24 : 14
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${hub ? '255,55,65' : '220,60,75'},${alpha})`
      ctx.fill()

      // Extra bloom pass on hubs
      if (hub) {
        ctx.shadowBlur  = 44
        ctx.shadowColor = 'rgba(214,53,69,.75)'
        ctx.beginPath()
        ctx.arc(x, y, r * .52, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,115,125,${alpha * .95})`
        ctx.fill()
      }
      ctx.restore()
    }

    // ── Render loop ──────────────────────────────────────────────────────────
    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const t      = Date.now() * .001
      const offset = scrollY * .28   // parallax: particles drift upward as page scrolls

      // Move nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0) { n.x = 0; n.vx *= -1 }
        if (n.x > W) { n.x = W; n.vx *= -1 }
        if (n.y < 0) { n.y = 0; n.vy *= -1 }
        if (n.y > H) { n.y = H; n.vy *= -1 }
      })

      // Connections
      ctx.save()
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const ax = a.x, ay = a.y - offset
          const bx = b.x, by = b.y - offset
          const dx = ax - bx, dy = ay - by
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            const fade      = 1 - d / LINK_DIST
            const isHubLink = a.hub || b.hub
            ctx.beginPath()
            ctx.strokeStyle = `rgba(214,53,69,${fade * (isHubLink ? .48 : .24)})`
            ctx.lineWidth   = fade * (isHubLink ? 1.5 : .85)
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.stroke()
          }
        }
      }
      ctx.restore()

      // Mouse connections
      if (mX > 0) {
        ctx.save()
        nodes.forEach(n => {
          const ny = n.y - offset
          const dx = n.x - mX, dy = ny - mY
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < MOUSE_DIST) {
            const al = (1 - d / MOUSE_DIST) * .7
            ctx.beginPath()
            ctx.strokeStyle = `rgba(214,53,69,${al})`
            ctx.lineWidth   = (1 - d / MOUSE_DIST) * 1.6
            ctx.moveTo(n.x, ny)
            ctx.lineTo(mX, mY)
            ctx.stroke()
          }
        })
        ctx.restore()
        // Cursor node
        drawGlowDot(mX, mY, 4, .85, true)
      }

      // Regular nodes (drawn first, behind hubs)
      nodes.filter(n => !n.hub).forEach(n => {
        // Two independent sine waves: one for size, one for brightness
        const sizePulse   = Math.sin(t * n.speed        + n.phase) * .38 + .82
        const brightPulse = Math.sin(t * n.speed * .65  + n.phase + 1.2) * .28 + .85
        drawGlowDot(n.x, n.y - offset, n.r * sizePulse, n.o * brightPulse, false)
      })

      // Hub nodes (on top)
      nodes.filter(n => n.hub).forEach(n => {
        const sizePulse   = Math.sin(t * n.speed       + n.phase) * .38 + .88
        const brightPulse = Math.sin(t * n.speed * .55 + n.phase + 2.1) * .32 + .88
        drawGlowDot(n.x, n.y - offset, n.r * sizePulse, n.o * brightPulse, true)
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize',     resize)
      window.removeEventListener('mousemove',  onMouse)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('scroll',     onScroll)
      window.removeEventListener('touchmove',  onTouch)
      window.removeEventListener('touchend',   onTouchEnd)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100%',
        height:        '100%',
        zIndex:        0,
        pointerEvents: 'none',
      }}
    />
  )
}
