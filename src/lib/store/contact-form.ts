import { create } from 'zustand';
import { z } from 'zod';
import { contactFormSchema, logger } from '@/lib/appwrite';
import { submitContactForm as apiSubmitContactForm, SubmissionMethod, ContactFormConfig } from '@/lib/api/contact';

// Define the form state type
export type ContactFormState = {
  // Form values
  values: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  // Form validation errors
  errors: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
    form?: string;
  };

  // Form submission state
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string | null;

  // Debug state (for development)
  debugLogs: string[];
  showDebug: boolean;

  // Actions
  setField: (field: keyof ContactFormState['values'], value: string) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  submitForm: (config?: Partial<ContactFormConfig>) => Promise<void>;
  addDebugLog: (message: string) => void;
  clearDebugLogs: () => void;
  toggleDebug: () => void;
};

// Create the store
export const useContactFormStore = create<ContactFormState>((set, get) => ({
  // Initial form values
  values: {
    name: '',
    email: '',
    subject: '',
    message: '',
  },

  // Initial errors state
  errors: {},

  // Initial submission state
  isSubmitting: false,
  isSuccess: false,
  errorMessage: null,

  // Initial debug state
  debugLogs: [],
  showDebug: process.env.NODE_ENV === 'development',

  // Action to set a field value
  setField: (field, value) => {
    set(state => ({
      values: {
        ...state.values,
        [field]: value,
      },
      // Clear error for this field when it's updated
      errors: {
        ...state.errors,
        [field]: undefined,
      },
    }));
  },

  // Action to reset the form
  resetForm: () => {
    set({
      values: {
        name: '',
        email: '',
        subject: '',
        message: '',
      },
      errors: {},
      isSuccess: false,
      errorMessage: null,
    });
  },

  // Action to validate the form
  validateForm: () => {
    const { values } = get();

    try {
      // Use the schema to validate the form values
      contactFormSchema.parse(values);

      // Clear errors if validation passes
      set({ errors: {} });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and format validation errors
        const formattedErrors: Record<string, string> = {};

        error.errors.forEach(err => {
          const field = err.path[0] as string;
          formattedErrors[field] = err.message;
        });

        // Update errors state
        set({ errors: formattedErrors });
      }

      return false;
    }
  },

  // Action to submit the form
  submitForm: async (config = {}) => {
    const { values, validateForm, addDebugLog } = get();

    // Validate form before submission
    if (!validateForm()) {
      addDebugLog('Form validation failed');
      return;
    }

    // Set submitting state
    set({ isSubmitting: true, errorMessage: null });
    addDebugLog('Form submission started');

    try {
      // Check network status first
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        addDebugLog('ERROR: Browser reports device is offline');
        set({
          isSubmitting: false,
          errorMessage: 'Network request failed: Your device appears to be offline. Please check your internet connection and try again.'
        });
        return;
      }

      // Prepare submission data - only include fields that exist in the Appwrite schema
      // Based on the error, the Appwrite collection doesn't have timestamp, source, or userAgent fields
      const submissionData = {
        name: values.name,
        email: values.email,
        subject: values.subject,
        message: values.message,
        // Remove timestamp, source, and userAgent as they're not in the schema
      };

      // Default to Appwrite submission method if not specified
      const submissionConfig: Partial<ContactFormConfig> = {
        method: SubmissionMethod.APPWRITE,
        ...config,
      };

      addDebugLog(`Submitting form using method: ${submissionConfig.method}`);
      addDebugLog(`Appwrite endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'Not defined'}`);
      addDebugLog(`Project ID: ${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? 'Defined' : 'Not defined'}`);

      // Create a timeout promise
      const timeoutPromise = new Promise<{ success: false, message: string }>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out after 10 seconds'));
        }, 10000);
      });

      // Submit the form using the API with timeout
      try {
        // Race the API call against the timeout - submissionData already simplified above
        const result = await Promise.race([
          apiSubmitContactForm(submissionData, submissionConfig),
          timeoutPromise
        ]);

        if (result.success) {
          addDebugLog(`Form submitted successfully with ID: ${result.id}`);

          // Update state on success
          set({
            isSuccess: true,
            isSubmitting: false,
            errorMessage: null,
          });

          // Reset success state after 5 seconds
          setTimeout(() => {
            set(state => ({
              isSuccess: false,
            }));
          }, 5000);
        } else {
          addDebugLog(`Form submission failed: ${result.message}`);
          if (result.error) {
            addDebugLog(`Error details: ${JSON.stringify(result.error)}`);
          }

          // Update state on error
          set({
            isSuccess: false,
            isSubmitting: false,
            errorMessage: result.message,
          });
        }
      } catch (innerError) {
        // Handle timeout or other promise rejection
        const errorMsg = innerError instanceof Error ? innerError.message : 'Unknown error in API call';
        addDebugLog(`ERROR: API call failed: ${errorMsg}`);

        set({
          isSuccess: false,
          isSubmitting: false,
          errorMessage: `Network request failed: ${errorMsg}. Please try again later.`
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      addDebugLog(`ERROR in form submission: ${errorMessage}`);

      // Try to get more details about the error
      if (error instanceof Error) {
        addDebugLog(`Error name: ${error.name}`);
        addDebugLog(`Error stack: ${error.stack?.slice(0, 200)}...`);
      } else {
        addDebugLog(`Error type: ${typeof error}`);
        try {
          addDebugLog(`Error details: ${JSON.stringify(error)}`);
        } catch (e) {
          addDebugLog(`Error cannot be stringified`);
        }
      }

      // Log the error
      logger.error('Unexpected error in form submission', error);

      // Update state on error
      set({
        isSuccess: false,
        isSubmitting: false,
        errorMessage: `Network request failed: ${errorMessage}`,
      });
    }
  },

  // Action to add a debug log
  addDebugLog: (message) => {
    if (process.env.NODE_ENV !== 'development') return;

    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]; // HH:MM:SS format
    const logMessage = `[${timestamp}] ${message}`;

    set(state => ({
      debugLogs: [...state.debugLogs, logMessage],
    }));
  },

  // Action to clear debug logs
  clearDebugLogs: () => {
    set({ debugLogs: [] });
  },

  // Action to toggle debug panel
  toggleDebug: () => {
    set(state => ({
      showDebug: !state.showDebug,
    }));
  },
}));