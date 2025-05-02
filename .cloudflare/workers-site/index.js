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

    // Check if the request is for the contact form API
    const url = new URL(event.request.url);
    if (url.pathname === '/api/contact-form') {
      return await handleContactForm(event);
    }

    // Otherwise, serve static assets
    return await getAssetFromKV(event, options);
  } catch (e) {
    if (DEBUG) {
      return new Response(e.message || e.toString(), {
        status: 500,
      });
    }

    return new Response('An unexpected error occurred', {
      status: 500,
    });
  }
}

async function handleContactForm(event) {
  // Set CORS headers to allow requests from your domains
  const headers = {
    'Access-Control-Allow-Origin': '*', // In production, you should restrict this to your domains
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // Only allow POST requests
  if (event.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    // Parse the request body
    const body = await event.request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers
      });
    }

    // Log the submission (this will appear in the Cloudflare Workers logs)
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      messageLength: body.message.length,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you would send this data to a database or email service
    // For now, we'll just return a success response
    return new Response(JSON.stringify({
      success: true,
      message: 'Form submitted successfully',
      id: `cf-${Date.now()}`
    }), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to process form submission',
      message: error.message
    }), {
      status: 500,
      headers
    });
  }
}
