// Firebase client-side configuration
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Fallback values for development - DO NOT USE IN PRODUCTION
// These are the same values that are in .env.local and publicly visible in the client-side code
const fallbackConfig = {
  apiKey: "AIzaSyCZAmGriqlYJL_RLvRx7iKGQz7pbY2nrB0",
  authDomain: "jacob-barkin-website.firebaseapp.com",
  projectId: "jacob-barkin-website",
  storageBucket: "jacob-barkin-website.firebasestorage.app",
  messagingSenderId: "1093183769646",
  appId: "1:1093183769646:web:0fbbcd20023cb9ec8823bf",
  measurementId: "G-KTBS67S2PC"
};

// Your web app's Firebase configuration
// Using environment variables for security with fallbacks
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? fallbackConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? fallbackConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? fallbackConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? fallbackConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? fallbackConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? fallbackConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? fallbackConfig.measurementId
};

// Log the configuration for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 5)}...` : 'undefined',
    authDomain: firebaseConfig.authDomain ?? 'undefined',
    projectId: firebaseConfig.projectId ?? 'undefined',
    storageBucket: firebaseConfig.storageBucket ?? 'undefined',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'defined' : 'undefined',
    appId: firebaseConfig.appId ? 'defined' : 'undefined',
    measurementId: firebaseConfig.measurementId ?? 'undefined',
    source: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'environment variables' : 'fallback values'
  });
}

// Initialize Firebase
let firebaseApp: FirebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

// Initialize Firebase services
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Initialize Analytics and only load it in the browser
const analytics = typeof window !== 'undefined'
  ? getAnalytics(firebaseApp)
  : null;

// Function to initialize analytics when needed (to avoid SSR issues)
const initializeAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      return getAnalytics(firebaseApp);
    }
  }
  return null;
};

export { firebaseApp, db, auth, analytics, initializeAnalytics };
