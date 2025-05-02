// Cloudflare Pages Function to handle contact form submissions
export async function onRequest(context) {
  // Set CORS headers to allow requests from your domains
  const headers = {
    'Access-Control-Allow-Origin': '*', // In production, you should restrict this to your domains
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // Only allow POST requests
  if (context.request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

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
