// Cloudflare Pages Function for contact form submissions using Appwrite
import { Client, Databases, ID } from 'appwrite';
import { formatEmailBody } from '../../src/lib/appwrite/email-service';

// Initialize Appwrite client (server-side)
const initAppwrite = (env) => {
  const client = new Client();

  // Use environment variables from context.env in Cloudflare Pages
  client
    .setEndpoint(env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d')
    .setKey(env.APPWRITE_API_KEY || 'your-api-key'); // Server API key

  return {
    client,
    databases: new Databases(client)
  };
};

export async function onRequest(context) {
  console.log('Contact form function called with method:', context.request.method);

  // Set CORS headers
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  });

  // Log environment variables (without exposing sensitive values)
  console.log('Environment variables check:', {
    hasAppwriteEndpoint: !!context.env.APPWRITE_ENDPOINT,
    hasAppwriteProjectId: !!context.env.APPWRITE_PROJECT_ID,
    hasAppwriteApiKey: !!context.env.APPWRITE_API_KEY,
    hasAppwriteDatabaseId: !!context.env.APPWRITE_DATABASE_ID,
    hasAppwriteCollectionId: !!context.env.APPWRITE_CONTACT_COLLECTION_ID
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

    console.log('Submitting to Appwrite...');

    try {
      // Initialize Appwrite with environment variables from context.env
      const { databases } = initAppwrite(context.env);

      const databaseId = context.env.APPWRITE_DATABASE_ID || 'contact-form-db';
      const collectionId = context.env.APPWRITE_CONTACT_COLLECTION_ID || 'contact-submissions';

      // Submit to Appwrite Database
      const document = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        submissionData
      );

      console.log(`Successfully submitted to Appwrite with ID: ${document.$id}`);
    } catch (appwriteError) {
      console.error('Error submitting to Appwrite:', appwriteError);

      // If Appwrite submission fails, we'll still try to send the email
      // but we'll include the error in the response
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save submission to database',
          message: appwriteError.message
        }),
        { status: 500, headers }
      );
    }

    // Format email body
    const emailBody = formatEmailBody(submissionData);

    // Log the email content (in a real implementation, you would send an actual email)
    console.log('Email notification would be sent with the following content:');
    console.log(emailBody);

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
        success: false,
        error: 'Failed to process form submission',
        message: error.message
      }),
      { status: 500, headers }
    );
  }
}
