'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface NavProps {
  onBookCall: () => void
}

const NAV_LINKS = [
  { label: 'Services',     href: '#services'     },
  { label: 'Case Studies', href: '#case-studies'  },
  { label: 'Process',      href: '#process'       },
  { label: 'Contact',      href: '#contact'       },
]

export default function Nav({ onBookCall }: NavProps) {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        padding: '0 3rem',
        height: '66px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background .4s, border-color .4s',
        background: scrolled || menuOpen ? 'rgba(13,10,8,.97)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(214,53,69,.07)' : '1px solid transparent',
      }}>
        {/* Logo */}
        <a
          href="/"
          aria-label="Kelriva AI — go to homepage"
          onClick={(e) => { e.preventDefault(); close(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{ display: 'flex', alignItems: 'center', gap: '.85rem', cursor: 'pointer', textDecoration: 'none' }}
        >
          <Image
            src="/mark-kelriva.png"
            alt="Kelriva AI"
            width={54}
            height={59}
            style={{ display: 'block' }}
          />
        </a>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }} className="nav-links-desktop">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="nav-link"
                style={{
                  fontFamily: 'var(--font-instrument), sans-serif',
                  fontSize: '.76rem', fontWeight: 500,
                  letterSpacing: '.1em', textTransform: 'uppercase',
                  color: '#6b5548', transition: 'color .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#d63545')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b5548')}
              >{label}</a>
            </li>
          ))}
          <li>
            <a
              href="/insights"
              className="nav-link"
              style={{
                fontFamily: 'var(--font-instrument), sans-serif',
                fontSize: '.76rem', fontWeight: 500,
                letterSpacing: '.1em', textTransform: 'uppercase',
                color: '#d63545', transition: 'color .2s', opacity: .85,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '.85' }}
            >Insights</a>
          </li>
        </ul>

        {/* Desktop CTA */}
        <button
          onClick={onBookCall}
          className="nav-cta-desktop"
          style={{
            background: 'transparent', color: '#d63545',
            border: '1px solid rgba(214,53,69,.4)',
            fontFamily: 'var(--font-instrument), sans-serif',
            fontWeight: 600, fontSize: '.74rem',
            letterSpacing: '.14em', textTransform: 'uppercase',
            padding: '.52rem 1.4rem', cursor: 'pointer', transition: 'all .25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#d63545'; e.currentTarget.style.color = '#0d0a08' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d63545' }}
        >
          Book a call
        </button>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="nav-hamburger"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none', background: 'none', border: 'none',
            cursor: 'pointer', padding: '11px', lineHeight: 0,
          }}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="3" x2="19" y2="19" stroke="#d63545" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="19" y1="3" x2="3" y2="19" stroke="#d63545" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="6"  x2="19" y2="6"  stroke="#d63545" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="3" y1="11" x2="19" y2="11" stroke="#d63545" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="3" y1="16" x2="19" y2="16" stroke="#d63545" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        <style>{`
          @media (max-width: 900px) {
            .nav-links-desktop { display: none !important; }
            .nav-cta-desktop   { display: none !important; }
            .nav-hamburger     { display: flex !important; }
            nav { padding: 0 1.5rem !important; }
          }
        `}</style>
      </nav>

      {/* Mobile overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 499,
        background: 'rgba(13,10,8,.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '0',
        transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform .42s cubic-bezier(0.23,1,0.32,1)',
        paddingTop: '66px',
      }}>
        {/* Horizontal line accent */}
        <div style={{
          width: 60, height: 1,
          background: 'linear-gradient(90deg, transparent, #a01828, transparent)',
          marginBottom: '3rem',
        }} />

        {[...NAV_LINKS, { label: 'Insights', href: '/insights' }].map(({ label, href }, i) => (
          <a
            key={label}
            href={href}
            onClick={close}
            style={{
              fontFamily: 'var(--font-cormorant), serif',
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 9vw, 3rem)',
              fontWeight: 300,
              color: label === 'Insights' ? '#d63545' : '#ffffff',
              letterSpacing: '-.01em',
              textDecoration: 'none',
              padding: '.5rem 0',
              transition: 'color .2s, opacity .2s',
              opacity: menuOpen ? 1 : 0,
              transitionDelay: `${i * 0.04}s`,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#d63545')}
            onMouseLeave={e => (e.currentTarget.style.color = label === 'Insights' ? '#d63545' : '#ffffff')}
          >{label}</a>
        ))}

        <button
          onClick={() => { close(); onBookCall() }}
          style={{
            marginTop: '2.5rem',
            background: '#d63545', color: '#0d0a08',
            fontFamily: 'var(--font-instrument), sans-serif',
            fontWeight: 700, fontSize: '.82rem',
            letterSpacing: '.14em', textTransform: 'uppercase',
            padding: '1rem 2.4rem', border: 'none', cursor: 'pointer',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity .2s',
            transitionDelay: '0.22s',
          }}
        >
          Book a discovery call
        </button>

        {/* Footer info */}
        <div style={{
          position: 'absolute', bottom: '2.5rem',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.58rem', color: 'rgba(74,96,120,.4)',
          letterSpacing: '.12em', textTransform: 'uppercase',
          textAlign: 'center', lineHeight: 2,
        }}>
          Kelriva AI Limited · London<br />
          020 3866 1197 · info@kelriva.ai
        </div>
      </div>
    </>
  )
}
