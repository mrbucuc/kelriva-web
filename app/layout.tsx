import type { Metadata } from 'next'
import { Bricolage_Grotesque, Cormorant_Garamond, JetBrains_Mono, Instrument_Sans } from 'next/font/google'
import Script from 'next/script'
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
    ],
    metadataBase: new URL('https://kelriva.ai'),
    robots: {
    index: true,
    follow: true,
    googleBot: {
        index: true,
        follow: true,
    },
    },
    openGraph: {
    title: 'Kelriva AI — From data to decision. Instantly.',
    description: 'Bespoke AI systems for enterprise. IDP, agentic workflows, BI. Fixed-fee. Weeks not months.',
    url: 'https://kelriva.ai',
    siteName: 'Kelriva AI',
    locale: 'en_GB',
    type: 'website',
    images: [
        {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kelriva AI — From data to decision. Instantly.',
        },
    ],
    },
    twitter: {
    card: 'summary_large_image',
    title: 'Kelriva AI — From data to decision. Instantly.',
    description: 'Bespoke AI systems for enterprise. IDP, agentic workflows, BI. Fixed-fee. Weeks not months.',
    images: ['/og-image.png'],
    },
    alternates: {
    canonical: 'https://kelriva.ai',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
    {
        '@type': 'Organization',
        '@id': 'https://kelriva.ai/#organization',
        name: 'Kelriva AI',
        url: 'https://kelriva.ai',
        logo: {
        '@type': 'ImageObject',
        url: 'https://kelriva.ai/lockup-white.png',
        },
        description:
        'B2B AI consultancy building bespoke AI systems for enterprise: Intelligent Document Processing, AI Workflow Automation, and Data Analytics.',
        areaServed: 'GB',
        address: {
        '@type': 'PostalAddress',
        streetAddress: '71-75 Shelton Street, Covent Garden',
        addressLocality: 'London',
        postalCode: 'WC2H 9JQ',
        addressCountry: 'GB',
        },
        email: 'info@kelriva.ai',
        sameAs: [
        'https://www.linkedin.com/company/kelriva-ai',
        ],
        knowsAbout: [
        'Artificial Intelligence',
        'Intelligent Document Processing',
        'AI Workflow Automation',
        'Data Analytics',
        'LangGraph',
        'Enterprise AI',
        ],
    },
    {
        '@type': 'WebSite',
        '@id': 'https://kelriva.ai/#website',
        url: 'https://kelriva.ai',
        name: 'Kelriva AI',
        publisher: {
        '@id': 'https://kelriva.ai/#organization',
        },
    },
    {
        '@type': 'Service',
        '@id': 'https://kelriva.ai/#service',
        name: 'Bespoke AI Systems for Enterprise',
        provider: {
        '@id': 'https://kelriva.ai/#organization',
        },
        description:
        'Fixed-fee, bespoke AI systems delivered in weeks. Specialising in Intelligent Document Processing, Agentic Workflow Automation, and Data Analytics for B2B enterprise.',
        serviceType: 'AI Consultancy',
        areaServed: 'GB',
        offers: {
        '@type': 'Offer',
        pricingType: 'Fixed fee',
        },
    },
    ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        </head>
        <body style={{ fontFamily: `var(--font-instrument), 'Instrument Sans', 'Bricolage Grotesque', sans-serif` }}>
        {children}
        </body>
    </html>
    )
}
