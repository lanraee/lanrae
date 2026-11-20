import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/success', '/profile'] },
    sitemap: 'https://lanrae.co.uk/sitemap.xml',
  };
}
