'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import GrainOverlay from '@/components/GrainOverlay'
import Nav from '@/components/Nav'

// GlobeSection uses Framer Motion — split into its own chunk
const GlobeSection = dynamic(() => import('@/components/GlobeSection'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', background: '#0d0a08' }} />,
})

const dark100vh = { height: '100vh',  background: '#0d0a08' } as const
const dark300vh = { height: '300vh',  background: '#100d0b' } as const
const darkAuto  = { minHeight: '60vh', background: '#100d0b' } as const

// Hero — below GlobeSection, defer its JS chunk
const Hero = dynamic(() => import('@/components/Hero'), {
  loading: () => <div style={dark100vh} />,
})

// All below-fold sections — code split
const QuoteStrip          = dynamic(() => import('@/components/QuoteStrip'))
const Services            = dynamic(() => import('@/components/Services'))
const ProofNumbers        = dynamic(() => import('@/components/ProofNumbers'))
const CaseStudies         = dynamic(() => import('@/components/CaseStudies'))
const Process             = dynamic(() => import('@/components/Process'), {
  loading: () => <div style={dark300vh} />,
})
const CapabilitiesSection = dynamic(() => import('@/components/CapabilitiesSection'), {
  loading: () => <div style={dark300vh} />,
})
const AboutSection        = dynamic(() => import('@/components/AboutSection'), {
  loading: () => <div style={darkAuto} />,
})
const CtaSection          = dynamic(() => import('@/components/CtaSection'))
const Footer              = dynamic(() => import('@/components/Footer'))
const ChatWidget          = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

export default function Page() {
  const [chatOpen, setChatOpen] = useState(false)

  const openChat   = () => setChatOpen(true)
  const toggleChat = () => setChatOpen(v => !v)

  return (
    <>
      <GrainOverlay />
      <Nav onBookCall={openChat} />
      <GlobeSection />
      <Hero onBookCall={openChat} />
      <QuoteStrip />
      <Services />
      <ProofNumbers />
      <CaseStudies />
      <Process />
      <CapabilitiesSection />
      <AboutSection />
      <CtaSection onBookCall={openChat} />
      <Footer />
      <ChatWidget isOpen={chatOpen} onToggle={toggleChat} />
    </>
  )
}
