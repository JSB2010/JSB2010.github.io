import { useState, useEffect, useCallback } from 'react';

type FormData = Record<string, any>;

interface FormPersistenceOptions {
  /**
   * Number of minutes before the stored form data expires
   * @default 60
   */
  expiryMinutes?: number;

  /**
   * Whether to save form data on window unload (when user navigates away)
   * @default true
   */
  saveOnUnload?: boolean;

  /**
   * Whether to show a confirmation dialog when the user tries to leave with unsaved changes
   * @default false
   */
  confirmOnUnload?: boolean;

  /**
   * Custom message to show when the user tries to leave with unsaved changes
   * @default "You have unsaved changes. Are you sure you want to leave?"
   */
  confirmationMessage?: string;

  /**
   * Whether to automatically restore form data on mount
   * @default true
   */
  autoRestore?: boolean;

  /**
   * Callback to run when form data is restored
   */
  onRestore?: (data: FormData) => void;
}

interface PersistenceState<T> {
  /**
   * Current form data
   */
  formData: T;

  /**
   * Whether the form has been modified since last save/reset
   */
  isDirty: boolean;

  /**
   * When the form data was last saved
   */
  lastSaved: Date | null;

  /**
   * When the form data will expire
   */
  expiresAt: Date | null;
}

/**
 * Enhanced custom hook for form persistence with additional features
 * @param formId Unique identifier for the form
 * @param initialValues Initial form values
 * @param options Configuration options
 * @returns Object containing form data, state, and utility functions
 */
export function useFormPersistence<T extends FormData>(
  formId: string,
  initialValues: T,
  options: FormPersistenceOptions = {}
) {
  // Default options
  const {
    expiryMinutes = 60,
    saveOnUnload = true,
    confirmOnUnload = false,
    confirmationMessage = "You have unsaved changes. Are you sure you want to leave?",
    autoRestore = true,
    onRestore
  } = options;

  // Create a storage key based on the form ID
  const storageKey = `form_${formId}`;

  // Initialize state with stored values or initial values
  const [persistenceState, setPersistenceState] = useState<PersistenceState<T>>(() => {
    // Default state
    const defaultState: PersistenceState<T> = {
      formData: { ...initialValues },
      isDirty: false,
      lastSaved: null,
      expiresAt: null
    };

    // Only run in browser environment
    if (typeof window === 'undefined' || !autoRestore) {
      return defaultState;
    }

    try {
      // Try to get stored form data
      const storedData = localStorage.getItem(storageKey);

      if (storedData) {
        const { data, expiry, savedAt } = JSON.parse(storedData);

        // Check if the data has expired
        if (expiry && new Date() < new Date(expiry)) {
          // Call onRestore callback if provided
          if (onRestore) {
            onRestore(data);
          }

          return {
            formData: { ...initialValues, ...data },
            isDirty: false,
            lastSaved: savedAt ? new Date(savedAt) : null,
            expiresAt: new Date(expiry)
          };
        } else {
          // Data has expired, remove it
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Error retrieving form data from localStorage:', error);
    }

    return defaultState;
  });

  // Destructure state for easier access
  const { formData, isDirty } = persistenceState;

  // Function to save form data to localStorage
  const saveFormData = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Calculate expiry time
      const now = new Date();
      const expiry = new Date(now);
      expiry.setMinutes(expiry.getMinutes() + expiryMinutes);

      // Store form data with expiry and saved timestamp
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          data: formData,
          expiry: expiry.toISOString(),
          savedAt: now.toISOString()
        })
      );

      // Update state
      setPersistenceState(prev => ({
        ...prev,
        isDirty: false,
        lastSaved: now,
        expiresAt: expiry
      }));

      return true;
    } catch (error) {
      console.error('Error storing form data in localStorage:', error);
      return false;
    }
  }, [formData, storageKey, expiryMinutes]);

  // Save data when it changes
  useEffect(() => {
    if (isDirty) {
      const timeoutId = setTimeout(() => {
        saveFormData();
      }, 1000); // Debounce save to avoid excessive writes

      return () => clearTimeout(timeoutId);
    }
  }, [formData, isDirty, saveFormData]);

  // Set up beforeunload event handler
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Save data when the user leaves the page
      if (saveOnUnload && isDirty) {
        saveFormData();
      }

      // Show confirmation dialog if enabled and form is dirty
      if (confirmOnUnload && isDirty) {
        e.preventDefault();
        e.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveOnUnload, confirmOnUnload, isDirty, confirmationMessage, saveFormData]);

  // Function to update form data
  const updateFormData = useCallback((newData: Partial<T>) => {
    setPersistenceState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...newData },
      isDirty: true
    }));
  }, []);

  // Function to reset form data
  const resetFormData = useCallback(() => {
    try {
      setPersistenceState({
        formData: { ...initialValues },
        isDirty: false,
        lastSaved: null,
        expiresAt: null
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.error('Error resetting form data:', error);
    }
  }, [initialValues, storageKey]);

  // Function to manually save form data
  const saveForm = useCallback(() => {
    return saveFormData();
  }, [saveFormData]);

  // Calculate time remaining until expiry
  const getTimeRemaining = useCallback(() => {
    if (!persistenceState.expiresAt) {
      return null;
    }

    const now = new Date();
    const expiresAt = new Date(persistenceState.expiresAt);
    const diffMs = expiresAt.getTime() - now.getTime();

    if (diffMs <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return { hours, minutes, seconds };
  }, [persistenceState.expiresAt]);

  return {
    // Form data
    formData: persistenceState.formData,

    // State information
    isDirty: persistenceState.isDirty,
    lastSaved: persistenceState.lastSaved,
    expiresAt: persistenceState.expiresAt,

    // Functions
    updateFormData,
    resetFormData,
    saveForm,
    getTimeRemaining
  };
}
