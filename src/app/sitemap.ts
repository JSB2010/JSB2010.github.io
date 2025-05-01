import { MetadataRoute } from 'next';

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
