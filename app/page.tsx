'use client'

import { useState } from 'react'
import GrainOverlay from '@/components/GrainOverlay'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import QuoteStrip from '@/components/QuoteStrip'
import Services from '@/components/Services'
import VideoSection from '@/components/VideoSection'
import ProofNumbers from '@/components/ProofNumbers'
import Verticals from '@/components/Verticals'
import Process from '@/components/Process'
import CtaSection from '@/components/CtaSection'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

export default function Page() {
  const [chatOpen, setChatOpen] = useState(false)

  const openChat  = () => setChatOpen(true)
  const toggleChat = () => setChatOpen(v => !v)

  return (
    <>
      <GrainOverlay />
      <Nav onBookCall={openChat} />
      <VideoSection />
      <Hero onBookCall={openChat} />
      <QuoteStrip />
      <Services />
      <ProofNumbers />
      <Verticals />
      <Process />
      <CtaSection onBookCall={openChat} />
      <Footer />
      <ChatWidget isOpen={chatOpen} onToggle={toggleChat} />
    </>
  )
}
