"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { trackEvent } from "@/lib/firebase/analytics";

// Create context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  sendSignInLinkToEmail: (email: string) => Promise<boolean>;
  signInWithEmailLink: (email: string) => Promise<boolean>;
  isSignInWithEmailLink: (url: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Track sign in event
      await trackEvent("user_sign_in", {
        method: "google",
        user_id: result.user.uid,
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Sign in with GitHub
  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Track sign in event
      await trackEvent("user_sign_in", {
        method: "github",
        user_id: result.user.uid,
      });
    } catch (error) {
      console.error("Error signing in with GitHub:", error);
    }
  };

  // Send sign-in link to email
  const sendEmailSignInLink = async (email: string): Promise<boolean> => {
    try {
      // Save the email to localStorage for later use
      localStorage.setItem('emailForSignIn', email);

      // URL settings for email sign-in
      const actionCodeSettings = {
        // URL you want to redirect to after sign-in
        url: window.location.origin + '/auth/email-signin',
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Track event
      await trackEvent("email_signin_link_sent", {
        email_domain: email.split('@')[1],
      });

      return true;
    } catch (error) {
      console.error("Error sending sign-in link to email:", error);
      return false;
    }
  };

  // Check if current URL is a sign-in link
  const checkIsSignInWithEmailLink = (url: string): boolean => {
    return isSignInWithEmailLink(auth, url);
  };

  // Sign in with email link
  const completeSignInWithEmailLink = async (email: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailLink(auth, email, window.location.href);

      // Clear email from storage
      localStorage.removeItem('emailForSignIn');

      // Track sign in event
      await trackEvent("user_sign_in", {
        method: "email_link",
        user_id: result.user.uid,
      });

      return true;
    } catch (error) {
      console.error("Error signing in with email link:", error);
      return false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      if (user) {
        // Track sign out event
        await trackEvent("user_sign_out", {
          user_id: user.uid,
        });
      }

      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle,
      signInWithGithub,
      sendSignInLinkToEmail: sendEmailSignInLink,
      signInWithEmailLink: completeSignInWithEmailLink,
      isSignInWithEmailLink: checkIsSignInWithEmailLink,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
