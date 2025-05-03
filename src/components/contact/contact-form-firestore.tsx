'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { db, firebaseApp } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getApp } from 'firebase/app';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(2, { message: 'Subject must be at least 2 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactFormFirestore() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

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

  // Function to add debug logs
  const addDebugLog = (message: string) => {
    setDebugLogs(prev => [...prev, `${new Date().toISOString().substring(11, 19)}: ${message}`]);
  };

  // Function to check network connectivity
  const checkNetworkStatus = () => {
    const nav = navigator as Navigator & {
      connection?: {
        effectiveType: string;
        saveData: boolean;
      }
    };

    const status = {
      online: nav.onLine,
      connectionType: nav.connection ? nav.connection.effectiveType : 'unknown',
      saveData: nav.connection ? nav.connection.saveData : false
    };

    addDebugLog(`Network status: ${JSON.stringify(status)}`);
    return status;
  };

  // Main form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setDebugLogs([]); // Clear previous debug logs

    // Check network status
    if (typeof window !== 'undefined') {
      const networkStatus = checkNetworkStatus();
      if (!networkStatus.online) {
        addDebugLog("ERROR: Device is offline. Cannot connect to Firebase.");
        setErrorMessage("Your device appears to be offline. Please check your internet connection and try again.");
        setIsSubmitting(false);
        return;
      }
    }

    addDebugLog(`Form submission started with data: ${JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      messageLength: data.message.length
    })}`);

    try {
      addDebugLog("Starting form submission process...");

      // Prepare the submission data
      const submissionData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        source: 'website_contact_form'
      };

      addDebugLog("Preparing to submit to Firestore...");

      // Log the current origin for debugging CORS issues
      if (typeof window !== 'undefined') {
        addDebugLog(`Current origin: ${window.location.origin}`);
      }

      // Submit to Firestore
      const contactSubmissionsRef = collection(db, 'contactSubmissions');

      // Set a longer timeout for the Firestore operation
      addDebugLog("Setting up Firestore operation with 60-second timeout...");

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          addDebugLog("ERROR: Firestore operation timed out after 60 seconds");
          reject(new Error('Firestore operation timed out after 60 seconds - possible network or configuration issue'));
        }, 60000);
      });

      // Simplified approach - direct submission with detailed logging
      try {
        addDebugLog("Starting direct Firestore submission...");

        // Log Firebase configuration
        const app = getApp();
        const options = app.options;
        addDebugLog(`Firebase project ID: ${options.projectId}`);
        addDebugLog(`Firebase app name: ${app.name}`);

        // Log the collection reference
        addDebugLog(`Collection path: ${contactSubmissionsRef.path}`);

        // Add a timestamp for tracking
        const clientTimestamp = new Date().toISOString();
        submissionData.clientTimestamp = clientTimestamp;
        addDebugLog(`Added client timestamp: ${clientTimestamp}`);

        // Direct submission to Firestore
        addDebugLog("Calling addDoc on contactSubmissions collection...");
        const docRef = await addDoc(contactSubmissionsRef, submissionData);

        // Success!
        addDebugLog(`Successfully submitted to Firestore with ID: ${docRef.id}`);

        // Show success message
        setIsSuccess(true);

        // Reset form
        reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } catch (firestoreError: any) {
        // Handle specific Firestore errors
        addDebugLog(`Firestore operation error: ${firestoreError.message}`);

        if (firestoreError.code) {
          addDebugLog(`Firestore error code: ${firestoreError.code}`);
        }

        throw firestoreError; // Re-throw to be caught by the outer catch block
      }

    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error submitting form:', err);
      addDebugLog(`ERROR: ${err.message}`);

      // Default user-friendly error message
      let userMessage = 'There was an error submitting your message. Please try again or contact me directly via email.';

      // If it's a Firebase-specific error, provide more details
      const firebaseError = error as { code?: string };
      if (firebaseError.code) {
        addDebugLog(`Firebase error code: ${firebaseError.code}`);

        // Customize error message based on error code
        if (firebaseError.code === 'permission-denied') {
          userMessage = 'You do not have permission to submit this form. Please try contacting me directly via email.';
        } else if (firebaseError.code.includes('unavailable') || firebaseError.code.includes('network')) {
          userMessage = 'Network error. Please check your internet connection and try again.';
        } else if (firebaseError.code === 'resource-exhausted') {
          userMessage = 'The service is currently experiencing high traffic. Please try again later or contact me directly via email.';
        } else if (firebaseError.code === 'unauthenticated') {
          userMessage = 'Authentication error. Please try again or contact me directly via email.';
        }
      }

      // Check for timeout errors
      if (err.message.includes('timeout') || err.message.includes('timed out')) {
        userMessage = 'The request timed out. This could be due to network issues or high server load. Please try again later.';
        addDebugLog('Detected timeout error');
      }

      // Check for CORS errors
      if (err.message.includes('CORS') || err.message.includes('cross-origin')) {
        userMessage = 'There was a cross-origin request error. Please try again later or contact me directly via email.';
        addDebugLog('Detected CORS error');
      }

      // Set the error message for the user
      setErrorMessage(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug panel component
  const DebugPanel = () => {
    // Show debug logs in both development and production for now to help diagnose issues
    if (debugLogs.length === 0) return null;

    return (
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono mb-4 max-h-40 overflow-y-auto">
        <div className="font-semibold mb-1">Debug Logs:</div>
        {debugLogs.map((log, i) => (
          <div key={i} className="text-xs">{log}</div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {/* Debug Panel */}
      <DebugPanel />

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
              <AlertCircle className="h-5 w-5 text-red-500" />
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
                Thank you for your message. I&apos;ll get back to you as soon as possible.
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
