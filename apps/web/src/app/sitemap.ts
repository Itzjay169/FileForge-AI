import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://fileforge.ai';
  const lastModified = new Date();

  const routes = [
    { url: `${baseUrl}`, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${baseUrl}/studio`, changeFrequency: 'daily' as const, priority: 0.95 },
    { url: `${baseUrl}/convert`, changeFrequency: 'daily' as const, priority: 0.95 },
    { url: `${baseUrl}/editor`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/transparency`, changeFrequency: 'weekly' as const, priority: 0.85 },
    { url: `${baseUrl}/formats`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/pricing`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/help`, changeFrequency: 'weekly' as const, priority: 0.75 },
    { url: `${baseUrl}/faq`, changeFrequency: 'weekly' as const, priority: 0.75 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/status`, changeFrequency: 'always' as const, priority: 0.7 },
    { url: `${baseUrl}/changelog`, changeFrequency: 'weekly' as const, priority: 0.75 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/dashboard`, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/legal/terms`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/legal/privacy`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/legal/refund`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/legal/acceptable-use`, changeFrequency: 'monthly' as const, priority: 0.5 }
  ];

  return routes.map((r) => ({
    ...r,
    lastModified
  }));
}
