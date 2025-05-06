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
      // Prepare submission data
      const submissionData = {
        ...values,
        timestamp: new Date().toISOString(),
        source: 'zustand_store',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      };
      
      // Default to Appwrite submission method if not specified
      const submissionConfig: Partial<ContactFormConfig> = {
        method: SubmissionMethod.APPWRITE,
        ...config,
      };
      
      addDebugLog(`Submitting form using method: ${submissionConfig.method}`);
      
      // Submit the form using the API
      const result = await apiSubmitContactForm(submissionData, submissionConfig);
      
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
        
        // Update state on error
        set({ 
          isSuccess: false, 
          isSubmitting: false,
          errorMessage: result.message,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      addDebugLog(`Error in form submission: ${errorMessage}`);
      
      // Log the error
      logger.error('Unexpected error in form submission', error);
      
      // Update state on error
      set({ 
        isSuccess: false, 
        isSubmitting: false,
        errorMessage: errorMessage,
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