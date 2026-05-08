'use client'

import { useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { motion } from 'framer-motion'
import { KelrivaLaunch } from './VideoComposition'

const DURATION = 360
const FPS      = 30
const W        = 1280
const H        = 720

export default function VideoSection() {
  const playerRef = useRef<PlayerRef>(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const p = playerRef.current
    if (!p) return
    if (playing) {
      p.pause()
      setPlaying(false)
    } else {
      p.play()
      setPlaying(true)
    }
  }

  return (
    <section
      id="showreel"
      style={{
        background: '#03060d',
        padding: '6rem 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Player wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          style={{ position: 'relative', border: '1px solid rgba(214,53,69,.15)' }}
        >
          <Player
            ref={playerRef}
            component={KelrivaLaunch}
            durationInFrames={DURATION}
            fps={FPS}
            compositionWidth={W}
            compositionHeight={H}
            style={{ width: '100%', aspectRatio: `${W}/${H}` }}
            controls={false}
            autoPlay
            loop
            acknowledgeRemotionLicense
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Pause / resume — appears on hover */}
          <div
            onClick={toggle}
            style={{
              position: 'absolute', bottom: 16, right: 16,
              cursor: 'pointer',
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
        </motion.div>
      </div>

      <style>{`
        .showreel-toggle { opacity: 0; }
        section#showreel:hover .showreel-toggle { opacity: 1; }
        @media (max-width: 900px) {
          section#showreel { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}
