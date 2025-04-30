export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
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
      // Let Cloudflare Pages handle static assets
      return env.ASSETS.fetch(request);
    }
    
    // For all other routes, serve the index.html file
    // This enables client-side routing
    return env.ASSETS.fetch(`${url.origin}/index.html`);
  }
};
