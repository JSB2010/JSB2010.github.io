import { MetadataRoute } from 'next';

// Add static export configuration
export const dynamic = 'force-static';
export const revalidate = 86400; // Revalidate once per day

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jsb2010.github.io';

  // Define all routes in your application
  const routes = [
    '',
    '/about',
    '/projects',
    '/contact',
    '/public-transportation',
    '/macbook-pro-opencore',
  ];

  // Current date for lastModified
  const date = new Date();

  // Generate sitemap entries
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: date,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
