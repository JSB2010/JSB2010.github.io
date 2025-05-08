'use client';

import { useEffect } from 'react';
import { useContactFormStore } from '@/lib/store/contact-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { SubmissionMethod } from '@/lib/api/contact';

export function ContactFormZustand() {
  // Get state and actions from the store
  const {
    values,
    errors,
    isSubmitting,
    isSuccess,
    errorMessage,
    debugLogs,
    showDebug,
    setField,
    resetForm,
    submitForm,
    addDebugLog,
    clearDebugLogs,
    toggleDebug
  } = useContactFormStore();

  // Add initial debug log
  useEffect(() => {
    addDebugLog('Contact form component mounted');

    // Clean up on unmount
    return () => {
      resetForm();
    };
  }, [addDebugLog, resetForm]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebugLog('Form submission initiated');

    await submitForm({ method: SubmissionMethod.APPWRITE });
  };

  // Debug panel component
  const DebugPanel = () => {
    if (!showDebug) return null;

    return (
      <div className="mt-6 p-4 border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Debug Panel (Zustand Version)</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearDebugLogs}
              className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={toggleDebug}
              className="text-xs px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded"
            >
              Hide
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-2 rounded border border-yellow-200 dark:border-yellow-900 h-60 overflow-y-auto text-xs font-mono">
          {debugLogs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No logs yet. Submit the form to see debug information.</p>
          ) : (
            debugLogs.map((log, index) => {
              const logClass = log.includes('ERROR')
                ? 'text-red-600 dark:text-red-400'
                : log.includes('SUCCESS')
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-800 dark:text-gray-200';

              return (
                <div key={`log-${index}`} className={`py-1 ${logClass}`}>
                  {log}
                </div>
              );
            })
          )}
        </div>
        <p className="mt-2 text-xs text-yellow-700 dark:text-yellow-400">
          Form state: {JSON.stringify({ values, errors, isSubmitting, isSuccess }, null, 2)}
        </p>
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
          <p className="font-semibold">Network Status:</p>
          <p>Online: {navigator?.onLine ? 'Yes' : 'No'}</p>
          <p>Appwrite Endpoint: {process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'Not defined'}</p>
          <p>Project ID: {process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? 'Defined' : 'Not defined'}</p>
          <p>Database ID: {process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Not defined'}</p>
          <p>Collection ID: {process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID || 'Not defined'}</p>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={testAppwriteConnection}
              className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded"
            >
              Test Appwrite Connection
            </button>
            <button
              type="button"
              onClick={() => {
                addDebugLog('Checking browser network status...');
                addDebugLog(`Browser reports online: ${navigator?.onLine ? 'Yes' : 'No'}`);

                // Try to fetch a known reliable endpoint
                fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' })
                  .then(() => addDebugLog('Internet connectivity test successful'))
                  .catch(err => addDebugLog(`Internet connectivity test failed: ${err.message}`));
              }}
              className="text-xs px-2 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 rounded"
            >
              Test Internet
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Force debug panel to be visible in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !showDebug) {
      toggleDebug();
    }
  }, [showDebug, toggleDebug]);

  // Function to test Appwrite connectivity
  const testAppwriteConnection = async () => {
    addDebugLog('Testing Appwrite connectivity...');

    try {
      // Import Appwrite client directly
      const { client, databases, config } = await import('@/lib/appwrite');

      addDebugLog(`Appwrite config: ${JSON.stringify({
        endpoint: config.endpoint,
        projectId: config.projectId ? 'defined' : 'undefined',
        databaseId: config.databaseId,
        collectionId: config.collectionId
      })}`);

      // Try a simple health check by pinging the Appwrite server
      const response = await fetch(`${config.endpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        addDebugLog(`Appwrite health check successful: ${JSON.stringify(data)}`);
      } else {
        addDebugLog(`ERROR: Appwrite health check failed with status ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addDebugLog(`ERROR: Failed to test Appwrite connection: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Debug Panel - always shown in development mode */}
      {process.env.NODE_ENV === 'development' && <DebugPanel />}

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
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
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
            value={values.email}
            onChange={(e) => setField('email', e.target.value)}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
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
          value={values.subject}
          onChange={(e) => setField('subject', e.target.value)}
        />
        {errors.subject && (
          <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
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
          value={values.message}
          onChange={(e) => setField('message', e.target.value)}
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message}</p>
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
                  onClick={() => submitForm({ method: SubmissionMethod.APPWRITE })}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 bg-transparent hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => submitForm({ method: SubmissionMethod.EMAIL })}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                >
                  Use Email Fallback
                </button>
                <a
                  href={`mailto:Jacobsamuelbarkin@gmail.com?subject=${encodeURIComponent(
                    `Contact Form: ${values.subject || 'Message from website'}`
                  )}&body=${encodeURIComponent(
                    `Name: ${values.name || ''}\nEmail: ${values.email || ''}\n\nMessage:\n${values.message || ''}`
                  )}`}
                  className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                >
                  Open Email Client
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