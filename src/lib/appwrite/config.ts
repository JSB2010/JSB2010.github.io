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
    // Only include the basic form fields that are defined in the Appwrite collection schema
    // This avoids errors with undefined attributes
    const submissionData = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    };

    // Create document in Appwrite database
    const document = await databases.createDocument(
      databaseId,
      contactSubmissionsCollectionId,
      ID.unique(),
      submissionData
    );

    return {
      success: true,
      id: document.$id,
      message: 'Form submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export { client, databases, databaseId, contactSubmissionsCollectionId, ID };
