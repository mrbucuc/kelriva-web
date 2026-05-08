'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface NavProps {
  onBookCall: () => void
}

export default function Nav({ onBookCall }: NavProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 500,
        padding: '0 3rem',
        height: '66px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background .4s, border-color .4s',
        background: scrolled ? 'rgba(13,10,8,.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(214,53,69,.07)' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <div
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ display: 'flex', alignItems: 'center', gap: '.85rem', cursor: 'pointer' }}
      >
        <Image
          src="/mark-white.png"
          alt="Kelriva AI"
          width={36}
          height={39}
          style={{ display: 'block' }}
        />
        <div style={{ lineHeight: 1 }}>
          <div style={{
            fontFamily: 'var(--font-instrument), sans-serif',
            fontWeight: 700,
            fontSize: '1.12rem',
            color: '#ffffff',
            letterSpacing: '.04em',
          }}>Kelriva AI</div>
          <div style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '.56rem',
            color: '#d63545',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            marginTop: '.18rem',
            opacity: .75,
          }}>AI Consultancy</div>
        </div>
      </div>

      {/* Links */}
      <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none' }} className="nav-links-desktop">
        {[
          { label: 'Services',  href: '#services'  },
          { label: 'Verticals', href: '#verticals' },
          { label: 'Process',   href: '#process'   },
          { label: 'Contact',   href: '#contact'   },
        ].map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="nav-link"
              style={{
                fontFamily: 'var(--font-instrument), sans-serif',
                fontSize: '.76rem',
                fontWeight: 500,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: '#6b5548',
                transition: 'color .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d63545')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b5548')}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onBookCall}
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
          cursor: 'pointer',
          transition: 'all .25s',
        }}
        onMouseEnter={e => {
          const b = e.currentTarget
          b.style.background = '#d63545'
          b.style.color = '#0d0a08'
        }}
        onMouseLeave={e => {
          const b = e.currentTarget
          b.style.background = 'transparent'
          b.style.color = '#d63545'
        }}
      >
        Book a call
      </button>

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          nav { padding: 0 1.5rem !important; }
        }
      `}</style>
    </nav>
  )
}
