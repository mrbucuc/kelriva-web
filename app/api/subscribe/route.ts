import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  let email: string
  try {
    const body = await req.json()
    email = body.email
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
  }

  const ts = new Date().toISOString()

  const [emailResult, zapierResult] = await Promise.allSettled([
    // ── 1. Notify Kelriva via Resend ───────────────────────────────────────────
    process.env.RESEND_API_KEY
      ? resend.emails.send({
          from:    'Kelriva AI Assistant <onboarding@resend.dev>',
          to:      ['info@kelriva.ai'],
          replyTo: email,
          subject: `New Insights subscriber: ${email}`,
          html: `
            <div style="font-family:monospace;background:#0d0a08;color:#ede5dc;padding:32px;max-width:600px">
              <div style="border-top:2px solid #d63545;padding-top:24px;margin-bottom:24px">
                <span style="color:#d63545;font-size:11px;letter-spacing:0.2em;text-transform:uppercase">// New subscriber · kelriva.ai/insights</span>
              </div>
              <table style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="padding:8px 0;color:#6b5548;font-size:12px;width:140px">Email</td>
                  <td style="padding:8px 0;color:#d63545;font-size:14px">
                    <a href="mailto:${email}" style="color:#d63545">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b5548;font-size:12px">Source</td>
                  <td style="padding:8px 0;color:#ffffff;font-size:14px">kelriva.ai/insights subscribe form</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b5548;font-size:12px">Submitted</td>
                  <td style="padding:8px 0;color:#6b5548;font-size:12px">${ts}</td>
                </tr>
              </table>
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(214,53,69,.15)">
                <a href="mailto:${email}?subject=Welcome to Kelriva AI Insights"
                   style="display:inline-block;background:#d63545;color:#0d0a08;padding:10px 24px;font-weight:700;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none">
                  Email ${email} →
                </a>
              </div>
            </div>
          `,
        })
      : Promise.resolve(null),

    // ── 2. Push to Zapier → HubSpot ───────────────────────────────────────────
    process.env.ZAPIER_WEBHOOK_URL
      ? fetch(process.env.ZAPIER_WEBHOOK_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstname:    '',
            company:      '',
            phone:        '',
            vertical:     '',
            service:      '',
            message:      'Subscribed to Kelriva AI Insights',
            source:       'kelriva.ai/insights subscribe',
            submitted_at: ts,
          }),
        })
      : Promise.resolve(null),
  ])

  if (emailResult.status === 'rejected') console.error('Resend error:', emailResult.reason)
  if (zapierResult.status === 'rejected') console.error('Zapier error:', zapierResult.reason)

  const anyOk = emailResult.status === 'fulfilled' || zapierResult.status === 'fulfilled'
  return NextResponse.json({ ok: anyOk })
}
