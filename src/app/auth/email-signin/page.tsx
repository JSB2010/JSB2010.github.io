"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle, Mail, Clock } from "lucide-react";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function EmailSignInPage() {
  const router = useRouter();
  const { user, isSignInWithEmailLink, signInWithEmailLink } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initial form values
  const initialValues = {
    email: ""
  };

  // Use form persistence hook
  const {
    formData,
    updateFormData,
    resetFormData,
    lastSaved,
    getTimeRemaining
  } = useFormPersistence(
    'email-signin-form',
    initialValues,
    {
      expiryMinutes: 60,
      saveOnUnload: true,
      confirmOnUnload: false,
      onRestore: (data) => {
        if (data.email) {
          toast({
            title: 'Email Restored',
            description: 'Your email has been restored from your last session.',
            variant: 'default',
          });
        }
      }
    }
  );

  // Destructure form values for easier access
  const { email } = formData;

  const handleSignIn = useCallback(async (emailToUse: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const success = await signInWithEmailLink(emailToUse);

      if (success) {
        setIsSuccess(true);
        // Clear saved form data on successful sign-in
        resetFormData();
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during sign-in. Please try again.");
      console.error("Sign-in error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [setIsProcessing, setError, signInWithEmailLink, setIsSuccess, resetFormData]);

  useEffect(() => {
    // Check if this is a sign-in link
    if (typeof window !== "undefined" && isSignInWithEmailLink(window.location.href)) {
      // Get the email from localStorage
      const savedEmail = localStorage.getItem("emailForSignIn");

      if (savedEmail) {
        updateFormData({ email: savedEmail });
        handleSignIn(savedEmail);
      }
    }
  }, [isSignInWithEmailLink, updateFormData, handleSignIn]);

  // Redirect if user is already signed in
  useEffect(() => {
    if (user && !isProcessing) {
      // Clear saved form data when user is authenticated
      resetFormData();

      // Redirect after a short delay to allow for UI feedback
      const timeout = setTimeout(() => {
        router.push("/");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [user, isProcessing, router, resetFormData]);

  // Update form data when inputs change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Sign In with Email Link</CardTitle>
              <CardDescription>
                Complete your sign-in process
              </CardDescription>
            </div>

            {/* Show last saved time if available */}
            {lastSaved && !user && !isSuccess && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeRemaining() && `${getTimeRemaining()?.minutes}m remaining`}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email will be remembered for {getTimeRemaining()?.minutes} minutes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
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
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
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

              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFormData}
                  disabled={isProcessing}
                >
                  Clear
                </Button>

                <Button
                  type="submit"
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
              </div>
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
