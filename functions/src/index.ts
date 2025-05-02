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
  console.log('Contact form submission received:', {
    name: data.name,
    email: data.email,
    subject: data.subject,
    messageLength: data.message ? data.message.length : 0
  });

  try {
    // Log Firebase config
    console.log('Firebase config check:', {
      projectId: process.env.FIREBASE_PROJECT_ID ?? admin.app().options.projectId,
      databaseURL: admin.app().options.databaseURL,
      storageBucket: admin.app().options.storageBucket,
    });

    // Log Firestore instance
    console.log('Firestore instance:', db ? 'Initialized' : 'Not initialized');

    // Validate the data
    if (!data.name || !data.email || !data.subject || !data.message) {
      console.log('Validation failed: Missing required fields');
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Missing required fields'
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.log('Validation failed: Invalid email format');
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid email format'
      );
    }

    // Create a timestamp
    const timestamp = admin.firestore.Timestamp.now();
    console.log('Timestamp created');

    // Prepare the data for Firestore
    const contactData: ContactFormData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp,
    };
    console.log('Contact data prepared for Firestore');

    // Check if the contactSubmissions collection exists
    try {
      console.log('Checking if contactSubmissions collection exists...');
      const collections = await db.listCollections();
      const collectionIds = collections.map(col => col.id);
      console.log('Available collections:', collectionIds);

      if (!collectionIds.includes('contactSubmissions')) {
        console.log('contactSubmissions collection does not exist, will be created automatically');
      }
    } catch (listError) {
      console.error('Error listing collections:', listError);
    }

    // Save to Firestore - wrap in try/catch to isolate Firestore errors
    let docRef;
    try {
      console.log('Attempting to save to Firestore...');

      // Try to get a document from the collection first to test permissions
      try {
        const testQuery = await db.collection('contactSubmissions').limit(1).get();
        console.log('Test query successful, documents count:', testQuery.size);
      } catch (testError) {
        console.error('Test query failed:', testError);
      }

      docRef = await db.collection('contactSubmissions').add(contactData);
      console.log('Successfully saved to Firestore with ID:', docRef.id);
    } catch (firestoreError: any) {
      console.error('Error saving to Firestore:', firestoreError);
      console.error('Error code:', firestoreError.code);
      console.error('Error message:', firestoreError.message);
      console.error('Error details:', JSON.stringify(firestoreError));

      throw new functions.https.HttpsError(
        'internal',
        `Failed to save your submission to our database: ${firestoreError.message ?? 'Unknown error'}`,
        { originalError: 'firestore_error', details: firestoreError.toString() }
      );
    }

    // Send email notification - wrap in try/catch to isolate email errors
    try {
      console.log('Attempting to send email notification...');
      await sendEmailNotification(contactData, docRef.id);
      console.log('Email notification sent successfully');
    } catch (emailError: any) {
      console.error('Error sending email notification:', emailError);
      console.error('Error message:', emailError.message);
      console.error('Error stack:', emailError.stack);
      // Don't throw an error here, as we still want to return success
      // The submission was saved to Firestore, which is the most important part
    }

    console.log('Contact form submission completed successfully');
    return {
      success: true,
      message: 'Contact form submitted successfully',
      id: docRef.id,
    };
  } catch (error: any) {
    console.error('Error submitting contact form:', error);

    // Determine the error type and provide a more specific error message
    let errorCode = 'internal';
    let errorMessage = 'An error occurred while processing your request';

    if (error.code === 'auth/invalid-email') {
      errorCode = 'invalid-argument';
      errorMessage = 'The email address is not valid.';
    } else if (error.code === 'permission-denied') {
      errorCode = 'permission-denied';
      errorMessage = 'You do not have permission to submit this form.';
    } else if (error.code === 'resource-exhausted') {
      errorCode = 'resource-exhausted';
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.code === 'unavailable') {
      errorCode = 'unavailable';
      errorMessage = 'The service is currently unavailable. Please try again later.';
    } else if (error.code === 'not-found') {
      errorCode = 'not-found';
      errorMessage = 'The requested resource was not found.';
    } else if (error.code === 'already-exists') {
      errorCode = 'already-exists';
      errorMessage = 'This submission already exists.';
    } else if (error.code === 'failed-precondition') {
      errorCode = 'failed-precondition';
      errorMessage = 'The operation failed because a precondition was not met.';
    } else if (error.code === 'aborted') {
      errorCode = 'aborted';
      errorMessage = 'The operation was aborted.';
    } else if (error.code === 'out-of-range') {
      errorCode = 'out-of-range';
      errorMessage = 'The operation was attempted past the valid range.';
    } else if (error.code === 'unimplemented') {
      errorCode = 'unimplemented';
      errorMessage = 'The operation is not implemented or not supported.';
    } else if (error.code === 'data-loss') {
      errorCode = 'data-loss';
      errorMessage = 'Unrecoverable data loss or corruption.';
    } else if (error.code === 'unauthenticated') {
      errorCode = 'unauthenticated';
      errorMessage = 'The request does not have valid authentication credentials.';
    } else if (error.code === 'cancelled') {
      errorCode = 'cancelled';
      errorMessage = 'The operation was cancelled.';
    } else if (error.code === 'unknown') {
      errorCode = 'unknown';
      errorMessage = 'Unknown error occurred.';
    } else if (error.code === 'deadline-exceeded') {
      errorCode = 'deadline-exceeded';
      errorMessage = 'Deadline expired before operation could complete.';
    }

    // If we have a more specific error message from the error object, use it
    if (error.message) {
      errorMessage = `${errorMessage}: ${error.message}`;
    }

    throw new functions.https.HttpsError(
      errorCode as functions.https.FunctionsErrorCode,
      errorMessage,
      { originalError: error.toString() }
    );
  }
});

/**
 * Send an email notification for new contact form submissions
 */
async function sendEmailNotification(data: ContactFormData, submissionId: string) {
  try {
    console.log('Starting email notification process...');

    // Get email configuration from environment variables
    const emailConfig: EmailConfig = {
      host: functions.config().email?.host ?? 'smtp.gmail.com',
      port: parseInt(functions.config().email?.port ?? '587'),
      secure: functions.config().email?.secure === 'true', // true for 465, false for other ports
      auth: {
        user: functions.config().email?.user ?? 'jacobsamuelbarkin@gmail.com',
        pass: functions.config().email?.pass ?? '', // App password from environment
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
    const formattedDate = new Date(data.timestamp.toDate()).toLocaleString();
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

    // Don't throw an error here, as we still want to return success for the form submission
    // But we'll log detailed information to help with debugging
    console.log('Email configuration attempted to be used, but failed');
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
