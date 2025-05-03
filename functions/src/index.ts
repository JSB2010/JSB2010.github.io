import * as admin from 'firebase-admin';
import { sendContactEmailNotification } from './contact-email-trigger';

// Initialize Firebase Admin
admin.initializeApp();

// Export the Firestore trigger function
export { sendContactEmailNotification };


