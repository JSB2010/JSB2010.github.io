// API route to test Appwrite connection
import { NextRequest } from 'next/server';
import { Client, Databases } from 'appwrite';
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

// Skip SDK initialization and use direct API calls instead
// This avoids issues with SDK version mismatches
async function testAppwriteDirectly() {
  const results = {
    client: { success: false, message: "Not tested" },
    database: { success: false, message: "Not tested" },
    collection: { success: false, message: "Not tested" }
  };

  // Test 1: Basic connectivity
  try {
    const response = await fetch(`${env.APPWRITE_ENDPOINT}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      results.client = {
        success: true,
        message: "Direct API connection successful"
      };

      // Test 2: Database and collection access
      try {
        const dbResponse = await fetch(
          `${env.APPWRITE_ENDPOINT}/databases/${env.APPWRITE_DATABASE_ID}/collections/${env.APPWRITE_CONTACT_COLLECTION_ID}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Appwrite-Project': env.APPWRITE_PROJECT_ID,
              'X-Appwrite-Key': env.APPWRITE_API_KEY || ''
            }
          }
        );

        if (dbResponse.ok) {
          const collectionData = await dbResponse.json();
          results.database = {
            success: true,
            message: "Database exists and is accessible"
          };
          results.collection = {
            success: true,
            message: `Collection exists with ${collectionData.attributes?.length || 0} attributes`
          };
        } else {
          const errorData = await dbResponse.json().catch(() => ({ message: `Status code: ${dbResponse.status}` }));
          results.database = {
            success: false,
            message: `Error accessing database: ${errorData.message || dbResponse.status}`
          };
        }
      } catch (dbError: any) {
        results.database = {
          success: false,
          message: `Error in database API call: ${dbError.message}`
        };
      }
    } else {
      results.client = {
        success: false,
        message: `API connection failed with status ${response.status}`
      };
    }
  } catch (error: any) {
    results.client = {
      success: false,
      message: `Error connecting to API: ${error.message}`
    };
  }

  return results;
}

export async function GET(request: NextRequest) {
  // For static export, we'll return a simulated response
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
    return createResponse({
      success: true,
      message: "This is a placeholder response for static export",
      tests: {
        client: { success: true, message: "Client initialized successfully" },
        database: { success: true, message: "Database connection successful" },
        collection: { success: true, message: "Collection exists and is accessible" }
      }
    });
  }

  // Test results object
  const results = {
    success: false,
    message: "Appwrite connection test results",
    tests: {
      client: { success: false, message: "Not tested" },
      database: { success: false, message: "Not tested" },
      collection: { success: false, message: "Not tested" }
    },
    config: {
      endpoint: env.APPWRITE_ENDPOINT,
      projectId: env.APPWRITE_PROJECT_ID ? "Defined" : "Not defined",
      apiKey: env.APPWRITE_API_KEY ? "Defined" : "Not defined",
      databaseId: env.APPWRITE_DATABASE_ID,
      collectionId: env.APPWRITE_CONTACT_COLLECTION_ID
    }
  };

  try {
    // Run direct API tests
    const testResults = await testAppwriteDirectly();

    // Update test results
    results.tests.client = testResults.client;
    results.tests.database = testResults.database;
    results.tests.collection = testResults.collection;

    // Set overall success if all tests passed
    results.success =
      testResults.client.success &&
      testResults.database.success &&
      testResults.collection.success;

    if (results.success) {
      results.message = "All Appwrite connection tests passed successfully";
    }
  } catch (error: any) {
    // Catch any unexpected errors
    results.message = `Unexpected error: ${error.message}`;
  }

  return createResponse(results);
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
