import { Client } from 'node-appwrite';
import nodemailer from 'nodemailer';

// This function handles contact form submissions and sends email notifications
export default async ({ req, res, log, error }) => {
  log('Contact form submission received');

  // Parse the request body if it's a POST request with JSON data
  let formData;
  try {
    if (req.method === 'POST') {
      formData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      log('Form data received:', formData);
    } else {
      return res.json({
        success: false,
        message: 'Only POST requests are supported'
      }, 405);
    }
  } catch (err) {
    error('Error parsing request body:', err);
    return res.json({
      success: false,
      message: 'Invalid request format'
    }, 400);
  }

  // Validate required fields
  if (!formData || !formData.name || !formData.email || !formData.message) {
    log('Missing required fields');
    return res.json({
      success: false,
      message: 'Missing required fields: name, email, and message are required'
    }, 400);
  }

  // Set up email transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'jacobsamuelbarkin@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER || 'jacobsamuelbarkin@gmail.com',
    to: process.env.EMAIL_USER || 'jacobsamuelbarkin@gmail.com',
    subject: `Website Contact: ${formData.subject || `Message from ${formData.name}`}`,
    text: `
=== WEBSITE CONTACT FORM SUBMISSION ===

CONTACT DETAILS
--------------
Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.subject ? `Subject: ${formData.subject}` : ''}
Date: ${new Date().toLocaleString()}

MESSAGE
-------
${formData.message}

---
This email was sent automatically from your website contact form.
`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    /* Base styles */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      background-color: #f9fafb;
    }

    /* Container */
    .container {
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin: 20px;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #0ea5e9, #3b82f6);
      color: white;
      padding: 24px;
      text-align: center;
      border-radius: 12px 12px 0 0;
    }

    .header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    /* Content */
    .content {
      padding: 24px;
    }

    /* Info table */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }

    .info-table td {
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-table td:first-child {
      font-weight: 600;
      width: 120px;
      color: #0369a1;
    }

    /* Message box */
    .message-box {
      background-color: #f9fafb;
      padding: 16px;
      border-left: 4px solid #0ea5e9;
      margin: 16px 0;
      border-radius: 0 8px 8px 0;
    }

    /* Footer */
    .footer {
      background-color: #f9fafb;
      padding: 16px 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #f0f0f0;
    }

    /* Responsive adjustments */
    @media only screen and (max-width: 480px) {
      .container {
        margin: 10px;
      }

      .header, .content, .footer {
        padding: 16px;
      }

      .info-table td {
        padding: 8px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>

    <div class="content">
      <p>You've received a new message from your website contact form:</p>

      <table class="info-table">
        <tr>
          <td>Name:</td>
          <td>${formData.name}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td><a href="mailto:${formData.email}" style="color: #0ea5e9; text-decoration: none;">${formData.email}</a></td>
        </tr>
        ${formData.phone ? `
        <tr>
          <td>Phone:</td>
          <td>${formData.phone}</td>
        </tr>
        ` : ''}
        ${formData.subject ? `
        <tr>
          <td>Subject:</td>
          <td>${formData.subject}</td>
        </tr>
        ` : ''}
        <tr>
          <td>Date:</td>
          <td>${new Date().toLocaleString()}</td>
        </tr>
      </table>

      <h3 style="color: #0369a1; margin-top: 24px; margin-bottom: 12px;">Message:</h3>
      <div class="message-box">
        ${formData.message.replace(/\n/g, '<br>')}
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${formData.email}?subject=Re: ${encodeURIComponent(formData.subject || `Message from ${formData.name}`)}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #0ea5e9, #3b82f6); color: white; text-decoration: none; border-radius: 6px; font-weight: 500; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Reply to ${formData.name}</a>
      </div>
    </div>

    <div class="footer">
      <p>This email was sent automatically from your website contact form.</p>
      <p style="margin-top: 8px; font-size: 12px;">Received on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </div>
  </div>
</body>
</html>
    `
  };

  // Send the email
  try {
    log('Attempting to send email notification...');
    await transporter.sendMail(mailOptions);
    log('Email notification sent successfully');

    return res.json({
      success: true,
      message: 'Contact form submission received and notification sent'
    });
  } catch (err) {
    error('Error sending email notification:', err);
    return res.json({
      success: false,
      message: 'Error sending notification email'
    }, 500);
  }
};
