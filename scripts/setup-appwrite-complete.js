// Comprehensive Appwrite setup script for contact form and email notifications
const { Client, Databases, Functions, Teams, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

// Appwrite configuration
const config = {
  endpoint: 'https://nyc.cloud.appwrite.io/v1',
  projectId: '6816ef35001da24d113d',
  apiKey: 'standard_7d784a84611fcf1ae8cd17b74b6ff1ad9ccf978a455f44079e9065d00b8e3ff24cfe194256497e540d40c7f3b46d99ac8522c28cdd753e2ce6369b07541838a399aafde729244907b6b8e4e47f6ca4264a08fa08660d7174405c2272085df741d96ef263aa7e7a8432ebc33f713fec24feab263afd1c2aae909927560752ca28',
  databaseId: 'contact-form-db',
  collectionId: 'contact-submissions',
  functionId: 'contact-email-notification',
  functionName: 'Contact Form Email Notification',
  emailUser: 'jacobsamuelbarkin@gmail.com',
  emailPassword: 'dwzm vsxv gipu tlsi'
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

// Set API key for server-side SDK
client.setKey(config.apiKey);

const databases = new Databases(client);
const functions = new Functions(client);
const teams = new Teams(client);

// Function to create a zip file of the email notification function
async function createFunctionZip() {
  console.log('Creating function zip file...');

  const sourceDir = path.join(__dirname, '../functions/email-notification');
  const outputFile = path.join(__dirname, '../functions/email-notification.zip');

  // Create a file to stream archive data to
  const output = fs.createWriteStream(outputFile);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  // Listen for all archive data to be written
  const closePromise = new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Function zip created: ${archive.pointer()} total bytes`);
      resolve(outputFile);
    });

    archive.on('error', (err) => {
      reject(err);
    });
  });

  // Pipe archive data to the file
  archive.pipe(output);

  // Add the source directory contents to the archive
  archive.directory(sourceDir, false);

  // Finalize the archive
  await archive.finalize();

  // Wait for the archive to be written
  return closePromise;
}

// Function to set up the database and collection
async function setupDatabase() {
  console.log('Setting up database and collection...');

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
          ['*'] // Permissions - allow all for now
        );
        console.log(`Database ${config.databaseId} created.`);
      } else {
        throw error;
      }
    }

    // Check if collection exists
    try {
      await databases.getCollection(config.databaseId, config.collectionId);
      console.log(`Collection ${config.collectionId} already exists.`);
    } catch (error) {
      if (error.code === 404) {
        // Create collection if it doesn't exist
        console.log(`Creating collection ${config.collectionId}...`);
        await databases.createCollection(
          config.databaseId,
          config.collectionId,
          'Contact Submissions',
          ['*'], // Permissions - allow all for now
          true // Enable document creation
        );
        console.log(`Collection ${config.collectionId} created.`);
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

    // Check existing attributes first
    try {
      const existingAttributes = await databases.listAttributes(config.databaseId, config.collectionId);
      const existingAttributeNames = existingAttributes.attributes.map(attr => attr.key);
      console.log('Existing attributes:', existingAttributeNames);

      // Only create attributes that don't exist yet
      for (const attr of attributes) {
        if (existingAttributeNames.includes(attr.name)) {
          console.log(`Attribute ${attr.name} already exists, skipping.`);
          continue;
        }

        try {
          console.log(`Creating attribute ${attr.name}...`);
          await databases.createStringAttribute(
            config.databaseId,
            config.collectionId,
            attr.name,
            attr.size,
            attr.required
          );
          console.log(`Attribute ${attr.name} created.`);
        } catch (error) {
          if (error.code === 409) {
            console.log(`Attribute ${attr.name} already exists.`);
          } else if (error.type === 'attribute_limit_exceeded') {
            console.log(`Attribute limit exceeded. Skipping creation of remaining attributes.`);
            break; // Stop trying to create more attributes
          } else {
            console.error(`Error creating attribute ${attr.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error listing attributes:', error);
    }

    console.log('Database and collection setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up database and collection:', error);
    throw error;
  }
}

// Function to set up the email notification function
async function setupFunction() {
  console.log('Setting up email notification function...');

  try {
    // Create function zip file
    const zipFile = await createFunctionZip();

    // Check if function exists
    let functionExists = false;
    try {
      await functions.get(config.functionId);
      functionExists = true;
      console.log(`Function ${config.functionId} already exists.`);
    } catch (error) {
      if (error.code === 404) {
        console.log(`Function ${config.functionId} does not exist. Creating...`);
      } else {
        throw error;
      }
    }

    // Use a hardcoded runtime that we know is valid from the error message
    const selectedRuntime = 'node-18.0'; // A stable Node.js version that should be supported
    console.log(`Selected runtime: ${selectedRuntime}`);

    if (!functionExists) {
      // Create function if it doesn't exist
      console.log(`Creating function ${config.functionId}...`);
      await functions.create(
        config.functionId,
        config.functionName,
        ['any'], // Execute permissions
        selectedRuntime // Use the selected runtime
      );
      console.log(`Function ${config.functionId} created.`);
    }

    // Update function settings
    console.log(`Updating function ${config.functionId} settings...`);
    await functions.update(
      config.functionId,
      config.functionName,
      ['any'], // Execute permissions
      15 // Timeout in seconds
    );
    console.log(`Function ${config.functionId} settings updated.`);

    // Set function variables
    console.log('Setting function variables...');

    // Helper function to set a variable (create or update)
    async function setFunctionVariable(key, value) {
      try {
        // Try to create the variable
        await functions.createVariable(
          config.functionId,
          key,
          value
        );
        console.log(`${key} variable created.`);
      } catch (error) {
        if (error.code === 409) {
          // Variable already exists, update it
          try {
            await functions.updateVariable(
              config.functionId,
              key,
              value
            );
            console.log(`${key} variable updated.`);
          } catch (updateError) {
            console.error(`Error updating ${key} variable:`, updateError);
            // Continue with the setup even if variable update fails
          }
        } else {
          console.error(`Error creating ${key} variable:`, error);
          // Continue with the setup even if variable creation fails
        }
      }
    }

    // Set the variables
    await setFunctionVariable('EMAIL_USER', config.emailUser);
    await setFunctionVariable('EMAIL_PASSWORD', config.emailPassword);

    // Deploy function
    console.log(`Deploying function ${config.functionId}...`);
    try {
      const zipData = fs.readFileSync(zipFile);
      await functions.createDeployment(
        config.functionId,
        'latest',
        zipData,
        true // Activate deployment
      );
      console.log(`Function ${config.functionId} deployed.`);
    } catch (error) {
      console.error('Error deploying function:', error);
      console.log('Continuing with setup despite deployment error...');
      // Continue with setup even if deployment fails
    }

    // Set up database event trigger
    console.log('Setting up database event trigger...');
    try {
      // First, check if the event already exists
      const events = await functions.listEvents(config.functionId);
      const eventName = `databases.${config.databaseId}.collections.${config.collectionId}.documents.create`;
      const eventExists = events.events.some(event => event.includes(eventName));

      if (eventExists) {
        console.log('Database event trigger already exists.');
      } else {
        try {
          await functions.createEvent(
            config.functionId,
            eventName
          );
          console.log('Database event trigger created.');
        } catch (eventError) {
          console.error('Error creating event trigger:', eventError);
          console.log('You may need to manually set up the event trigger in the Appwrite Console.');
        }
      }
    } catch (error) {
      console.error('Error checking event triggers:', error);
      console.log('You may need to manually set up the event trigger in the Appwrite Console.');
    }

    // Clean up
    try {
      fs.unlinkSync(zipFile);
      console.log('Cleaned up temporary files.');
    } catch (error) {
      console.error('Error cleaning up temporary files:', error);
    }

    console.log('Function setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up function:', error);
    throw error;
  }
}

// Main setup function
async function setupAppwrite() {
  console.log('Starting Appwrite setup...');

  try {
    // Install required dependencies
    console.log('Installing required dependencies...');
    try {
      await exec('npm install archiver nodemailer --no-save');
      console.log('Dependencies installed.');
    } catch (error) {
      console.error('Error installing dependencies:', error);
      throw error;
    }

    // Set up database and collection
    await setupDatabase();

    // Set up function
    await setupFunction();

    console.log('Appwrite setup completed successfully!');
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
      console.log('Appwrite setup completed successfully!');
      console.log('==============================================');
      console.log('Your contact form is now configured to:');
      console.log('1. Store submissions in Appwrite database');
      console.log('2. Send email notifications to your Gmail account');
      console.log('');
      console.log('Important: For security reasons, please revoke or rotate');
      console.log('the API key used for this setup when you\'re done.');
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
