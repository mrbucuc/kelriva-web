'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function VideoSection() {
  const videoRef  = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying]   = useState(true)
  const [ready,   setReady]     = useState(false)  // true once video can play

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onCanPlay = () => setReady(true)
    v.addEventListener('canplay', onCanPlay)
    // If already ready (cached)
    if (v.readyState >= 3) setReady(true)
    return () => v.removeEventListener('canplay', onCanPlay)
  }, [])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else          { v.play();  setPlaying(true)  }
  }

  return (
    <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', background: '#0d0a08' }}>

      {/* ── Animated placeholder — shown until video is ready ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        opacity: ready ? 0 : 1,
        transition: 'opacity .8s ease',
        pointerEvents: ready ? 'none' : 'auto',
        background: '#0d0a08',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0,
      }}>
        {/* Animated scan line */}
        <div className="scan-line" />

        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map(pos => (
          <div key={pos} style={{
            position: 'absolute',
            width: 40, height: 40,
            top:    pos.startsWith('t') ? 60  : undefined,
            bottom: pos.startsWith('b') ? 60  : undefined,
            left:   pos.endsWith('l')   ? 60  : undefined,
            right:  pos.endsWith('r')   ? 60  : undefined,
            borderTop:    pos.startsWith('t') ? '1px solid rgba(214,53,69,.5)' : undefined,
            borderBottom: pos.startsWith('b') ? '1px solid rgba(214,53,69,.5)' : undefined,
            borderLeft:   pos.endsWith('l')   ? '1px solid rgba(214,53,69,.5)' : undefined,
            borderRight:  pos.endsWith('r')   ? '1px solid rgba(214,53,69,.5)' : undefined,
            animation: 'bracketIn .6s ease forwards',
            opacity: 0,
          }} />
        ))}

        {/* Logo pulse */}
        <div style={{ animation: 'logoPulse 2s ease infinite', marginBottom: 28 }}>
          <Image src="/mark-kelriva.png" alt="" width={68} height={74} />
        </div>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.65rem', color: '#d63545',
          letterSpacing: '.28em', textTransform: 'uppercase',
          animation: 'fadeUp .8s ease .3s forwards', opacity: 0,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ display:'block', width:32, height:1, background:'linear-gradient(90deg,transparent,#d63545)' }} />
          Kelriva AI · London
          <span style={{ display:'block', width:32, height:1, background:'linear-gradient(90deg,#d63545,transparent)' }} />
        </div>

        {/* Loading bar */}
        <div style={{
          marginTop: 32, width: 180, height: 1,
          background: 'rgba(214,53,69,.15)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div className="load-bar" />
        </div>

        {/* Status text */}
        <div style={{
          marginTop: 12,
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.58rem', color: '#6b5548',
          letterSpacing: '.2em', textTransform: 'uppercase',
          animation: 'blink 1.2s step-end infinite',
        }}>Initialising_</div>
      </div>

      {/* ── Video ── */}
      <video
        ref={videoRef}
        src="/kelriva-launch.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width:  'max(100vw, calc(100vh * 1.7778))',
          height: 'max(100vh, calc(100vw * 0.5625))',
          objectFit: 'cover',
          zIndex: 1,
          opacity: ready ? 1 : 0,
          transition: 'opacity .8s ease',
        }}
      />

      {/* Pause / play */}
      <div onClick={toggle} style={{
        position: 'absolute', bottom: 24, right: 24,
        cursor: 'pointer', zIndex: 10, transition: 'opacity .2s',
      }} className="showreel-toggle">
        <div style={{
          width: 36, height: 36,
          border: '1px solid rgba(214,53,69,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(13,10,8,.7)',
        }}>
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="1" width="4" height="12" fill="#d63545" />
              <rect x="8" y="1" width="4" height="12" fill="#d63545" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 1.5v11L13 7 3 1.5z" fill="#d63545" />
            </svg>
          )}
        </div>
      </div>

      <style>{`
        .showreel-toggle { opacity: 0; }
        section:hover .showreel-toggle { opacity: 1; }

        @keyframes logoPulse {
          0%,100% { opacity: .55; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.06); }
        }
        @keyframes bracketIn {
          from { opacity: 0; transform: scale(1.08); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .load-bar {
          position: absolute; top: 0; left: -60%;
          width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, #d63545, transparent);
          animation: loadSlide 1.4s ease infinite;
        }
        @keyframes loadSlide {
          from { left: -60%; }
          to   { left: 160%; }
        }
        .scan-line {
          position: absolute; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(214,53,69,.4) 30%, rgba(214,53,69,.7) 50%, rgba(214,53,69,.4) 70%, transparent 100%);
          animation: scanDown 2.4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes scanDown {
          0%   { top: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </section>
  )
}
