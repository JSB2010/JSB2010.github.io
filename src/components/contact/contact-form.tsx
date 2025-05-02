"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getFunctions, httpsCallable } from "firebase/functions";
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

  // Helper function to extract error details
  const getErrorMessage = (error: any): string => {
    // Default error message
    let errorDetails = "There was an error submitting your message. ";

    // Add error code if available
    if (error.code) {
      errorDetails += `Error code: ${error.code}. `;
    }

    // Add error message or details
    if (error.message) {
      errorDetails += `${error.message}`;
    } else if (error.details) {
      errorDetails += `${error.details}`;
    }

    // Add additional details from Firebase Functions error
    if (error.details && typeof error.details === 'object') {
      if (error.details.message) {
        errorDetails += ` ${error.details.message}`;
      }

      if (error.details.originalError) {
        errorDetails += ` (${error.details.originalError})`;
      }
    }

    // Handle specific error types

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
      return "Database error: There was an issue saving your submission to our database. Please try again later.";
    }

    // Email errors
    if (error.message?.includes('SMTP')) {
      return "Email notification error: There was an issue sending the email notification. Your submission was saved, but we couldn't send a notification email.";
    }

    return errorDetails;
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Set the region for the functions
      const region = 'us-central1';
      const functionsWithRegion = getFunctions(firebaseApp, region);

      // Call the submitContactForm function
      const submitContactForm = httpsCallable(functionsWithRegion, 'submitContactForm');

      // Submit the form data and log the response
      console.log("Submitting form data:", data);
      console.log("Using Firebase Functions region:", region);

      const result = await submitContactForm(data);
      console.log("Form submission response:", result);

      // Show success message
      setIsSuccess(true);

      // Reset form
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error: any) {
      console.error("Error submitting form:", error);

      // Get error message
      const errorDetails = getErrorMessage(error);

      // Set the error message
      setErrorMessage(errorDetails);

      // Log additional debugging information to the console
      console.log("Error details:", {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: error.stack
      });
    } finally {
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
        <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error Details</h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-400">
                {errorMessage}
              </div>
              <div className="mt-2">
                <p className="text-xs text-red-700 dark:text-red-400">
                  If this error persists, please contact me directly at <a href="mailto:Jacobsamuelbarkin@gmail.com" className="underline">Jacobsamuelbarkin@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm flex items-center">
          <CheckCircle className="h-4 w-4 mr-2" />
          Your message has been sent successfully! I'll get back to you soon.
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
