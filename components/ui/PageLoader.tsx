'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { checkReducedMotion } from '@/lib/animations'

export default function PageLoader() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3 | 4>(0)
  // 0: black | 1: +grain | 2: +logo | 3: exit | 4: done

  useEffect(() => {
    if (checkReducedMotion()) { setPhase(4); return }

    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 300)
    const t3 = setTimeout(() => setPhase(3), 580)
    const t4 = setTimeout(() => setPhase(4), 980)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  if (phase === 4) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0d0a08',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 3 ? 0 : 1,
        transition: phase === 3 ? 'opacity 400ms cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
        pointerEvents: phase === 3 ? 'none' : 'all',
      }}
    >
      {/* Grain */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          opacity: phase >= 1 ? 0.22 : 0,
          transition: 'opacity 300ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* K mark */}
      <div
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.88)',
          transition: 'opacity 500ms cubic-bezier(0.23, 1, 0.32, 1), transform 500ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <Image
          src="/mark-kelriva.png"
          alt=""
          width={54}
          height={59}
          priority
        />
      </div>
    </div>
  )
}
