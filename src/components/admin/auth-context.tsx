"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User, // Your app's User type
  signIn as firebaseSignIn,
  signOut as firebaseSignOut,
  onAuthUserStateChanged
} from "@/lib/firebase/authService"; // Import from your new Firebase auth service

// Define the authentication context type
interface AdminAuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  clearError: () => void;
}

// Create the context with default values
const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => false,
  signOut: async () => false,
  clearError: () => {},
});

// Custom hook to use the auth context
export const useAdminAuth = () => useContext(AdminAuthContext);

// Auth provider component
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to auth state changes
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthUserStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignIn(email, password);
      // User state will be updated by onAuthUserStateChanged
      return true;
    } catch (err: any) {
      console.error("Sign in error in context:", err);
      setError(err.message || "An error occurred during sign in.");
      setLoading(false); // Ensure loading is false on error
      return false;
    }
    // setLoading(false) will be handled by the onAuthUserStateChanged effect
  };

  // Sign out function
  const signOut = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut();
      // User state will be updated by onAuthUserStateChanged
      return true;
    } catch (err: any) {
      console.error("Sign out error in context:", err);
      setError(err.message || "An error occurred during sign out.");
      setLoading(false); // Ensure loading is false on error
      return false;
    }
    // setLoading(false) will be handled by the onAuthUserStateChanged effect
  };
  
  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
