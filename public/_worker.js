export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Define known application routes and their corresponding HTML files
    const routeMap = {
      '/': '/index.html',
      '/about': '/about/index.html',
      '/projects': '/projects/index.html',
      '/contact': '/contact/index.html',
      '/public-transportation': '/public-transportation/index.html',
      '/macbook-pro-opencore': '/macbook-pro-opencore/index.html',
      '/macos-apple-tv': '/macos-apple-tv/index.html'
    };

    // Check if the request is for a static asset
    if (
      url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/images/') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.gif')
    ) {
      // Let Cloudflare Pages handle static assets directly
      return env.ASSETS.fetch(request);
    }

    // For known routes, serve the corresponding HTML file
    if (routeMap[url.pathname]) {
      return env.ASSETS.fetch(`${url.origin}${routeMap[url.pathname]}`);
    }

    // For any other routes, try to fetch the actual resource first
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) {
        return response;
      }
    } catch (e) {
      // If there's an error fetching the resource, log it and fall back to index.html
      console.error('Error fetching resource:', e);
    }

    // Fall back to index.html for client-side routing
    return env.ASSETS.fetch(`${url.origin}/index.html`);
  }
};
