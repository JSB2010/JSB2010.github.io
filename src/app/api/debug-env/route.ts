// API route to debug environment variables
import { NextRequest } from 'next/server';
import { env } from '@/lib/env';

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

// Helper function to create a response
function createResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Safely mask sensitive values
function maskSensitiveValue(value: string | undefined): string {
  if (!value) return 'undefined';
  if (value.length <= 8) return '********';
  return value.substring(0, 4) + '****' + value.substring(value.length - 4);
}

export async function GET(request: NextRequest) {
  // For security, only allow this in development mode
  if (process.env.NODE_ENV === 'production') {
    return createResponse({
      message: "This endpoint is only available in development mode for security reasons.",
      environment: process.env.NODE_ENV,
      // Provide minimal safe information in production
      config: {
        appwriteEndpointDefined: !!env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
        appwriteProjectIdDefined: !!env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        appwriteDatabaseIdDefined: !!env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        appwriteCollectionIdDefined: !!env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID,
        origin: request.headers.get('origin') || 'unknown'
      }
    });
  }

  // In development, provide more detailed information
  return createResponse({
    message: "Environment variables debug information",
    environment: process.env.NODE_ENV,
    config: {
      // Client-side variables
      NEXT_PUBLIC_APPWRITE_ENDPOINT: env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
      NEXT_PUBLIC_APPWRITE_PROJECT_ID: env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
      NEXT_PUBLIC_APPWRITE_DATABASE_ID: env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID: env.NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID,
      
      // Server-side variables (masked)
      APPWRITE_ENDPOINT: env.APPWRITE_ENDPOINT,
      APPWRITE_PROJECT_ID: env.APPWRITE_PROJECT_ID,
      APPWRITE_API_KEY: maskSensitiveValue(env.APPWRITE_API_KEY),
      APPWRITE_DATABASE_ID: env.APPWRITE_DATABASE_ID,
      APPWRITE_CONTACT_COLLECTION_ID: env.APPWRITE_CONTACT_COLLECTION_ID,
      
      // Request information
      headers: {
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        userAgent: request.headers.get('user-agent')
      }
    }
  });
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
