import type { Metadata } from 'next'
import { Bricolage_Grotesque, Cormorant_Garamond, JetBrains_Mono, Instrument_Sans } from 'next/font/google'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['200', '400', '600', '700', '800'],
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400'],
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['300', '400'],
})

export const metadata: Metadata = {
  title: 'Kelriva AI — From data to decision. Instantly.',
  description:
    'B2B AI consultancy building bespoke AI systems for enterprise: Intelligent Document Processing, AI Workflow Automation, and Data Analytics. Fixed-fee. Delivered in weeks.',
  keywords: ['AI consultancy', 'intelligent document processing', 'LangGraph', 'AI automation', 'UK AI'],
  openGraph: {
    title: 'Kelriva AI — From data to decision. Instantly.',
    description: 'Bespoke AI systems for enterprise. IDP, agentic workflows, BI. Fixed-fee. Weeks not months.',
    url: 'https://kelriva.ai',
    siteName: 'Kelriva AI',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${cormorant.variable} ${jetbrains.variable} ${instrument.variable}`}
    >
      <body style={{ fontFamily: `var(--font-instrument), 'Instrument Sans', 'Bricolage Grotesque', sans-serif` }}>
        {children}
      </body>
    </html>
  )
}
