/**
 * @jest-environment node
 */

// Import the Cloudflare Function to test
const testFunction = require('../test');

describe('Cloudflare Function Test API', () => {
  it('should return a successful response', async () => {
    // Mock the context object that Cloudflare Functions provide
    const mockContext = {
      env: {
        APPWRITE_ENDPOINT: 'https://cloud.appwrite.io/v1',
        APPWRITE_PROJECT_ID: 'test-project-id',
        APPWRITE_API_KEY: 'test-api-key',
        APPWRITE_DATABASE_ID: 'test-database-id',
        APPWRITE_CONTACT_COLLECTION_ID: 'test-collection-id'
      }
    };

    // Call the function
    const response = await testFunction.onRequest(mockContext);
    
    // Get the response body as JSON
    const body = await response.json();
    
    // Test expectations
    expect(response instanceof Response).toBe(true);
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Cloudflare Function is working!');
    expect(body.env.hasAppwriteEndpoint).toBe(true);
    expect(body.env.hasAppwriteProjectId).toBe(true);
    expect(body.env.hasAppwriteApiKey).toBe(true);
    expect(body.env.hasAppwriteDatabaseId).toBe(true);
    expect(body.env.hasAppwriteCollectionId).toBe(true);
  });
});
