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
        title: 'Kelriva AI — From data to decision. Instantly.',
        description: 'B2B AI consultancy building bespoke AI systems: Document Processing, Workflow Automation & Data Analytics. Fixed-fee. Delivered in weeks.',
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
                    title: 'Kelriva AI — From data to decision. Instantly.',
                    description: 'Bespoke AI systems for enterprise. IDP, agentic workflows, BI. Fixed-fee. Weeks not months.',
                    url: 'https://kelriva.ai/',
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
                    site: '@kelrivaai',
                    creator: '@kelrivaai',
        },
}

const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Kelriva AI',
        url: 'https://kelriva.ai/',
        logo: 'https://kelriva.ai/logo.png',
        sameAs: [],
        description: 'B2B AI consultancy building bespoke AI systems for enterprise: Intelligent Document Processing, AI Workflow Automation, and Data Analytics.',
        address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'London',
                    addressCountry: 'GB',
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
                                                </Script
                                                <script
                                                                        type="application/ld+json"
                                                                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                                                                    />
                                </head>
                                <body>
                                                <noscript>
                                                                    <iframe
                                                                                                src="https://www.googletagmanager.com/ns.html?id=G-NQ7ENKQ1DK"
                                                                                                height="0"
                                                                                                width="0"
                                                                                                style={{ display: 'none', visibility: 'hidden' }}
                                                                                            />
                                                </noscript>noscript>
                                    {children}
                                </body>body>
                    </html>html>
                )
}</html>
