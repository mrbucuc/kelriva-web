import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'

// Escape HTML to prevent injection in email templates
function esc(str: string | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: Request) {
  // Rate limit: 5 submissions per IP per minute
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip, 'contact')) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { name: _n, company: _c, email: _e, phone: _p, vertical: _v, service: _s, note: _note, ts } = body

  // Sanitise all user-supplied fields before use in HTML email
  const name     = esc(_n)
  const company  = esc(_c)
  const email    = esc(_e)
  const phone    = esc(_p)
  const vertical = esc(_v)
  const service  = esc(_s)
  const note     = esc(_note)

  // Run Resend and Zapier independently — one failing must not block the other
  const [emailResult, zapierResult, researchResult] = await Promise.allSettled([
    // ── 1. Send email via Resend ───────────────────────────────────────────────
    process.env.RESEND_API_KEY
      ? resend.emails.send({
          from:    'Kelriva AI Assistant <onboarding@resend.dev>',
          to:      ['info@kelriva.ai'],
          replyTo: email,
          subject: `New lead: ${name} — ${company}`,
          html: `
            <div style="font-family:monospace;background:#0d0a08;color:#ede5dc;padding:32px;max-width:600px">
              <div style="border-top:2px solid #d63545;padding-top:24px;margin-bottom:24px">
                <span style="color:#d63545;font-size:11px;letter-spacing:0.2em;text-transform:uppercase">// New lead · kelriva.ai chatbot</span>
              </div>
              <table style="width:100%;border-collapse:collapse">
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px;width:140px">Name</td>
                    <td style="padding:8px 0;color:#ffffff;font-size:14px">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px">Company</td>
                    <td style="padding:8px 0;color:#ffffff;font-size:14px">${company}</td></tr>
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px">Email</td>
                    <td style="padding:8px 0;color:#d63545;font-size:14px"><a href="mailto:${email}" style="color:#d63545">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px">Phone</td>
                    <td style="padding:8px 0;color:#ffffff;font-size:14px">${phone || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px">Vertical</td>
                    <td style="padding:8px 0;color:#ffffff;font-size:14px">${vertical || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px">Service</td>
                    <td style="padding:8px 0;color:#ffffff;font-size:14px">${service || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px">Note</td>
                    <td style="padding:8px 0;color:#ffffff;font-size:14px">${note || '—'}</td></tr>
                <tr><td style="padding:8px 0;color:#6b5548;font-size:12px">Submitted</td>
                    <td style="padding:8px 0;color:#6b5548;font-size:12px">${ts}</td></tr>
              </table>
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(214,53,69,.15)">
                <a href="mailto:${email}?subject=Re: Kelriva AI Discovery Call"
                   style="display:inline-block;background:#d63545;color:#0d0a08;padding:10px 24px;font-weight:700;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none">
                  Reply to ${name} →
                </a>
              </div>
            </div>
          `,
        })
      : Promise.resolve(null),

    // ── 2. Fire Zapier webhook ─────────────────────────────────────────────────
    process.env.ZAPIER_WEBHOOK_URL
      ? fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name:   name,
            last_name:    '',
            company_name: company,
            email,
            phone_number: phone    || '',
            vertical:     vertical || '',
            service:      service  || '',
            message:      note     || '',
            source:       'kelriva.ai chatbot',
            submitted_at: ts,
          }),
        })
      : Promise.resolve(null),

    // ── 3. Fire research agent webhook ────────────────────────────────────────
    process.env.ZAPIER_RESEARCH_WEBHOOK_URL
      ? fetch(process.env.ZAPIER_RESEARCH_WEBHOOK_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name:   name,
            last_name:    '',
            company_name: company,
            email,
            phone_number: phone    || '',
            vertical:     vertical || '',
            service:      service  || '',
            message:      note     || '',
            source:       'kelriva.ai chatbot',
            submitted_at: ts,
          }),
        })
      : Promise.resolve(null),
  ])

  if (emailResult.status === 'rejected') console.error('Resend error:', emailResult.reason)
  if (zapierResult.status === 'rejected') console.error('Zapier error:', zapierResult.reason)
  if (researchResult.status === 'rejected') console.error('Research agent error:', researchResult.reason)

  const anyOk = emailResult.status === 'fulfilled' || zapierResult.status === 'fulfilled'
  return NextResponse.json({ ok: anyOk })
}
