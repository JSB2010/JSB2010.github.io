import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Email configuration
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Contact form submission interface
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: admin.firestore.Timestamp;
}

/**
 * Cloud Function to handle contact form submissions
 * Stores the submission in Firestore and sends an email notification
 */
export const submitContactForm = functions.https.onCall(async (data: any, context) => {
  try {
    // Validate the data
    if (!data.name || !data.email || !data.subject || !data.message) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid email format'
      );
    }

    // Create a timestamp
    const timestamp = admin.firestore.Timestamp.now();

    // Prepare the data for Firestore
    const contactData: ContactFormData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp,
    };

    // Save to Firestore
    const docRef = await db.collection('contactSubmissions').add(contactData);

    // Send email notification
    await sendEmailNotification(contactData, docRef.id);

    return {
      success: true,
      message: 'Contact form submitted successfully',
      id: docRef.id,
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while processing your request'
    );
  }
});

/**
 * Send an email notification for new contact form submissions
 */
async function sendEmailNotification(data: ContactFormData, submissionId: string) {
  try {
    // Email configuration for Gmail with app password
    const emailConfig: EmailConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'jacobsamuelbarkin@gmail.com',
        pass: 'phnv varx llta soll', // App password
      },
    };

    // Create a transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Format the date
    const formattedDate = new Date(data.timestamp.toDate()).toLocaleString();

    // Prepare email content
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

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't throw an error here, as we still want to return success for the form submission
  }
}

/**
 * Cloud Function to track project views
 * Increments a counter in Firestore for each project view
 */
export const trackProjectView = functions.https.onCall(async (data: any, context) => {
  try {
    // Validate the data
    if (!data.projectId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing project ID'
      );
    }

    const projectId = data.projectId;

    // Reference to the project document
    const projectRef = db.collection('projectViews').doc(projectId);

    // Use a transaction to safely increment the view count
    await db.runTransaction(async (transaction) => {
      const projectDoc = await transaction.get(projectRef);

      if (!projectDoc.exists) {
        // If the document doesn't exist, create it with an initial count of 1
        transaction.set(projectRef, {
          views: 1,
          lastViewed: admin.firestore.Timestamp.now()
        });
      } else {
        // If the document exists, increment the view count
        const currentViews = projectDoc.data()?.views ?? 0;
        transaction.update(projectRef, {
          views: currentViews + 1,
          lastViewed: admin.firestore.Timestamp.now()
        });
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking project view:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while tracking the project view'
    );
  }
});

/**
 * Cloud Function to get project views
 * Returns the view count for a specific project
 */
export const getProjectViews = functions.https.onCall(async (data: any, context) => {
  try {
    // Validate the data
    if (!data.projectId) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing project ID'
      );
    }

    const projectId = data.projectId;

    // Reference to the project document
    const projectRef = db.collection('projectViews').doc(projectId);

    // Get the project document
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return { data: null };
    }

    return { data: projectDoc.data() };
  } catch (error) {
    console.error('Error getting project views:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while getting the project views'
    );
  }
});

/**
 * Cloud Function to submit project feedback
 * Stores user feedback for projects in Firestore
 */
export const submitProjectFeedback = functions.https.onCall(async (data: any, context) => {
  try {
    // Validate the data
    if (!data.projectId || !data.rating || !data.feedback) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      );
    }

    // Validate rating (1-5)
    const rating = parseInt(data.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Rating must be between 1 and 5'
      );
    }

    // Prepare the feedback data
    const feedbackData = {
      projectId: data.projectId,
      rating,
      feedback: data.feedback,
      timestamp: admin.firestore.Timestamp.now(),
      // Include user info if available
      userEmail: data.userEmail ?? null,
      userName: data.userName ?? null,
    };

    // Save to Firestore
    await db.collection('projectFeedback').add(feedbackData);

    return { success: true };
  } catch (error) {
    console.error('Error submitting project feedback:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while submitting project feedback'
    );
  }
});
