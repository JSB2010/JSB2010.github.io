// Cloudflare Pages Function for contact form submissions using Appwrite
import { Client, Databases, ID } from 'appwrite';
import { formatEmailBody } from '../../src/lib/appwrite/email-service';

// CORS headers for cross-origin requests
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Handle OPTIONS request for CORS preflight
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers
  });
}

// Initialize Appwrite client (server-side)
function initAppwrite(env) {
  const client = new Client();

  // Use environment variables from context.env in Cloudflare Pages
  client
    .setEndpoint(env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d')
    .setKey(env.APPWRITE_API_KEY || ''); // Server API key

  return {
    client,
    databases: new Databases(client)
  };
}

export async function onRequest(context) {
  // Handle CORS preflight request
  if (context.request.method === 'OPTIONS') {
    return handleOptions();
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

    // Prepare submission data - only include fields that are defined in the Appwrite collection schema
    const submissionData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message
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
          id: document.$id
        }),
        { status: 200, headers }
      );
    } catch (error) {
      console.error('Error submitting to Appwrite:', error);

      // Try to extract Appwrite error details
      let errorMessage = 'Failed to submit to database';
      if (error.response && error.response.message) {
        errorMessage = error.response.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Database error',
          message: errorMessage
        }),
        { status: 500, headers }
      );
    }
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
