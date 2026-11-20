import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: 'desc' },
    });
  } catch { /* non-fatal — sitemap still serves static routes */ }

  const now = new Date();

  return [
    { url: 'https://lanrae.co.uk',          lastModified: now, changeFrequency: 'weekly',  priority: 1 },
    { url: 'https://lanrae.co.uk/store',    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://lanrae.co.uk/members',  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://lanrae.co.uk/blog',     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://lanrae.co.uk/fans',     lastModified: now, changeFrequency: 'weekly',  priority: 0.6 },
    { url: 'https://lanrae.co.uk/request',  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://lanrae.co.uk/support',  lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://lanrae.co.uk/about',    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://lanrae.co.uk/trove',    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://lanrae.co.uk/tools',    lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://lanrae.co.uk/radio',    lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://lanrae.co.uk/play',     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://lanrae.co.uk/browser',  lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ...posts.map(p => ({
      url: `https://lanrae.co.uk/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
