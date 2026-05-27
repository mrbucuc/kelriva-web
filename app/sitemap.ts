import type { MetadataRoute } from 'next'

// Article metadata — update lastModified when content changes
const articles = [
  { slug: 'model-agnostic-infrastructure-2026',            lastModified: '2026-05-18' },
  { slug: 'amazon-ai-usage-wrong-metric',                   lastModified: '2026-05-27' },
  { slug: 'four-layer-ai-stack-audit',                      lastModified: '2026-05-18' },
  { slug: 'professional-services-document-review-70-percent', lastModified: '2026-05-18' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const articleEntries: MetadataRoute.Sitemap = articles.map(a => ({
    url: `https://kelriva.ai/insights/${a.slug}`,
    lastModified: new Date(a.lastModified),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://kelriva.ai/',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://kelriva.ai/insights',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articleEntries,
  ]
}
