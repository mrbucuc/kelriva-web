'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })
const PageLoader         = dynamic(() => import('@/components/ui/PageLoader'),       { ssr: false })
const CustomCursor       = dynamic(() => import('@/components/ui/CustomCursor'),     { ssr: false })
const ScrollProgress     = dynamic(() => import('@/components/ui/ScrollProgress'),   { ssr: false })

export default function GlobalChrome() {
  // ParticleBackground is heavy canvas work — skip on mobile to preserve TBT
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (min-width: 768px)').matches) return
    setShowParticles(true)
  }, [])

  return (
    <>
      {showParticles && <ParticleBackground />}
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
    </>
  )
}
