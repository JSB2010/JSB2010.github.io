// API route for contact form submissions using Appwrite
import { Client, Databases, ID } from 'appwrite';
import { sendContactFormEmail } from '../../lib/appwrite/email-service';

// Initialize Appwrite client (server-side)
const initAppwrite = () => {
  const client = new Client();

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d')
    .setKey(process.env.APPWRITE_API_KEY || 'your-api-key'); // Server API key

  return {
    client,
    databases: new Databases(client)
  };
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get the form data from the request body
    const { name, email, subject, message, userAgent, timestamp, source } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Log the submission (this will appear in the server logs)
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: timestamp || new Date().toISOString()
    });

    // Initialize Appwrite
    const { databases } = initAppwrite();

    // Prepare submission data
    const submissionData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || req.headers['user-agent'],
      source: source || 'contact_form_api',
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    };

    // Submit to Appwrite Database
    console.log('Submitting to Appwrite...');

    const databaseId = process.env.APPWRITE_DATABASE_ID || 'your-database-id';
    const collectionId = process.env.APPWRITE_CONTACT_COLLECTION_ID || 'contact-submissions';

    const document = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      submissionData
    );

    console.log(`Successfully submitted to Appwrite with ID: ${document.$id}`);

    // Send an email notification
    try {
      await sendContactFormEmail({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
        timestamp: timestamp || new Date().toISOString(),
        source: source || 'contact_form_api',
        ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: userAgent || req.headers['user-agent']
      });

      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails - we don't want to block the form submission
    }

    // Return a success response
    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      id: document.$id
    });
  } catch (error) {
    console.error('Error processing contact form submission:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to process form submission',
      message: error.message
    });
  }
}
