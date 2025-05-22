'use client';

import { useEffect } from 'react';
import { useContactFormStore } from '@/lib/store/contact-form'; // Assuming this store is generic enough
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
// Firebase imports
import { functions } from '@/lib/firebase/firebaseClient';
import { httpsCallable, HttpsCallableResult } from 'firebase/functions';

// Define the expected response type from the Firebase Function (align with contact-form-firebase.tsx)
interface SubmitResult extends HttpsCallableResult {
    readonly data: {
        success: boolean;
        id?: string;
        message: string;
    };
}

export function ContactFormZustand() {
  const {
    values,
    errors,
    isSubmitting, // Use this from store
    isSuccess,   // Use this from store
    errorMessage,// Use this from store
    debugLogs,
    showDebug,
    setField,
    resetForm,
    // submitForm, // We will call Firebase function directly instead of store's submitForm
    setIsSubmitting, // Action from store
    setSuccess,      // Action from store
    setError,        // Action from store
    addDebugLog,
    clearDebugLogs,
    toggleDebug
  } = useContactFormStore();

  useEffect(() => {
    addDebugLog('Zustand Contact Form component mounted');
    return () => {
      // resetForm(); // Consider if form should reset on unmount
    };
  }, [addDebugLog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebugLog('Zustand form submission initiated via Firebase Cloud Function...');
    setIsSubmitting(true); // Update store state
    setError(null);      // Update store state

    // Basic client-side validation check (optional, as Zod is in store or server-side)
    if (!values.name || !values.email || !values.message) {
        addDebugLog('ERROR: Client-side validation failed - Name, Email, Message are required.');
        setError('Please fill out all required fields.');
        setIsSubmitting(false);
        return;
    }
    
    try {
      const submitFunction = httpsCallable(functions, 'submitContactForm');
      const result = await submitFunction({
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
      }) as SubmitResult;

      addDebugLog(`Firebase Function call completed: ${JSON.stringify(result.data)}`);

      if (!result.data.success) {
        throw new Error(result.data.message || 'Unknown error returned by function.');
      }

      addDebugLog(`Form submitted successfully via Firebase with ID: ${result.data.id}`);
      setSuccess(true); // Update store state
      resetForm(); // Reset form through store

      setTimeout(() => {
        setSuccess(false); // Clear success message after a delay
      }, 5000);

    } catch (error: any) {
      let detailedErrorMessage = 'An unknown error occurred.';
      if (error.code && error.message) { // Firebase Functions HttpsError
        detailedErrorMessage = `Error: ${error.message} (Code: ${error.code})`;
        addDebugLog(`Firebase Function Error: ${error.message} (Code: ${error.code}, Details: ${error.details})`);
      } else if (error instanceof Error) { // Standard JS Error
        detailedErrorMessage = error.message;
        addDebugLog(`ERROR: ${error.message}`);
      } else {
        addDebugLog(`Unknown error structure: ${JSON.stringify(error)}`);
      }
      setError(detailedErrorMessage); // Update store state
    } finally {
      setIsSubmitting(false); // Update store state
    }
  };

  const DebugPanel = () => {
    if (!showDebug) return null;
    return (
      <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Debug Panel (Zustand + Firebase)</h3>
          <div className="flex gap-2">
            <button type="button" onClick={clearDebugLogs} className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">Clear</button>
            <button type="button" onClick={toggleDebug} className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded">Hide</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-2 rounded border border-yellow-200 dark:border-yellow-900 h-60 overflow-y-auto text-xs font-mono">
          {debugLogs.map((log, index) => (
            <div key={`log-${index}`} className={`py-1 ${log.includes('ERROR') ? 'text-red-600' : log.includes('SUCCESS') ? 'text-green-600' : ''}`}>{log}</div>
          ))}
        </div>
        <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-400">
          Store state: {JSON.stringify({ values, errors, isSubmitting, isSuccess, errorMessage }, null, 2)}
        </p>
         <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
            <p className="font-semibold">Firebase Config (Client):</p>
            <p>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}</p>
        </div>
      </div>
    );
  };
  
  useEffect(() => {
    const shouldShowDebug = process.env.NODE_ENV === 'development' ||
      (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug'));
    if (shouldShowDebug && !showDebug) {
      toggleDebug();
    }
  }, [showDebug, toggleDebug]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {showDebug && <DebugPanel />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="zustand-name" className="text-xs sm:text-sm font-medium">Name</label>
          <Input id="zustand-name" placeholder="Your name"
            className={`h-9 sm:h-10 text-sm ${errors.name ? "border-red-500" : ""}`}
            disabled={isSubmitting} value={values.name} onChange={(e) => setField('name', e.target.value)} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="zustand-email" className="text-xs sm:text-sm font-medium">Email</label>
          <Input id="zustand-email" type="email" placeholder="Your email"
            className={`h-9 sm:h-10 text-sm ${errors.email ? "border-red-500" : ""}`}
            disabled={isSubmitting} value={values.email} onChange={(e) => setField('email', e.target.value)} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="zustand-subject" className="text-xs sm:text-sm font-medium">Subject</label>
        <Input id="zustand-subject" placeholder="What's this about?"
          className={`h-9 sm:h-10 text-sm ${errors.subject ? "border-red-500" : ""}`}
          disabled={isSubmitting} value={values.subject} onChange={(e) => setField('subject', e.target.value)} />
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
      </div>
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="zustand-message" className="text-xs sm:text-sm font-medium">Message</label>
        <Textarea id="zustand-message" placeholder="Your message..." rows={5}
          className={`min-h-[100px] sm:min-h-[120px] text-sm ${errors.message ? "border-red-500" : ""}`}
          disabled={isSubmitting} value={values.message} onChange={(e) => setField('message', e.target.value)} />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300 text-sm">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium">Unable to Send Message</h3>
              <p className="mt-1 text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      {isSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-300 text-sm">
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium">Message Sent Successfully!</h3>
              <p className="mt-1 text-sm">Thank you for reaching out. I'll get back to you soon.</p>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full sm:w-auto h-9 sm:h-10 text-sm" disabled={isSubmitting}>
        {isSubmitting ? (
          <><Loader2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />Sending...</>
        ) : (
          <><Send className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />Send Message</>
        )}
      </Button>
    </form>
  );
}
```
