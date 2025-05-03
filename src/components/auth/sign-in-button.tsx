"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "./auth-provider";
import {
  Loader2,
  LogIn,
  LogOut,
  User as UserIcon,
  Mail,
  AlertCircle,
  CheckCircle,
  Code
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SignInButton() {
  const { user, loading, signInWithGoogle, signInWithGithub, sendSignInLinkToEmail, signOut } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSignInWithGoogle = async () => {
    setIsSigningIn(true);
    await signInWithGoogle();
    setIsSigningIn(false);
  };

  const handleSignInWithGithub = async () => {
    setIsSigningIn(true);
    await signInWithGithub();
    setIsSigningIn(false);
  };

  const handleSignInWithEmail = () => {
    setShowEmailDialog(true);
  };

  const handleSendEmailLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsSigningIn(true);
    setEmailError(null);

    try {
      const success = await sendSignInLinkToEmail(email);

      if (success) {
        setEmailSent(true);
        // Close dialog after 3 seconds
        setTimeout(() => {
          setShowEmailDialog(false);
          setEmailSent(false);
          setEmail("");
        }, 3000);
      } else {
        setEmailError("Failed to send sign-in link. Please try again.");
      }
    } catch (error) {
      setEmailError("An error occurred. Please try again.");
      console.error("Error sending email link:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.displayName) return "JB";

    const nameParts = user.displayName.split(" ");
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();

    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled className="flex flex-col items-start">
            <span className="font-medium">{user.displayName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={isSigningIn}>
          {isSigningIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign in</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleSignInWithGoogle} disabled={isSigningIn}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Sign in with Google</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignInWithGithub} disabled={isSigningIn}>
          <Code className="mr-2 h-4 w-4" />
          <span>Sign in with GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignInWithEmail} disabled={isSigningIn}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Sign in with Email Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* Email Sign-in Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in with Email Link</DialogTitle>
            <DialogDescription>
              We'll send a sign-in link to your email address.
            </DialogDescription>
          </DialogHeader>

          {emailSent ? (
            <div className="p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Sign-in link sent! Check your email inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSendEmailLink} className="space-y-4">
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
                  disabled={isSigningIn}
                />
              </div>

              {emailError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {emailError}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEmailDialog(false)}
                  disabled={isSigningIn}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSigningIn || !email}
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Link
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
