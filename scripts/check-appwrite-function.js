// Script to check the status of the Appwrite function
const { Client, Functions } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '',
  functionId: 'contact-email-notification',
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const functions = new Functions(client);

// Function to check the status of the Appwrite function
async function checkFunction() {
  console.log('Checking Appwrite function status...');
  console.log('Configuration:', {
    endpoint: config.endpoint,
    projectId: config.projectId,
    functionId: config.functionId,
  });

  try {
    // Check if function exists
    console.log(`Checking if function ${config.functionId} exists...`);
    const functionDetails = await functions.get(config.functionId);
    
    console.log('Function exists!');
    console.log('Function details:', {
      id: functionDetails.$id,
      name: functionDetails.name,
      runtime: functionDetails.runtime,
      status: functionDetails.status,
      events: functionDetails.events,
      schedule: functionDetails.schedule,
      timeout: functionDetails.timeout,
      enabled: functionDetails.enabled,
    });

    // Check function variables
    console.log('Checking function variables...');
    const variables = await functions.listVariables(config.functionId);
    
    console.log('Function variables:');
    variables.variables.forEach(variable => {
      console.log(`- ${variable.key}: ${variable.key.includes('PASSWORD') ? '********' : variable.value}`);
    });

    // Check function executions
    console.log('Checking recent function executions...');
    const executions = await functions.listExecutions(config.functionId);
    
    console.log(`Found ${executions.total} executions.`);
    executions.executions.forEach(execution => {
      console.log(`- Execution ${execution.$id}: Status ${execution.status}, Created at ${new Date(execution.$createdAt).toLocaleString()}`);
    });

    return true;
  } catch (error) {
    if (error.code === 404) {
      console.error(`Function ${config.functionId} does not exist.`);
      console.log('You need to create the function in the Appwrite Console or using the update-email-function.js script.');
    } else {
      console.error('Error checking function:', error);
    }
    
    return false;
  }
}

// Run the check
checkFunction()
  .then(success => {
    if (success) {
      console.log('Function check completed successfully!');
    } else {
      console.error('Function check failed!');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
