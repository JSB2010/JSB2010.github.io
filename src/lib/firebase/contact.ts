import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp?: string;
}

export interface SubmissionResult {
  success: boolean;
  id?: string;
  message: string;
  error?: any;
}

export async function submitContactForm(data: ContactFormData): Promise<SubmissionResult> {
  try {
    // Check if Firebase is properly initialized
    if (!db) {
      throw new Error('Firebase is not properly initialized. Please check your configuration.');
    }

    // Add the document to Firestore
    const docRef = await addDoc(collection(db, 'contact_submissions'), {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      timestamp: serverTimestamp(),
      status: 'new'
    });

    return {
      success: true,
      id: docRef.id,
      message: 'Contact form submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: 'Failed to submit contact form',
      error
    };
  }
}
