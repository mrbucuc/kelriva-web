'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')

    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()

      if (data.ok) {
        setStatus('success')
        setMessage('You\'re on the list. First article is already live ↗')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error === 'Invalid email' ? 'Please enter a valid email.' : 'Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Connection error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem 0',
      }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28, height: 28,
          border: '1px solid #d63545',
          borderRadius: '50%',
          color: '#d63545',
          fontSize: '1rem',
          flexShrink: 0,
        }}>✓</span>
        <span style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.72rem',
          color: '#ede5dc',
          letterSpacing: '.06em',
        }}>
          {message}
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        gap: 0,
        border: '1px solid rgba(214,53,69,.25)',
        background: 'rgba(255,255,255,.03)',
        transition: 'border-color .2s',
      }} className="subscribe-wrap">

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === 'loading'}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '.85rem 1.2rem',
            fontFamily: 'var(--font-instrument), sans-serif',
            fontSize: '.88rem',
            color: '#ede5dc',
            minWidth: 0,
          }}
        />

        <button
          type="submit"
          disabled={status === 'loading' || !email.trim()}
          style={{
            background: status === 'loading' ? 'rgba(214,53,69,.6)' : '#d63545',
            color: '#0d0a08',
            border: 'none',
            padding: '.85rem 1.6rem',
            fontFamily: 'var(--font-instrument), sans-serif',
            fontWeight: 700,
            fontSize: '.74rem',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'background .2s, opacity .2s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
        </button>
      </div>

      {status === 'error' && (
        <p style={{
          marginTop: '.6rem',
          fontFamily: 'var(--font-jetbrains), monospace',
          fontSize: '.6rem',
          color: '#d63545',
          letterSpacing: '.08em',
          textAlign: 'center',
        }}>
          {message}
        </p>
      )}

      <p style={{
        marginTop: '.75rem',
        fontFamily: 'var(--font-jetbrains), monospace',
        fontSize: '.56rem',
        color: '#6b5548',
        letterSpacing: '.08em',
        textAlign: 'center',
      }}>
        One article per week. No spam. Unsubscribe any time.
      </p>

      <style>{`
        .subscribe-wrap:focus-within {
          border-color: rgba(214,53,69,.6) !important;
        }
        input::placeholder { color: #6b5548; }
      `}</style>
    </form>
  )
}
