// Cloudflare Pages Function to handle contact form submissions

// Default handler for all HTTP methods
export async function onRequest(context) {
  // Get the HTTP method from the request
  const method = context.request.method.toUpperCase();

  // Return a 405 Method Not Allowed for methods other than POST and OPTIONS
  if (method !== 'POST' && method !== 'OPTIONS') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // For POST and OPTIONS, the specific handlers will be called
  // This is just a fallback in case the routing doesn't work as expected
  return new Response(JSON.stringify({ error: 'Something went wrong' }), {
    status: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// Handle POST requests for form submissions
export async function onRequestPost(context) {
  // Set CORS headers to allow requests from your domains
  const headers = {
    'Access-Control-Allow-Origin': '*', // In production, you should restrict this to your domains
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // We're already in the onRequestPost handler, so we know it's a POST request

  try {
    // Parse the request body
    const body = await context.request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers
      });
    }

    // Log the submission (this will appear in the Cloudflare Pages logs)
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
