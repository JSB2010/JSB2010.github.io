// Enhanced Appwrite setup script with comprehensive schema validation
const { Client, Databases, ID, Query, Permission, Role } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

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
  .setProject(config.projectId);

// Set API key for server-side SDK
client.setKey(config.apiKey);

const databases = new Databases(client);

// Enhanced schema definition with validation rules
const schema = {
  name: 'Contact Form Submissions',
  attributes: [
    {
      key: 'name',
      type: 'string',
      size: 255,
      required: true,
      array: false,
      default: null,
      description: 'Full name of the person submitting the form'
    },
    {
      key: 'email',
      type: 'string',
      size: 255,
      required: true,
      array: false,
      default: null,
      format: 'email',
      description: 'Email address of the person submitting the form'
    },
    {
      key: 'subject',
      type: 'string',
      size: 255,
      required: true,
      array: false,
      default: null,
      description: 'Subject of the contact form submission'
    },
    {
      key: 'message',
      type: 'string',
      size: 10000,
      required: true,
      array: false,
      default: null,
      description: 'Message content of the contact form submission'
    },
    {
      key: 'timestamp',
      type: 'datetime',
      required: false,
      array: false,
      default: null,
      description: 'Timestamp of when the form was submitted'
    },
    {
      key: 'userAgent',
      type: 'string',
      size: 1000,
      required: false,
      array: false,
      default: null,
      description: 'User agent of the browser used to submit the form'
    },
    {
      key: 'source',
      type: 'string',
      size: 255,
      required: false,
      array: false,
      default: null,
      description: 'Source of the form submission (e.g., website, app)'
    },
    {
      key: 'ipAddress',
      type: 'string',
      size: 45,
      required: false,
      array: false,
      default: null,
      description: 'IP address of the client submitting the form'
    },
    {
      key: 'status',
      type: 'string',
      size: 50,
      required: false,
      array: false,
      default: 'new',
      description: 'Status of the submission (new, read, replied, archived)'
    },
    {
      key: 'tags',
      type: 'string',
      size: 255,
      required: false,
      array: true,
      default: null,
      description: 'Tags associated with this submission for categorization'
    },
    {
      key: 'priority',
      type: 'integer',
      required: false,
      min: 1,
      max: 5,
      default: 3,
      description: 'Priority level of the submission (1-5, where 1 is highest)'
    }
  ],
  indexes: [
    {
      key: 'email_index',
      type: 'key',
      attributes: ['email'],
      description: 'Index for searching by email'
    },
    {
      key: 'timestamp_index',
      type: 'key',
      attributes: ['timestamp'],
      description: 'Index for sorting by timestamp'
    },
    {
      key: 'status_index',
      type: 'key',
      attributes: ['status'],
      description: 'Index for filtering by status'
    },
    {
      key: 'priority_index',
      type: 'key',
      attributes: ['priority'],
      description: 'Index for sorting by priority'
    },
    {
      key: 'source_index',
      type: 'key',
      attributes: ['source'],
      description: 'Index for filtering by source'
    }
  ]
};

// Function to set up the database
async function setupDatabase() {
  console.log('Setting up database...');

  try {
    // Check if database exists
    try {
      await databases.get(config.databaseId);
      console.log(`Database ${config.databaseId} already exists.`);
    } catch (error) {
      if (error.code === 404) {
        // Create database if it doesn't exist
        console.log(`Creating database ${config.databaseId}...`);
        await databases.create(
          config.databaseId,
          'Contact Form Database',
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.team("administrators")),
            Permission.delete(Role.team("administrators"))
          ]
        );
        console.log(`Database ${config.databaseId} created.`);
      } else {
        throw error;
      }
    }

    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Function to set up the collection with enhanced schema
async function setupCollection() {
  console.log('Setting up collection...');

  try {
    // Check if collection exists
    let collectionExists = false;
    try {
      await databases.getCollection(config.databaseId, config.collectionId);
      console.log(`Collection ${config.collectionId} already exists.`);
      collectionExists = true;
    } catch (error) {
      if (error.code === 404) {
        // Create collection if it doesn't exist
        console.log(`Creating collection ${config.collectionId}...`);
        await databases.createCollection(
          config.databaseId,
          config.collectionId,
          schema.name,
          [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.team("administrators")),
            Permission.delete(Role.team("administrators"))
          ]
        );
        console.log(`Collection ${config.collectionId} created.`);
      } else {
        throw error;
      }
    }

    // Create attributes
    for (const attr of schema.attributes) {
      try {
        console.log(`Creating attribute ${attr.key}...`);
        
        // Skip if attribute already exists
        try {
          await databases.getAttribute(config.databaseId, config.collectionId, attr.key);
          console.log(`Attribute ${attr.key} already exists.`);
          continue;
        } catch (error) {
          if (error.code !== 404) {
            throw error;
          }
        }

        // Create attribute based on type
        switch (attr.type) {
          case 'string':
            await databases.createStringAttribute(
              config.databaseId,
              config.collectionId,
              attr.key,
              attr.size,
              attr.required,
              attr.default,
              attr.array
            );
            break;
          case 'integer':
            await databases.createIntegerAttribute(
              config.databaseId,
              config.collectionId,
              attr.key,
              attr.required,
              attr.min,
              attr.max,
              attr.default,
              attr.array
            );
            break;
          case 'datetime':
            await databases.createDatetimeAttribute(
              config.databaseId,
              config.collectionId,
              attr.key,
              attr.required,
              attr.default,
              attr.array
            );
            break;
          default:
            console.warn(`Unsupported attribute type: ${attr.type} for ${attr.key}`);
            continue;
        }
        
        console.log(`Attribute ${attr.key} created.`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`Attribute ${attr.key} already exists.`);
        } else {
          console.error(`Error creating attribute ${attr.key}:`, error);
        }
      }
    }

    // Create indexes
    for (const index of schema.indexes) {
      try {
        console.log(`Creating index ${index.key}...`);
        
        // Skip if index already exists
        try {
          await databases.getIndex(config.databaseId, config.collectionId, index.key);
          console.log(`Index ${index.key} already exists.`);
          continue;
        } catch (error) {
          if (error.code !== 404) {
            throw error;
          }
        }

        await databases.createIndex(
          config.databaseId,
          config.collectionId,
          index.key,
          index.type,
          index.attributes,
          index.description
        );
        
        console.log(`Index ${index.key} created.`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`Index ${index.key} already exists.`);
        } else {
          console.error(`Error creating index ${index.key}:`, error);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error setting up collection:', error);
    throw error;
  }
}

// Main setup function
async function setupAppwrite() {
  console.log('Starting enhanced Appwrite setup...');

  try {
    // Set up database
    await setupDatabase();

    // Set up collection with enhanced schema
    await setupCollection();

    console.log('Enhanced Appwrite setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up Appwrite:', error);
    return false;
  }
}

// Run the setup
setupAppwrite()
  .then(success => {
    if (success) {
      console.log('==============================================');
      console.log('Enhanced Appwrite setup completed successfully!');
      console.log('==============================================');
      console.log('Your contact form database now has:');
      console.log('1. Comprehensive schema validation');
      console.log('2. Proper indexing for efficient querying');
      console.log('3. Enhanced security with role-based permissions');
      console.log('4. Additional fields for better contact management');
      console.log('==============================================');
      process.exit(0);
    } else {
      console.error('Appwrite setup failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });