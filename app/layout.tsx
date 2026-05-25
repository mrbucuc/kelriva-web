import type { Metadata } from 'next'
import { Bricolage_Grotesque, Cormorant_Garamond, JetBrains_Mono, Instrument_Sans } from 'next/font/google'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ParticleBackground from '@/components/ParticleBackground'
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
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Kelriva AI — Enterprise AI Consultancy | London',
  description: 'London-based enterprise AI consultancy. AI systems for IDP, Workflow Automation & Data Analytics. Fixed-fee, delivered in weeks.',
  keywords: [
    'AI consultancy',
    'intelligent document processing',
    'LangGraph',
    'AI automation',
    'UK AI',
    'enterprise AI London',
    'AI workflow automation',
    'document automation AI',
    'business process automation consulting',
    'AI consultancy London',
    'fintech AI',
    'ESG AI',
    'agentic AI systems',
    'enterprise AI consultancy UK',
    'bespoke AI solutions',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: 'https://kelriva.ai/',
  },
  openGraph: {
    title: 'Kelriva AI — Enterprise AI Consultancy London',
    description: 'Bespoke AI systems for enterprise. IDP, agentic workflows, BI. Fixed-fee. Weeks not months.',
    url: 'https://kelriva.ai/',
    siteName: 'Kelriva AI',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: 'https://kelriva.ai/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kelriva AI — Enterprise AI Consultancy London',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kelriva AI — Enterprise AI Consultancy London',
    description: 'Bespoke AI systems for enterprise. IDP, agentic workflows, BI. Fixed-fee. Weeks not months.',
    images: ['https://kelriva.ai/og-image.png'],
    site: '@kelrivaai',
    creator: '@kelrivaai',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Kelriva AI',
  url: 'https://kelriva.ai/',
  logo: 'https://kelriva.ai/logo.png',
  image: 'https://kelriva.ai/og-image.png',
  description: 'London-based enterprise AI consultancy building bespoke, production-ready AI systems: Intelligent Document Processing, AI Workflow Automation, and Data Analytics. Fixed-fee delivery in weeks.',
  priceRange: '££££',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Covent Garden',
    addressLocality: 'London',
    addressRegion: 'England',
    postalCode: 'WC2',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.5117,
    longitude: -0.1240,
  },
  areaServed: {
    '@type': 'Country',
    name: 'United Kingdom',
  },
  sameAs: [
    'https://www.linkedin.com/company/kelriva',
  ],
  foundingDate: '2025',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Enterprise AI Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Intelligent Document Processing' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Workflow Automation' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Data Analytics' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Enterprise AI Consultancy' } },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${cormorant.variable} ${jetbrains.variable} ${instrument.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NQ7ENKQ1DK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NQ7ENKQ1DK');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script dangerouslySetInnerHTML={{ __html: `function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"6a11ff06014d1a00180dafa1"})},document.head.appendChild(o)}initApollo();` }} />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-NQ7ENKQ1DK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Global particle canvas — sits behind all page content */}
        <ParticleBackground />
        {/* All page content sits above the canvas */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  )
}
