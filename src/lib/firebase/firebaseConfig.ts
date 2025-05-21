// src/lib/firebase/firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import { getAnalytics, Analytics } from 'firebase/analytics'; // Optional

// Your web app's Firebase configuration
// These variables should be sourced from environment variables
const firebaseConfigObj = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let functions: Functions;
let analytics: Analytics | undefined; // Optional

if (typeof window !== 'undefined' && !getApps().length) {
  // Client-side initialization
  app = initializeApp(firebaseConfigObj);
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
  // Initialize Analytics only if measurementId is available (Optional)
  if (firebaseConfigObj.measurementId) {
    try {
        analytics = getAnalytics(app);
    } catch (error) {
        console.warn("Firebase Analytics could not be initialized:", error);
    }
  }
} else if (getApps().length) {
  // Reuse existing app instance if already initialized (client or server)
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
  if (firebaseConfigObj.measurementId) {
    try {
        // Check if analytics is already initialized for this app
        // This is a simplified check; more robust checks might be needed
        // if you have multiple app instances or complex scenarios.
        analytics = getAnalytics(app);
    } catch (error) {
        // console.warn("Firebase Analytics could not be re-initialized or is not available:", error);
        // It's common for getAnalytics to throw if called multiple times without care,
        // or if not supported in the current environment.
    }
  }
} else {
  // Fallback for server-side or environments where window is not defined
  // This basic initialization might be sufficient for some server-side tasks
  // but for Admin SDK capabilities, you'd use 'firebase-admin'.
  // This setup is primarily for client-side Firebase.
  app = initializeApp(firebaseConfigObj);
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
   if (firebaseConfigObj.measurementId) {
    try {
        analytics = getAnalytics(app);
    } catch (error) {
        // console.warn("Firebase Analytics could not be initialized in this environment:", error);
    }
  }
}

// Log the configuration for debugging (only in development)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const definedConfig = { ...firebaseConfigObj };
  // Mask sensitive keys for logging
  if (definedConfig.apiKey) definedConfig.apiKey = 'defined';

  console.log('Firebase Config (Client-side):', {
    ...definedConfig,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'defined' : 'undefined',
    source: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'environment variables' : 'fallback/missing values'
  });
}

export { app, auth, db, functions, analytics, firebaseConfigObj };
