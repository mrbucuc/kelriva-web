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
    title:    'Why Model-Agnostic AI Infrastructure Is the Most Important Decision You\'ll Make in 2026',
    category: 'news-analysis',
    date:     '2026-05-18',
    readTime: 5,
    excerpt:  'Real transaction data from 50,000+ businesses shows Anthropic\'s Claude overtaking OpenAI in enterprise adoption. The lesson isn\'t which model to choose — it\'s how to build so you\'re never forced to choose again.',
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
