import type { Metadata } from 'next'
import InsightsNav from '@/components/InsightsNav'
import SubscribeForm from '@/components/SubscribeForm'
import { articles, categoryLabel, formatDate } from '@/lib/insights'

export const metadata: Metadata = {
  title: 'Insights — Kelriva AI',
  description: 'Weekly analysis on enterprise AI strategy, infrastructure, and implementation — for London businesses building seriously.',
  alternates: { canonical: 'https://kelriva.ai/insights' },
  openGraph: {
    title: 'Insights — Kelriva AI',
    description: 'Weekly analysis on enterprise AI strategy, infrastructure, and implementation.',
    url: 'https://kelriva.ai/insights',
    siteName: 'Kelriva AI',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: 'https://kelriva.ai/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kelriva AI Insights',
      },
    ],
  },
}

export default function InsightsPage() {
  return (
    <>
      <InsightsNav />

      <main style={{ background: 'transparent', minHeight: '100vh', paddingTop: '66px' }}>

        {/* ── Page header ──────────────────────────────────────────────── */}
        <header style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '5rem 3rem 4rem',
          borderBottom: '1px solid rgba(214,53,69,.08)',
        }} className="insights-header">
          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.62rem',
            color: '#d63545',
            letterSpacing: '.28em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            opacity: .8,
            display: 'flex',
            alignItems: 'center',
            gap: '.75rem',
          }}>
            <span style={{
              display: 'block', width: 32, height: 1,
              background: 'linear-gradient(90deg,transparent,#d63545)',
            }} />
            Weekly intelligence
          </div>

          <h1 style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(3rem, 5.5vw, 5rem)',
            color: '#ffffff',
            lineHeight: .95,
            letterSpacing: '-.02em',
            marginBottom: '1.5rem',
          }}>
            Insights
          </h1>

          <p style={{
            fontSize: '1rem',
            color: '#6b5548',
            maxWidth: 520,
            lineHeight: 1.8,
          }}>
            Enterprise AI strategy, infrastructure, and implementation — for London businesses
            building seriously. One article per week, signal over noise.
          </p>
        </header>

        {/* ── Article grid ─────────────────────────────────────────────── */}
        <section style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '3.5rem 3rem 6rem',
        }} className="insights-grid-wrap">

          {articles.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '6rem 0',
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.7rem', color: '#6b5548',
              letterSpacing: '.15em', textTransform: 'uppercase',
            }}>
              First article coming soon_
            </div>
          ) : (
            <div className="insights-grid">
              {articles.map(article => {
                const soon = article.status === 'coming-soon'
                const Card = soon ? 'div' : 'a'
                const cardProps = soon
                  ? {}
                  : { href: `/insights/${article.slug}` }

                return (
                  <Card
                    key={article.slug}
                    {...(cardProps as object)}
                    className={soon ? 'insight-card-soon' : 'insight-card'}
                    style={{
                      display: 'block',
                      padding: '2rem',
                      border: `1px solid ${soon ? 'rgba(214,53,69,.04)' : 'rgba(214,53,69,.08)'}`,
                      background: soon ? 'rgba(255,255,255,.006)' : 'rgba(255,255,255,.012)',
                      transition: 'border-color .25s, transform .25s, background .25s',
                      position: 'relative',
                      overflow: 'hidden',
                      opacity: soon ? .55 : 1,
                      cursor: soon ? 'default' : 'pointer',
                    }}
                  >
                    {/* Top accent line — published cards only */}
                    {!soon && (
                      <div className="card-accent" style={{
                        position: 'absolute', top: 0, left: 0, right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg,#d63545,transparent)',
                        opacity: 0,
                        transition: 'opacity .3s',
                      }} />
                    )}

                    {/* Category + date */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.4rem',
                      flexWrap: 'wrap',
                      gap: '.5rem',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '.56rem',
                        letterSpacing: '.2em',
                        textTransform: 'uppercase',
                        color: soon ? '#6b5548' : '#d63545',
                        background: soon ? 'rgba(107,85,72,.08)' : 'rgba(214,53,69,.1)',
                        padding: '.28rem .7rem',
                        border: `1px solid ${soon ? 'rgba(107,85,72,.15)' : 'rgba(214,53,69,.2)'}`,
                      }}>
                        {categoryLabel[article.category]}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '.58rem',
                        color: '#6b5548',
                        letterSpacing: '.06em',
                      }}>
                        {soon ? `${formatDate(article.date)}` : formatDate(article.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontWeight: 600,
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.4rem, 2.2vw, 1.75rem)',
                      color: soon ? 'rgba(255,255,255,.5)' : '#ffffff',
                      lineHeight: 1.15,
                      letterSpacing: '-.01em',
                      marginBottom: '1rem',
                    }}>
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p style={{
                      fontSize: '.88rem',
                      color: '#6b5548',
                      lineHeight: 1.75,
                      marginBottom: '1.75rem',
                    }}>
                      {article.excerpt}
                    </p>

                    {/* Footer row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-jetbrains), monospace',
                        fontSize: '.56rem',
                        color: '#6b5548',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                      }}>
                        {soon ? 'Coming soon' : `${article.readTime} min read`}
                      </span>

                      {!soon && (
                        <span className="card-arrow" style={{
                          fontFamily: 'var(--font-instrument), sans-serif',
                          fontSize: '.8rem',
                          color: '#d63545',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          transition: 'transform .2s',
                          display: 'inline-block',
                        }}>
                          Read →
                        </span>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Subscribe strip ──────────────────────────────────────────── */}
        <section style={{
          borderTop: '1px solid rgba(214,53,69,.06)',
          background: 'rgba(214,53,69,.03)',
          padding: '4rem 3rem',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.6rem',
              color: '#d63545',
              letterSpacing: '.22em',
              textTransform: 'uppercase',
              marginBottom: '1.2rem',
              opacity: .8,
            }}>
              Weekly signal
            </div>
            <h3 style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: '#ffffff',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}>
              Get each article the week it drops
            </h3>
            <p style={{
              fontSize: '.9rem',
              color: '#6b5548',
              lineHeight: 1.75,
              marginBottom: '2rem',
            }}>
              One article per week. Enterprise AI strategy and implementation insights for London
              decision-makers. No noise.
            </p>
            <SubscribeForm />
          </div>
        </section>

      </main>

      <style>{`
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .insight-card:hover {
          border-color: rgba(214,53,69,.28) !important;
          background: rgba(255,255,255,.025) !important;
          transform: translateY(-3px);
        }
        .insight-card:hover .card-accent { opacity: 1 !important; }
        .insight-card:hover .card-arrow  { transform: translateX(4px); }
        @media (max-width: 1000px) {
          .insights-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .insights-grid { grid-template-columns: 1fr !important; }
          .insights-header, .insights-grid-wrap { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        }
      `}</style>
    </>
  )
}
