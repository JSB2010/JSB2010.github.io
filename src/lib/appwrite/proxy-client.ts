// Appwrite client with proxy support to avoid CORS issues
import { Client, Account, Databases, ID, Storage, Teams } from 'appwrite';

// Fallback values for development - DO NOT USE IN PRODUCTION
const fallbackConfig = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '6816ef35001da24d113d',
};

// Custom fetch function that uses our proxy
const proxyFetch = async (url: string, options: RequestInit = {}) => {
  try {
    // Extract the path from the Appwrite URL
    const appwriteEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || fallbackConfig.endpoint;
    let path = url.replace(appwriteEndpoint, '');
    
    // Construct the proxy URL
    const proxyUrl = `/api/appwrite-proxy?path=${encodeURIComponent(path)}`;
    
    // Forward the request to our proxy
    const response = await fetch(proxyUrl, options);
    
    return response;
  } catch (error) {
    console.error('Proxy fetch error:', error);
    throw error;
  }
};

/**
 * Create and configure an Appwrite client that uses our proxy
 * @returns Configured Appwrite client
 */
export function createProxyClient(): Client {
  const client = new Client();
  
  // Configure client with environment variables or fallback values
  client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? fallbackConfig.endpoint)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? fallbackConfig.projectId);
  
  // Set response format to 1.0.0 for better compatibility
  try {
    if (typeof client.setHeader === 'function') {
      client.setHeader('X-Appwrite-Response-Format', '1.0.0');
    }
  } catch (error) {
    console.warn('Error setting Appwrite headers:', error);
  }
  
  // Override the fetch method to use our proxy
  // @ts-ignore - We're overriding a private method
  client.call = async (method: string, url: string, headers: Record<string, string> = {}, params: any = {}) => {
    try {
      // Prepare request options
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && params) {
        options.body = JSON.stringify(params);
      }
      
      // Use our proxy fetch
      const response = await proxyFetch(url, options);
      
      // Parse the response
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Unknown error');
      }
      
      return data;
    } catch (error) {
      console.error('Appwrite client error:', error);
      throw error;
    }
  };
  
  return client;
}

// Create services with the proxy client
export function createProxyServices() {
  const client = createProxyClient();
  const account = new Account(client);
  const databases = new Databases(client);
  
  return {
    client,
    account,
    databases,
  };
}

// Export a singleton instance for convenience
export const proxyServices = createProxyServices();
