// Script to test the contact form submission to Appwrite
const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'contact-form-db',
  collectionId: process.env.APPWRITE_CONTACT_COLLECTION_ID || 'contact-submissions',
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const databases = new Databases(client);

// Test data
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Submission',
  message: 'This is a test submission from the test script.'
};

// Function to submit test data
async function submitTestData() {
  console.log('Submitting test data to Appwrite...');
  console.log('Configuration:', {
    endpoint: config.endpoint,
    projectId: config.projectId,
    databaseId: config.databaseId,
    collectionId: config.collectionId
  });
  console.log('Test data:', testData);

  try {
    // Create document in Appwrite database
    const document = await databases.createDocument(
      config.databaseId,
      config.collectionId,
      ID.unique(),
      testData
    );

    console.log('Test submission successful!');
    console.log('Document ID:', document.$id);
    console.log('Created at:', new Date(document.$createdAt).toLocaleString());
    console.log('');
    console.log('Check your email for the notification.');
    console.log('If you don\'t receive an email, check the function logs in the Appwrite Console.');

    return document;
  } catch (error) {
    console.error('Error submitting test data:', error);
    throw error;
  }
}

// Run the test
submitTestData()
  .then(() => {
    console.log('Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });
