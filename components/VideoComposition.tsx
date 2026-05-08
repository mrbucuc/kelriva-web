import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,


  Easing,
} from 'remotion'

// ─── helpers ────────────────────────────────────────────────────────────────

const ROSE   = '#d63545'
const DARK   = '#0d0a08'
const MUTED  = '#6b5548'

function ease(frame: number, start: number, end: number, from: number, to: number, easing = Easing.out(Easing.cubic)) {
  return interpolate(frame, [start, end], [from, to], {
    easing,
    extrapolateLeft:  'clamp',
    extrapolateRight: 'clamp',
  })
}

// ─── sub-components ─────────────────────────────────────────────────────────

/** Diagonal rose sweep that flashes across the frame */
function RoseSweep({ startFrame }: { startFrame: number }) {
  const frame = useCurrentFrame()
  const { width } = useVideoConfig()
  if (frame < startFrame || frame > startFrame + 22) return null
  const progress = ease(frame, startFrame, startFrame + 22, -width * 0.1, width * 1.2, Easing.inOut(Easing.cubic))
  const opacity  = ease(frame, startFrame, startFrame + 11, 0, 0.85)
                 * ease(frame, startFrame + 11, startFrame + 22, 1, 0)
  return (
    <div style={{
      position: 'absolute', inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 5,
    }}>
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: progress,
        width: width * 0.22,
        background: ROSE,
        opacity,
        transform: 'skewX(-18deg)',
        transformOrigin: 'top left',
      }} />
    </div>
  )
}



// ─── main composition ────────────────────────────────────────────────────────

export const KelrivaLaunch: React.FC = () => {
  const frame = useCurrentFrame()
  useVideoConfig()

  const SCENE_1_END   = 80
  const SCENE_2_END   = 180
  const SCENE_3_END   = 270
  // Scene 4: 270–360

  // Cross-fade opacities
  const scene1Op = interpolate(frame, [SCENE_1_END - 12, SCENE_1_END], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const scene2Op = interpolate(frame,
    [SCENE_1_END - 12, SCENE_1_END, SCENE_2_END - 12, SCENE_2_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const scene3Op = interpolate(frame,
    [SCENE_2_END - 12, SCENE_2_END, SCENE_3_END - 12, SCENE_3_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const scene4Op = interpolate(frame,
    [SCENE_3_END - 12, SCENE_3_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Frame offsets for each scene
  const f1 = frame
  const f2 = frame - SCENE_1_END
  const f3 = frame - SCENE_2_END
  const f4 = frame - SCENE_3_END

  const sweepFrame = 62 // rose sweep during scene transition 1→2

  return (
    <AbsoluteFill style={{ background: DARK, overflow: 'hidden' }}>
      {/* Scene 1 */}
      <AbsoluteFill style={{ opacity: scene1Op }}>
        <SceneOpenWithFrame frame={f1} />
      </AbsoluteFill>

      {/* Scene 2 */}
      <AbsoluteFill style={{ opacity: scene2Op }}>
        <SceneStatsWithFrame frame={f2} />
      </AbsoluteFill>

      {/* Scene 3 */}
      <AbsoluteFill style={{ opacity: scene3Op }}>
        <SceneServicesWithFrame frame={f3} />
      </AbsoluteFill>

      {/* Scene 4 */}
      <AbsoluteFill style={{ opacity: scene4Op }}>
        <SceneEndWithFrame frame={f4} />
      </AbsoluteFill>

      {/* Rose sweep on every scene transition */}
      <RoseSweep startFrame={sweepFrame} />
      <RoseSweep startFrame={SCENE_2_END - 8} />
      <RoseSweep startFrame={SCENE_3_END - 8} />

      {/* Cinematic bars always on top */}
      <CinematicBarsStatic />
    </AbsoluteFill>
  )
}

// ── frame-injected wrappers (so sub-scenes use a local "frame" prop) ─────────

function SceneOpenWithFrame({ frame }: { frame: number }) {
  const { fps } = useVideoConfig()

  const markScale = spring({ frame, fps, from: 0.82, to: 1, config: { damping: 14, mass: 0.8 } })
  const markOp    = ease(frame, 8, 28, 0, 1)
  const eyebrowOp = ease(frame, 28, 44, 0, 1)
  const eyebrowY  = ease(frame, 28, 44, 12, 0)
  const taglineOp = ease(frame, 38, 56, 0, 1)
  const taglineY  = ease(frame, 38, 56, 18, 0)
  const subOp     = ease(frame, 52, 68, 0, 1)
  const subY      = ease(frame, 52, 68, 12, 0)

  const lineScale = ease(frame, 28, 50, 0, 1, Easing.out(Easing.cubic))

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ opacity: markOp, transform: `scale(${markScale})`, marginBottom: 32 }}>
        <img src={'/mark-white.png'} style={{ width: 72, height: 'auto', display: 'block' }} />
      </div>

      <div style={{
        opacity: eyebrowOp,
        transform: `translateY(${eyebrowY}px)`,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11, color: ROSE,
        letterSpacing: '0.28em', textTransform: 'uppercase',
        marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 36, height: 1, background: ROSE, transform: `scaleX(${lineScale})`, transformOrigin: 'right' }} />
        kelriva.ai · London, UK · Est. 2026
        <div style={{ width: 36, height: 1, background: ROSE, transform: `scaleX(${lineScale})`, transformOrigin: 'left' }} />
      </div>

      <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)`, textAlign: 'center' }}>
        <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 82, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
          From data
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 82, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 8 }}>
          to decision.
        </div>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: 72, letterSpacing: '-0.04em', color: 'transparent', WebkitTextStroke: `1.5px ${ROSE}`, lineHeight: 1.1 }}>
          Instantly.
        </div>
      </div>

      <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, fontFamily: 'system-ui, sans-serif', fontSize: 14, color: MUTED, letterSpacing: '0.06em', marginTop: 28, textAlign: 'center' }}>
        B2B AI Consultancy · IDP · Agentic Automation · Data Intelligence
      </div>
    </AbsoluteFill>
  )
}

function SceneStatsWithFrame({ frame }: { frame: number }) {
  const bgOp = ease(frame, 0, 20, 0, 1)
  const eyeOp = ease(frame, 0, 18, 0, 1)

  const STATS = [
    { value: '2',      label: 'Live production\nAI systems' },
    { value: '£1.17B', label: 'UK Gov AI\nspend 2025'       },
    { value: '48h',    label: 'Proposal\nturnaround'        },
    { value: '100%',   label: 'Fixed-fee\ndelivery'         },
  ]

  return (
    <AbsoluteFill style={{ background: '#03060d', opacity: bgOp, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 48 }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'system-ui, sans-serif', fontWeight: 800, fontSize: 220, color: 'rgba(214,53,69,0.03)', letterSpacing: '-0.04em' }}>KELRIVA</div>
      </div>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: ROSE, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: eyeOp }}>
        // proof of capability
      </div>
      <div style={{ display: 'flex', gap: 80, alignItems: 'center' }}>
        {STATS.map((s, i) => {
          const op = ease(frame, i * 12, i * 12 + 18, 0, 1)
          const y  = ease(frame, i * 12, i * 12 + 18, 16, 0)
          return (
            <div key={s.label} style={{ opacity: op, transform: `translateY(${y}px)`, textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 52, fontWeight: 300, color: '#fff', lineHeight: 1 }}>
                <span style={{ color: ROSE }}>{s.value}</span>
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MUTED, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 8, whiteSpace: 'pre-line' }}>{s.label}</div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

function SceneServicesWithFrame({ frame }: { frame: number }) {
  const SERVICES = [
    { n: '01', title: 'Intelligent Document\nProcessing', color: ROSE },
    { n: '02', title: 'AI Workflow\nAutomation',          color: '#00e09c' },
    { n: '03', title: 'Data Analytics\n& Intelligence',   color: '#f5b642' },
  ]

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 40, padding: '0 80px' }}>
      <div style={{ opacity: ease(frame, 0, 20, 0, 1), transform: `translateY(${ease(frame, 0, 20, 14, 0)}px)`, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: ROSE, letterSpacing: '0.28em', textTransform: 'uppercase' }}>// what we build</div>
      <div style={{ display: 'flex', gap: 2, width: '100%' }}>
        {SERVICES.map((s, i) => {
          const op = ease(frame, i * 14, i * 14 + 26, 0, 1)
          const y  = ease(frame, i * 14, i * 14 + 26, 28, 0)
          const lineW = ease(frame, i * 14 + 20, i * 14 + 44, 0, 100)
          return (
            <div key={s.n} style={{ flex: 1, opacity: op, transform: `translateY(${y}px)`, padding: '36px 32px', background: '#150f09', borderTop: `2px solid ${s.color}` }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: MUTED, letterSpacing: '0.18em', marginBottom: 18 }}>{s.n} /</div>
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontStyle: 'italic', fontSize: 32, fontWeight: 300, color: '#fff', lineHeight: 1.15, whiteSpace: 'pre-line' }}>{s.title}</div>
              <div style={{ height: 1, background: s.color, marginTop: 20, width: `${lineW}%` }} />
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

function SceneEndWithFrame({ frame }: { frame: number }) {
  const { fps } = useVideoConfig()
  const lockupScale = spring({ frame, fps, from: 0.88, to: 1, config: { damping: 16, mass: 0.9 } })
  const lockupOp    = ease(frame, 0, 24, 0, 1)
  const lineScale   = ease(frame, 28, 50, 0, 1, Easing.out(Easing.cubic))
  const urlOp       = ease(frame, 28, 46, 0, 1)
  const urlY        = ease(frame, 28, 46, 12, 0)
  const ctaOp       = ease(frame, 42, 60, 0, 1)
  const ctaY        = ease(frame, 42, 60, 10, 0)
  const bracketOp   = ease(frame, 10, 30, 0, 1)

  return (
    <AbsoluteFill style={{ background: DARK, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 32 }}>
      {(['tl','tr','bl','br'] as const).map(pos => (
        <div key={pos} style={{
          position: 'absolute', width: 36, height: 36, opacity: bracketOp,
          top:    pos.startsWith('t') ? 48  : undefined,
          bottom: pos.startsWith('b') ? 48  : undefined,
          left:   pos.endsWith('l')   ? 64  : undefined,
          right:  pos.endsWith('r')   ? 64  : undefined,
          borderTop:    pos.startsWith('t') ? `1px solid ${ROSE}` : undefined,
          borderBottom: pos.startsWith('b') ? `1px solid ${ROSE}` : undefined,
          borderLeft:   pos.endsWith('l')   ? `1px solid ${ROSE}` : undefined,
          borderRight:  pos.endsWith('r')   ? `1px solid ${ROSE}` : undefined,
        }} />
      ))}

      <div style={{ opacity: lockupOp, transform: `scale(${lockupScale})` }}>
        <img src={'/lockup-white.png'} style={{ width: 280, height: 'auto' }} />
      </div>

      <div style={{ opacity: urlOp, transform: `translateY(${urlY}px)`, fontFamily: '"JetBrains Mono", monospace', fontSize: 13, color: MUTED, letterSpacing: '0.2em', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 1, background: ROSE, transform: `scaleX(${lineScale})`, transformOrigin: 'right' }} />
        kelriva.ai
        <div style={{ width: 40, height: 1, background: ROSE, transform: `scaleX(${lineScale})`, transformOrigin: 'left' }} />
      </div>

      <div style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)`, fontFamily: 'system-ui, sans-serif', fontWeight: 700, fontSize: 12, color: DARK, background: ROSE, padding: '12px 36px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        Book a discovery call
      </div>
    </AbsoluteFill>
  )
}

function CinematicBarsStatic() {
  const { height } = useVideoConfig()
  const barH = height * 0.09
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: barH, background: '#000', zIndex: 10 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: barH, background: '#000', zIndex: 10 }} />
    </>
  )
}
