// Script to update Firebase CORS configuration
const { initializeApp } = require('firebase/app');
const { getStorage, connectStorageEmulator } = require('firebase/storage');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Firebase configuration from the project
const firebaseConfig = {
  apiKey: "AIzaSyCZAmGriqlYJL_RLvRx7iKGQz7pbY2nrB0",
  authDomain: "jacob-barkin-website.firebaseapp.com",
  projectId: "jacob-barkin-website",
  storageBucket: "jacob-barkin-website.firebasestorage.app",
  messagingSenderId: "1093183769646",
  appId: "1:1093183769646:web:0fbbcd20023cb9ec8823bf",
  measurementId: "G-KTBS67S2PC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

console.log('Updating Firebase CORS configuration...');

// Read the CORS configuration file
const corsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-cors-config.json'), 'utf8'));

console.log('CORS Configuration:', JSON.stringify(corsConfig, null, 2));

// Instructions for updating Firebase CORS configuration
console.log('\nTo update Firebase CORS configuration, follow these steps:');
console.log('\n1. Install the Firebase CLI if you haven\'t already:');
console.log('   npm install -g firebase-tools');
console.log('\n2. Login to Firebase:');
console.log('   firebase login');
console.log('\n3. Set the default project:');
console.log(`   firebase use ${firebaseConfig.projectId}`);
console.log('\n4. Update the Firebase Storage CORS configuration:');
console.log('   firebase storage:cors set firebase-cors-config.json');
console.log('\n5. Update the Firestore CORS configuration in the Firebase Console:');
console.log('   - Go to https://console.firebase.google.com/project/jacob-barkin-website/firestore');
console.log('   - Click on "Rules"');
console.log('   - Add the following to your rules:');
console.log(`
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow CORS for specific domains
    match /{document=**} {
      allow read, write: if request.auth != null || 
                          request.origin == 'https://modern-redesign-shadcn.jsb2010-github-io.pages.dev' ||
                          request.origin == 'https://jacobbarkin.com' ||
                          request.origin == 'https://www.jacobbarkin.com';
    }
    
    // Contact form submissions - allow anonymous creation and reading
    match /contactSubmissions/{submission} {
      // Allow anyone to create contact submissions
      allow create: if true;
      
      // Allow reading for testing purposes
      allow read: if true;
      
      // No one can update or delete submissions
      allow update, delete: if false;
    }
  }
}
`);

// Try to run the Firebase CLI commands automatically
console.log('\nAttempting to run Firebase CLI commands automatically...');

// Check if Firebase CLI is installed
exec('firebase --version', (error, stdout, stderr) => {
  if (error) {
    console.error('Firebase CLI is not installed or not in PATH. Please follow the manual steps above.');
    return;
  }
  
  console.log(`Firebase CLI version: ${stdout.trim()}`);
  
  // Try to set CORS configuration
  exec('firebase storage:cors set firebase-cors-config.json', (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to set CORS configuration automatically. Please follow the manual steps above.');
      console.error(stderr);
      return;
    }
    
    console.log('Successfully updated Firebase Storage CORS configuration!');
    console.log(stdout);
    console.log('\nDon\'t forget to update the Firestore rules in the Firebase Console as described above.');
  });
});
