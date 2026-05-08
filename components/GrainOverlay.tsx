'use client'

import { useEffect, useRef } from 'react'

export default function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    c.width  = 256
    c.height = 256

    const draw = () => {
      const id = ctx.createImageData(256, 256)
      for (let i = 0; i < id.data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        id.data[i] = id.data[i + 1] = id.data[i + 2] = v
        id.data[i + 3] = 255
      }
      ctx.putImageData(id, 0, 0)
    }
    draw()
    const t = setInterval(draw, 80)
    return () => clearInterval(t)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 9990,
        pointerEvents: 'none',
        opacity: 0.032,
        animation: 'grainAnim .1s steps(2) infinite',
      }}
    />
  )
}
