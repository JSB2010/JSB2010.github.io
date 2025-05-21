'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { functions } from '@/lib/firebase/firebaseClient'; // Import Firebase functions service
import { httpsCallable, HttpsCallableResult } from 'firebase/functions'; // Import httpsCallable

// Form validation schema (remains the same)
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

// Define the expected response type from the Firebase Function
interface SubmitResult extends HttpsCallableResult {
    readonly data: {
        success: boolean;
        id?: string;
        message: string;
    };
}

export function ContactFormFirebase() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
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
    setDebugLogs((prev) => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
  };
  
  // Function to check network status (remains the same)
  const checkNetworkStatus = () => {
    if (typeof navigator !== 'undefined') {
      return {
        online: navigator.onLine,
        connection: 'navigator' in window && 'connection' in navigator
          ? (navigator as any).connection?.effectiveType
          : 'unknown'
      };
    }
    return { online: true, connection: 'unknown' };
  };

  // Simplified Debug panel component (Appwrite connection test removed)
  const DebugPanel = () => {
    if (!showDebug) return null;

    return (
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-auto max-h-60">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Debug Logs</h4>
          <button
            type="button"
            onClick={() => setDebugLogs([])}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Clear
          </button>
        </div>
        {debugLogs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No logs yet</p>
        ) : (
          <ul className="space-y-1">
            {debugLogs.map((log, index) => (
              <li key={index} className="break-all">{log}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Main form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setDebugLogs([]); // Clear previous debug logs

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
      // Get a reference to the Firebase Function
      const submitFormFunction = httpsCallable(functions, 'submitContactForm');
      
      addDebugLog("Calling Firebase Cloud Function 'submitContactForm'...");

      // Call the function with the form data
      // Type assertion to SubmitResult for the response
      const result = await submitFormFunction({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      }) as SubmitResult;

      addDebugLog(`Firebase Function call completed: ${JSON.stringify(result.data)}`);

      if (!result.data.success) {
        // The function itself might return success: false for business logic errors
        throw new Error(result.data.message || 'Unknown error returned by function.');
      }

      addDebugLog(`Form submitted successfully via Firebase Function with ID: ${result.data.id}`);
      setIsSuccess(true);
      reset(); // Reset form fields

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (error: any) {
      let detailedErrorMessage = 'An unknown error occurred while submitting the form.';
      if (error.code && error.message) { // Firebase Functions HttpsError
        detailedErrorMessage = `Error: ${error.message} (Code: ${error.code})`;
        addDebugLog(`Firebase Function Error: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      } else if (error instanceof Error) { // Standard JS Error
        detailedErrorMessage = error.message;
        addDebugLog(`ERROR: ${error.message}`);
      } else {
        addDebugLog(`Unknown error structure: ${JSON.stringify(error)}`);
      }
      
      setErrorMessage(detailedErrorMessage);

      // Specific error messages based on known Firebase Function error codes
      if (error.code === 'unavailable') {
        setErrorMessage("The service is currently unavailable. This might be a network issue or the function isn't deployed correctly. Please try again later.");
      } else if (error.code === 'deadline-exceeded') {
         setErrorMessage("The request timed out. Please check your internet connection and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Direct email link component (remains the same)
  const DirectEmailLink = () => {
    const generateMailtoLink = () => {
      const currentName = watch('name');
      const currentEmail = watch('email');
      const currentSubject = watch('subject');
      const currentMessage = watch('message');

      if (!currentName || !currentEmail) return 'mailto:Jacobsamuelbarkin@gmail.com';

      const mailtoSubject = encodeURIComponent(currentSubject || 'Contact Form');
      const mailtoBody = encodeURIComponent(
        `Name: ${currentName}
Email: ${currentEmail}

Message:
${currentMessage || ''}`
      );
      return `mailto:Jacobsamuelbarkin@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    };

    return (
      <div className="mt-2 text-xs text-center">
        <p className="mb-1 text-muted-foreground">
          If you're having trouble with the form, you can also email me directly:
        </p>
        <a
          href={generateMailtoLink()}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jacobsamuelbarkin@gmail.com
        </a>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
          placeholder="Subject of your message"
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

      <div className="flex flex-col items-center space-y-3">
        {isSuccess ? (
          <div className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md flex items-center justify-center text-green-700 dark:text-green-400 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Message sent successfully! I'll get back to you soon.</span>
          </div>
        ) : errorMessage ? (
          <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex flex-col items-center text-red-700 dark:text-red-400 text-sm">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  setDebugLogs([]);
                }}
                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-transparent hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Try Again
              </button>
              <a
                href={`mailto:Jacobsamuelbarkin@gmail.com?subject=${encodeURIComponent(
                  `Contact Form: ${watch('subject') ?? 'Message from website'}`
                )}&body=${encodeURIComponent(
                  `Name: ${watch('name') ?? ''}
Email: ${watch('email') ?? ''}

Message:
${watch('message') ?? ''}`
                )}`}
                className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-transparent hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                Email Directly
              </a>
            </div>
          </div>
        ) : (
          <Button
            type="submit"
            className="w-full sm:w-auto min-w-[120px] h-10 sm:h-11"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        )}

        <div className="flex flex-col items-center space-y-2">
          <button
            type="button"
            onClick={() => {
              setShowDebug(!showDebug);
              if (!showDebug) {
                addDebugLog('Firebase Configuration (Client):');
                addDebugLog(`- Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}`);
                addDebugLog(`- Functions Region (Default/Assumed): Not explicitly set in client`);
                addDebugLog(`- Environment: ${process.env.NODE_ENV}`);
              }
            }}
            className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
           {/* Test links can be updated or removed later if they are Appwrite specific */}
           <div className="flex space-x-3">
             <a
              href="/test-form.html" // May need update if it's Appwrite specific
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300"
            >
              Test Form
            </a>
           </div>
        </div>
        <DirectEmailLink />
      </div>
    </form>
  );
}
