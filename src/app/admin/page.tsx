'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAdminAuth } from '@/components/admin/auth-context';

/**
 * Admin page that redirects to the appropriate page based on authentication status
 * This page handles persistent sessions and redirects accordingly
 */
export default function AdminRedirectPage() {
  const router = useRouter();
  const { user, loading, checkSession } = useAdminAuth();

  // Check for persistent session and redirect based on authentication status
  useEffect(() => {
    // Remove any stored API key from localStorage (legacy cleanup)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminApiKey');
    }

    // Force a session check to ensure we have the latest auth state
    const verifySession = async () => {
      await checkSession();

      // Only redirect after auth state is determined
      if (!loading) {
        if (user) {
          // If user is authenticated, redirect to dashboard
          router.push('/admin/dashboard');
        } else {
          // If user is not authenticated, redirect to login
          router.push('/admin/login');
        }
      }
    };

    verifySession();
  }, [router, user, loading, checkSession]);

  // Show loading spinner while redirecting
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
      <span className="ml-4 text-muted-foreground">Checking authentication...</span>
    </div>
  );
}