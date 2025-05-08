// Email notification function for Appwrite
// This function is triggered when a new contact form submission is created
import nodemailer from 'nodemailer';

export default async ({ req, res, log, error }) => {
  try {
    log('Email notification function triggered');
    
    // Get the document data from the request payload
    const payload = req.body;
    log('Received payload: ' + JSON.stringify(payload));
    
    // Check if this is a database event
    if (!payload || !payload.database || !payload.database.name) {
      log('Not a database event, ignoring');
      return res.json({
        success: false,
        message: 'Not a database event'
      });
    }
    
    // Extract the document data
    const document = payload.document;
    if (!document) {
      error('No document data in payload');
      return res.json({
        success: false,
        message: 'No document data in payload'
      });
    }
    
    log('Processing document: ' + JSON.stringify(document));
    
    // Extract contact form data
    const name = document.name || 'Unknown';
    const email = document.email || 'no-email@example.com';
    const subject = document.subject || 'Contact Form Submission';
    const message = document.message || 'No message provided';
    const timestamp = document.timestamp || new Date().toISOString();
    const source = document.source || 'contact_form';
    const userAgent = document.userAgent || 'Unknown';
    const ipAddress = document.ipAddress || 'Unknown';
    
    // Format the email body
    const emailBody = formatEmailBody({
      name,
      email,
      subject,
      message,
      timestamp,
      source,
      userAgent,
      ipAddress,
      documentId: document.$id
    });
    
    // Send the email notification
    const emailResult = await sendEmailNotification({
      name,
      email,
      subject,
      message,
      emailBody
    });
    
    log('Email notification result: ' + JSON.stringify(emailResult));
    
    return res.json({
      success: true,
      message: 'Email notification sent successfully',
      result: emailResult
    });
  } catch (err) {
    error('Error in email notification function: ' + err.message);
    error(err.stack);
    
    return res.json({
      success: false,
      message: 'Error sending email notification: ' + err.message
    });
  }
};

/**
 * Format the email body
 * @param {Object} data - The contact form data
 * @returns {string} - The formatted email body
 */
function formatEmailBody(data) {
  return `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

Submission Details:
Document ID: ${data.documentId}
Timestamp: ${data.timestamp}
Source: ${data.source}
IP Address: ${data.ipAddress}
User Agent: ${data.userAgent}
`;
}

/**
 * Send an email notification
 * @param {Object} data - The contact form data
 * @returns {Promise<Object>} - The result of sending the email
 */
async function sendEmailNotification(data) {
  // Get email configuration from environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  
  if (!emailUser || !emailPassword) {
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD environment variables.');
  }
  
  // Create email transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });
  
  // Prepare email options
  const mailOptions = {
    from: `"Contact Form" <${emailUser}>`,
    to: emailUser,
    replyTo: data.email,
    subject: `New Contact Form: ${data.subject}`,
    text: data.emailBody,
    html: `<pre>${data.emailBody}</pre>`
  };
  
  // Send the email
  const info = await transporter.sendMail(mailOptions);
  
  return {
    messageId: info.messageId,
    response: info.response
  };
}
