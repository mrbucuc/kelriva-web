'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function VideoSection() {
  const videoRef   = useRef<HTMLVideoElement>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const [playing, setPlaying] = useState(true)
  const [ready,   setReady]   = useState(false)

  // ── Video ready state ────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onCanPlay = () => setReady(true)
    v.addEventListener('canplay', onCanPlay)
    if (v.readyState >= 3) setReady(true)
    return () => v.removeEventListener('canplay', onCanPlay)
  }, [])

  // ── Particle canvas — layered IN FRONT of video ──────────────────────────
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')!

    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    type Node = {
      x: number; y: number; vx: number; vy: number
      r: number; o: number; hub: boolean; phase: number; speed: number
    }

    const make = (hub: boolean): Node => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      vx: (Math.random() - .5) * (hub ? .22 : .38),
      vy: (Math.random() - .5) * (hub ? .22 : .38),
      r:  hub ? Math.random() * 3.5 + 4 : Math.random() * 2 + .9,
      o:  hub ? Math.random() * .28 + .68 : Math.random() * .45 + .28,
      hub, phase: Math.random() * Math.PI * 2, speed: Math.random() * .9 + .45,
    })

    const nodes: Node[] = [
      ...Array.from({ length: 95 }, () => make(false)),
      ...Array.from({ length: 14 }, () => make(true)),
    ]

    let mX = -999, mY = -999
    const onMouse = (e: MouseEvent) => {
      const r = cv.getBoundingClientRect(); mX = e.clientX - r.left; mY = e.clientY - r.top
    }
    const onLeave = () => { mX = -999; mY = -999 }
    cv.addEventListener('mousemove', onMouse)
    cv.addEventListener('mouseleave', onLeave)

    const LINK = 200, MD = 235

    const dot = (x: number, y: number, r: number, alpha: number, hub: boolean) => {
      const hR = hub ? r * 7 : r * 5.5
      const hA = hub ? alpha * .26 : alpha * .14
      const g  = ctx.createRadialGradient(x, y, 0, x, y, hR)
      g.addColorStop(0,   `rgba(214,53,69,${Math.min(hA * 3.5, 1)})`)
      g.addColorStop(.38, `rgba(214,53,69,${hA})`)
      g.addColorStop(1,   'rgba(214,53,69,0)')
      ctx.beginPath(); ctx.arc(x, y, hR, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
      ctx.save()
      ctx.shadowColor = hub ? '#ff1020' : '#d63545'
      ctx.shadowBlur  = hub ? 28 : 16
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${hub ? '255,48,58' : '220,58,72'},${alpha})`; ctx.fill()
      if (hub) {
        ctx.shadowBlur = 52; ctx.shadowColor = 'rgba(214,53,69,.8)'
        ctx.beginPath(); ctx.arc(x, y, r * .5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,112,122,${alpha * .95})`; ctx.fill()
      }
      ctx.restore()
    }

    let raf: number
    const draw = () => {
      const W = cv.width, H = cv.height
      ctx.clearRect(0, 0, W, H)
      const t = Date.now() * .001
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0) { n.x = 0; n.vx *= -1 } if (n.x > W) { n.x = W; n.vx *= -1 }
        if (n.y < 0) { n.y = 0; n.vy *= -1 } if (n.y > H) { n.y = H; n.vy *= -1 }
      })
      ctx.save()
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx*dx + dy*dy)
          if (d < LINK) {
            const f = 1 - d/LINK, isHub = a.hub || b.hub
            ctx.beginPath()
            ctx.strokeStyle = `rgba(214,53,69,${f * (isHub ? .58 : .3)})`
            ctx.lineWidth = f * (isHub ? 1.7 : 1)
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      ctx.restore()
      if (mX > 0) {
        ctx.save()
        nodes.forEach(n => {
          const dx = n.x - mX, dy = n.y - mY, d = Math.sqrt(dx*dx + dy*dy)
          if (d < MD) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(214,53,69,${(1-d/MD)*.8})`
            ctx.lineWidth = (1-d/MD) * 2.2
            ctx.moveTo(n.x, n.y); ctx.lineTo(mX, mY); ctx.stroke()
          }
        })
        ctx.restore()
        dot(mX, mY, 4.5, .9, true)
      }
      nodes.forEach(n => {
        const sp = Math.sin(t * n.speed       + n.phase) * .38 + .84
        const bp = Math.sin(t * n.speed * .62 + n.phase + 1.4) * .3 + .88
        dot(n.x, n.y, n.r * sp, n.o * bp, n.hub)
      })
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cv.removeEventListener('mousemove', onMouse)
      cv.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) } else { v.play(); setPlaying(true) }
  }

  return (
    <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#0d0a08' }}>

      {/* Loading placeholder */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        opacity: ready ? 0 : 1, transition: 'opacity .8s ease',
        pointerEvents: ready ? 'none' : 'auto',
        background: '#0d0a08',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="scan-line" />
        {(['tl','tr','bl','br'] as const).map(pos => (
          <div key={pos} style={{
            position: 'absolute', width: 40, height: 40,
            top:    pos.startsWith('t') ? 60 : undefined,
            bottom: pos.startsWith('b') ? 60 : undefined,
            left:   pos.endsWith('l')   ? 60 : undefined,
            right:  pos.endsWith('r')   ? 60 : undefined,
            borderTop:    pos.startsWith('t') ? '1px solid rgba(214,53,69,.5)' : undefined,
            borderBottom: pos.startsWith('b') ? '1px solid rgba(214,53,69,.5)' : undefined,
            borderLeft:   pos.endsWith('l')   ? '1px solid rgba(214,53,69,.5)' : undefined,
            borderRight:  pos.endsWith('r')   ? '1px solid rgba(214,53,69,.5)' : undefined,
            animation: 'bracketIn .6s ease forwards', opacity: 0,
          }} />
        ))}
        <div style={{ animation: 'logoPulse 2s ease infinite', marginBottom: 28 }}>
          <Image src="/mark-kelriva.png" alt="Kelriva AI" width={68} height={74} />
        </div>
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.65rem', color: '#d63545', letterSpacing: '.28em', textTransform: 'uppercase',
          animation: 'fadeUp .8s ease .3s forwards', opacity: 0,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ display:'block', width:32, height:1, background:'linear-gradient(90deg,transparent,#d63545)' }} />
          Kelriva AI · London
          <span style={{ display:'block', width:32, height:1, background:'linear-gradient(90deg,#d63545,transparent)' }} />
        </div>
        <div style={{ marginTop: 32, width: 180, height: 1, background: 'rgba(214,53,69,.15)', position: 'relative', overflow: 'hidden' }}>
          <div className="load-bar" />
        </div>
        <div style={{
          marginTop: 12, fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.58rem', color: '#6b5548', letterSpacing: '.2em', textTransform: 'uppercase',
          animation: 'blink 1.2s step-end infinite',
        }}>Initialising_</div>
      </div>

      {/* Video */}
      <video ref={videoRef} src="/kelriva-launch.mp4" autoPlay muted loop playsInline style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 'max(100vw, calc(100vh * 1.7778))',
        height: 'max(100vh, calc(100vw * 0.5625))',
        objectFit: 'cover', zIndex: 1,
        opacity: ready ? 1 : 0, transition: 'opacity .8s ease',
      }} />

      {/* Particle canvas — IN FRONT of video */}
      <canvas ref={canvasRef} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        zIndex: 6, pointerEvents: 'none',
        opacity: ready ? 1 : 0, transition: 'opacity 1.2s ease .4s',
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 7, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 38%, rgba(13,10,8,.6) 100%)',
      }} />

      {/* Pause/play */}
      <div onClick={toggle} style={{
        position: 'absolute', bottom: 24, right: 24, cursor: 'pointer', zIndex: 10,
      }} className="showreel-toggle">
        <div style={{
          width: 36, height: 36, border: '1px solid rgba(214,53,69,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(13,10,8,.7)',
        }}>
          {playing
            ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="4" height="12" fill="#d63545"/><rect x="8" y="1" width="4" height="12" fill="#d63545"/></svg>
            : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 1.5v11L13 7 3 1.5z" fill="#d63545"/></svg>
          }
        </div>
      </div>

      <style>{`
        .showreel-toggle { opacity:0; transition:opacity .2s; }
        section:hover .showreel-toggle { opacity:1; }
        @keyframes logoPulse { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
        @keyframes bracketIn { from{opacity:0;transform:scale(1.08)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .load-bar { position:absolute;top:0;left:-60%;width:60%;height:100%;background:linear-gradient(90deg,transparent,#d63545,transparent);animation:loadSlide 1.4s ease infinite; }
        @keyframes loadSlide { from{left:-60%} to{left:160%} }
        .scan-line { position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 0%,rgba(214,53,69,.4) 30%,rgba(214,53,69,.7) 50%,rgba(214,53,69,.4) 70%,transparent 100%);animation:scanDown 2.4s ease-in-out infinite;pointer-events:none; }
        @keyframes scanDown { 0%{top:10%;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:90%;opacity:0} }
      `}</style>
    </section>
  )
}
