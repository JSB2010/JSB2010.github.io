"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/auth-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle, Lock, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading, error, signIn, clearError } = useAdminAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Initial form values
  const initialValues = {
    email: "",
    password: ""
  };

  // Use form persistence hook with a shorter expiry time for security
  const {
    formData,
    updateFormData,
    resetFormData,
    lastSaved,
    getTimeRemaining
  } = useFormPersistence(
    'admin-login-form',
    initialValues,
    {
      expiryMinutes: 30, // Shorter expiry for security
      saveOnUnload: true,
      confirmOnUnload: false, // No confirmation needed for login form
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
  const { email, password } = formData;

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      // Clear saved form data when user is authenticated
      resetFormData();
      router.push("/admin/dashboard");
    }
  }, [user, router, resetFormData]);

  // Update form data when inputs change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setIsProcessing(true);
    clearError();

    try {
      const success = await signIn(email, password);

      if (success) {
        // Clear saved form data on successful login
        resetFormData();
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <PageHero
        title="Admin Login"
        description="Please sign in to access the admin dashboard"
        backgroundImage="/images/code-bg.jpg"
      />

      <div className="container max-w-md py-12">
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Sign in to access the contact form submissions dashboard
                </CardDescription>
              </div>

              {/* Show last saved time if available */}
              {lastSaved && (
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
                  disabled={isProcessing || loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                  required
                  disabled={isProcessing || loading}
                />
                <p className="text-xs text-muted-foreground">
                  Note: For security, your password is not saved between sessions
                </p>
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
                  disabled={isProcessing || loading}
                >
                  Clear
                </Button>

                <Button
                  type="submit"
                  disabled={isProcessing || loading || !email || !password}
                >
                  {isProcessing || loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              This area is restricted to administrators only
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
