// ─────────────────────────────────────────────────────────────────────────────
// Kelriva AI — Insights content library
// To add a new article: copy the shape below, fill in the fields, push to git.
// ─────────────────────────────────────────────────────────────────────────────

export type Category = 'news-analysis' | 'education' | 'case-study'

export type Block =
  | { t: 'p';    v: string }
  | { t: 'h2';   v: string }
  | { t: 'lead'; v: string }   // larger opening paragraph

export type Article = {
  slug:     string
  title:    string
  category: Category
  date:     string    // YYYY-MM-DD
  readTime: number    // minutes
  excerpt:  string    // 1–2 sentences shown on listing card
  body:     Block[]
  tags:     string[]
  status:   'published' | 'coming-soon'
}

export const categoryLabel: Record<Category, string> = {
  'news-analysis': 'News Analysis',
  'education':     'Education',
  'case-study':    'Case Study',
}

// ── Articles (newest first) ──────────────────────────────────────────────────

export const articles: Article[] = [
  {
    slug:     'model-agnostic-infrastructure-2026',
    title:    'Model-Agnostic AI Infrastructure: The 2026 Enterprise Decision',
    category: 'news-analysis',
    date:     '2026-05-18',
    readTime: 5,
    excerpt:  'Real data from 50,000+ businesses shows why model-agnostic AI infrastructure is the most critical enterprise decision of 2026. Build to never be locked in again.',
    status:   'published',
    tags:     ['Enterprise AI', 'AI Strategy', 'London Tech', 'LLM'],
    body: [
      {
        t: 'lead',
        v: 'Anthropic just overtook OpenAI in enterprise AI spend. For the first time. Real transaction data from 50,000+ businesses shows Claude pulling ahead of ChatGPT in paid adoption — and if that surprises you, you\'re not alone. Twelve months ago, the AI market looked settled. It isn\'t.',
      },
      { t: 'h2', v: 'What the Data Actually Shows' },
      {
        t: 'p',
        v: 'The number that caught the industry\'s attention came from Ramp, a US fintech company that processes corporate card and invoice payments for over 50,000 businesses. In April 2026, their AI Index showed Anthropic\'s Claude at 34.4% of enterprise AI adoption, nudging past OpenAI\'s ChatGPT at 32.3%.',
      },
      {
        t: 'p',
        v: 'The reason this data matters more than most AI rankings is because of how it was collected. This isn\'t a survey asking IT managers which tools they prefer, or a poll of tech enthusiasts on social media. It is spend data — real payments made by real finance departments to real AI vendors. When a company pays for an AI tool, they are using it. That signal is about as clean as data gets.',
      },
      {
        t: 'p',
        v: 'What the trend shows is equally striking. Anthropic\'s business adoption has quadrupled since 2025. And the growth hasn\'t stayed inside engineering teams. Claude has moved into finance departments, legal teams, and research functions — exactly the areas where enterprise value gets created and where the cost of disruption is highest.',
      },
      {
        t: 'p',
        v: 'This is the AI market in motion. And it is moving faster than most business strategies are built to handle.',
      },
      { t: 'h2', v: 'The Real Lesson: It\'s Not "Switch to Claude"' },
      {
        t: 'p',
        v: 'The temptation, reading that data, is to treat it as a product recommendation. It isn\'t. The real lesson is something more uncomfortable: the AI tools that looked like safe, long-term bets last year are already being challenged. And if you\'ve built your internal processes around any single AI platform, you are exposed to risks that most teams haven\'t fully stress-tested.',
      },
      {
        t: 'p',
        v: 'Consider what lock-in actually looks like in practice.',
      },
      {
        t: 'p',
        v: 'Your team builds an automated workflow — perhaps contract summarisation for your legal department, or client report generation for your finance team. It works well. Then the AI provider restructures its pricing. We saw exactly this in May 2026 when Anthropic split its agent usage into a separate credit pool, triggering an immediate cost increase for power users and widespread disruption to workflows that had been running reliably for months. For some teams, automations simply stopped working until they rebuilt them under a new pricing structure.',
      },
      {
        t: 'p',
        v: 'That\'s the mild version of lock-in. The more serious version is architectural. If your data pipelines, your document processing logic, and your automation rules are all written to work with one provider\'s specific behaviour — its formatting, its response structure, its particular quirks — then migrating to a different model isn\'t a settings change. It\'s a rebuild project. Potentially a significant one.',
      },
      {
        t: 'p',
        v: 'The AI market in 2026 is competitive enough that pricing, capability, and reliability will keep shifting. Lock-in means you absorb every one of those shifts.',
      },
      { t: 'h2', v: 'What to Do About It: Infrastructure That Doesn\'t Pick Sides' },
      {
        t: 'p',
        v: 'Model-agnostic AI infrastructure sounds technical, but the idea behind it is straightforward. Think of it like this: if your business uses a fleet of company cars, you don\'t redesign your logistics operation every time you switch from Ford to Toyota. The roads, the drivers, the delivery routes — all of that stays the same. Only the vehicle changes.',
      },
      {
        t: 'p',
        v: 'Model-agnostic AI infrastructure applies the same logic to AI. Your business data, your document processing workflows, your automation rules, and your decision logic all sit on a layer that is independent of any single AI provider. When one model improves — or gets more expensive, or goes down — you swap it out without rebuilding everything that sits above it.',
      },
      {
        t: 'p',
        v: 'In practice, this means your AI system is designed around your data and your processes first, with the AI model treated as a component that can be updated, replaced, or run in combination with others. For a Finance Director, the analogy is straightforward: it is the difference between buying software that only runs on one operating system, and buying software that works anywhere.',
      },
      {
        t: 'p',
        v: 'This is what Kelriva AI builds for clients. Not solutions tied to a single tool or platform, but AI infrastructure designed around how your business actually works — robust, cost-observable, and built to stay useful as the market keeps moving.',
      },
      { t: 'h2', v: 'A Question Worth Sitting With' },
      {
        t: 'p',
        v: 'If your current AI provider doubled its prices tomorrow, or suffered a week-long outage, or simply got outperformed by a competitor — what inside your business would break first? And how long would it take you to fix it?',
      },
      {
        t: 'p',
        v: 'That answer tells you more about your AI strategy than any benchmark.',
      },
    ],
  },
  {
    slug:     'amazon-ai-usage-wrong-metric',
    title:    'Stop Measuring AI Usage — Track This Instead',
    category: 'news-analysis',
    date:     '2026-05-26',
    readTime: 5,
    status:   'published',
    excerpt:  'Amazon\'s internal data revealed a counterintuitive truth: winning businesses don\'t measure AI usage — they measure what changes because of it. Here\'s the framework.',
    tags:     ['Enterprise AI', 'AI Strategy', 'Productivity', 'ROI'],
    body: [
      {
        t: 'lead',
        v: 'Amazon recently shared an uncomfortable finding from its internal AI rollout: teams that tracked AI usage — prompts sent, tools activated, hours spent with AI — showed almost no correlation with business outcomes. The teams that moved faster, made better decisions, and cut costs were measuring something else entirely.',
      },
      { t: 'h2', v: 'The Metric That Looks Right But Isn\'t' },
      {
        t: 'p',
        v: 'When a business deploys AI, the natural instinct is to measure adoption. How many staff are using it? How often? Which departments have the highest engagement? These numbers feel like progress. They are easy to report to a board. They give the impression of transformation.',
      },
      {
        t: 'p',
        v: 'The problem is that usage is an input metric, not an outcome metric. A legal team can log hundreds of AI interactions a week and still be producing the same volume of work, at the same quality, for the same cost. The AI is being used. Nothing has changed.',
      },
      {
        t: 'p',
        v: 'Amazon\'s internal analysis found exactly this pattern. High usage rates in some teams were masking the fact that the AI had been bolted onto existing processes without changing those processes. Staff were using AI as a faster typewriter. The workflow underneath — the approvals, the handoffs, the review cycles — remained untouched.',
      },
      { t: 'h2', v: 'What the High-Performing Teams Were Measuring Instead' },
      {
        t: 'p',
        v: 'The teams that demonstrated real ROI from AI were tracking outcomes, not activity. Specifically, they were asking three questions on a regular cadence.',
      },
      {
        t: 'p',
        v: 'First: what decisions are being made faster? Not "are we using AI to help with decisions" — but which specific decisions now take hours instead of days, and what is the downstream value of that speed? For a finance team, faster credit decisions have a direct revenue impact. For a legal team, faster contract review shortens deal cycles. The AI is only valuable if it changes the decision timeline.',
      },
      {
        t: 'p',
        v: 'Second: where has human review been meaningfully reduced? This is different from asking whether humans are still in the loop. The question is whether the AI has genuinely absorbed work that previously required senior attention. If a compliance officer still reads every document the AI has already processed, the AI has added a step, not removed one. The metric to track is reduction in review hours per output unit — not whether AI was involved.',
      },
      {
        t: 'p',
        v: 'Third: what errors or rework have decreased? AI-assisted processes frequently reduce certain classes of error — missed clauses in contracts, miscategorised transactions, inconsistent formatting in reports. Tracking error rates before and after AI implementation gives you a concrete quality metric that translates directly into cost avoided.',
      },
      { t: 'h2', v: 'Why This Distinction Matters for How You Build' },
      {
        t: 'p',
        v: 'The difference between usage metrics and outcome metrics is not just a reporting preference. It determines how you architect your AI systems in the first place.',
      },
      {
        t: 'p',
        v: 'If you are optimising for usage, you deploy tools broadly and let teams find their own workflows. The AI sits alongside existing processes. Adoption is the goal. This is the approach most enterprise software vendors encourage — it maximises seat licences and looks good in quarterly reviews.',
      },
      {
        t: 'p',
        v: 'If you are optimising for outcomes, you start with the process you want to change and work backwards to the AI capability required to change it. You instrument the process before and after. You define what success looks like in hours saved, errors reduced, or decisions accelerated — before you write a line of code. The AI is embedded into the workflow, not added beside it.',
      },
      {
        t: 'p',
        v: 'This is a harder build. It requires understanding your business processes in detail, identifying where AI genuinely creates leverage, and being willing to redesign workflows rather than simply augment them. Most internal teams don\'t have the time or the mandate to do this work properly. Which is why the gap between high-performing and low-performing AI adopters keeps widening.',
      },
      { t: 'h2', v: 'A Simple Audit to Start With' },
      {
        t: 'p',
        v: 'If you want to understand where your business stands, start with one process — not your entire AI strategy. Pick the workflow where you have already deployed AI, or where you are considering it. Then answer four questions.',
      },
      {
        t: 'p',
        v: 'What is the current cycle time for this process, from input to output? What does one unit of error in this process cost you — in time, rework, or risk? What decision or action at the end of this process creates the most business value? And if AI cut the cycle time by 60%, what would you do with the capacity freed?',
      },
      {
        t: 'p',
        v: 'Those four answers tell you whether there is a genuine ROI case for AI in that process — and what you would need to measure to prove it. If you can\'t answer the last question, the process probably isn\'t the right place to start.',
      },
      {
        t: 'p',
        v: 'The businesses that will extract durable value from AI are not the ones with the highest usage rates. They are the ones that knew what they were measuring before they started building.',
      },
    ],
  },
  {
    slug:     'four-layer-ai-stack-audit',
    title:    'Our 4-Layer AI Readiness Audit (60 Min)',
    category: 'education',
    date:     '2026-06-02',
    readTime: 6,
    status:   'published',
    excerpt:  'Before writing a line of code, we run every client through the same 60-minute audit. Four layers, four questions — a clear picture of where AI creates value vs. cost.',
    tags:     ['AI Strategy', 'Enterprise AI', 'AI Readiness', 'Consultancy'],
    body: [
      {
        t: 'lead',
        v: 'Every client engagement at Kelriva AI starts the same way. Before we discuss technology, before we talk about timelines, and before anyone opens a laptop, we run a 60-minute audit across four layers of the business. It is the most valuable hour we spend together.',
      },
      {
        t: 'p',
        v: 'Most AI projects that fail do so for reasons that were visible before the first line of code was written. Processes that were not documented. Data that was less clean than anyone assumed. Integration dependencies that nobody had mapped. Compliance requirements that only surfaced halfway through a build.',
      },
      {
        t: 'p',
        v: 'The audit exists to surface those issues early, when they are cheap to address. Here is how it works.',
      },
      { t: 'h2', v: 'Layer 1: Process' },
      {
        t: 'p',
        v: 'We start by asking a deceptively simple question: where does time actually go in this business?',
      },
      {
        t: 'p',
        v: 'Not where people think time goes. Not what shows up in a job description. We want to know what a senior person in the team spends their first two hours on each morning, what tasks get pushed to Friday afternoons, and which processes have informal workarounds that nobody has ever written down.',
      },
      {
        t: 'p',
        v: 'AI creates the most value in processes that are high-volume, repetitive, and have clear inputs and outputs. Document review, data extraction, report generation, client onboarding checks. Processes that require judgment, creativity, or relationship management are usually poor candidates, at least as a starting point.',
      },
      {
        t: 'p',
        v: 'By the end of layer one, we have a ranked list of candidate processes. The top three or four are where we focus the rest of the audit.',
      },
      { t: 'h2', v: 'Layer 2: Data' },
      {
        t: 'p',
        v: 'AI systems run on data. The quality of what you build is directly limited by the quality of what you feed it.',
      },
      {
        t: 'p',
        v: 'In layer two we look at what data exists for each candidate process, where it lives, and what state it is in. This is where most businesses get a surprise. Data that feels accessible often turns out to be spread across multiple systems, inconsistently formatted, partially missing, or locked inside PDFs that no one has ever needed to parse programmatically before.',
      },
      {
        t: 'p',
        v: 'We are not looking for perfect data. Perfect data does not exist. We are looking for data that is good enough to build on, with a clear path to improving it over time. If the data is genuinely too fragmented to work with, we say so clearly at this stage rather than discovering it six weeks into a build.',
      },
      {
        t: 'p',
        v: 'For most clients, two or three weeks of light data preparation before we begin building saves three times that in rework later.',
      },
      { t: 'h2', v: 'Layer 3: Integration' },
      {
        t: 'p',
        v: 'An AI system does not exist in isolation. It needs to receive inputs from somewhere, and it needs to send outputs somewhere. Layer three maps every system the AI will touch.',
      },
      {
        t: 'p',
        v: 'We look at what APIs are available, what is only accessible via manual export, what requires a third-party connector, and what the IT or security team will need to approve before any integration goes live. In regulated industries, this layer also covers data residency. Where the data is stored and processed matters for GDPR compliance and sector-specific regulation, and those constraints shape the architecture of the whole system.',
      },
      {
        t: 'p',
        v: 'Integration complexity is the most common source of scope creep in AI projects. Identifying it upfront means we can price and plan for it accurately, not discover it mid-build.',
      },
      { t: 'h2', v: 'Layer 4: Risk and Governance' },
      {
        t: 'p',
        v: 'The final layer is the one most technical teams skip entirely, and the one that causes the most problems in deployment.',
      },
      {
        t: 'p',
        v: 'We ask who in the business is accountable for decisions the AI will influence. What happens if the AI produces an error? Who reviews its outputs, and how often? What is the escalation path when something falls outside normal parameters? For financial services and legal clients especially, these questions have regulatory dimensions that need to be answered before any system goes near production.',
      },
      {
        t: 'p',
        v: 'We also look at internal appetite for change. An AI system that works perfectly but that the team does not trust will not get used. Understanding who the sceptics are, and what their concerns are, shapes how we design the handoff between the AI and the humans working alongside it.',
      },
      {
        t: 'p',
        v: 'Governance is not a blocker to building. It is a design input. The businesses that treat it that way ship faster and with fewer post-launch problems.',
      },
      { t: 'h2', v: 'What You Get at the End' },
      {
        t: 'p',
        v: 'After 60 minutes across these four layers, we produce a short written summary. It covers which process we recommend tackling first and why, what the data preparation requirements are, which integrations are straightforward and which need more investigation, and any governance or compliance considerations to address before build begins.',
      },
      {
        t: 'p',
        v: 'It is not a lengthy report. It is a clear map of where to start, what the real constraints are, and what a realistic first phase looks like. Most clients tell us it is the most honest conversation they have had about AI in their business.',
      },
      {
        t: 'p',
        v: 'If you want to run through it for your business, that is exactly what a discovery call is for.',
      },
    ],
  },
  {
    slug:     'professional-services-document-review-70-percent',
    title:    'How We Cut Document Review Time by 70%',
    category: 'case-study',
    date:     '2026-06-09',
    readTime: 7,
    status:   'coming-soon',
    excerpt:  'A City firm was spending 3 days a week on document review. We rebuilt it with AI — it now takes half a day. Here\'s exactly what we built, how it works, and what it cost.',
    tags:     ['Case Study', 'IDP', 'Document Automation', 'London'],
    body:     [],
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getArticle(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  })
}
