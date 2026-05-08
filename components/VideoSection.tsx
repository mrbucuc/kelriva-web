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
  const [playing, setPlaying] = useState(false)

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.66rem', color: '#d63545',
            letterSpacing: '.22em', textTransform: 'uppercase',
            marginBottom: '.9rem',
            display: 'flex', alignItems: 'center', gap: '.6rem',
          }}
        >
          <span style={{ opacity: .5 }}>//</span> Showreel
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
            fontWeight: 300, fontStyle: 'italic',
            color: '#ffffff', lineHeight: 1.1,
            letterSpacing: '-.02em', marginBottom: '2.5rem',
          }}
        >
          From data to decision.{' '}
          <em>In 12 seconds.</em>
        </motion.h2>

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
            loop
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />

          {/* Custom play overlay */}
          {!playing && (
            <div
              onClick={toggle}
              style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                background: 'rgba(13,10,8,.45)',
                backdropFilter: 'blur(2px)',
                transition: 'background .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(13,10,8,.3)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(13,10,8,.45)')}
            >
              <div style={{
                width: 72, height: 72,
                borderRadius: '50%',
                border: '1px solid rgba(214,53,69,.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(214,53,69,.12)',
                transition: 'transform .16s cubic-bezier(0.23,1,0.32,1), border-color .2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.08)'
                  e.currentTarget.style.borderColor = '#d63545'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.borderColor = 'rgba(214,53,69,.6)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5.14v13.72L19 12 8 5.14z" fill="#d63545" />
                </svg>
              </div>
            </div>
          )}

          {/* Pause button (visible while playing) */}
          {playing && (
            <div
              onClick={toggle}
              style={{
                position: 'absolute', bottom: 16, right: 16,
                cursor: 'pointer', opacity: 0,
                transition: 'opacity .2s',
              }}
              className="pause-btn"
            >
              <div style={{
                width: 36, height: 36,
                border: '1px solid rgba(214,53,69,.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(13,10,8,.7)',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="4" height="12" fill="#d63545" />
                  <rect x="8" y="1" width="4" height="12" fill="#d63545" />
                </svg>
              </div>
            </div>
          )}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.62rem', color: '#6b5548',
            letterSpacing: '.14em', textTransform: 'uppercase',
            marginTop: '1rem', textAlign: 'right',
          }}
        >
          1280 × 720 · 30fps · Built with Remotion
        </motion.p>
      </div>

      <style>{`
        .pause-btn { opacity: 0 !important; }
        section#showreel:hover .pause-btn { opacity: 1 !important; }
        @media (max-width: 900px) {
          section#showreel { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}
