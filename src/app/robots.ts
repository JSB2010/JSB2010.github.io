import { MetadataRoute } from 'next';

// Add static export configuration
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://jacobbarkin.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/*.json$',
        '/admin/',
        '/admin/*',
        '/.github/',
        '/node_modules/',
        '/functions/',
        '/scripts/',
        '/docs/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
