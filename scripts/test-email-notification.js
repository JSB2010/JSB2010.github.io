// Test script for email notification function
const nodemailer = require('nodemailer');

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'jacobsamuelbarkin@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
};

// Test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Email Notification',
  message: 'This is a test message to verify the email notification functionality.',
  timestamp: new Date().toISOString(),
  source: 'test_script'
};

// Function to send test email
async function sendTestEmail() {
  console.log('Testing email notification...');
  
  try {
    // Create email transporter
    const transporter = nodemailer.createTransport(emailConfig);
    
    // Format the email content
    const subject = `Test: New Contact Form Submission: ${testData.subject}`;
    const text = `
TEST EMAIL - PLEASE IGNORE

New Contact Form Submission

Name: ${testData.name}
Email: ${testData.email}
Subject: ${testData.subject}

Message:
${testData.message}

Timestamp: ${testData.timestamp}
Source: ${testData.source}

This is a test email to verify the email notification functionality.
`;
    
    // Send the email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"Contact Form Test" <${emailConfig.auth.user}>`,
      to: emailConfig.auth.user,
      subject: subject,
      text: text
    });
    
    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
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
      console.log('Please check your email configuration and try again.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
