// Appwrite client-side configuration
import { Client, Databases, ID } from 'appwrite';

// Fallback values for development - DO NOT USE IN PRODUCTION
const fallbackConfig = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '6816ef35001da24d113d',
  databaseId: 'contact-form-db',
  collectionId: 'contact-submissions'
};

// Initialize Appwrite client
const client = new Client();

// Configure Appwrite client
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? fallbackConfig.endpoint)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? fallbackConfig.projectId);

// Initialize Appwrite services
const databases = new Databases(client);

// Database and collection IDs
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? fallbackConfig.databaseId;
const contactSubmissionsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID ?? fallbackConfig.collectionId;

// Log the configuration for debugging (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Appwrite Config:', {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? fallbackConfig.endpoint,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? 'defined' : 'undefined',
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? fallbackConfig.databaseId,
    collectionId: contactSubmissionsCollectionId,
    source: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ? 'environment variables' : 'fallback values'
  });
}

/**
 * Submit contact form data to Appwrite database
 * @param data Form data to submit
 * @returns Promise with submission result
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      throw new Error('Cannot submit form from server-side code');
    }

    // Check network connectivity
    if (!navigator.onLine) {
      throw new Error('Network error: Browser is offline');
    }

    // Log the configuration being used
    console.log('Submitting with config:', {
      endpoint: client.config.endpoint,
      projectId: client.config.project,
      databaseId,
      collectionId: contactSubmissionsCollectionId
    });

    // Only include the basic form fields that are defined in the Appwrite collection schema
    // This avoids errors with undefined attributes
    const submissionData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    };

    // Create document in Appwrite database with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000);
    });

    const documentPromise = databases.createDocument(
      databaseId,
      contactSubmissionsCollectionId,
      ID.unique(),
      submissionData
    );

    // Race the document creation against the timeout
    const document = await Promise.race([documentPromise, timeoutPromise]) as any;

    return {
      success: true,
      id: document.$id,
      message: 'Form submitted successfully'
    };
  } catch (error: any) {
    console.error('Error submitting contact form:', error);

    // Handle specific error types
    if (error.name === 'AppwriteException') {
      console.error('Appwrite error details:', {
        code: error.code,
        type: error.type,
        message: error.message
      });

      // Handle CORS errors
      if (error.code === 0 || error.message.includes('CORS')) {
        return {
          success: false,
          message: 'Network error: CORS policy violation. Please try again later.',
          error
        };
      }

      // Handle authentication errors
      if (error.code === 401) {
        return {
          success: false,
          message: 'Authentication error: Not authorized to access this resource.',
          error
        };
      }

      // Handle rate limiting
      if (error.code === 429) {
        return {
          success: false,
          message: 'Too many requests. Please try again later.',
          error
        };
      }
    }

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'Network request failed. Please check your internet connection and try again.',
        error
      };
    }

    // Handle timeout errors
    if (error.message && error.message.includes('timed out')) {
      return {
        success: false,
        message: 'Request timed out. The server took too long to respond. Please try again later.',
        error
      };
    }

    // Generic error handling
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      error
    };
  }
}

export { client, databases, databaseId, contactSubmissionsCollectionId, ID };
