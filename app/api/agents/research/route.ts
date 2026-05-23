import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: Request) {

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const { first_name, company_name, email, phone_number, vertical, service, message } = body

  if (!company_name && !email) {
    return NextResponse.json({ ok: false, error: 'Missing contact data' }, { status: 400 })
  }

  const emailDomain = email?.split('@')[1] || ''

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ ok: false, error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const resend = new Resend(process.env.RESEND_API_KEY)

  // ── Claude agent prompt ────────────────────────────────────────────────────
  let agentResponse
  try {
    agentResponse = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: `You are a senior business development analyst at Kelriva AI, a London-based AI consultancy.

Kelriva AI specialises in three services:
1. Intelligent Document Processing (IDP) — contracts, KYC, compliance, onboarding docs
2. AI Workflow Automation — multi-step agentic systems (LangGraph), replacing manual approval chains
3. Data Analytics & Intelligence — pipelines, BI dashboards, predictive analytics

Target verticals: Fintech, ESG, Corporate Finance, Corporate Coaching.
Deal size: £30k–£150k fixed-fee projects. Delivered in weeks, not months.

When given a new inbound lead, you:
1. Research the company based on name and email domain
2. Score the lead: HIGH / MEDIUM / LOW with one-line reasoning
3. Write a short company snapshot (2-3 sentences)
4. Identify the top 2 pain points Kelriva can solve for them specifically
5. Draft a personalised first outreach reply email (5-7 sentences, consultative tone, no fluff, no "I hope this email finds you well", reference their specific vertical and service interest)

Respond in this exact JSON format:
{
  "score": "HIGH" | "MEDIUM" | "LOW",
  "score_reason": "one sentence",
  "company_snapshot": "2-3 sentences about the company",
  "pain_points": ["pain point 1", "pain point 2"],
  "draft_email": "full email draft with subject line on first line starting with Subject:"
}`,
    messages: [
      {
        role: 'user',
        content: `New inbound lead:
- Name: ${first_name || 'Unknown'}
- Company: ${company_name || 'Unknown'}
- Email: ${email} (domain: ${emailDomain})
- Phone: ${phone_number || 'Not provided'}
- Vertical: ${vertical || 'Not specified'}
- Service interest: ${service || 'Not specified'}
- Message: ${message || 'No message'}

Analyse this lead and respond in the JSON format specified.`,
      },
    ],
  })
  } catch (e) {
    console.error('Anthropic API error:', e)
    return NextResponse.json({ ok: false, error: 'Anthropic API error', detail: String(e) }, { status: 500 })
  }

  // ── Parse Claude response ──────────────────────────────────────────────────
  let analysis: {
    score: string
    score_reason: string
    company_snapshot: string
    pain_points: string[]
    draft_email: string
  }

  try {
    const block = agentResponse.content[0]
    const raw = block.type === 'text' ? (block as { type: 'text'; text: string }).text : ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    analysis = JSON.parse(jsonMatch?.[0] || '{}')
  } catch (e) {
    console.error('Agent parse error:', e)
    return NextResponse.json({ ok: false, error: 'Agent response parse error', detail: String(e) }, { status: 500 })
  }

  const scoreColor = analysis.score === 'HIGH' ? '#00e09c' : analysis.score === 'MEDIUM' ? '#f5b642' : '#6b5548'

  const [subjectLine, ...emailBody] = (analysis.draft_email || '').split('\n')
  const emailBodyText = emailBody.join('\n').trim()

  // ── Send research report to info@kelriva.ai ────────────────────────────────
  await resend.emails.send({
    from:    'Kelriva Agent <onboarding@resend.dev>',
    to:      ['info@kelriva.ai'],
    subject: `[${analysis.score}] Lead Intelligence: ${first_name} — ${company_name}`,
    html: `
      <div style="font-family:monospace;background:#0d0a08;color:#ede5dc;padding:32px;max-width:680px">

        <div style="border-top:2px solid #d63545;padding-top:24px;margin-bottom:28px">
          <span style="color:#d63545;font-size:11px;letter-spacing:0.2em;text-transform:uppercase">// Kelriva AI — Lead Intelligence Report</span>
        </div>

        <!-- Lead info -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
          <tr><td style="padding:6px 0;color:#6b5548;font-size:12px;width:140px">Name</td><td style="color:#fff;font-size:14px">${first_name || '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b5548;font-size:12px">Company</td><td style="color:#fff;font-size:14px">${company_name || '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b5548;font-size:12px">Email</td><td style="font-size:14px"><a href="mailto:${email}" style="color:#d63545">${email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b5548;font-size:12px">Phone</td><td style="color:#fff;font-size:14px">${phone_number || '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b5548;font-size:12px">Vertical</td><td style="color:#fff;font-size:14px">${vertical || '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b5548;font-size:12px">Service</td><td style="color:#fff;font-size:14px">${service || '—'}</td></tr>
          <tr><td style="padding:6px 0;color:#6b5548;font-size:12px">Message</td><td style="color:#ede5dc;font-size:13px">${message || '—'}</td></tr>
        </table>

        <!-- Score -->
        <div style="border:1px solid ${scoreColor}33;padding:20px;margin-bottom:28px">
          <div style="font-size:11px;color:#6b5548;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:10px">// Lead Score</div>
          <div style="font-size:2rem;font-weight:700;color:${scoreColor};margin-bottom:8px">${analysis.score}</div>
          <div style="font-size:13px;color:#ede5dc">${analysis.score_reason || ''}</div>
        </div>

        <!-- Company snapshot -->
        <div style="margin-bottom:28px">
          <div style="font-size:11px;color:#6b5548;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:10px">// Company Snapshot</div>
          <p style="font-size:13px;color:#ede5dc;line-height:1.8;margin:0">${analysis.company_snapshot || '—'}</p>
        </div>

        <!-- Pain points -->
        <div style="margin-bottom:28px">
          <div style="font-size:11px;color:#6b5548;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:10px">// Top Pain Points Kelriva Can Solve</div>
          ${(analysis.pain_points || []).map(p => `
            <div style="display:flex;gap:10px;margin-bottom:8px">
              <span style="color:#d63545;flex-shrink:0">→</span>
              <span style="font-size:13px;color:#ede5dc">${p}</span>
            </div>
          `).join('')}
        </div>

        <!-- Draft email -->
        <div style="border:1px solid rgba(214,53,69,.2);padding:24px;margin-bottom:28px">
          <div style="font-size:11px;color:#d63545;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px">// Draft Outreach Email — Review &amp; Send</div>
          <div style="font-size:12px;color:#6b5548;margin-bottom:8px">${subjectLine || ''}</div>
          <div style="font-size:13px;color:#ede5dc;line-height:1.9;white-space:pre-line">${emailBodyText}</div>
        </div>

        <!-- Reply button -->
        <a href="mailto:${email}?subject=${encodeURIComponent((subjectLine || '').replace('Subject:', '').trim())}&body=${encodeURIComponent(emailBodyText)}"
           style="display:inline-block;background:#d63545;color:#0d0a08;padding:12px 28px;font-weight:700;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none">
          Send this email to ${first_name} →
        </a>

      </div>
    `,
  })

  return NextResponse.json({
    ok: true,
    score: analysis.score,
    company: company_name,
    lead: first_name,
  })
}
