const nodemailer = require('nodemailer');

module.exports = async function(req, res) {
  // Log the function invocation
  console.log('Email notification function triggered');

  try {
    // Parse the request body
    const payload = JSON.parse(req.payload || '{}');
    
    // Extract the document data
    const document = payload?.document || {};
    
    // Check if we have the necessary data
    if (!document.name || !document.email || !document.message) {
      console.error('Missing required fields in document');
      return res.json({
        success: false,
        message: 'Missing required fields in document'
      }, 400);
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: req.variables.EMAIL_USER || 'jacobsamuelbarkin@gmail.com',
        pass: req.variables.EMAIL_PASSWORD || 'dwzm vsxv gipu tlsi'
      }
    });

    // Format the email content
    const subject = `New Contact Form Submission: ${document.subject || 'No Subject'}`;
    const text = `
New Contact Form Submission

Name: ${document.name}
Email: ${document.email}
Subject: ${document.subject || 'No Subject'}

Message:
${document.message}

Timestamp: ${document.timestamp || new Date().toISOString()}
Source: ${document.source || 'website_contact_form'}
User Agent: ${document.userAgent || 'Not provided'}
IP Address: ${document.ipAddress || 'Not provided'}

This email was sent automatically from your website contact form.
`;

    // Send the email
    console.log('Sending email notification...');
    const info = await transporter.sendMail({
      from: `"Contact Form" <${req.variables.EMAIL_USER || 'jacobsamuelbarkin@gmail.com'}>`,
      to: req.variables.EMAIL_USER || 'jacobsamuelbarkin@gmail.com',
      subject: subject,
      text: text
    });

    console.log('Email sent successfully:', info.messageId);
    
    // Return success response
    return res.json({
      success: true,
      message: 'Email notification sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    
    // Return error response
    return res.json({
      success: false,
      message: 'Failed to send email notification',
      error: error.message
    }, 500);
  }
};
