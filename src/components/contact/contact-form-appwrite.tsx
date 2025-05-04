'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ID } from 'appwrite';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { databases, databaseId, contactSubmissionsCollectionId } from '@/lib/appwrite/config';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactFormAppwrite() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

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
    setDebugLogs((prev) => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
  };

  // Function to check network status
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

  // Debug panel component
  const DebugPanel = () => {
    if (!showDebug) return null;
    
    return (
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-auto max-h-40">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Debug Logs</h4>
          <button 
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

    // Check network status
    if (typeof window !== 'undefined') {
      const networkStatus = checkNetworkStatus();
      if (!networkStatus.online) {
        addDebugLog("ERROR: Device is offline. Cannot connect to Appwrite.");
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
      // Prepare the submission data
      const submissionData = {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        source: 'website_contact_form_appwrite'
      };

      addDebugLog(`Submission data prepared: ${JSON.stringify({
        name: data.name,
        email: data.email,
        subject: data.subject,
        messageLength: data.message.length
      })}`);

      // Set up the fetch request
      addDebugLog("Preparing API request...");
      // Use the API endpoint
      const apiEndpoint = '/api/contact-appwrite';

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

      // Set a timeout for the fetch operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out after 10 seconds'));
        }, 10000);
      });

      // Race the fetch against the timeout
      addDebugLog("Sending request to API...");
      const result = await Promise.race([fetchPromise, timeoutPromise]) as { success: boolean; message: string; id?: string };

      addDebugLog(`API request completed: ${JSON.stringify(result)}`);

      if (result.success) {
        addDebugLog(`Form submitted successfully with ID: ${result.id}`);
        setIsSuccess(true);
        reset(); // Reset form fields
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      } else {
        addDebugLog(`ERROR: ${result.message}`);
        setErrorMessage(result.message || 'An unknown error occurred');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      addDebugLog(`ERROR: ${errorMessage}`);
      
      // Check if it's a timeout error
      if (errorMessage.includes('timed out')) {
        setErrorMessage('The request timed out. Please try again or use the direct email option below.');
      } else {
        setErrorMessage(`Error submitting form: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct email link component as a fallback
  const DirectEmailLink = () => {
    // Get form values
    const name = document.getElementById('name') as HTMLInputElement;
    const email = document.getElementById('email') as HTMLInputElement;
    const subject = document.getElementById('subject') as HTMLInputElement;
    const message = document.getElementById('message') as HTMLTextAreaElement;
    
    // Generate mailto link
    const generateMailtoLink = () => {
      if (!name?.value || !email?.value) return 'mailto:Jacobsamuelbarkin@gmail.com';

      const mailtoSubject = encodeURIComponent(subject?.value || 'Contact Form');
      const mailtoBody = encodeURIComponent(
        `Name: ${name.value}\nEmail: ${email.value}\n\nMessage:\n${message?.value || ''}`
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
                  `Contact Form: ${document.getElementById('subject')?.value ?? 'Message from website'}`
                )}&body=${encodeURIComponent(
                  `Name: ${document.getElementById('name')?.value ?? ''}\nEmail: ${document.getElementById('email')?.value ?? ''}\n\nMessage:\n${document.getElementById('message')?.value ?? ''}`
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

        {/* Debug toggle button - only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <button
            type="button"
            onClick={() => setShowDebug(!showDebug)}
            className="text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex items-center"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
        )}

        {/* Direct email link as fallback */}
        <DirectEmailLink />
      </div>
    </form>
  );
}
