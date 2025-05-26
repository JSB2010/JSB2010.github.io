import { create } from 'zustand';
import { z } from 'zod';

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
});

// Simple logger
const logger = {
  error: (message: string, error?: any) => {
    console.error(`[ContactForm] ${message}`, error);
  },
  info: (message: string) => {
    console.log(`[ContactForm] ${message}`);
  }
};

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
  submitForm: () => Promise<void>;
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
  submitForm: async () => {
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

      // Prepare submission data
      const submissionData = {
        name: values.name,
        email: values.email,
        subject: values.subject || 'Contact Form Submission',
        message: values.message,
        timestamp: new Date().toISOString()
      };

      addDebugLog('Submitting form using Firebase');

      // Import Firebase functions
      const { submitContactForm } = await import('@/lib/firebase/contact');

      // Submit the form using Firebase
      const result = await submitContactForm(submissionData);

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

        // Update state on error with a more user-friendly message
        set({
          isSuccess: false,
          isSubmitting: false,
          errorMessage: "We're having trouble submitting your message. Please try again or contact us directly via email.",
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

      // Update state on error with a user-friendly message
      set({
        isSuccess: false,
        isSubmitting: false,
        errorMessage: "We're having trouble processing your message. Please try again or contact us directly via email.",
      });
    }
  },

  // Action to add a debug log
  addDebugLog: (message) => {
    // Always log to console regardless of environment
    console.log(`[ContactForm] ${message}`);

    // Only update state in development mode
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