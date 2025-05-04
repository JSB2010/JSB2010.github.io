// Appwrite client-side configuration
import { Client, Databases, Account } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Fallback values for development - DO NOT USE IN PRODUCTION
const fallbackConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  projectId: 'your-project-id', // This will be replaced with actual values
  databaseId: 'your-database-id',
  collectionId: 'contact-submissions'
};

// Configure Appwrite client
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? fallbackConfig.endpoint)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? fallbackConfig.projectId);

// Initialize Appwrite services
const databases = new Databases(client);
const account = new Account(client);

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

export { client, databases, account, databaseId, contactSubmissionsCollectionId };
