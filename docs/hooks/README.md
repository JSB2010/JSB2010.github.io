# Custom React Hooks Documentation

This document provides detailed information about the custom React hooks used in the Jacob Barkin Portfolio website.

## Table of Contents

- [useFormPersistence](#useformpersistence)
- [useThemeDetection](#usethemedetection)
- [useToast](#usetoast)

## useFormPersistence

**File**: `src/hooks/use-form-persistence.ts`

**Description**: A hook for persisting form data in localStorage with advanced features like auto-save, expiry management, and navigation warnings.

### Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `formId` | `string` | Unique identifier for the form | Required |
| `initialValues` | `Record<string, any>` | Initial form values | Required |
| `options` | `FormPersistenceOptions` | Configuration options | `{}` |

### Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `expiryMinutes` | `number` | Minutes before stored data expires | `60` |
| `saveOnUnload` | `boolean` | Save data when user navigates away | `true` |
| `confirmOnUnload` | `boolean` | Show confirmation when leaving with unsaved changes | `false` |
| `confirmationMessage` | `string` | Message for the confirmation dialog | `"You have unsaved changes. Are you sure you want to leave?"` |
| `autoRestore` | `boolean` | Automatically restore data on mount | `true` |
| `onRestore` | `(data: FormData) => void` | Callback when data is restored | `undefined` |

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `formData` | `T` | Current form data |
| `isDirty` | `boolean` | Whether the form has unsaved changes |
| `lastSaved` | `Date \| null` | When the form was last saved |
| `expiresAt` | `Date \| null` | When the stored data will expire |
| `updateFormData` | `(newData: Partial<T>) => void` | Function to update form data |
| `resetFormData` | `() => void` | Function to reset form data to initial values |
| `saveForm` | `() => boolean` | Function to manually save form data |
| `getTimeRemaining` | `() => { hours: number; minutes: number; seconds: number } \| null` | Function to get time remaining until expiry |

### Usage Example

```tsx
import { useFormPersistence } from '@/hooks/use-form-persistence';

function ContactForm() {
  const initialValues = { name: '', email: '', message: '' };
  
  const {
    formData,
    isDirty,
    lastSaved,
    expiresAt,
    updateFormData,
    resetFormData,
    saveForm,
    getTimeRemaining
  } = useFormPersistence('contact-form', initialValues, {
    expiryMinutes: 30,
    confirmOnUnload: true
  });
  
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data
    resetFormData(); // Clear form after submission
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      {/* Other form fields */}
      <button type="submit">Submit</button>
      <button type="button" onClick={resetFormData}>Reset</button>
      <button type="button" onClick={saveForm}>Save</button>
      
      {lastSaved && (
        <p>Last saved: {lastSaved.toLocaleTimeString()}</p>
      )}
    </form>
  );
}
```

### Implementation Details

The hook implements several key features:

1. **Form Data Persistence**:
   - Stores form data in localStorage with a unique key based on the form ID
   - Automatically saves data when it changes (debounced to avoid excessive writes)
   - Provides manual save and reset functions

2. **Expiry Management**:
   - Sets an expiry time for stored data
   - Automatically cleans up expired data
   - Provides a function to get the time remaining until expiry

3. **Navigation Warnings**:
   - Optionally saves data when the user navigates away
   - Optionally shows a confirmation dialog when leaving with unsaved changes
   - Handles the beforeunload event for browser navigation

4. **State Management**:
   - Tracks whether the form has unsaved changes
   - Records when the form was last saved
   - Provides the expiry time for the stored data

### Testing

The hook is thoroughly tested with Jest and React Testing Library:

- `src/hooks/__tests__/use-form-persistence.test.ts`: Comprehensive tests
- `src/hooks/__tests__/use-form-persistence.simple.test.ts`: Simplified tests

## useThemeDetection

**File**: `src/hooks/use-theme-detection.ts`

**Description**: A hook that extends next-themes functionality to provide additional theme detection and management features.

### Parameters

None

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `string \| undefined` | Current theme setting ('light', 'dark', or 'system') |
| `setTheme` | `(theme: string) => void` | Function to set the theme |
| `systemTheme` | `string \| undefined` | System theme preference ('light' or 'dark') |
| `effectiveTheme` | `string \| undefined` | The actual theme being displayed (resolves 'system' to 'light' or 'dark') |
| `toggleTheme` | `() => void` | Function to toggle between light and dark themes |
| `mounted` | `boolean` | Whether the component has mounted (for SSR compatibility) |

### Usage Example

```tsx
import { useThemeDetection } from '@/hooks/use-theme-detection';

function ThemeToggle() {
  const { theme, setTheme, effectiveTheme, mounted } = useThemeDetection();
  
  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }
  
  return (
    <button onClick={() => setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')}>
      {effectiveTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
```

### Implementation Details

The hook builds on next-themes to provide:

1. **Theme Detection**:
   - Determines the effective theme (what's actually being displayed)
   - Resolves 'system' theme to the actual 'light' or 'dark' value

2. **Theme Toggling**:
   - Provides a simple function to toggle between light and dark themes
   - Handles the case where the theme is set to 'system'

3. **SSR Compatibility**:
   - Tracks whether the component has mounted
   - Prevents hydration mismatches by not accessing theme information until mounted

4. **System Theme Integration**:
   - Exposes the system theme preference
   - Updates the effective theme when the system preference changes

## useToast

**File**: `src/components/ui/use-toast.ts`

**Description**: A hook for displaying toast notifications, based on the shadcn UI toast component.

### Parameters

None

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `toast` | `(props: ToastProps) => void` | Function to show a toast notification |
| `dismiss` | `(toastId?: string) => void` | Function to dismiss a toast notification |
| `toasts` | `Toast[]` | Array of active toast notifications |

### Toast Properties

| Property | Type | Description | Default |
|----------|------|-------------|---------|
| `title` | `string` | Toast title | - |
| `description` | `string` | Toast description | - |
| `action` | `React.ReactNode` | Action button | - |
| `variant` | `'default' \| 'destructive' \| 'success'` | Toast variant | `'default'` |
| `duration` | `number` | Duration in milliseconds | `5000` |

### Usage Example

```tsx
import { useToast } from '@/components/ui/use-toast';

function SubmitButton() {
  const { toast } = useToast();
  
  const handleSubmit = async () => {
    try {
      await submitForm();
      toast({
        title: 'Success!',
        description: 'Your form has been submitted.',
        variant: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit form. Please try again.',
        variant: 'destructive',
        action: <button onClick={handleSubmit}>Retry</button>
      });
    }
  };
  
  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Implementation Details

The hook provides a toast notification system with:

1. **Toast Management**:
   - Creates and displays toast notifications
   - Manages multiple toasts simultaneously
   - Automatically removes toasts after their duration

2. **Customization**:
   - Supports different variants (default, destructive, success)
   - Allows custom duration for each toast
   - Supports custom action buttons

3. **Accessibility**:
   - Uses the Radix UI Toast primitive for accessibility
   - Supports keyboard navigation and screen readers
   - Provides appropriate ARIA attributes

4. **Styling**:
   - Integrates with the site's theme system
   - Supports both light and dark modes
   - Uses consistent styling with the rest of the UI
