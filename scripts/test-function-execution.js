// Script to directly execute the Appwrite function
const { Client, Functions } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '',
  functionId: '681c08e2003d92a504ba', // Your actual function ID
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const functions = new Functions(client);

// Sample document data that simulates a database event
const sampleData = {
  database: {
    name: 'contact-form-db',
    $id: 'contact-form-db'
  },
  collection: {
    name: 'contact-submissions',
    $id: 'contact-submissions'
  },
  document: {
    $id: 'test-document-id',
    name: 'Test User (Direct Execution)',
    email: 'test@example.com',
    subject: 'Test Direct Function Execution',
    message: 'This is a test message sent by directly executing the function.'
  }
};

// Function to execute the Appwrite function
async function executeFunction() {
  console.log('Executing Appwrite function...');
  console.log('Configuration:', {
    endpoint: config.endpoint,
    projectId: config.projectId,
    functionId: config.functionId
  });

  try {
    // Execute the function with the sample data
    console.log('Sending sample data:', JSON.stringify(sampleData, null, 2));
    const execution = await functions.createExecution(
      config.functionId,
      JSON.stringify(sampleData),
      false, // async execution
      '/', // path
      'POST' // method
    );

    console.log('Function executed successfully!');
    console.log('Execution ID:', execution.$id);
    console.log('Status:', execution.status);
    console.log('Created at:', new Date(execution.$createdAt).toLocaleString());
    console.log('Response:', execution.response);

    return execution;
  } catch (error) {
    console.error('Error executing function:', error);
    throw error;
  }
}

// Run the execution
executeFunction()
  .then(execution => {
    console.log('Test completed successfully!');
    console.log('Check your email for the notification.');
    console.log('If you don\'t receive an email, check the function logs in the Appwrite Console.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
