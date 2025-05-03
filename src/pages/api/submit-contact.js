// API route for contact form submissions
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if not already initialized
let firebaseAdmin;
if (!global.firebaseAdmin) {
  try {
    firebaseAdmin = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'jacob-barkin-website',
    }, 'contact-form-app');
    global.firebaseAdmin = firebaseAdmin;
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    // If it's already initialized, get the existing app
    firebaseAdmin = getApps().find(app => app.name === 'contact-form-app');
  }
} else {
  firebaseAdmin = global.firebaseAdmin;
}

// Get Firestore instance
const db = getFirestore(firebaseAdmin);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('Processing contact form submission...');
    
    // Get form data from request body
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    // Prepare submission data
    const submissionData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      timestamp: new Date(),
      userAgent: req.headers['user-agent'],
      source: 'contact_form_api',
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    };
    
    console.log('Submitting to Firestore...');
    
    // Submit to Firestore
    const contactSubmissionsRef = db.collection('contactSubmissions');
    const docRef = await contactSubmissionsRef.add(submissionData);
    
    console.log(`Successfully submitted to Firestore with ID: ${docRef.id}`);
    
    // Return a success response
    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      id: docRef.id
    });
  } catch (error) {
    console.error('Error processing contact form submission:', error);
    
    res.status(500).json({
      error: 'Failed to process form submission',
      message: error.message
    });
  }
}
