'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  type: 'bot' | 'user'
  html: string
}

interface QuickReply {
  label: string
  fn: () => void
}

type Stage = 'idle' | 'intro' | 'challenge' | 'services' | 'form' | 'done'

interface ChatWidgetProps {
  isOpen: boolean
  onToggle: () => void
}

export default function ChatWidget({ isOpen, onToggle }: ChatWidgetProps) {
  const [messages, setMessages]       = useState<Message[]>([])
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const [stage, setStage]             = useState<Stage>('idle')
  const [showNotif, setShowNotif]     = useState(false)
  const [showForm, setShowForm]       = useState(false)
  const [showInput, setShowInput]     = useState(true)
  const [inputVal, setInputVal]       = useState('')
  const messagesRef = useRef<HTMLDivElement>(null)

  const addBotMsg = useCallback(async (html: string, delay = 0): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // Show typing indicator briefly then replace with message
        setMessages(prev => [...prev, { type: 'bot', html: '___typing___' }])
        setTimeout(() => {
          setMessages(prev => prev.map((m, i) =>
            i === prev.length - 1 && m.html === '___typing___'
              ? { type: 'bot', html }
              : m
          ))
          resolve()
        }, 700)
      }, delay)
    })
  }, [])

  const addUserMsg = useCallback((text: string) => {
    setMessages(prev => [...prev, { type: 'user', html: text }])
    setQuickReplies([])
  }, [])

  const startConvo = useCallback(async () => {
    setStage('intro')
    await addBotMsg('Hi there 👋 I\'m the <strong>Kelriva AI</strong> assistant.')
    await addBotMsg('We help organisations in <strong>Fintech, ESG, Finance, and Coaching</strong> automate their most painful processes with AI.', 150)
    await addBotMsg('What brings you here today?', 300)
    setQuickReplies([
      { label: 'I have a specific challenge', fn: showChallenge },
      { label: 'Tell me about your services',  fn: showServices  },
      { label: 'Book a discovery call',        fn: openForm      },
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBotMsg])

  const showChallenge = useCallback(async () => {
    addUserMsg('I have a specific challenge')
    setStage('challenge')
    await addBotMsg('Good — best place to start. What area?')
    const detail = async (type: string) => {
      const msgs: Record<string, string> = {
        doc:  'Our IDP system is live in production at enterprise clients today.',
        flow: 'We build multi-step AI agents on LangGraph replacing manual approval chains.',
        data: 'Complete data pipelines, cloud warehouses, BI dashboards — raw data to real-time decisions.',
        comp: 'Compliance automation is a key focus for FCA-regulated firms. Warm referral active now.',
      }
      addUserMsg({ doc: 'Document processing/KYC', flow: 'Workflow automation', data: 'Data & reporting', comp: 'Compliance' }[type]!)
      await addBotMsg(msgs[type])
      await addBotMsg('Free 30-minute discovery call — scope your situation and proposal back in 48 hours.', 200)
      setQuickReplies([
        { label: 'Book a call',   fn: openForm       },
        { label: 'Tell me more',  fn: showServicesQR },
      ])
    }
    setQuickReplies([
      { label: 'Document processing/KYC', fn: () => detail('doc')  },
      { label: 'Workflow automation',     fn: () => detail('flow') },
      { label: 'Data & reporting',        fn: () => detail('data') },
      { label: 'Compliance',             fn: () => detail('comp') },
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBotMsg, addUserMsg])

  const showServices = useCallback(async () => {
    addUserMsg('Tell me about your services')
    showServicesQR()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addUserMsg])

  const showServicesQR = useCallback(async () => {
    setStage('services')
    await addBotMsg('<strong>01 — IDP & Decision Systems</strong><br>Document processing, extraction, decision routing<br><br><strong>02 — AI Workflow Automation</strong><br>Agentic systems replacing manual processes<br><br><strong>03 — Data Analytics & BI</strong><br>Pipelines, warehousing, dashboards, predictive models')
    setQuickReplies([{ label: 'Book a call', fn: openForm }])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addBotMsg])

  const openForm = useCallback(async () => {
    setStage('form')
    setQuickReplies([])
    await addBotMsg('Let me take a few details — the right person will be in touch within hours.')
    setShowForm(true)
    setShowInput(false)
  }, [addBotMsg])

  const handleSend = useCallback(async () => {
    const val = inputVal.trim()
    if (!val) return
    addUserMsg(val)
    setInputVal('')
    await addBotMsg('A quick discovery call is the fastest way to help. Take your details?', 600)
    setQuickReplies([
      { label: "Yes, let's do it", fn: openForm },
      { label: 'Just browsing',    fn: async () => {
        addUserMsg('Just browsing')
        await addBotMsg("No problem — explore and I'm here when ready.")
      }},
    ])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputVal, addBotMsg, addUserMsg, openForm])

  const handleFormSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const lead = {
      name:     data.get('name')     as string,
      company:  data.get('company')  as string,
      email:    data.get('email')    as string,
      phone:    data.get('phone')    as string,
      vertical: data.get('vertical') as string,
      service:  data.get('service')  as string,
      note:     data.get('note')     as string,
      ts:       new Date().toISOString(),
      src:      'kelriva.ai chatbot',
    }

    setShowForm(false)
    setStage('done')
    await addBotMsg(`Thank you, ${lead.name}! ✓`)
    await addBotMsg(`We'll be in touch at <strong>${lead.email}</strong> within 24 hours.`, 200)

    // Send email notification
    try {
      await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(lead),
      })
    } catch {
      // Silent fail — lead still confirmed to user
    }
  }, [addBotMsg])

  // Auto-start when opened
  useEffect(() => {
    if (isOpen && stage === 'idle') startConvo()
  }, [isOpen, stage, startConvo])

  // Scroll to bottom
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, quickReplies, showForm])

  // Notification badge after 12s
  useEffect(() => {
    const t = setTimeout(() => { if (!isOpen) setShowNotif(true) }, 12000)
    return () => clearTimeout(t)
  }, [isOpen])

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 600 }}>
      {/* Notification badge */}
      {showNotif && !isOpen && (
        <div style={{
          position: 'absolute', top: -3, right: -3,
          width: 16, height: 16,
          background: '#ff4444',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.58rem', fontWeight: 700, color: '#fff',
          animation: 'pulse 2s ease infinite',
        }}>1</div>
      )}

      {/* FAB */}
      <button
        onClick={() => { setShowNotif(false); onToggle() }}
        aria-label="Chat with Kelriva AI"
        style={{
          width: 54, height: 54,
          borderRadius: '50%',
          background: '#d63545',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem',
          transition: 'transform .16s cubic-bezier(0.23,1,0.32,1)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'none'
        }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.1)' }}
      >
        💬
      </button>

      {/* Chat window — spring animation from scale(0.9), not scale(0) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            style={{
              position: 'absolute',
              bottom: '4.5rem', right: 0,
              width: 370, maxHeight: 580,
              background: 'rgba(21,15,9,.97)',
              border: '1px solid rgba(214,53,69,.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 32px 80px rgba(0,0,0,.7)',
              display: 'flex',
              flexDirection: 'column',
              transformOrigin: 'bottom right',
            }}
            className="chat-window"
          >
            {/* Header */}
            <div style={{
              padding: '1rem 1.2rem',
              background: 'rgba(18,12,7,.9)',
              borderBottom: '1px solid rgba(214,53,69,.1)',
              display: 'flex', alignItems: 'center', gap: '.75rem',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: '#150f09',
                border: '1px solid rgba(214,53,69,.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, overflow: 'hidden',
              }}>
                <Image src="/mark-white.png" alt="K" width={20} height={22} />
              </div>
              <div>
                <div style={{
                  fontWeight: 700, fontSize: '.88rem', color: '#ffffff', lineHeight: 1.2,
                }}>Kelriva AI Assistant</div>
                <div style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '.62rem', color: '#00e09c',
                  display: 'flex', alignItems: 'center', gap: '.3rem',
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#00e09c', boxShadow: '0 0 5px #00e09c',
                    display: 'inline-block',
                  }} />
                  Online · replies instantly
                </div>
              </div>
              <button
                onClick={onToggle}
                style={{
                  marginLeft: 'auto', background: 'none', border: 'none',
                  color: '#6b5548', cursor: 'pointer', fontSize: '1rem',
                  transition: 'color .15s', padding: '0 .25rem',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b5548')}
              >✕</button>
            </div>

            {/* Messages */}
            <div
              ref={messagesRef}
              style={{
                flex: 1, overflowY: 'auto', padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '.7rem',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(214,53,69,.2) transparent',
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '.4rem',
                    alignItems: 'flex-end',
                    justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                    animation: 'msgIn .2s ease',
                  }}
                >
                  {msg.type === 'bot' && (
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: '#150f09',
                      border: '1px solid rgba(214,53,69,.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, overflow: 'hidden',
                    }}>
                      <Image src="/mark-white.png" alt="K" width={14} height={15} />
                    </div>
                  )}
                  {msg.html === '___typing___' ? (
                    <div style={{
                      display: 'flex', gap: 4, padding: '.6rem .9rem',
                      background: 'rgba(255,255,255,.04)',
                      border: '1px solid rgba(214,53,69,.1)',
                    }}>
                      {[0, .2, .4].map(delay => (
                        <span key={delay} style={{
                          width: 5, height: 5, borderRadius: '50%',
                          background: '#6b5548',
                          display: 'inline-block',
                          animation: `typingDot 1.4s ease infinite`,
                          animationDelay: `${delay}s`,
                        }} />
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{
                        maxWidth: '86%',
                        padding: '.6rem .9rem',
                        fontSize: '.83rem',
                        lineHeight: 1.6,
                        background: msg.type === 'bot' ? 'rgba(255,255,255,.04)' : '#d63545',
                        color: msg.type === 'bot' ? '#ede5dc' : '#0d0a08',
                        fontWeight: msg.type === 'user' ? 600 : 400,
                        border: msg.type === 'bot' ? '1px solid rgba(214,53,69,.1)' : 'none',
                        borderBottomLeftRadius: msg.type === 'bot' ? 2 : undefined,
                        borderBottomRightRadius: msg.type === 'user' ? 2 : undefined,
                      }}
                      dangerouslySetInnerHTML={{ __html: msg.html }}
                    />
                  )}
                </div>
              ))}

              {/* Quick replies */}
              {quickReplies.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', padding: '.2rem 0' }}>
                  {quickReplies.map(qr => (
                    <button
                      key={qr.label}
                      onClick={qr.fn}
                      style={{
                        background: 'transparent',
                        border: '1px solid rgba(214,53,69,.22)',
                        color: '#d63545',
                        fontFamily: 'var(--font-instrument), sans-serif',
                        fontSize: '.75rem', padding: '.3rem .7rem',
                        cursor: 'pointer',
                        transition: 'background .15s, border-color .15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(214,53,69,.1)'
                        e.currentTarget.style.borderColor = '#d63545'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgba(214,53,69,.22)'
                      }}
                    >{qr.label}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Lead capture form */}
            {showForm && (
              <form
                onSubmit={handleFormSubmit}
                style={{
                  padding: '.75rem 1rem',
                  borderTop: '1px solid rgba(214,53,69,.08)',
                  display: 'flex', flexDirection: 'column', gap: '.45rem',
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.45rem' }}>
                  <input name="name"    required placeholder="Name *"    className="chat-input" />
                  <input name="company" required placeholder="Company *" className="chat-input" />
                </div>
                <input name="email" required type="email" placeholder="Work email *" className="chat-input" />
                <input name="phone" type="tel" placeholder="Phone (optional)" className="chat-input" />
                <select name="vertical" required className="chat-input" defaultValue="">
                  <option value="" disabled>Area of interest *</option>
                  <option>Fintech & Financial Services</option>
                  <option>Sustainability & ESG</option>
                  <option>Corporate Finance & PE</option>
                  <option>Corporate Coaching & L&D</option>
                  <option>Other / Not sure yet</option>
                </select>
                <select name="service" className="chat-input" defaultValue="">
                  <option value="">Service interest</option>
                  <option>IDP & Document Processing</option>
                  <option>AI Workflow Automation</option>
                  <option>Data Analytics & BI</option>
                  <option>General consultation</option>
                </select>
                <input name="note" placeholder="Brief description (optional)" className="chat-input" />
                <button
                  type="submit"
                  style={{
                    background: '#d63545', color: '#0d0a08',
                    fontFamily: 'var(--font-instrument), sans-serif',
                    fontWeight: 700, fontSize: '.75rem',
                    letterSpacing: '.08em', textTransform: 'uppercase',
                    padding: '.6rem', border: 'none', cursor: 'pointer',
                    width: '100%', transition: 'background .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e8404f')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#d63545')}
                  onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
                  onMouseUp={e => { e.currentTarget.style.transform = 'none' }}
                >
                  Send — reply within 24hrs →
                </button>
              </form>
            )}

            {/* Text input */}
            {showInput && (
              <div style={{
                display: 'flex',
                borderTop: '1px solid rgba(214,53,69,.08)',
              }}>
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, background: 'transparent', border: 'none',
                    color: '#ffffff', padding: '.7rem 1rem',
                    fontFamily: 'var(--font-instrument), sans-serif',
                    fontSize: '.83rem', outline: 'none',
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    background: '#d63545', border: 'none',
                    color: '#0d0a08', width: 42,
                    cursor: 'pointer', fontSize: '.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'background .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e8404f')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#d63545')}
                >→</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .chat-input {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(214,53,69,.12);
          color: #ffffff;
          padding: .45rem .7rem;
          font-family: var(--font-instrument), sans-serif;
          font-size: .8rem;
          outline: none;
          transition: border-color .2s;
          width: 100%;
        }
        .chat-input:focus { border-color: #d63545; }
        .chat-input::placeholder { color: #6b5548; }
        .chat-input option { background: #150f09; }

        @media (max-width: 480px) {
          .chat-window { width: calc(100vw - 1.5rem) !important; right: calc(-2rem + .75rem) !important; }
        }
      `}</style>
    </div>
  )
}
