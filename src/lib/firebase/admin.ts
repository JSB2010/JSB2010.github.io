// Firebase admin configuration for server-side operations
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  // Use application default credentials
  initializeApp({
    projectId: 'jacob-barkin-website',
  });
}

// Get Firestore instance
const adminDb = getFirestore();

export { adminDb };
