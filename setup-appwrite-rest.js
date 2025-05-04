// Script to set up Appwrite database and collection using REST API
const fetch = require('node-fetch');

// Appwrite configuration
const config = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '6816ef35001da24d113d',
  apiKey: 'standard_7d784a84611fcf1ae8cd17b74b6ff1ad9ccf978a455f44079e9065d00b8e3ff24cfe194256497e540d40c7f3b46d99ac8522c28cdd753e2ce6369b07541838a399aafde729244907b6b8e4e47f6ca4264a08fa08660d7174405c2272085df741d96ef263aa7e7a8432ebc33f713fec24feab263afd1c2aae909927560752ca28'
};

// Headers for API requests
const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': config.projectId,
  'X-Appwrite-Key': config.apiKey
};

// Generate a unique ID
const generateId = () => {
  return 'unique' + Math.random().toString(36).substring(2, 11);
};

// Create database
async function createDatabase() {
  console.log('Creating database...');
  
  const databaseId = 'contact-form-db';
  const response = await fetch(`${config.endpoint}/databases`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      databaseId,
      name: 'Contact Form Database'
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 409) {
      console.log('Database already exists, using existing database');
      return databaseId;
    } else {
      console.error('Error creating database:', data);
      throw new Error(`Failed to create database: ${data.message}`);
    }
  }
  
  console.log(`Database created with ID: ${data.$id}`);
  return data.$id;
}

// Create collection
async function createCollection(databaseId) {
  console.log('Creating collection...');
  
  const collectionId = 'contact-submissions';
  const response = await fetch(`${config.endpoint}/databases/${databaseId}/collections`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      collectionId,
      name: 'Contact Submissions',
      permissions: [
        'create("any")',
        'read("any")',
        'update("any")',
        'delete("any")'
      ]
    })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 409) {
      console.log('Collection already exists, using existing collection');
      return collectionId;
    } else {
      console.error('Error creating collection:', data);
      throw new Error(`Failed to create collection: ${data.message}`);
    }
  }
  
  console.log(`Collection created with ID: ${data.$id}`);
  return data.$id;
}

// Create attribute
async function createAttribute(databaseId, collectionId, key, type, required, options = {}) {
  console.log(`Creating attribute: ${key}...`);
  
  const body = {
    key,
    type,
    required,
    ...options
  };
  
  const response = await fetch(`${config.endpoint}/databases/${databaseId}/collections/${collectionId}/attributes/${type}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 409) {
      console.log(`Attribute ${key} already exists`);
      return;
    } else {
      console.error(`Error creating attribute ${key}:`, data);
      throw new Error(`Failed to create attribute ${key}: ${data.message}`);
    }
  }
  
  console.log(`Attribute ${key} created successfully`);
}

// Main setup function
async function setupAppwrite() {
  try {
    // Create database
    const databaseId = await createDatabase();
    
    // Create collection
    const collectionId = await createCollection(databaseId);
    
    // Create attributes
    await createAttribute(databaseId, collectionId, 'name', 'string', true, { size: 255 });
    await createAttribute(databaseId, collectionId, 'email', 'string', true, { size: 255 });
    await createAttribute(databaseId, collectionId, 'subject', 'string', false, { size: 255 });
    await createAttribute(databaseId, collectionId, 'message', 'string', true, { size: 10000 });
    await createAttribute(databaseId, collectionId, 'timestamp', 'string', false, { size: 255 });
    await createAttribute(databaseId, collectionId, 'userAgent', 'string', false, { size: 1000 });
    await createAttribute(databaseId, collectionId, 'source', 'string', false, { size: 255 });
    await createAttribute(databaseId, collectionId, 'ipAddress', 'string', false, { size: 255 });
    
    console.log('Appwrite setup completed successfully!');
    console.log(`Database ID: ${databaseId}`);
    console.log(`Collection ID: ${collectionId}`);
    
    return { databaseId, collectionId };
  } catch (error) {
    console.error('Error setting up Appwrite:', error);
    throw error;
  }
}

setupAppwrite()
  .then(ids => {
    console.log('Setup completed successfully!');
    console.log('Use these IDs in your .env.local file:');
    console.log(`NEXT_PUBLIC_APPWRITE_DATABASE_ID=${ids.databaseId}`);
    console.log(`NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID=${ids.collectionId}`);
    console.log(`APPWRITE_DATABASE_ID=${ids.databaseId}`);
    console.log(`APPWRITE_CONTACT_COLLECTION_ID=${ids.collectionId}`);
  })
  .catch(error => {
    console.error('Setup failed:', error);
  });
