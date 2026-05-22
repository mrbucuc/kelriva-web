import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, company, email, phone, vertical, service, note, ts } = body

  // Run Resend and Zapier independently — one failing must not block the other
  const [emailResult, zapierResult] = await Promise.allSettled([
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
  ])

  if (emailResult.status === 'rejected') console.error('Resend error:', emailResult.reason)
  if (zapierResult.status === 'rejected') console.error('Zapier error:', zapierResult.reason)

  const anyOk = emailResult.status === 'fulfilled' || zapierResult.status === 'fulfilled'
  return NextResponse.json({ ok: anyOk })
}
