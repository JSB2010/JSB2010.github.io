// Script to set up Appwrite collection schema for contact form
const { Client, Databases, ID } = require('appwrite');

// Initialize Appwrite client
const client = new Client();

// Configure Appwrite client
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d')
  .setKey(process.env.APPWRITE_API_KEY || ''); // Replace with your API key

// Initialize Appwrite services
const databases = new Databases(client);

// Database and collection IDs
const databaseId = process.env.APPWRITE_DATABASE_ID || 'contact-form-db';
const collectionId = process.env.APPWRITE_CONTACT_COLLECTION_ID || 'contact-submissions';

// Function to set up Appwrite collection schema
async function setupAppwriteSchema() {
  try {
    console.log('Setting up Appwrite collection schema...');

    // Check if collection exists
    try {
      await databases.getCollection(databaseId, collectionId);
      console.log(`Collection ${collectionId} already exists.`);
    } catch (error) {
      if (error.code === 404) {
        // Create collection if it doesn't exist
        console.log(`Creating collection ${collectionId}...`);
        await databases.createCollection(
          databaseId,
          collectionId,
          'Contact Submissions',
          ['*'], // Permissions - allow all for now
          false // Don't enable document creation
        );
        console.log(`Collection ${collectionId} created.`);
      } else {
        throw error;
      }
    }

    // Define attributes
    const attributes = [
      { name: 'name', type: 'string', size: 255, required: true },
      { name: 'email', type: 'string', size: 255, required: true },
      { name: 'subject', type: 'string', size: 255, required: true },
      { name: 'message', type: 'string', size: 10000, required: true },
      { name: 'timestamp', type: 'string', size: 255, required: false },
      { name: 'userAgent', type: 'string', size: 1000, required: false },
      { name: 'source', type: 'string', size: 255, required: false },
      { name: 'ipAddress', type: 'string', size: 45, required: false }
    ];

    // Create attributes
    for (const attr of attributes) {
      try {
        console.log(`Creating attribute ${attr.name}...`);
        await databases.createStringAttribute(
          databaseId,
          collectionId,
          attr.name,
          attr.size,
          attr.required
        );
        console.log(`Attribute ${attr.name} created.`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`Attribute ${attr.name} already exists.`);
        } else {
          console.error(`Error creating attribute ${attr.name}:`, error);
        }
      }
    }

    // Update collection permissions
    console.log('Updating collection permissions...');
    await databases.updateCollection(
      databaseId,
      collectionId,
      'Contact Submissions',
      ['*'], // Permissions - allow all for now
      true // Enable document creation
    );
    console.log('Collection permissions updated.');

    console.log('Appwrite collection schema setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Appwrite collection schema:', error);
    throw error;
  }
}

// Run the setup function
setupAppwriteSchema()
  .then(() => {
    console.log('Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
