// src/lib/firebase/firebaseClient.ts
// This file is for any specific client-side Firebase service configurations or helper functions.
// For now, it re-exports the initialized services from firebaseConfig.ts.

import { app, auth, db, functions, analytics } from './firebaseConfig';

// Example of a potential client-side helper function (can be added later if needed)
// export const getCurrentUser = () => auth.currentUser;

// Re-export the Firebase services for easy import in other parts of the application
export { app, auth, db, functions, analytics };

// Session persistence for Firebase Auth is typically configured when initializing Auth
// or by calling `auth.setPersistence()`.
// By default, Firebase uses `indexedDB` for persistence (`browserLocalPersistence`).
// If you needed to change it, you could do something like:
// import { browserSessionPersistence, setPersistence } from "firebase/auth";
// setPersistence(auth, browserSessionPersistence)
//   .then(() => {
//     // Existing and future Auth states are now persisted in session storage.
//     console.log("Firebase Auth persistence set to session.");
//   })
//   .catch((error) => {
//     console.error("Error setting Firebase Auth persistence:", error);
//   });
