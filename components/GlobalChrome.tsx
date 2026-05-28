'use client'

import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false })
const PageLoader         = dynamic(() => import('@/components/ui/PageLoader'),       { ssr: false })
const CustomCursor       = dynamic(() => import('@/components/ui/CustomCursor'),     { ssr: false })
const ScrollProgress     = dynamic(() => import('@/components/ui/ScrollProgress'),   { ssr: false })

export default function GlobalChrome() {
  return (
    <>
      <ParticleBackground />
      <PageLoader />
      <CustomCursor />
      <ScrollProgress />
    </>
  )
}
