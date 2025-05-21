// src/lib/firebase/authService.ts
import {
  Auth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser, // Firebase's User type
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile // If you need to update user's profile (e.g., displayName)
} from 'firebase/auth';
import { auth } from './firebaseClient'; // Your initialized Firebase auth instance

// Define a simpler User type for your application if needed,
// or use FirebaseUser directly.
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

// Function to map FirebaseUser to your app's User type
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  emailVerified: firebaseUser.emailVerified,
});

// Sign in function
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(userCredential.user);
  } catch (error: any) {
    // Handle Firebase Auth errors (e.g., auth/wrong-password, auth/user-not-found)
    console.error("Firebase sign-in error:", error.code, error.message);
    throw new Error(error.message || "Failed to sign in."); // Or throw a custom error object
  }
};

// Sign out function
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Firebase sign-out error:", error.code, error.message);
    throw new Error(error.message || "Failed to sign out.");
  }
};

// Observe auth state changes
// The callback will receive either a User object or null
export const onAuthUserStateChanged = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback(mapFirebaseUser(firebaseUser));
    } else {
      callback(null);
    }
  });
};

// Get current user (synchronously, if available)
export const getCurrentUser = (): User | null => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
        return mapFirebaseUser(firebaseUser);
    }
    return null;
};

// (Optional) Create user function - if admins can create other users
export const createUser = async (email: string, password: string, displayName?: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName && userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
        }
        return mapFirebaseUser(userCredential.user);
    } catch (error: any) {
        console.error("Firebase create user error:", error.code, error.message);
        throw new Error(error.message || "Failed to create user.");
    }
};

// (Optional) Password Reset
export const sendUserPasswordResetEmail = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        console.error("Firebase password reset error:", error.code, error.message);
        throw new Error(error.message || "Failed to send password reset email.");
    }
};
