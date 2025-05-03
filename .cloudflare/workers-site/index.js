// This file is used by Cloudflare Pages to configure the Workers site
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * The DEBUG flag will do two things:
 * 1. We will skip caching on the edge, which makes it easier to debug
 * 2. We will return an error message on exception in your Response rather than the default 500 page
 */
const DEBUG = false;

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  let options = {};

  try {
    if (DEBUG) {
      options.cacheControl = {
        bypassCache: true,
      };
    }

    const url = new URL(event.request.url);
    const pathname = url.pathname;

    // If the URL ends with a trailing slash, redirect to the non-trailing slash version
    if (pathname.endsWith('/') && pathname !== '/') {
      const redirectUrl = new URL(url);
      redirectUrl.pathname = pathname.slice(0, -1);
      return Response.redirect(redirectUrl.toString(), 301);
    }

    // Serve static assets
    return await getAssetFromKV(event, options);
  } catch (e) {
    // If an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/404.html`, req),
        });

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 });
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}
