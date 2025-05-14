"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "./auth-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component that redirects to login if not authenticated
 * Handles persistent sessions by checking authentication status
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, checkSession } = useAdminAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  // Set isClient to true on mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check for persistent session on mount
  useEffect(() => {
    const verifySession = async () => {
      if (isClient) {
        await checkSession();
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [isClient, checkSession]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !loading && !isVerifying && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router, isClient, isVerifying]);

  // Show loading spinner while checking authentication
  if (loading || isVerifying || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
        <span className="ml-4 text-muted-foreground">Verifying authentication...</span>
      </div>
    );
  }

  // If authenticated, render children
  return user ? <>{children}</> : null;
}
