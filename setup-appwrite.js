// Script to set up Appwrite database and collection for contact form
const { Client, Databases, ID, Permission, Role } = require('appwrite');

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('6816ef35001da24d113d')
  .setKey('standard_7d784a84611fcf1ae8cd17b74b6ff1ad9ccf978a455f44079e9065d00b8e3ff24cfe194256497e540d40c7f3b46d99ac8522c28cdd753e2ce6369b07541838a399aafde729244907b6b8e4e47f6ca4264a08fa08660d7174405c2272085df741d96ef263aa7e7a8432ebc33f713fec24feab263afd1c2aae909927560752ca28');

const databases = new Databases(client);

// Database and collection names
const databaseId = 'contact-form-db';
const collectionId = 'contact-submissions';

async function setupAppwrite() {
  try {
    console.log('Starting Appwrite setup...');

    // Create database
    console.log('Creating database...');
    let database;
    try {
      database = await databases.create(
        ID.unique(),
        'Contact Form Database',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log(`Database created with ID: ${database.$id}`);
    } catch (error) {
      if (error.code === 409) {
        console.log('Database already exists, fetching existing databases...');
        const databasesList = await databases.list();
        database = databasesList.databases.find(db => db.name === 'Contact Form Database');
        if (database) {
          console.log(`Using existing database with ID: ${database.$id}`);
        } else {
          throw new Error('Could not find existing database');
        }
      } else {
        throw error;
      }
    }

    // Create collection
    console.log('Creating collection...');
    let collection;
    try {
      collection = await databases.createCollection(
        database.$id,
        ID.unique(),
        'Contact Submissions',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log(`Collection created with ID: ${collection.$id}`);
    } catch (error) {
      if (error.code === 409) {
        console.log('Collection already exists, fetching existing collections...');
        const collectionsList = await databases.listCollections(database.$id);
        collection = collectionsList.collections.find(col => col.name === 'Contact Submissions');
        if (collection) {
          console.log(`Using existing collection with ID: ${collection.$id}`);
        } else {
          throw new Error('Could not find existing collection');
        }
      } else {
        throw error;
      }
    }

    // Create attributes
    console.log('Creating attributes...');
    
    // Name attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'name',
        255,
        true
      );
      console.log('Created name attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('Name attribute already exists');
      } else {
        console.error('Error creating name attribute:', error);
      }
    }

    // Email attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'email',
        255,
        true
      );
      console.log('Created email attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('Email attribute already exists');
      } else {
        console.error('Error creating email attribute:', error);
      }
    }

    // Subject attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'subject',
        255,
        false
      );
      console.log('Created subject attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('Subject attribute already exists');
      } else {
        console.error('Error creating subject attribute:', error);
      }
    }

    // Message attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'message',
        10000, // Longer text
        true
      );
      console.log('Created message attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('Message attribute already exists');
      } else {
        console.error('Error creating message attribute:', error);
      }
    }

    // Timestamp attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'timestamp',
        255,
        false
      );
      console.log('Created timestamp attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('Timestamp attribute already exists');
      } else {
        console.error('Error creating timestamp attribute:', error);
      }
    }

    // UserAgent attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'userAgent',
        1000,
        false
      );
      console.log('Created userAgent attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('UserAgent attribute already exists');
      } else {
        console.error('Error creating userAgent attribute:', error);
      }
    }

    // Source attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'source',
        255,
        false
      );
      console.log('Created source attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('Source attribute already exists');
      } else {
        console.error('Error creating source attribute:', error);
      }
    }

    // IP Address attribute
    try {
      await databases.createStringAttribute(
        database.$id,
        collection.$id,
        'ipAddress',
        255,
        false
      );
      console.log('Created ipAddress attribute');
    } catch (error) {
      if (error.code === 409) {
        console.log('IP Address attribute already exists');
      } else {
        console.error('Error creating ipAddress attribute:', error);
      }
    }

    console.log('Appwrite setup completed successfully!');
    console.log(`Database ID: ${database.$id}`);
    console.log(`Collection ID: ${collection.$id}`);
    
    // Create .env.local file with the correct IDs
    console.log('Creating .env.local file...');
    
    return {
      databaseId: database.$id,
      collectionId: collection.$id
    };
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
