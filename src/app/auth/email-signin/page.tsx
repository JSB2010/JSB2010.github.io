"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";

export default function EmailSignInPage() {
  const router = useRouter();
  const { user, isSignInWithEmailLink, signInWithEmailLink } = useAuth();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is a sign-in link
    if (typeof window !== "undefined" && isSignInWithEmailLink(window.location.href)) {
      // Get the email from localStorage
      const savedEmail = localStorage.getItem("emailForSignIn");
      
      if (savedEmail) {
        setEmail(savedEmail);
        handleSignIn(savedEmail);
      }
    }
  }, [isSignInWithEmailLink]);

  // Redirect if user is already signed in
  useEffect(() => {
    if (user && !isProcessing) {
      // Redirect after a short delay to allow for UI feedback
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [user, isProcessing, router]);

  const handleSignIn = async (emailToUse: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await signInWithEmailLink(emailToUse);
      
      if (success) {
        setIsSuccess(true);
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during sign-in. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      handleSignIn(email);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Sign In with Email Link</CardTitle>
          <CardDescription>
            Complete your sign-in process
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>You are signed in! Redirecting...</span>
            </div>
          ) : isSuccess ? (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span>Sign-in successful! Redirecting...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isProcessing}
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing || !email}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Complete Sign In
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isProcessing}
          >
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
