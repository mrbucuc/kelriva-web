'use client'

import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{
      background: '#080604',
      borderTop: '1px solid rgba(214,53,69,.08)',
      padding: '5rem 3rem 2.5rem',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Grid */}
        <div
          className="foot-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
            gap: '3rem',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(214,53,69,.07)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.9rem', marginBottom: '1.3rem' }}>
              <Image
                src="/mark-kelriva.png"
                alt="Kelriva AI logo"
                width={40}
                height={44}
                style={{ display: 'block' }}
              />
              <div style={{ lineHeight: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-instrument), sans-serif',
                  fontWeight: 700, fontSize: '1rem',
                  color: '#ffffff', letterSpacing: '.04em',
                }}>Kelriva AI</div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '.5rem', color: '#d63545',
                  letterSpacing: '.2em', textTransform: 'uppercase',
                  marginTop: '.25rem', opacity: .65,
                }}>AI Consultancy · London</div>
              </div>
            </div>

            <p style={{
              fontSize: '.83rem', color: 'rgba(107,85,72,.65)',
              lineHeight: 1.8, maxWidth: 250, marginBottom: '1.3rem',
            }}>
              Intelligent automation for the modern enterprise. UK-registered. Fixed-fee delivery.
            </p>

            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.58rem',
              color: 'rgba(74,96,112,.45)',
              lineHeight: 2.0,
              marginBottom: '1.6rem',
            }}>
              KELRIVA AI LIMITED · Co. No. 17179115<br />
              71-75 Shelton Street, Covent Garden<br />
              London WC2H 9JQ · England &amp; Wales<br />
              020 3866 1197 · info@kelriva.ai
            </div>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/kelriva-ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kelriva AI on LinkedIn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34, height: 34,
                border: '1px solid rgba(214,53,69,.18)',
                transition: 'border-color .2s, background .2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(214,53,69,.45)'
                e.currentTarget.style.background = 'rgba(214,53,69,.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(214,53,69,.18)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke="#d63545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="2" y="9" width="4" height="12" stroke="#d63545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="4" cy="4" r="2" stroke="#d63545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          {/* Services */}
          <FootCol title="Services" links={[
            { label: 'IDP & Decision Systems', href: '#services' },
            { label: 'AI Workflow Automation',  href: '#services' },
            { label: 'Data Analytics & BI',     href: '#services' },
          ]} />

          {/* Case Studies */}
          <FootCol title="Case Studies" links={[
            { label: 'AI Coach Matching', href: '#case-studies' },
            { label: 'IDP Client Setup',  href: '#case-studies' },
          ]} />

          {/* Insights */}
          <FootCol title="Insights" links={[
            { label: 'Model-Agnostic AI Infrastructure', href: '/insights/model-agnostic-infrastructure-2026'            },
            { label: 'Amazon AI: Wrong Metric',          href: '/insights/amazon-ai-usage-wrong-metric'                  },
            { label: 'The 4-Layer AI Stack Audit',       href: '/insights/four-layer-ai-stack-audit'                     },
            { label: 'Cut Document Review by 70%',       href: '/insights/professional-services-document-review-70-percent' },
            { label: 'All Insights →',                   href: '/insights'                                                },
          ]} />

          {/* Company */}
          <FootCol title="Company" links={[
            { label: '020 3866 1197',    href: 'tel:02038661197'                                   },
            { label: 'info@kelriva.ai',  href: 'mailto:info@kelriva.ai'                            },
            { label: 'How we work',      href: '#process'                                           },
            { label: 'LinkedIn',         href: 'https://www.linkedin.com/company/kelriva-ai'       },
          ]} />
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.58rem',
            color: 'rgba(74,96,120,.38)',
            letterSpacing: '.08em',
          }}>© 2026 KELRIVA AI LIMITED. All rights reserved.</span>

          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.58rem',
            color: 'rgba(74,96,120,.38)',
            letterSpacing: '.08em',
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
          }}>
            <span>London · UK</span>
            <span style={{ color: 'rgba(214,53,69,.25)' }}>·</span>
            <span>WC2H 9JQ</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .foot-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
          .foot-grid > :first-child { grid-column: 1 / -1 !important; }
          footer { padding-left: 1.5rem !important; padding-right: 1.5rem !important; padding-top: 3.5rem !important; }
        }
        @media (max-width: 520px) {
          .foot-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

function FootCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '.58rem', letterSpacing: '.22em',
        textTransform: 'uppercase', color: '#d63545',
        marginBottom: '1.4rem', opacity: .75,
      }}>{title}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
        {links.map(l => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{
                fontSize: '.83rem',
                color: 'rgba(107,85,72,.65)',
                transition: 'color .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ede5dc')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(107,85,72,.65)')}
            >{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
