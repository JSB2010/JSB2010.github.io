// Custom Appwrite client with CORS workarounds
import { Client, Databases, ID } from 'appwrite';

// Initialize Appwrite client
const createClient = () => {
  const client = new Client();

  // Configure Appwrite client
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '6816ef35001da24d113d');

  // Add custom headers if needed
  // This is a workaround for CORS issues
  // client.setHeader('X-Custom-Header', 'value');

  return client;
};

// Create client and services
const client = createClient();
const databases = new Databases(client);

// Database and collection IDs
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'contact-form-db';
const contactSubmissionsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID || 'contact-submissions';

// Function to submit a contact form
export async function submitContactForm(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  [key: string]: any;
}) {
  try {
    // Only include fields that are explicitly defined in the Appwrite collection schema
    // Based on the error, we need to be very careful about field names
    const submissionData = {
      name: data.name,
      email: data.email,
      subject: data.subject || 'Contact Form Submission',
      message: data.message
      // Remove timestamp, userAgent, and source as they might not match the schema exactly
    };

    // Create document in Appwrite
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
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to submit form'
    };
  }
}

export { client, databases, databaseId, contactSubmissionsCollectionId };
