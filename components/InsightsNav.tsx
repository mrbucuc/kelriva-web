import Image from 'next/image'

export default function InsightsNav() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 500,
      padding: '0 3rem',
      height: '66px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(13,10,8,.95)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(214,53,69,.07)',
    }}>

      {/* Logo → back to home */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
        <Image src="/mark-kelriva.png" alt="Kelriva AI" width={44} height={48} style={{ display: 'block' }} />
      </a>

      {/* Breadcrumb */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '.6rem',
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '.6rem', letterSpacing: '.18em', textTransform: 'uppercase',
      }}>
        <a href="/" style={{ color: '#6b5548', transition: 'color .2s' }}
          onMouseEnter={undefined} onMouseLeave={undefined}>kelriva.ai</a>
        <span style={{ color: 'rgba(214,53,69,.35)' }}>/</span>
        <span style={{ color: '#d63545' }}>Insights</span>
      </div>

      {/* CTA */}
      <a
        href="/#contact"
        style={{
          background: 'transparent',
          color: '#d63545',
          border: '1px solid rgba(214,53,69,.4)',
          fontFamily: 'var(--font-instrument), sans-serif',
          fontWeight: 600,
          fontSize: '.74rem',
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          padding: '.52rem 1.4rem',
          transition: 'all .25s',
          display: 'inline-block',
        }}
        onMouseEnter={undefined}
        onMouseLeave={undefined}
      >
        Book a call
      </a>

      <style>{`
        @media (max-width: 700px) {
          nav { padding: 0 1.5rem !important; }
          nav > div { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
