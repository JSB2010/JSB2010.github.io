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
    subject: `New Contact Form Submission from ${formData.name}`,
    text: `
Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}

Message:
${formData.message}
    `,
    html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${formData.name}</p>
<p><strong>Email:</strong> ${formData.email}</p>
${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
<h3>Message:</h3>
<p>${formData.message.replace(/\n/g, '<br>')}</p>
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
