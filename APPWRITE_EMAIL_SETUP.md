# Appwrite Email Notification Setup Guide

This guide will help you set up email notifications for your contact form submissions in Appwrite.

## Overview

When someone submits your contact form, the data is stored in your Appwrite database. To receive email notifications for these submissions, you need to set up an Appwrite Function that is triggered whenever a new submission is created.

## Prerequisites

1. An Appwrite account with a project set up
2. A Gmail account (or other email provider)
3. An app password for your Gmail account (not your regular password)

## Step 1: Create the Email Notification Function

1. Go to your [Appwrite Console](https://cloud.appwrite.io/console)
2. Navigate to your project
3. Go to the "Functions" section in the sidebar
4. Click "Create Function"
5. Fill in the following details:
   - **Name**: Contact Form Email Notification
   - **Runtime**: Node.js 18.0
   - **Timeout**: 15 seconds
   - **Execute Permissions**: Any
6. Click "Create" to create the function

## Step 2: Set Up Environment Variables

1. In your function's details page, go to the "Variables" tab
2. Add the following variables:
   - **EMAIL_USER**: jacobsamuelbarkin@gmail.com
   - **EMAIL_PASSWORD**: Your Gmail app password (not your regular password)

## Step 3: Deploy the Function Code

1. In your function's details page, go to the "Deployments" tab
2. Click "Create Deployment"
3. Select "Manual" deployment
4. Copy and paste the following code:

```javascript
// Email notification function for Appwrite
// This function is triggered when a new contact form submission is created
const nodemailer = require('nodemailer');

module.exports = async function(req, res) {
  try {
    console.log('Email notification function triggered');
    
    // Get the document data from the request payload
    const payload = req.body;
    console.log('Received payload: ' + JSON.stringify(payload));
    
    // Check if this is a database event
    if (!payload || !payload.database || !payload.database.name) {
      console.log('Not a database event, ignoring');
      return res.json({
        success: false,
        message: 'Not a database event'
      });
    }
    
    // Extract the document data
    const document = payload.document;
    if (!document) {
      console.error('No document data in payload');
      return res.json({
        success: false,
        message: 'No document data in payload'
      });
    }
    
    console.log('Processing document: ' + JSON.stringify(document));
    
    // Extract contact form data
    const name = document.name || 'Unknown';
    const email = document.email || 'no-email@example.com';
    const subject = document.subject || 'Contact Form Submission';
    const message = document.message || 'No message provided';
    
    // Format the email body
    const emailBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Submission Details:
Document ID: ${document.$id}
Timestamp: ${new Date().toISOString()}
`;
    
    // Send the email notification
    const emailResult = await sendEmailNotification({
      name,
      email,
      subject,
      message,
      emailBody
    });
    
    console.log('Email notification result: ' + JSON.stringify(emailResult));
    
    return res.json({
      success: true,
      message: 'Email notification sent successfully',
      result: emailResult
    });
  } catch (err) {
    console.error('Error in email notification function: ' + err.message);
    console.error(err.stack);
    
    return res.json({
      success: false,
      message: 'Error sending email notification: ' + err.message
    });
  }
};

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
```

5. Add the following package.json content:

```json
{
  "name": "contact-form-email-notification",
  "version": "1.0.0",
  "description": "Email notification function for contact form submissions",
  "main": "index.js",
  "dependencies": {
    "nodemailer": "^6.9.7"
  }
}
```

6. Click "Deploy" to deploy the function

## Step 4: Set Up the Event Trigger

1. In your function's details page, go to the "Settings" tab
2. Scroll down to the "Events" section
3. Click "Add Event"
4. Select "Database" as the event type
5. Configure the event:
   - **Database**: contact-form-db (or your database name)
   - **Collection**: contact-submissions (or your collection name)
   - **Event**: Document Created
6. Click "Add" to add the event trigger

## Step 5: Test the Function

1. Submit a test message through your contact form
2. Go to your function's details page
3. Go to the "Executions" tab to see if the function was triggered
4. Check your email to see if you received the notification

## Troubleshooting

If you're not receiving email notifications:

1. Check the function logs in the "Executions" tab for any errors
2. Verify that your Gmail app password is correct
3. Check your spam folder for email notifications
4. Make sure the database event trigger is set up correctly
5. Ensure that your contact form is successfully submitting data to Appwrite

## Security Note

For security reasons:
- Use an app password for your Gmail account, not your regular password
- Regularly rotate your app passwords
- Consider using a dedicated email address for notifications
