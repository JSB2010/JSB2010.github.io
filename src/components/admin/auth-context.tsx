"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService, AuthUser, AuthError } from "@/lib/appwrite/auth";
import { proxyAuthService } from "@/lib/appwrite/proxy-auth";

// Define the authentication context type
interface AdminAuthContextType {
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try with proxy first
        try {
          const currentUser = await proxyAuthService.getCurrentUser();
          setUser(currentUser);
          return;
        } catch (proxyErr) {
          console.warn("Proxy auth failed, falling back to direct auth:", proxyErr);
        }

        // Fall back to direct auth if proxy fails
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Try with proxy first
      try {
        const result = await proxyAuthService.signIn(email, password);

        if ('type' in result) {
          // This is an error
          setError(result.message);
          return false;
        } else {
          // This is a user
          setUser(result);
          return true;
        }
      } catch (proxyErr) {
        console.warn("Proxy auth failed, falling back to direct auth:", proxyErr);
      }

      // Fall back to direct auth if proxy fails
      const result = await authService.signIn(email, password);

      if ('type' in result) {
        // This is an error
        setError(result.message);
        return false;
      } else {
        // This is a user
        setUser(result);
        return true;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<boolean> => {
    setLoading(true);

    try {
      // Try with proxy first
      try {
        const success = await proxyAuthService.signOut();
        if (success) {
          setUser(null);
          return success;
        }
      } catch (proxyErr) {
        console.warn("Proxy auth failed, falling back to direct auth:", proxyErr);
      }

      // Fall back to direct auth if proxy fails
      const success = await authService.signOut();
      if (success) {
        setUser(null);
      }
      return success;
    } catch (err: any) {
      setError(err.message || "An error occurred during sign out");
      return false;
    } finally {
      setLoading(false);
    }
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
