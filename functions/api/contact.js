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

    // Get environment variables
    const appwriteEndpoint = context.env.APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
    const appwriteProjectId = context.env.APPWRITE_PROJECT_ID || "6816ef35001da24d113d";
    const appwriteApiKey = context.env.APPWRITE_API_KEY;
    const databaseId = context.env.APPWRITE_DATABASE_ID || "contact-form-db";
    const collectionId = context.env.APPWRITE_CONTACT_COLLECTION_ID || "contact-submissions";

    // Log configuration (without exposing sensitive values)
    console.log("Appwrite configuration:", {
      endpoint: appwriteEndpoint,
      projectId: appwriteProjectId,
      hasApiKey: !!appwriteApiKey,
      databaseId,
      collectionId
    });

    // Create a unique document ID
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      // Make request to Appwrite API
      const response = await fetch(
        `${appwriteEndpoint}/databases/${databaseId}/collections/${collectionId}/documents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Project": appwriteProjectId,
            "X-Appwrite-Key": appwriteApiKey
          },
          body: JSON.stringify({
            documentId: uniqueId,
            data: submissionData
          })
        }
      );

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Appwrite API error:", errorData);

        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to save submission to database",
            message: errorData.message || "Unknown error"
          }),
          { status: 500, headers }
        );
      }

      const result = await response.json();
      console.log("Successfully submitted to Appwrite:", result);
    } catch (error) {
      console.error("Error submitting to Appwrite:", error);
      // Continue with email notification even if Appwrite submission fails
    }

    // Send email notification
    const emailBody = `
New contact form submission:

Name: ${name}
Email: ${email}
Subject: ${subject || 'Contact Form Submission'}

Message:
${message}

Timestamp: ${submissionData.timestamp}
Source: ${submissionData.source}
IP Address: ${submissionData.ipAddress}
User Agent: ${submissionData.userAgent}
`;

    // Log the email content (in a real implementation, you would send an actual email)
    console.log('Email notification would be sent with the following content:');
    console.log(emailBody);

    // Return a success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        id: uniqueId
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
