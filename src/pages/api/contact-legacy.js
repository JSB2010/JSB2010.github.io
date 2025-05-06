// Legacy API route for contact form submissions (Pages Router)
// This file has been renamed to avoid conflicts with the App Router implementation
// Use the unified API endpoint /api/contact-unified instead
import { sendContactFormEmail } from '../../lib/email-service';

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
    const { name, email, subject, message } = req.body;

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
      timestamp: new Date().toISOString()
    });

    // Send an email notification
    try {
      await sendContactFormEmail({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message
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
      id: `pages-${Date.now()}`
    });
  } catch (error) {
    console.error('Error processing contact form submission:', error);

    res.status(500).json({
      error: 'Failed to process form submission',
      message: error.message
    });
  }
}