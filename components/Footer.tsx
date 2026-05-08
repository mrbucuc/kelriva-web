import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{
      background: '#0d0a08',
      borderTop: '1px solid rgba(214,53,69,.06)',
      padding: '5rem 3rem 2.5rem',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1fr 1fr 1fr',
          gap: '3rem',
          paddingBottom: '3.5rem',
          borderBottom: '1px solid rgba(214,53,69,.06)',
          marginBottom: '2.5rem',
        }} className="foot-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
              <Image src="/mark-white.png" alt="Kelriva AI" width={42} height={46} style={{ display: 'block' }} />
              <div style={{ lineHeight: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-instrument), sans-serif',
                  fontWeight: 700, fontSize: '1.05rem',
                  color: '#ffffff', letterSpacing: '.04em',
                }}>Kelriva AI</div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '.52rem', color: '#d63545',
                  letterSpacing: '.2em', textTransform: 'uppercase',
                  marginTop: '.22rem', opacity: .7,
                }}>AI Consultancy · London</div>
              </div>
            </div>

            <p style={{ fontSize: '.84rem', color: '#6b5548', lineHeight: 1.8, maxWidth: 260, marginBottom: '1.25rem' }}>
              Intelligent automation for the modern enterprise. UK-registered. AWS-powered. Fixed-fee delivery.
            </p>

            <div style={{
              fontFamily: 'var(--font-jetbrains), monospace',
              fontSize: '.62rem',
              color: 'rgba(74,96,112,.55)',
              lineHeight: 1.9,
            }}>
              KELRIVA AI LIMITED · Company No. 17179115<br />
              71-75 Shelton Street, Covent Garden<br />
              London WC2H 9JQ · England &amp; Wales<br />
              info@kelriva.ai
            </div>
          </div>

          {/* Services */}
          <FootCol title="Services" links={[
            { label: 'IDP & Decision Systems',  href: '#services' },
            { label: 'AI Workflow Automation',   href: '#services' },
            { label: 'Data Analytics & BI',      href: '#services' },
          ]} />

          {/* Verticals */}
          <FootCol title="Verticals" links={[
            { label: 'Fintech & RegTech',       href: '#verticals' },
            { label: 'Sustainability & ESG',    href: '#verticals' },
            { label: 'Corporate Finance',       href: '#verticals' },
            { label: 'Corporate Coaching',      href: '#verticals' },
          ]} />

          {/* Company */}
          <FootCol title="Company" links={[
            { label: 'info@kelriva.ai',  href: 'mailto:info@kelriva.ai' },
            { label: 'kelriva.ai',       href: 'https://kelriva.ai' },
            { label: 'How we work',      href: '#process' },
          ]} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.62rem',
            color: 'rgba(74,96,120,.45)',
            letterSpacing: '.06em',
          }}>© 2026 KELRIVA AI LIMITED. All rights reserved.</span>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.62rem',
            color: 'rgba(74,96,120,.45)',
            letterSpacing: '.06em',
          }}>kelriva.ai</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .foot-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          footer { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
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
        fontSize: '.62rem', letterSpacing: '.2em',
        textTransform: 'uppercase', color: '#d63545',
        marginBottom: '1.5rem', opacity: .8,
      }}>{title}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
        {links.map(l => (
          <li key={l.label}>
            <a
              href={l.href}
              style={{ fontSize: '.84rem', color: '#6b5548', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b5548')}
            >{l.label}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
