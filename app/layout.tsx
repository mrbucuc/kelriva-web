import type { Metadata } from 'next'
import { Cormorant_Garamond, JetBrains_Mono, Instrument_Sans } from 'next/font/google'
import Script from 'next/script'
import { SpeedInsights } from '@vercel/speed-insights/next'
import GlobalChrome from '@/components/GlobalChrome'
import './globals.css'

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

// Only weight 300 is used in headings; italic is required for .t-section
// font-display:optional — prevents late font-swap repaint that would push LCP to ~3.7s on slow 4G
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'optional',
  weight: ['300', '400'],
  style: ['normal', 'italic'],
})

// Only weight 400 is used for mono labels
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: 'Kelriva AI — Enterprise AI Consultancy | London',
  description: 'London-based enterprise AI consultancy. AI systems for IDP, Workflow Automation & Data Analytics. Fixed-fee, delivered in weeks.',
  icons: {
    icon: [
      { url: '/favicon-kelriva.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-kelriva.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: { url: '/favicon-kelriva.png', sizes: '512x512', type: 'image/png' },
    shortcut: '/favicon-kelriva.png',
  },
  authors: [{ name: 'Kelriva AI', url: 'https://kelriva.ai/' }],
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
  logo: 'https://kelriva.ai/lockup-white.png',
  image: 'https://kelriva.ai/og-image.png',
  description: 'London-based enterprise AI consultancy building bespoke, production-ready AI systems: Intelligent Document Processing, AI Workflow Automation, and Data Analytics. Fixed-fee delivery in weeks.',
  telephone: '+44-20-3866-1197',
  priceRange: '££££',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '71-75 Shelton Street',
    addressLocality: 'London',
    addressRegion: 'England',
    postalCode: 'WC2H 9JQ',
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
    'https://www.linkedin.com/company/kelriva-ai',
  ],
  foundingDate: '2026',
  author: {
    '@type': 'Organization',
    name: 'Kelriva AI',
    url: 'https://kelriva.ai/',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Kelriva AI',
    url: 'https://kelriva.ai/',
    logo: {
      '@type': 'ImageObject',
      url: 'https://kelriva.ai/lockup-white.png',
      width: 600,
      height: 60,
    },
  },
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
      lang="en-GB"
      className={`${cormorant.variable} ${jetbrains.variable} ${instrument.variable}`}
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
        <Script
          id="apollo-tracker"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"6a11ff06014d1a00180dafa1"})},document.head.appendChild(o)}initApollo();` }}
        />
      </head>
      <body>
        <a href="#hero" className="skip-link">Skip to content</a>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=G-NQ7ENKQ1DK"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* Global chrome: particle bg, page loader, cursor, scroll progress — all ssr:false */}
        <GlobalChrome />
        {/* All page content sits above the canvas */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        <SpeedInsights />
      </body>
    </html>
  )
}
