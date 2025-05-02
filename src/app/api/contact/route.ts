import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin if it hasn't been initialized already
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    // Check if we have the necessary environment variables
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const projectId = process.env.FIREBASE_PROJECT_ID;

    if (!privateKey || !clientEmail || !projectId) {
      throw new Error('Missing Firebase Admin credentials in environment variables');
    }

    // Initialize the app with credentials
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        // The private key comes as a string with "\n" characters
        // We need to replace them with actual newlines
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }

  return getFirestore();
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Firestore
    const db = initializeFirebaseAdmin();

    // Prepare the submission data
    const submissionData = {
      ...body,
      timestamp: new Date(),
      source: 'api_submission',
      submittedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    };

    // Add the document to Firestore
    const docRef = await db.collection('contactSubmissions').add(submissionData);

    // Return a success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully',
        id: docRef.id
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error submitting contact form:', error);

    // Return an error response
    return NextResponse.json(
      { 
        error: 'Failed to submit form',
        message: error.message
      },
      { status: 500 }
    );
  }
}
