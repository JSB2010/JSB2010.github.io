// Test script to verify email sending works
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'jacobsamuelbarkin@gmail.com',
    pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD // Try both environment variable names
  }
};

// Function to send a test email
async function sendTestEmail() {
  console.log('Testing email sending...');
  console.log('Email configuration:', {
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    user: emailConfig.auth.user,
    pass: emailConfig.auth.pass ? '********' : 'NOT SET'
  });

  // Check if email password is set
  if (!emailConfig.auth.pass) {
    console.error('ERROR: Email password is not set in environment variables.');
    console.error('Please set EMAIL_PASS or EMAIL_PASSWORD in your .env.local file.');
    return false;
  }

  try {
    // Create email transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Verify connection configuration
    console.log('Verifying email transport...');
    await transporter.verify();
    console.log('Email transport verified successfully!');

    // Send a test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Contact Form Test" <${emailConfig.auth.user}>`,
      to: emailConfig.auth.user,
      subject: 'Test Email from Contact Form',
      text: 'This is a test email to verify that email sending works correctly.',
      html: '<p>This is a test email to verify that email sending works correctly.</p>'
    });

    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);

    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check your email and password.');
      console.error('If you\'re using Gmail, make sure you\'re using an App Password, not your regular password.');
      console.error('You can create an App Password at: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ESOCKET') {
      console.error('Socket error. This could be due to network issues or firewall restrictions.');
    }
    
    return false;
  }
}

// Run the test
sendTestEmail()
  .then(success => {
    if (success) {
      console.log('Email test completed successfully!');
      console.log('Check your inbox (and spam folder) for the test email.');
    } else {
      console.error('Email test failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
