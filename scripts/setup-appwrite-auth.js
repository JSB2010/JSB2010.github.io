// Script to set up Appwrite authentication for admin dashboard
const { Client, Account, ID } = require('node-appwrite');
const readline = require('readline');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '', // Replace with your API key
};

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const account = new Account(client);

// Function to create admin user
async function createAdminUser(email, password, name) {
  try {
    console.log(`Creating admin user with email: ${email}...`);

    // Create user with node-appwrite v16
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );

    console.log(`Admin user created successfully with ID: ${user.$id}`);
    return user;
  } catch (error) {
    if (error.code === 409) {
      console.log('User with this email already exists.');
      return null;
    } else {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }
}

// Function to prompt for user input
function promptForInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Main function
async function setupAppwriteAuth() {
  try {
    console.log('==============================================');
    console.log('Appwrite Admin User Setup');
    console.log('==============================================');

    // Get user input
    const email = await promptForInput('Enter admin email: ');
    const password = await promptForInput('Enter admin password (min 8 characters): ');
    const name = await promptForInput('Enter admin name: ');

    // Validate input
    if (!email || !password || !name) {
      console.error('All fields are required.');
      return false;
    }

    if (password.length < 8) {
      console.error('Password must be at least 8 characters long.');
      return false;
    }

    // Create admin user
    const user = await createAdminUser(email, password, name);

    if (user) {
      console.log('==============================================');
      console.log('Admin user setup completed successfully!');
      console.log('==============================================');
      console.log('You can now log in to the admin dashboard at:');
      console.log('/admin/login');
      console.log('==============================================');
      return true;
    } else {
      console.log('==============================================');
      console.log('Admin user already exists or setup failed.');
      console.log('You can try logging in with your existing credentials.');
      console.log('==============================================');
      return false;
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
    return false;
  } finally {
    rl.close();
  }
}

// Run the setup
setupAppwriteAuth()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
