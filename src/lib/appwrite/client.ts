// Appwrite client configuration
import { Client } from 'appwrite';

// Fallback values for development - DO NOT USE IN PRODUCTION
const fallbackConfig = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '', // This should be set in environment variables
};

/**
 * Create and configure an Appwrite client
 * @returns Configured Appwrite client
 */
export function createClient(): Client {
  const client = new Client();
  
  // Configure client with environment variables or fallback values
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? fallbackConfig.endpoint)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? fallbackConfig.projectId);
  
  // Add custom headers for CORS if needed
  try {
    if (typeof client.setHeader === 'function') {
      // Add CORS headers for production domain
      const allowedOrigins = [
        'https://jacobbarkin.com',
        'https://www.jacobbarkin.com',
        'https://jacobbarkin-com.pages.dev',
        'https://modern-redesign-shadcn.jsb2010-github-io.pages.dev'
      ];

      // Get the current origin if in browser environment
      if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        if (allowedOrigins.includes(origin)) {
          client.setHeader('Origin', origin);
        }
      }
    }
  } catch (error) {
    console.warn('Error setting Appwrite headers:', error);
  }
  
  return client;
}

// Export a singleton instance for convenience
export const client = createClient();
