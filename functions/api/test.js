// Simple test function to verify Cloudflare Functions are working
export async function onRequest(context) {
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Cloudflare Function is working!',
      timestamp: new Date().toISOString(),
      env: {
        hasAppwriteEndpoint: !!context.env.APPWRITE_ENDPOINT,
        hasAppwriteProjectId: !!context.env.APPWRITE_PROJECT_ID,
        hasAppwriteApiKey: !!context.env.APPWRITE_API_KEY,
        hasAppwriteDatabaseId: !!context.env.APPWRITE_DATABASE_ID,
        hasAppwriteCollectionId: !!context.env.APPWRITE_CONTACT_COLLECTION_ID
      }
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}
