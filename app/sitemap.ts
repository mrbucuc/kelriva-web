import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
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
    {
      url: 'https://kelriva.ai/insights/model-agnostic-infrastructure-2026',
      lastModified: new Date('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://kelriva.ai/insights/amazon-ai-usage-wrong-metric',
      lastModified: new Date('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://kelriva.ai/insights/four-layer-ai-stack-audit',
      lastModified: new Date('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://kelriva.ai/insights/professional-services-document-review-70-percent',
      lastModified: new Date('2026-05-18'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
