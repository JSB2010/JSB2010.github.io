'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(2, { message: 'Subject must be at least 2 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

// Component for handling contact form submissions via API endpoint

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
    console.log(`[Contact Form] ${message}`); // Also log to console for easier debugging
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

  // Main form submission handler - simplified to match the test HTML page
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setDebugLogs([]); // Clear previous debug logs

    addDebugLog('Form submitted, preparing data...');

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

    // Prepare the submission data for the API
    const submissionData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      userAgent: navigator.userAgent,
      source: 'website_contact_form'
    };

    addDebugLog(`Submission data prepared: ${JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject,
      messageLength: data.message.length
    })}`);

    try {
      addDebugLog('Submitting form via API endpoint...');

      // Log the current origin for debugging
      if (typeof window !== 'undefined') {
        addDebugLog(`Current origin: ${window.location.origin}`);
      }

      // Create a timeout promise
      addDebugLog("Setting up submission with 15-second timeout...");
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('API request timed out after 15 seconds'));
        }, 15000);
      });

      // Set up the fetch request
      addDebugLog("Preparing API request...");
      const apiEndpoint = '/api/submit-contact';

      // Create the fetch promise
      const fetchPromise = fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      }).then(async (response) => {
        addDebugLog(`API response status: ${response.status}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          addDebugLog(`API error: ${JSON.stringify(errorData)}`);
          throw new Error(`API error: ${response.status} ${errorData.message || ''}`);
        }

        return response.json();
      });

      // Race between the fetch operation and the timeout
      addDebugLog("Starting API request with timeout...");
      const responseData = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]);

      // Success!
      addDebugLog(`Successfully submitted form via API with ID: ${responseData.id}`);

      // Show success message
      setIsSuccess(true);

      // Reset form
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error submitting form:', err);
      addDebugLog(`ERROR: ${err.message}`);

      // Log error details
      if ((error as any).code) {
        addDebugLog(`Error code: ${(error as any).code}`);
      }

      // Default user-friendly error message
      let userMessage = 'There was an error submitting your message. Please try again or contact me directly via email.';

      // If it's a Firebase-specific error, provide more details
      const firebaseError = error as { code?: string };
      if (firebaseError.code) {
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

      // Check for specific error types
      if (err.message.includes('timeout') || err.message.includes('timed out')) {
        userMessage = 'The request timed out. This could be due to network issues or high server load. Please try the email option below.';
        addDebugLog('Detected timeout error - suggesting email fallback');
      } else if (err.message.includes('CORS') || err.message.includes('cross-origin')) {
        userMessage = 'There was a cross-origin request error. Please use the email option below.';
        addDebugLog('Detected CORS error - suggesting email fallback');
      } else if (err.message.includes('network') || err.message.includes('connection')) {
        userMessage = 'Network connection error. Please check your internet connection or use the email option below.';
        addDebugLog('Detected network error - suggesting email fallback');
      }

      // Set the error message for the user
      setErrorMessage(userMessage);

      // Log the full error for debugging
      addDebugLog(`Full error object: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);

      // Suggest using the mailto link as a fallback
      addDebugLog('Suggesting mailto fallback option');
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

  // Direct email link component as a fallback
  const DirectEmailLink = () => {
    return (
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
          Send Message Directly via Email
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
          If you're experiencing issues with the form, you can send me an email directly:
        </p>
        <a
          href="mailto:Jacobsamuelbarkin@gmail.com"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors"
        >
          Email Me Directly
        </a>
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

      <div className="flex flex-col sm:flex-row gap-3">
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
      </div>

      {/* Always show the direct email link as a fallback option */}
      <DirectEmailLink />
    </form>
  );
}
