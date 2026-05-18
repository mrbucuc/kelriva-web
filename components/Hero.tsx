'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface HeroProps {
  onBookCall: () => void
}
export default function Hero({ onBookCall }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!
    let W = 0, H = 0

    const resize = () => {
      W = cv.width  = cv.offsetWidth
      H = cv.height = cv.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Node types ───────────────────────────────────────────────────────────
    // Regular nodes: many small-medium glowing dots
    // Hub nodes: fewer large bright anchor points (like the bright clusters in the image)
    const LINK_DIST   = 200
    const MOUSE_DIST  = 220

    type Node = {
      x: number; y: number
      vx: number; vy: number
      r: number          // base radius
      o: number          // base opacity
      hub: boolean       // large bright node?
      phase: number      // for pulse animation
      speed: number      // pulse speed
    }

    const makeNode = (hub: boolean): Node => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - .5) * (hub ? .15 : .28),
      vy:    (Math.random() - .5) * (hub ? .15 : .28),
      r:     hub ? Math.random() * 3 + 3   : Math.random() * 1.8 + .6,
      o:     hub ? Math.random() * .35 + .55 : Math.random() * .45 + .12,
      hub,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * .8 + .4,
    })

    const nodes: Node[] = [
      ...Array.from({ length: 110 }, () => makeNode(false)),
      ...Array.from({ length: 14  }, () => makeNode(true)),
    ]

    let mX = -999, mY = -999
    const onMouse = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect()
      mX = e.clientX - r.left
      mY = e.clientY - r.top
    }
    const onMouseLeave = () => { mX = -999; mY = -999 }
    cv.addEventListener('mousemove', onMouse)
    cv.addEventListener('mouseleave', onMouseLeave)

    // ── Draw helpers ─────────────────────────────────────────────────────────
    const drawGlowDot = (x: number, y: number, r: number, alpha: number, hub: boolean) => {
      // Outer soft halo
      const haloR = hub ? r * 5.5 : r * 4
      const haloAlpha = hub ? alpha * .18 : alpha * .08
      const grad = ctx.createRadialGradient(x, y, 0, x, y, haloR)
      grad.addColorStop(0,   `rgba(214,53,69,${haloAlpha * 2.5})`)
      grad.addColorStop(.4,  `rgba(214,53,69,${haloAlpha})`)
      grad.addColorStop(1,   'rgba(214,53,69,0)')
      ctx.beginPath()
      ctx.arc(x, y, haloR, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // Inner bright core
      ctx.save()
      ctx.shadowColor  = hub ? '#ff2233' : '#d63545'
      ctx.shadowBlur   = hub ? 18 : 10
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${hub ? '255,60,70' : '214,53,69'},${alpha})`
      ctx.fill()
      // Second pass — extra bloom on hubs
      if (hub) {
        ctx.shadowBlur = 35
        ctx.shadowColor = 'rgba(214,53,69,.6)'
        ctx.beginPath()
        ctx.arc(x, y, r * .6, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,100,110,${alpha * .9})`
        ctx.fill()
      }
      ctx.restore()
    }

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const t = Date.now() * .001

      // ── Move nodes ──────────────────────────────────────────────────────
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0) { n.x = 0; n.vx *= -1 }
        if (n.x > W) { n.x = W; n.vx *= -1 }
        if (n.y < 0) { n.y = 0; n.vy *= -1 }
        if (n.y > H) { n.y = H; n.vy *= -1 }
      })

      // ── Connections between nodes ────────────────────────────────────────
      ctx.save()
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            const fade = 1 - d / LINK_DIST
            const isHubLink = a.hub || b.hub
            const al = fade * (isHubLink ? .38 : .18)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(214,53,69,${al})`
            ctx.lineWidth   = fade * (isHubLink ? 1.2 : .7)
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.restore()

      // ── Mouse connections ────────────────────────────────────────────────
      if (mX > 0) {
        ctx.save()
        nodes.forEach(n => {
          const dx = n.x - mX, dy = n.y - mY
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MOUSE_DIST) {
            const al = (1 - d / MOUSE_DIST) * .55
            ctx.beginPath()
            ctx.strokeStyle = `rgba(214,53,69,${al})`
            ctx.lineWidth = (1 - d / MOUSE_DIST) * 1.2
            ctx.moveTo(n.x, n.y)
            ctx.lineTo(mX, mY)
            ctx.stroke()
          }
        })
        ctx.restore()
        // Cursor node
        drawGlowDot(mX, mY, 3, .7, true)
      }

      // ── Draw nodes (regular first, hubs on top) ──────────────────────────
      nodes.filter(n => !n.hub).forEach(n => {
        const pulse = Math.sin(t * n.speed + n.phase) * .2 + .8
        drawGlowDot(n.x, n.y, n.r * pulse, n.o * pulse, false)
      })
      nodes.filter(n => n.hub).forEach(n => {
        const pulse = Math.sin(t * n.speed + n.phase) * .25 + .85
        drawGlowDot(n.x, n.y, n.r * pulse, n.o, true)
      })

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    // Parallax on scroll
    const onScroll = () => {
      cv.style.transform = `translateY(${window.scrollY * .35}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      cv.removeEventListener('mousemove', onMouse)
      cv.removeEventListener('mouseleave', onMouseLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      id="hero"
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 3rem',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      />

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(to right, rgba(13,10,8,.96) 25%, rgba(13,10,8,.5) 65%, rgba(13,10,8,.75) 100%),
          linear-gradient(to bottom, rgba(13,10,8,.5) 0%, transparent 25%, transparent 72%, rgba(13,10,8,.9) 100%)
        `,
      }} />

      {/* Cinematic bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 58, background: '#0d0a08', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 58, background: '#0d0a08', zIndex: 2 }} />

      {/* Corner brackets */}
      {(['tl','tr','bl','br'] as const).map(pos => (
        <div key={pos} style={{
          position: 'absolute',
          width: 38, height: 38,
          zIndex: 3,
          top:    pos.startsWith('t') ? 72  : undefined,
          bottom: pos.startsWith('b') ? 68  : undefined,
          left:   pos.endsWith('l')   ? '3rem' : undefined,
          right:  pos.endsWith('r')   ? '3rem' : undefined,
          borderTop:    pos.startsWith('t') ? '1px solid #d63545' : undefined,
          borderBottom: pos.startsWith('b') ? '1px solid #d63545' : undefined,
          borderLeft:   pos.endsWith('l')   ? '1px solid #d63545' : undefined,
          borderRight:  pos.endsWith('r')   ? '1px solid #d63545' : undefined,
        }} />
      ))}

      {/* Watermark logo */}
      <div style={{
        position: 'absolute', right: '5%', top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 2, opacity: .04, pointerEvents: 'none',
      }}>
        <Image src="/lockup-white.png" alt="Kelriva AI" aria-hidden width={320} height={200} style={{ width: 320, height: 'auto' }} />   
      </div>
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 3, maxWidth: 780 }}>
        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.68rem',
          color: '#d63545',
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          marginBottom: '1.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.75rem',
          opacity: 0,
          animation: 'fadeUp 1s ease .3s forwards',
        }}>
          <span style={{ display: 'block', width: 44, height: 1, background: 'linear-gradient(90deg,transparent,#d63545)' }} />
          London, UK
          <span style={{ opacity: .4 }}>·</span>
          Est. 2026
          <span style={{ animation: 'blink 1.2s step-end infinite' }}>_</span>
        </div>

        {/* H1 */}
        <h1 style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
          color: '#ffffff',
          lineHeight: .96,
          letterSpacing: '-.02em',
          marginBottom: '.4rem',
          opacity: 0,
          animation: 'fadeUp 1.1s ease .5s forwards',
        }}>
          <span>From data</span><br />
          <span>to decision.</span>
        </h1>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-instrument), sans-serif',
          fontStyle: 'normal',
          fontWeight: 800,
          fontSize: 'clamp(3rem, 6vw, 5.8rem)',
          letterSpacing: '-.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(214,53,69,.55)',
          opacity: 0,
          animation: 'fadeUp 1.1s ease .7s forwards',
          marginBottom: '1.65rem',
        }}>
          Instantly.
        </span>

        <p style={{
          fontSize: '1.05rem',
          color: 'rgba(237,229,220,.7)',
          maxWidth: 480,
          lineHeight: 1.8,
          marginBottom: '3rem',
          opacity: 0,
          animation: 'fadeUp 1s ease .9s forwards',
        }}>
          We build <strong style={{ color: '#ede5dc', fontWeight: 500 }}>AI systems</strong> that process
          documents, automate workflows, and surface intelligence —{' '}
          <strong style={{ color: '#ede5dc', fontWeight: 500 }}>delivered in weeks, not months.</strong>
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap',
          opacity: 0, animation: 'fadeUp 1s ease 1.1s forwards',
        }}>
          <button
            onClick={onBookCall}
            style={{
              background: '#d63545', color: '#0d0a08',
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 700, fontSize: '.82rem',
              letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '1rem 2.4rem', border: 'none',
              cursor: 'pointer',
              transition: 'transform .16s cubic-bezier(0.23,1,0.32,1)',
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          >
            Book a discovery call
          </button>

          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent', color: '#ede5dc',
              fontFamily: 'var(--font-instrument), sans-serif',
              fontWeight: 500, fontSize: '.82rem',
              letterSpacing: '.1em', textTransform: 'uppercase',
              padding: '1rem 2rem',
              border: '1px solid rgba(237,229,220,.15)',
              cursor: 'pointer',
              transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d63545'
              e.currentTarget.style.color = '#d63545'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(237,229,220,.15)'
              e.currentTarget.style.color = '#ede5dc'
            }}
            onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
            onMouseUp={e => { e.currentTarget.style.transform = 'none' }}
          >
            See what we build →
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 78, left: '3rem', zIndex: 3,
        display: 'flex', alignItems: 'center', gap: '.75rem',
        opacity: 0, animation: 'fadeIn 1s ease 2s forwards',
      }}>
        <div style={{
          width: 40, height: 1,
          background: 'linear-gradient(90deg,#d63545,transparent)',
          animation: 'scrollLine 2.2s ease infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.6rem', color: '#6b5548',
          letterSpacing: '.2em', textTransform: 'uppercase',
        }}>Scroll to explore</span>
      </div>

      {/* Stats */}
      <div style={{
        position: 'absolute', right: '3rem', bottom: 78, zIndex: 3,
        display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'right',
        opacity: 0, animation: 'fadeUp 1s ease 1.5s forwards',
      }} className="hero-stats">
        {[
          { n: '£1.17B', l: 'UK Gov AI spend' },
          { n: '48h',    l: 'Proposal turnaround' },
          { n: '100%',   l: 'Fixed-fee delivery' },
        ].map(({ n, l }) => (
          <div key={l}>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '1.65rem', color: '#d63545', fontWeight: 400,
              lineHeight: 1, display: 'block',
            }}>{n}</span>
            <span style={{
              fontSize: '.66rem', color: '#6b5548',
              letterSpacing: '.1em', textTransform: 'uppercase',
            }}>{l}</span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-stats { display: none !important; }
          section#hero { padding: 0 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}
