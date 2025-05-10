// Simplified script to set up the Appwrite function for email notifications
const { Client, Functions } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Appwrite configuration - load from environment variables
require('dotenv').config({ path: '.env.local' });

const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '',
  apiKey: process.env.APPWRITE_API_KEY || '',
  functionId: process.env.APPWRITE_FUNCTION_ID || 'contact-email-notification',
  functionName: 'Contact Form Email Notification',
  databaseId: process.env.APPWRITE_DATABASE_ID || 'contact-form-db',
  collectionId: process.env.APPWRITE_CONTACT_COLLECTION_ID || 'contact-submissions',
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || ''
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const functions = new Functions(client);

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

// Main function
async function setupFunction() {
  try {
    console.log('Starting function setup...');

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

    if (!functionExists) {
      // Create function if it doesn't exist
      console.log(`Creating function ${config.functionId}...`);

      // Try different runtimes
      const runtimes = ['node-18.0', 'node-16.0', 'node-14.5'];
      let created = false;

      for (const runtime of runtimes) {
        try {
          console.log(`Trying runtime: ${runtime}`);
          await functions.create(
            config.functionId,
            config.functionName,
            ['any'], // Execute permissions
            runtime
          );
          console.log(`Function ${config.functionId} created with runtime ${runtime}.`);
          created = true;
          break;
        } catch (error) {
          console.error(`Error creating function with runtime ${runtime}:`, error.message);
        }
      }

      if (!created) {
        console.error('Failed to create function with any runtime.');
        console.log('Please create the function manually in the Appwrite Console.');
        return false;
      }
    }

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
            console.error(`Error updating ${key} variable:`, updateError.message);
          }
        } else {
          console.error(`Error creating ${key} variable:`, error.message);
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
      console.error('Error deploying function:', error.message);
      console.log('You may need to deploy the function manually in the Appwrite Console.');
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
          console.error('Error creating event trigger:', eventError.message);
          console.log('You may need to manually set up the event trigger in the Appwrite Console.');
        }
      }
    } catch (error) {
      console.error('Error checking event triggers:', error.message);
      console.log('You may need to manually set up the event trigger in the Appwrite Console.');
    }

    // Clean up
    try {
      fs.unlinkSync(zipFile);
      console.log('Cleaned up temporary files.');
    } catch (error) {
      console.error('Error cleaning up temporary files:', error.message);
    }

    console.log('Function setup completed!');
    console.log('');
    console.log('==============================================');
    console.log('NEXT STEPS:');
    console.log('1. Test the contact form on your website');
    console.log('2. Check your email for notifications when forms are submitted');
    console.log('3. If you encounter any issues, check the function logs in the Appwrite Console');
    console.log('==============================================');

    return true;
  } catch (error) {
    console.error('Error setting up function:', error);
    return false;
  }
}

// Run the setup
setupFunction()
  .then(success => {
    if (success) {
      console.log('Setup completed successfully!');
      process.exit(0);
    } else {
      console.error('Setup failed!');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
