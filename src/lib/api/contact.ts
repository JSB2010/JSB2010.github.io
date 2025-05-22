// src/lib/api/contact.ts
import { z } from 'zod';

// Define a logger (can be replaced with a more sophisticated one if needed)
const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
};

// Define contact form schema locally
// This should match the structure expected by your submission handlers.
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  timestamp: z.string().datetime().optional(), // Optional: ISO date string
  source: z.string().optional(),
});

// Submission methods
export enum SubmissionMethod {
  // APPWRITE = 'appwrite', // Removed
  API = 'api',
  EMAIL = 'email',
}

// Configuration for the contact form API
export interface ContactFormConfig {
  method: SubmissionMethod;
  endpoint?: string; // For API method
  emailAddress?: string; // For EMAIL method
}

// Default configuration - updated to API, assuming /api/contact-unified is a valid backend endpoint.
// If not, this default might need to be removed or changed.
const defaultConfig: ContactFormConfig = {
  method: SubmissionMethod.API,
  endpoint: '/api/contact-unified', // Default API endpoint
};

// Contact form data type
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Submit contact form data using the configured method
 * @param data Form data to submit
 * @param config Configuration for submission method
 * @returns Promise with submission result
 */
export async function submitContactForm(
  data: ContactFormData,
  config: Partial<ContactFormConfig> = {}
): Promise<{ success: boolean; id?: string; message: string; error?: any }> {
  const mergedConfig: ContactFormConfig = {
    ...defaultConfig,
    ...config,
  };

  logger.info('Contact form submission started', {
    method: mergedConfig.method,
    name: data.name,
    email: data.email,
    subject: data.subject,
  });

  try {
    const validatedData = contactFormSchema.parse(data);

    switch (mergedConfig.method) {
      // case SubmissionMethod.APPWRITE: // Removed
      //   return await submitToAppwrite(validatedData);

      case SubmissionMethod.API:
        return await submitViaAPI(validatedData, mergedConfig.endpoint);

      case SubmissionMethod.EMAIL:
        return await submitViaEmail(validatedData, mergedConfig.emailAddress);

      default:
        // This case should ideally not be reached if SubmissionMethod has limited options
        // And if a valid default is always set.
        // However, to satisfy exhaustiveness for type checking if more methods were added:
        const exhaustiveCheck: never = mergedConfig.method; 
        logger.error('Invalid submission method', { method: exhaustiveCheck });
        return {
          success: false,
          message: 'Invalid submission method configured.',
        };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Validation error', { error: error.errors });
      return {
        success: false,
        message: 'Invalid form data: ' + error.errors.map(e => e.message).join(', '),
        error,
      };
    }
    logger.error('Error submitting contact form', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error,
    };
  }
}

async function submitViaAPI(
  data: ContactFormData,
  endpoint = '/api/contact-unified' // Default endpoint
): Promise<{ success: boolean; id?: string; message: string; error?: any }> {
  try {
    logger.info('Submitting via API', { endpoint });
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        timestamp: data.timestamp || new Date().toISOString(),
        source: data.source || 'unified_api',
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('API error', { status: response.status, error: errorData });
      throw new Error(`API error: ${response.status} ${errorData.message || ''}`);
    }

    const responseData = await response.json();
    logger.info('API submission successful', { id: responseData.id });
    return {
      success: true,
      id: responseData.id,
      message: responseData.message || 'Form submitted successfully',
    };
  } catch (error) {
    logger.error('Error submitting via API', error);
    if (error.name === 'AbortError') {
      return { success: false, message: 'Request timed out. Please try again.', error };
    }
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred', error };
  }
}

async function submitViaEmail(
  data: ContactFormData,
  emailAddress = 'Jacobsamuelbarkin@gmail.com'
): Promise<{ success: boolean; id?: string; message: string }> {
  try {
    logger.info('Preparing email submission', { emailAddress });
    if (typeof window === 'undefined') {
      throw new Error('Cannot open email client from server-side code');
    }
    const subject = encodeURIComponent(`Contact Form: ${data.subject}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
    );
    const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
    logger.info('Email client opened');
    return { success: true, message: 'Email client opened. Please send the email.' };
  } catch (error) {
    logger.error('Error opening email client', error);
    // Fallback might be complex to implement here if window.location.href fails silently.
    // The original code had a console.log fallback, which isn't user-facing.
    return { success: false, message: 'Failed to open email client. Please contact directly via email: ' + emailAddress };
  }
}
