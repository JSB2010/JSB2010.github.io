// Script to test Appwrite authentication
const { Client, Account } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
};

console.log('Appwrite configuration:');
console.log(JSON.stringify(config, null, 2));

// Function to test authentication
async function testAuthentication(email, password) {
  try {
    console.log(`Testing authentication for ${email}...`);
    
    // Initialize Appwrite client
    const client = new Client();
    client
      .setEndpoint(config.endpoint)
      .setProject(config.projectId);
    
    const account = new Account(client);
    
    // Try to create a session
    console.log('Attempting to create a session...');
    const session = await account.createEmailPasswordSession(email, password);
    
    console.log('Session created successfully!');
    console.log('Session ID:', session.$id);
    
    // Try to get the current account
    console.log('Fetching account details...');
    const user = await account.get();
    
    console.log('Authentication successful!');
    console.log('User ID:', user.$id);
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    
    // Delete the session
    console.log('Deleting session...');
    await account.deleteSession(session.$id);
    console.log('Session deleted successfully!');
    
    return true;
  } catch (error) {
    console.error('Authentication failed:', error);
    return false;
  }
}

// Main function
async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.error('Usage: node test-appwrite-auth.js <email> <password>');
    process.exit(1);
  }
  
  const success = await testAuthentication(email, password);
  
  if (success) {
    console.log('✅ Authentication test passed!');
    process.exit(0);
  } else {
    console.error('❌ Authentication test failed!');
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
