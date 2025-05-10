// Script to update Appwrite collection schema for contact form (isRead field removed)
const { Client, Databases, ID } = require('node-appwrite');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '', // Replace with your API key
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

// Function to update Appwrite collection schema
async function updateAppwriteSchema() {
  try {
    console.log('Updating Appwrite collection schema...');

    // Check if collection exists
    try {
      await databases.getCollection(config.databaseId, config.collectionId);
      console.log(`Collection ${config.collectionId} exists.`);
    } catch (error) {
      if (error.code === 404) {
        console.error(`Collection ${config.collectionId} does not exist. Please run setup-appwrite-schema.js first.`);
        return false;
      } else {
        throw error;
      }
    }

    // isRead attribute and index setup removed
    console.log('No schema updates needed - isRead functionality has been removed.');

    console.log('Appwrite collection schema updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating Appwrite collection schema:', error);
    throw error;
  }
}

// Run the update function
updateAppwriteSchema()
  .then((success) => {
    if (success) {
      console.log('==============================================');
      console.log('Schema check completed successfully!');
      console.log('==============================================');
      console.log('The isRead functionality has been removed from the dashboard.');
      console.log('==============================================');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Update failed:', error);
    process.exit(1);
  });
