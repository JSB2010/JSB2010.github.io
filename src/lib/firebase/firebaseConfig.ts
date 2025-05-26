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

// Check if Firebase configuration is valid
const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfigObj.apiKey &&
    firebaseConfigObj.authDomain &&
    firebaseConfigObj.projectId &&
    firebaseConfigObj.storageBucket &&
    firebaseConfigObj.messagingSenderId &&
    firebaseConfigObj.appId
  );
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let functions: Functions | undefined;
let analytics: Analytics | undefined; // Optional

// Only initialize Firebase if we have valid configuration and we're in the right environment
if (isFirebaseConfigValid()) {
  if (typeof window !== 'undefined' && !getApps().length) {
    // Client-side initialization
    try {
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
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  } else if (getApps().length) {
    // Reuse existing app instance if already initialized (client or server)
    try {
      app = getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      functions = getFunctions(app);
      if (firebaseConfigObj.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch (error) {
          // Analytics might not be available in all environments
        }
      }
    } catch (error) {
      console.error("Failed to get existing Firebase app:", error);
    }
  } else if (typeof window === 'undefined') {
    // Server-side: Only initialize if we're in a safe environment
    // Skip initialization during build time to prevent errors
    if (process.env.NODE_ENV !== 'production' || process.env.FIREBASE_ADMIN_INIT === 'true') {
      try {
        app = initializeApp(firebaseConfigObj);
        auth = getAuth(app);
        db = getFirestore(app);
        functions = getFunctions(app);
      } catch (error) {
        console.warn("Firebase initialization skipped on server-side:", error);
      }
    }
  }
} else {
  console.warn("Firebase configuration is incomplete. Firebase services will not be available.");
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
