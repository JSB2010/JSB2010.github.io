"use client";

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

// Form values type
type FormValues = z.infer<typeof formSchema>;

export function ContactFormFixed() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [firebaseApp, setFirebaseApp] = useState<any>(null);
  const [firestore, setFirestore] = useState<any>(null);

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
    console.log(`[Contact Form] ${message}`);
  };

  // Initialize Firebase API key and project ID
  useEffect(() => {
    let isMounted = true;

    const initializeFirebase = async () => {
      try {
        addDebugLog('Loading Firebase configuration...');

        // Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyCZAmGriqlYJL_RLvRx7iKGQz7pbY2nrB0",
          projectId: "jacob-barkin-website",
        };

        addDebugLog('Firebase configuration loaded successfully');

        if (isMounted) {
          setFirebaseApp(firebaseConfig);
          setFirestore(true); // Just use this as a flag to indicate Firebase is ready
          addDebugLog('Firebase initialized successfully');
        }
      } catch (error) {
        addDebugLog(`Error initializing Firebase: ${(error as Error).message}`);
        console.error('Error initializing Firebase:', error);
      }
    };

    initializeFirebase();

    return () => {
      isMounted = false;
    };
  }, []);

  // Main form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setDebugLogs([]); // Clear previous debug logs

    addDebugLog('Form submitted, preparing data...');

    // Check if Firebase is initialized
    if (!firebaseApp) {
      addDebugLog('Firebase is not initialized yet.');
      setErrorMessage('Firebase is not initialized yet. Please try again in a moment.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the submission data
      const submissionData = {
        fields: {
          name: { stringValue: data.name },
          email: { stringValue: data.email },
          subject: { stringValue: data.subject },
          message: { stringValue: data.message },
          userAgent: { stringValue: navigator.userAgent },
          source: { stringValue: 'website_contact_form_direct_rest' },
          timestamp: { timestampValue: new Date().toISOString() }
        }
      };

      addDebugLog(`Submission data prepared: ${JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        messageLength: data.message.length
      })}`);

      // Log the current origin for debugging CORS issues
      if (typeof window !== 'undefined') {
        addDebugLog(`Current origin: ${window.location.origin}`);
      }

      // Create a timeout promise
      addDebugLog("Setting up submission with 15-second timeout...");
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Firestore submission timed out after 15 seconds'));
        }, 15000);
      });

      // Submit to Firestore REST API directly
      addDebugLog('Submitting to Firestore REST API...');

      const projectId = (firebaseApp as any).projectId;
      const apiKey = (firebaseApp as any).apiKey;

      const firestoreApiUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/contactSubmissions?key=${apiKey}`;

      addDebugLog(`Using Firestore API URL: ${firestoreApiUrl.replace(apiKey, 'API_KEY_HIDDEN')}`);

      // Race between the fetch operation and the timeout
      const response = await Promise.race([
        fetch(firestoreApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData)
        }),
        timeoutPromise
      ]) as Response;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Firestore API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const responseData = await response.json();

      // Success!
      addDebugLog(`Successfully submitted to Firestore with ID: ${responseData.name}`);

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

      // Default user-friendly error message
      let userMessage = 'There was an error submitting your message. Please try again or contact me directly via email.';

      // Check for specific error types
      if (err.message.includes('timeout') || err.message.includes('timed out')) {
        userMessage = 'The request timed out. This could be due to network issues or high server load. Please try the email option below.';
        addDebugLog('Detected timeout error');
      } else if (err.message.includes('CORS') || err.message.includes('cross-origin')) {
        userMessage = 'There was a cross-origin request error. Please try the email option below.';
        addDebugLog('Detected CORS error');
      }

      // Set the error message for the user
      setErrorMessage(userMessage);

      // Log the full error for debugging
      addDebugLog(`Full error object: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug panel component
  const DebugPanel = () => {
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
    <div className="w-full max-w-2xl mx-auto">
      <DebugPanel />

      {!firestore && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md mb-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Initializing Firebase...
          </p>
        </div>
      )}

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">Message Sent!</h3>
          <p className="text-green-700 dark:text-green-400">
            Thank you for your message. I'll get back to you as soon as possible.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Unable to Send Message
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-400">
                  {errorMessage}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setErrorMessage(null)}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="Your name"
                {...register("name")}
                className={errors.name ? "border-red-300 dark:border-red-700" : ""}
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                {...register("email")}
                className={errors.email ? "border-red-300 dark:border-red-700" : ""}
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Message subject"
              {...register("subject")}
              className={errors.subject ? "border-red-300 dark:border-red-700" : ""}
            />
            {errors.subject && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Your message"
              rows={6}
              {...register("message")}
              className={errors.message ? "border-red-300 dark:border-red-700" : ""}
            />
            {errors.message && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              className="w-full sm:w-auto h-9 sm:h-10 text-sm"
              disabled={isSubmitting || !firestore}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Sending...
                </>
              ) : !firestore ? (
                <>
                  <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Initializing...
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
      )}
    </div>
  );
}
