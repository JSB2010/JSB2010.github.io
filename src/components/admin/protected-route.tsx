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
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAdminAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true on mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push("/admin/login");
    }
  }, [user, loading, router, isClient]);

  // Show loading spinner while checking authentication
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authenticated, render children
  return user ? <>{children}</> : null;
}
