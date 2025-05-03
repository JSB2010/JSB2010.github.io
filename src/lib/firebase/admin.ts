// Firebase admin configuration for server-side operations
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  // Use application default credentials or environment variable
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID ?? 'jacob-barkin-website',
  });
}

// Get Firestore instance
const adminDb = getFirestore();

export { adminDb };
