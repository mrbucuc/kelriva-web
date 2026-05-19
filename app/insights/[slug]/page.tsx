import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import InsightsNav from '@/components/InsightsNav'
import { articles, getArticle, categoryLabel, formatDate } from '@/lib/insights'

// ── Static params for build-time generation ──────────────────────────────────
export async function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

// ── Per-article SEO metadata ─────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article   = getArticle(slug)
  if (!article) return { title: 'Not Found — Kelriva AI' }

  return {
    title:       `${article.title} — Kelriva AI`,
    description: article.excerpt,
    keywords:    article.tags,
    alternates:  { canonical: `https://kelriva.ai/insights/${slug}` },
    openGraph: {
      title:       article.title,
      description: article.excerpt,
      url:         `https://kelriva.ai/insights/${slug}`,
      siteName:    'Kelriva AI',
      locale:      'en_GB',
      type:        'article',
      publishedTime: article.date,
      tags:        article.tags,
    },
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug }  = await params
  const article   = getArticle(slug)
  if (!article) notFound()

  const jsonLd = {
    '@context':     'https://schema.org',
    '@type':        'Article',
    headline:       article.title,
    description:    article.excerpt,
    datePublished:  article.date,
    author: {
      '@type': 'Organization',
      name:    'Kelriva AI',
      url:     'https://kelriva.ai',
    },
    publisher: {
      '@type': 'Organization',
      name:    'Kelriva AI',
      url:     'https://kelriva.ai',
    },
    keywords: article.tags.join(', '),
    url:      `https://kelriva.ai/insights/${slug}`,
  }

  return (
    <>
      <InsightsNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ background: 'transparent', minHeight: '100vh', paddingTop: '66px' }}>

        {/* ── Article header ───────────────────────────────────────────── */}
        <header style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '4.5rem 3rem 0',
        }} className="article-pad">

          {/* Back link */}
          <a href="/insights" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '.5rem',
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.58rem',
            color: '#6b5548',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            marginBottom: '2.5rem',
            transition: 'color .2s',
          }} className="back-link">
            ← Insights
          </a>

          {/* Category + date + read time */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.56rem',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: '#d63545',
              background: 'rgba(214,53,69,.1)',
              padding: '.28rem .7rem',
              border: '1px solid rgba(214,53,69,.2)',
            }}>
              {categoryLabel[article.category]}
            </span>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.58rem',
              color: '#6b5548',
              letterSpacing: '.06em',
            }}>
              {formatDate(article.date)}
            </span>
            <span style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.58rem',
              color: '#6b5548',
              letterSpacing: '.06em',
            }}>
              {article.readTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontWeight: 600,
            fontStyle: 'italic',
            fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-.02em',
            marginBottom: '3rem',
          }}>
            {article.title}
          </h1>

          {/* Divider */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg,#d63545,rgba(214,53,69,.08) 60%,transparent)',
            marginBottom: '3rem',
          }} />
        </header>

        {/* ── Article body ─────────────────────────────────────────────── */}
        <article style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 3rem',
        }} className="article-pad">
          {article.body.map((block, i) => {
            if (block.t === 'h2') {
              return (
                <h2 key={i} style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontWeight: 500,
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.35rem, 2.2vw, 1.7rem)',
                  color: '#ffffff',
                  lineHeight: 1.2,
                  letterSpacing: '-.01em',
                  marginTop: '3rem',
                  marginBottom: '1.2rem',
                  paddingLeft: '1rem',
                  borderLeft: '2px solid #d63545',
                }}>
                  {block.v}
                </h2>
              )
            }
            if (block.t === 'lead') {
              return (
                <p key={i} style={{
                  fontSize: 'clamp(1.05rem, 1.6vw, 1.15rem)',
                  color: 'rgba(237,229,220,.9)',
                  lineHeight: 1.85,
                  marginBottom: '1.75rem',
                  fontWeight: 400,
                }}>
                  {block.v}
                </p>
              )
            }
            // Default paragraph
            return (
              <p key={i} style={{
                fontSize: '1rem',
                color: 'rgba(237,229,220,.75)',
                lineHeight: 1.9,
                marginBottom: '1.5rem',
              }}>
                {block.v}
              </p>
            )
          })}
        </article>

        {/* ── Tags ─────────────────────────────────────────────────────── */}
        <div style={{
          maxWidth: 760,
          margin: '2.5rem auto 0',
          padding: '0 3rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '.5rem',
        }} className="article-pad">
          {article.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.54rem',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              color: '#6b5548',
              padding: '.25rem .65rem',
              border: '1px solid rgba(107,85,72,.2)',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div style={{
          maxWidth: 760,
          margin: '4rem auto 0',
          padding: '0 3rem 6rem',
        }} className="article-pad">
          <div style={{
            padding: '2.5rem',
            border: '1px solid rgba(214,53,69,.2)',
            background: 'rgba(214,53,69,.04)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg,#d63545,transparent)',
            }} />

            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.58rem',
              color: '#d63545',
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              opacity: .8,
            }}>
              Thinking about your AI infrastructure?
            </div>

            <h3 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontWeight: 500,
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
              color: '#ffffff',
              marginBottom: '.9rem',
              lineHeight: 1.2,
            }}>
              Let's talk about how your business is built today — and how we'd make it AI-ready.
            </h3>

            <p style={{
              fontSize: '.9rem',
              color: '#6b5548',
              lineHeight: 1.75,
              marginBottom: '1.75rem',
              maxWidth: 480,
            }}>
              Fixed-fee. Delivered in weeks. No lock-in to any single provider.
            </p>

            <a
              href="/#contact"
              style={{
                display: 'inline-block',
                background: '#d63545',
                color: '#0d0a08',
                fontFamily: 'var(--font-instrument), sans-serif',
                fontWeight: 700,
                fontSize: '.78rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                padding: '.9rem 2.2rem',
                transition: 'opacity .2s',
              }}
            >
              Book a discovery call →
            </a>
          </div>
        </div>

        {/* ── Back to insights ─────────────────────────────────────────── */}
        <div style={{
          borderTop: '1px solid rgba(214,53,69,.06)',
          padding: '2rem 3rem',
          maxWidth: 760,
          margin: '0 auto',
        }} className="article-pad">
          <a href="/insights" style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.6rem',
            color: '#6b5548',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            transition: 'color .2s',
          }} className="back-link">
            ← Back to all insights
          </a>
        </div>

      </main>

      <style>{`
        .back-link:hover { color: #d63545 !important; }
        @media (max-width: 640px) {
          .article-pad { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>
    </>
  )
}
