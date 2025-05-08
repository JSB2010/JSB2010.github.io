// Script to list all Appwrite functions
const { Client, Functions } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '',
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const functions = new Functions(client);

// Function to list all Appwrite functions
async function listFunctions() {
  console.log('Listing Appwrite functions...');
  console.log('Configuration:', {
    endpoint: config.endpoint,
    projectId: config.projectId,
  });

  try {
    // List all functions
    const functionsList = await functions.list();
    
    console.log(`Found ${functionsList.total} functions:`);
    functionsList.functions.forEach(func => {
      console.log(`- ${func.name} (ID: ${func.$id})`);
      console.log(`  Runtime: ${func.runtime}`);
      console.log(`  Status: ${func.status}`);
      console.log(`  Events: ${func.events.length > 0 ? func.events.join(', ') : 'None'}`);
      console.log(`  Enabled: ${func.enabled ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    return functionsList;
  } catch (error) {
    console.error('Error listing functions:', error);
    throw error;
  }
}

// Run the listing
listFunctions()
  .then(functionsList => {
    if (functionsList.total === 0) {
      console.log('No functions found. You need to create a function in the Appwrite Console.');
    } else {
      console.log('Function listing completed successfully!');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Listing failed:', error);
    process.exit(1);
  });
