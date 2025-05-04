// Cloudflare Pages Function for contact form submissions
export async function onRequest(context) {
  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  });

  // Handle OPTIONS requests for CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST requests
  if (context.request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    console.log('Processing contact form submission...');

    // Get form data from request body
    const data = await context.request.json();
    const { name, email, subject, message } = data;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Prepare submission data
    const submissionData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      timestamp: new Date().toISOString(),
      userAgent: context.request.headers.get('User-Agent') || 'Unknown',
      source: 'cloudflare_pages_function',
      ipAddress: context.request.headers.get('CF-Connecting-IP') || 'Unknown'
    };

    console.log('Submission data:', JSON.stringify(submissionData));

    // Send email notification
    try {
      // Import the email notification function
      const { sendEmailNotification } = await import('./email-notification.js');

      // Send the email notification
      const emailResult = await sendEmailNotification(submissionData);
      console.log('Email notification result:', emailResult);
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails - we don't want to block the form submission
    }

    // Log the submission
    console.log('Contact form submission received:', submissionData);

    // Return a success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        id: `cf-${Date.now()}`
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error processing contact form submission:', error);

    return new Response(
      JSON.stringify({
        error: 'Failed to process form submission',
        message: error.message
      }),
      { status: 500, headers }
    );
  }
}
