import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Cloud Function triggered when a new document is added to the contactSubmissions collection
 * Sends an email notification with the contact form details
 */
export const sendContactEmailNotification = onDocumentCreated({
  document: 'contactSubmissions/{submissionId}',
  region: 'us-east1'
}, async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log('No data associated with the event');
      return { success: false, error: 'No data associated with the event' };
    }

    const submissionId = event.params.submissionId;
    const data = snapshot.data();

    console.log(`New contact form submission detected with ID: ${submissionId}`);

    try {
      // Email configuration from environment variables
      const emailConfig: EmailConfig = {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER || '',
          pass: process.env.EMAIL_PASS || '',
        },
      };

      console.log('Email configuration loaded:', {
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure,
        user: emailConfig.auth.user,
        // Don't log the password
      });

      // Create a transporter
      console.log('Creating nodemailer transporter...');
      const transporter = nodemailer.createTransport(emailConfig);

      // Verify SMTP connection configuration
      console.log('Verifying SMTP connection...');
      try {
        await transporter.verify();
        console.log('SMTP connection verified successfully');
      } catch (verifyError: any) {
        console.error('SMTP connection verification failed:', verifyError);
        throw new Error(`SMTP verification failed: ${verifyError.message ?? 'Unknown error'}`);
      }

      // Format the date
      const timestamp = data.timestamp instanceof admin.firestore.Timestamp
        ? data.timestamp.toDate()
        : new Date(data.timestamp?._seconds * 1000 || Date.now());

      const formattedDate = timestamp.toLocaleString();
      console.log('Formatted date:', formattedDate);

      // Prepare email content
      console.log('Preparing email content...');
      const mailOptions = {
        from: `"Jacob Barkin Website" <${emailConfig.auth.user}>`,
        to: 'jacobsamuelbarkin@gmail.com', // Your email address
        replyTo: data.email,
        subject: `New Contact Form: ${data.subject}`,
        text: `
          New contact form submission from your website:

          Name: ${data.name}
          Email: ${data.email}
          Subject: ${data.subject}

          Message:
          ${data.message}

          Submission ID: ${submissionId}
          Timestamp: ${formattedDate}
        `,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line;">${data.message}</p>
          <hr>
          <p><small>Submission ID: ${submissionId}</small></p>
          <p><small>Timestamp: ${formattedDate}</small></p>
        `,
      };
      console.log('Email content prepared');

      // Send the email
      console.log('Sending email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully', info.messageId);

      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Error sending email notification:', error);

      // Log detailed error information for debugging
      if (error.code) {
        console.error('Error code:', error.code);
      }

      if (error.message) {
        console.error('Error message:', error.message);
      }

      if (error.response) {
        console.error('SMTP Response:', error.response);
      }

      // Return the error but don't throw - this prevents the function from retrying
      return { success: false, error: error.message };
    }
  });
