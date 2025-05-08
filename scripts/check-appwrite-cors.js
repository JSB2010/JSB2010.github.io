// Script to check Appwrite CORS settings
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Appwrite configuration
const config = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d',
  apiKey: process.env.APPWRITE_API_KEY || '',
};

console.log('Appwrite configuration:');
console.log(JSON.stringify(config, null, 2));

// List of domains to check
const domainsToCheck = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://jacobbarkin.com',
  'https://www.jacobbarkin.com',
  'https://jsb2010.github.io',
  'https://modern-redesign-shadcn.jsb2010-github-io.pages.dev'
];

// Function to check CORS settings using fetch
async function checkCORS() {
  console.log('Checking CORS settings for Appwrite...');

  for (const domain of domainsToCheck) {
    try {
      console.log(`\nTesting domain: ${domain}`);
      const hostname = new URL(domain).hostname;

      // Try a preflight OPTIONS request
      console.log('Sending OPTIONS preflight request...');
      const preflightResponse = await fetch(`${config.endpoint}/health`, {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type',
          'Origin': domain
        }
      });

      console.log(`Preflight response status: ${preflightResponse.status}`);

      // Now try the actual request
      console.log('Sending actual GET request...');
      const response = await fetch(`${config.endpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': domain
        }
      });

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        console.log(`✅ CORS test PASSED for ${domain}`);
      } else {
        console.log(`❌ CORS test FAILED for ${domain} with status ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error testing CORS for ${domain}:`, error.message);
    }
  }
}

// Run the function
checkCORS().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
