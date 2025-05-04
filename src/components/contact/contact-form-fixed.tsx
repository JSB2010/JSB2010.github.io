"use client";

import { useState, useEffect, useRef } from 'react';
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
  const [iframeReady, setIframeReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Set up message listener for iframe communication
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // For security, you might want to check event.origin
      // if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type) {
        switch (event.data.type) {
          case 'READY':
            addDebugLog('Firebase iframe is ready to receive submissions');
            setIframeReady(true);
            break;
          case 'LOG':
            addDebugLog(`Iframe: ${event.data.message}`);
            break;
          case 'SUCCESS':
            addDebugLog(`Successfully submitted to Firestore with ID: ${event.data.documentId}`);
            setIsSuccess(true);
            setIsSubmitting(false);

            // Reset form
            reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
              setIsSuccess(false);
            }, 5000);
            break;
          case 'ERROR':
            addDebugLog(`ERROR from iframe: ${event.data.message}`);
            setErrorMessage('There was an error submitting your message. Please try again or contact me directly via email.');
            setIsSubmitting(false);
            break;
        }
      }
    };

    // Add message listener
    window.addEventListener('message', handleMessage);

    // Log that we're waiting for the iframe
    addDebugLog('Waiting for Firebase iframe to initialize...');

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [reset]);

  // Main form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setDebugLogs([]); // Clear previous debug logs

    addDebugLog('Form submitted, preparing data...');

    // Check if iframe is ready
    if (!iframeReady || !iframeRef.current) {
      addDebugLog('Firebase iframe is not ready yet.');
      setErrorMessage('Firebase is not initialized yet. Please try again in a moment.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the submission data
      const submissionData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        userAgent: navigator.userAgent,
        source: 'website_contact_form_iframe'
      };

      addDebugLog(`Submission data prepared: ${JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        messageLength: data.message.length
      })}`);

      // Log the current origin for debugging
      if (typeof window !== 'undefined') {
        addDebugLog(`Current origin: ${window.location.origin}`);
      }

      // Create a timeout for the iframe submission
      addDebugLog("Setting up submission with 20-second timeout...");
      const timeoutId = setTimeout(() => {
        addDebugLog("ERROR: Iframe submission timed out after 20 seconds");
        setErrorMessage('The request timed out. This could be due to network issues or high server load. Please try the email option below.');
        setIsSubmitting(false);
      }, 20000);

      // Send the data to the iframe
      addDebugLog('Sending data to Firebase iframe...');
      iframeRef.current.contentWindow?.postMessage({
        type: 'SUBMIT',
        formData: submissionData
      }, '*');

      // Note: We don't set isSubmitting to false here because the iframe will send a message back
      // when the submission is complete, and we'll handle it in the message listener

      // Clear the timeout when component unmounts
      return () => clearTimeout(timeoutId);
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error submitting form:', err);
      addDebugLog(`ERROR: ${err.message}`);

      // Set the error message for the user
      setErrorMessage('There was an error submitting your message. Please try again or contact me directly via email.');

      // Log the full error for debugging
      addDebugLog(`Full error object: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);

      // Reset submission state
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

      {/* Hidden iframe for Firebase submission */}
      <iframe
        ref={iframeRef}
        src="/firebase-submit.html"
        className="hidden"
        title="Firebase Submission"
      />

      {!iframeReady && (
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
              disabled={isSubmitting || !iframeReady}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                  Sending...
                </>
              ) : !iframeReady ? (
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
