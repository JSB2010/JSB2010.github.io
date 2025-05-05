// Check Appwrite SDK version and methods
const { Client } = require('appwrite');

// Get Appwrite SDK version
const appwritePackage = require('appwrite/package.json');
console.log('Appwrite SDK Version:', appwritePackage.version);

// Check available methods
const client = new Client();
console.log('Available methods on Client:');
const methods = Object.getOwnPropertyNames(Client.prototype)
  .filter(method => typeof Client.prototype[method] === 'function' && method !== 'constructor');
console.log(methods);

// Check specific methods for setting API key
console.log('\nChecking methods for setting API key:');
console.log('client.setKey exists:', typeof client.setKey === 'function');
console.log('client.setAPIKey exists:', typeof client.setAPIKey === 'function');
console.log('client.setSecret exists:', typeof client.setSecret === 'function');

// Suggest the correct method to use
if (typeof client.setKey === 'function') {
  console.log('\nSuggested method: client.setKey(apiKey)');
} else if (typeof client.setAPIKey === 'function') {
  console.log('\nSuggested method: client.setAPIKey(apiKey)');
} else if (typeof client.setSecret === 'function') {
  console.log('\nSuggested method: client.setSecret(apiKey)');
} else {
  console.log('\nCould not determine the correct method. Please check the Appwrite SDK documentation.');
}
