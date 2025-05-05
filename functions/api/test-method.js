// Simple test function to verify HTTP methods
export async function onRequest(context) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  // Log the request method
  console.log("Request method:", context.request.method);
  
  // Handle OPTIONS requests for CORS preflight
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }
  
  // Return information about the request
  return new Response(
    JSON.stringify({
      success: true,
      method: context.request.method,
      url: context.request.url,
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries([...context.request.headers]),
      env: {
        hasAppwriteEndpoint: !!context.env.APPWRITE_ENDPOINT,
        hasAppwriteProjectId: !!context.env.APPWRITE_PROJECT_ID,
        hasAppwriteApiKey: !!context.env.APPWRITE_API_KEY,
        hasAppwriteDatabaseId: !!context.env.APPWRITE_DATABASE_ID,
        hasAppwriteCollectionId: !!context.env.APPWRITE_CONTACT_COLLECTION_ID
      }
    }),
    { status: 200, headers }
  );
}
