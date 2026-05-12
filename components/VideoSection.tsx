'use client'

import { useState, useRef } from 'react'

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else          { v.play();  setPlaying(true)  }
  }

  return (
    <section
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#0d0a08',
      }}
    >
      <video
        ref={videoRef}
        src="/kelriva-launch.mp4"
        poster="/og-image.png"
        preload="none"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'max(100vw, calc(100vh * 1.7778))',
          height: 'max(100vh, calc(100vw * 0.5625))',
          objectFit: 'cover',
        }}
      />

      {/* Pause / play — bottom-right, appears on hover */}
      <div
        onClick={toggle}
        style={{
          position: 'absolute', bottom: 24, right: 24,
          cursor: 'pointer', zIndex: 10,
          transition: 'opacity .2s',
        }}
        className="showreel-toggle"
      >
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
      `}</style>
    </section>
  )
}
