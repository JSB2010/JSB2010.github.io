// Script to update Appwrite platform settings
const sdk = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '',
};

// Initialize Appwrite client
const client = new sdk.Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

const projects = new sdk.Projects(client);

// List of platforms to add
const platformsToAdd = [
  {
    name: 'Web App (localhost)',
    type: 'web',
    hostname: 'localhost'
  },
  {
    name: 'Web App (jacobbarkin.com)',
    type: 'web',
    hostname: 'jacobbarkin.com'
  },
  {
    name: 'Web App (www.jacobbarkin.com)',
    type: 'web',
    hostname: 'www.jacobbarkin.com'
  },
  {
    name: 'Web App (Cloudflare Pages)',
    type: 'web',
    hostname: 'jacobbarkin-com.pages.dev'
  },
  {
    name: 'Web App (GitHub Pages)',
    type: 'web',
    hostname: 'modern-redesign-shadcn.jsb2010-github-io.pages.dev'
  }
];

// Function to update platform settings
async function updatePlatforms() {
  try {
    console.log('Updating Appwrite platform settings...');

    // Get current platforms
    const currentPlatforms = await projects.listPlatforms(config.projectId);
    console.log('Current platforms:', JSON.stringify(currentPlatforms, null, 2));

    // Add new platforms
    for (const platform of platformsToAdd) {
      try {
        // Check if platform already exists
        const exists = currentPlatforms.platforms.some(p =>
          p.hostname === platform.hostname && p.type === platform.type
        );

        if (exists) {
          console.log(`Platform ${platform.name} (${platform.hostname}) already exists. Skipping.`);
          continue;
        }

        // Create new platform
        console.log(`Adding platform ${platform.name} (${platform.hostname})...`);
        await projects.createPlatform(
          config.projectId,
          platform.type,
          platform.name,
          platform.hostname
        );
        console.log(`✅ Platform ${platform.name} added successfully!`);
      } catch (error) {
        console.error(`Error adding platform ${platform.name}:`, error);
      }
    }

    // Get updated platforms
    const updatedPlatforms = await projects.listPlatforms(config.projectId);
    console.log('Updated platforms:', JSON.stringify(updatedPlatforms, null, 2));

    console.log('Platform update completed!');
  } catch (error) {
    console.error('Error updating platforms:', error);
  }
}

// Run the function
updatePlatforms().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
