'use client'

import { useRef, useEffect, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { KelrivaLaunch } from './VideoComposition'

const DURATION = 360
const FPS      = 30
const W        = 1280
const H        = 720

export default function VideoSection() {
  const playerRef = useRef<PlayerRef>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    const attempt = () => {
      const p = playerRef.current
      if (!p) return
      p.play()
      setPlaying(true)
    }
    // Try immediately, then retry after a short delay as fallback
    attempt()
    const t = setTimeout(attempt, 300)
    return () => clearTimeout(t)
  }, [])

  const toggle = () => {
    const p = playerRef.current
    if (!p) return
    if (playing) { p.pause(); setPlaying(false) }
    else          { p.play();  setPlaying(true)  }
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
      {/* Scale video to cover the full viewport */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width:  `max(100vw, calc(100vh * ${W / H}))`,
        height: `max(100vh, calc(100vw * ${H / W}))`,
      }}>
        <Player
          ref={playerRef}
          component={KelrivaLaunch}
          durationInFrames={DURATION}
          fps={FPS}
          compositionWidth={W}
          compositionHeight={H}
          style={{ width: '100%', height: '100%' }}
          controls={false}
          autoPlay
          loop
          acknowledgeRemotionLicense
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>

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
