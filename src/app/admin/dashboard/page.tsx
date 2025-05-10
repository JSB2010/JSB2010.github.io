"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/auth-context";
import { ProtectedRoute } from "@/components/admin/protected-route";
import { SubmissionsDashboard } from "@/components/admin/submissions-dashboard";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const { user, signOut } = useAdminAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const success = await signOut();
      if (success) {
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageHero
        title="Admin Dashboard"
        description="Manage contact form submissions"
        backgroundImage="/images/code-bg.jpg"
        actions={
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        }
      />

      <div className="container py-8">
        <SubmissionsDashboard />
      </div>
    </ProtectedRoute>
  );
}
