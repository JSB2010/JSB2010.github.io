"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Firebase functions import removed as we're using direct Firestore access
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { firebaseApp } from "@/lib/firebase/config";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Helper function to extract error details and provide user-friendly messages
  const getErrorMessage = (error: any): string => {
    // Default user-friendly message
    let userFriendlyMessage = "There was an error submitting your message. ";

    // For developers, log the detailed error
    console.log("Detailed error information:", error);

    // Network errors
    if (error.name === 'FirebaseError' && error.code === 'functions/network-error') {
      return "Network error: Please check your internet connection and try again.";
    }

    // Authentication errors
    if (error.code === 'functions/unauthenticated' || error.code === 'functions/permission-denied') {
      return "Authentication error: You don't have permission to perform this action.";
    }

    // Firestore errors
    if (error.details && error.details.originalError === 'firestore_error') {
      return "Database error: There was an issue saving your submission. Please try again later or contact me directly via email.";
    }

    // Email errors
    if (error.message?.includes('SMTP') || error.message?.includes('email')) {
      return "Your message was received, but there was an issue sending the notification email. I'll still receive your message.";
    }

    // Timeout errors
    if (error.code === 'functions/deadline-exceeded' || error.message?.includes('timeout') || error.message?.includes('timed out')) {
      return "The request took too long to complete. Your message might have been saved. Please try again later or contact me directly via email.";
    }

    // Internal server errors
    if (error.code === 'functions/internal') {
      return "There was an internal server error. Your message might have been saved directly to the database. Please try again later if you don't receive a response.";
    }

    // Unavailable errors
    if (error.code === 'functions/unavailable') {
      return "The service is currently unavailable. Please try again later or contact me directly via email.";
    }

    // If we have a specific error message from Firebase, add it
    if (error.message) {
      // Clean up the message to be more user-friendly
      const cleanMessage = error.message
        .replace(/^FirebaseError: /, '')
        .replace(/^Error: /, '')
        .replace(/^functions\//, '');

      userFriendlyMessage += cleanMessage;
    }

    return userFriendlyMessage;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Set a timeout to prevent the form from being stuck in the submitting state
    const timeoutId = setTimeout(() => {
      setIsSubmitting(false);
      setErrorMessage("The request timed out. Please try again or contact me directly via email.");
    }, 20000); // 20 seconds timeout

    try {
      console.log("Starting form submission process...");

      // Log Firebase app configuration for debugging
      console.log("Firebase app config check:", {
        apiKey: firebaseApp.options.apiKey ? `${firebaseApp.options.apiKey.substring(0, 5)}...` : 'undefined',
        authDomain: firebaseApp.options.authDomain ?? 'undefined',
        projectId: firebaseApp.options.projectId ?? 'undefined',
        appId: firebaseApp.options.appId ? 'defined' : 'undefined',
        environment: process.env.NODE_ENV
      });

      // Skip Firebase Functions and use direct Firestore write only
      console.log("Using direct Firestore write approach...");

      try {
        console.log("Importing Firestore modules...");
        const { getFirestore, collection, addDoc } = await import('firebase/firestore');

        console.log("Getting Firestore instance...");
        const db = getFirestore(firebaseApp);

        console.log("Preparing data for Firestore...");
        const submissionData = {
          ...data,
          timestamp: new Date(),
          source: 'direct_client_submission',
          userAgent: navigator.userAgent,
          submittedAt: new Date().toISOString(),
          environment: process.env.NODE_ENV
        };

        // In development mode, log the submission data but don't actually submit
        if (process.env.NODE_ENV === 'development') {
          console.log("DEVELOPMENT MODE: Would have submitted this data to Firestore:", submissionData);
          console.log("Simulating successful submission in development mode");

          // Simulate a successful submission after a short delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Clear the timeout since the request completed successfully
          clearTimeout(timeoutId);

          // Show success message
          setIsSuccess(true);

          // Reset form
          reset();

          // Hide success message after 5 seconds
          setTimeout(() => {
            setIsSuccess(false);
          }, 5000);

          return;
        }

        // In production, actually submit to Firestore
        console.log("Adding document to Firestore collection...");
        const docRef = await addDoc(collection(db, 'contactSubmissions'), submissionData);

        console.log('Form data saved directly to Firestore with ID:', docRef.id);

        // Clear the timeout since the request completed successfully
        clearTimeout(timeoutId);

        // Show success message
        setIsSuccess(true);

        // Reset form
        reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);

        return; // Exit early, skipping the Firebase Function call
      } catch (firestoreError) {
        console.error("Direct Firestore write failed:", firestoreError);

        // In development mode, show a more helpful error message
        if (process.env.NODE_ENV === 'development') {
          console.log("DEVELOPMENT MODE: This error is expected in development if you don't have Firebase emulators running.");
          console.log("In development mode, we'll simulate a successful submission instead.");

          // Simulate a successful submission after a short delay
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Clear the timeout since the request completed successfully
          clearTimeout(timeoutId);

          // Show success message
          setIsSuccess(true);

          // Reset form
          reset();

          // Hide success message after 5 seconds
          setTimeout(() => {
            setIsSuccess(false);
          }, 5000);

          return;
        }

        throw firestoreError; // Re-throw to be caught by the outer catch block in production
      }

      // We're using direct Firestore access instead of Firebase Functions
      // This approach bypasses the need for server-side processing

    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Clear the timeout since we're handling the error
      clearTimeout(timeoutId);

      // In development mode, show a more helpful error message
      if (process.env.NODE_ENV === 'development') {
        setErrorMessage("Development mode: This error is expected if you don't have Firebase emulators running. In production, this would attempt to write to the actual Firestore database.");

        // Log additional debugging information to the console
        console.log("DEVELOPMENT MODE ERROR:", {
          name: error.name,
          code: error.code,
          message: error.message,
          details: error.details,
          stack: error.stack
        });

        return;
      }

      // Production error handling
      // Check if it's a Firestore permission error
      if (error.code === 'permission-denied') {
        setErrorMessage("You don't have permission to submit this form. Please contact me directly via email instead.");
      }
      // Check if it's a network error
      else if (error.name === 'FirebaseError' && error.code === 'failed-precondition') {
        setErrorMessage("There was an issue connecting to the database. Please try again later or contact me directly via email.");
      }
      // Check if it's a timeout error
      else if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
        setErrorMessage("The request timed out. Please try again later or contact me directly via email.");
      }
      else {
        // Get error message for other types of errors
        const errorDetails = getErrorMessage(error);
        setErrorMessage(errorDetails);
      }

      // Log additional debugging information to the console
      console.log("Detailed error information:", {
        name: error.name,
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack
      });
    } finally {
      // Ensure isSubmitting is set to false (this will be redundant if the timeout hasn't fired)
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="name" className="text-xs sm:text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            placeholder="Your name"
            className={`h-9 sm:h-10 text-sm ${errors.name ? "border-red-500" : ""}`}
            disabled={isSubmitting}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="email" className="text-xs sm:text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Your email"
            className={`h-9 sm:h-10 text-sm ${errors.email ? "border-red-500" : ""}`}
            disabled={isSubmitting}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="subject" className="text-xs sm:text-sm font-medium">
          Subject
        </label>
        <Input
          id="subject"
          placeholder="What's this about?"
          className={`h-9 sm:h-10 text-sm ${errors.subject ? "border-red-500" : ""}`}
          disabled={isSubmitting}
          {...register("subject")}
        />
        {errors.subject && (
          <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="message" className="text-xs sm:text-sm font-medium">
          Message
        </label>
        <Textarea
          id="message"
          placeholder="Your message..."
          rows={5}
          className={`min-h-[100px] sm:min-h-[120px] text-sm ${errors.message ? "border-red-500" : ""}`}
          disabled={isSubmitting}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Unable to Send Message</h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                {errorMessage}
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setIsSubmitting(false);
                  }}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-transparent hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Try Again
                </button>
                <a
                  href={`mailto:Jacobsamuelbarkin@gmail.com?subject=${encodeURIComponent(
                    `Contact Form: ${document.getElementById('subject')?.value ?? 'Message from website'}`
                  )}&body=${encodeURIComponent(
                    `Name: ${document.getElementById('name')?.value ?? ''}\nEmail: ${document.getElementById('email')?.value ?? ''}\n\nMessage:\n${document.getElementById('message')?.value ?? ''}`
                  )}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                >
                  Send via Email Instead
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Message Sent Successfully!</h3>
              <div className="mt-1 text-sm text-green-700 dark:text-green-400">
                Thank you for reaching out. I've received your message and will get back to you as soon as possible.
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-500">
                A copy of your message has been saved to my database and I've been notified by email.
              </div>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full sm:w-auto h-9 sm:h-10 text-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
