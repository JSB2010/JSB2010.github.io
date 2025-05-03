"use client";

import { createContext, useContext } from "react";
import { trackEvent } from "@/lib/firebase/analytics";

// Create a simplified context without auth functionality
interface AuthContextType {
  user: null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  sendSignInLinkToEmail: (email: string) => Promise<boolean>;
  signInWithEmailLink: (email: string) => Promise<boolean>;
  isSignInWithEmailLink: (url: string) => boolean;
  signOut: () => Promise<void>;
}

// Create a default context with dummy functions
const defaultContext: AuthContextType = {
  user: null,
  loading: false,
  signInWithGoogle: async () => {
    console.log("Auth functionality has been disabled");
    await trackEvent("auth_disabled", { action: "google_signin_attempt" });
  },
  signInWithGithub: async () => {
    console.log("Auth functionality has been disabled");
    await trackEvent("auth_disabled", { action: "github_signin_attempt" });
  },
  sendSignInLinkToEmail: async () => {
    console.log("Auth functionality has been disabled");
    await trackEvent("auth_disabled", { action: "email_signin_attempt" });
    return false;
  },
  signInWithEmailLink: async () => {
    console.log("Auth functionality has been disabled");
    await trackEvent("auth_disabled", { action: "email_link_signin_attempt" });
    return false;
  },
  isSignInWithEmailLink: () => false,
  signOut: async () => {
    console.log("Auth functionality has been disabled");
    await trackEvent("auth_disabled", { action: "signout_attempt" });
  }
};

const AuthContext = createContext<AuthContextType>(defaultContext);

// Simplified Auth provider component
export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthContext.Provider value={defaultContext}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}
