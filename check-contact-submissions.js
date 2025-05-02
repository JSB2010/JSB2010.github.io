// Script to check contact form submissions in Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, orderBy, limit } = require('firebase/firestore');

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
const db = getFirestore(app);

async function checkContactSubmissions() {
  console.log('Checking contact form submissions in Firestore...');
  
  try {
    // Create a query to get the most recent submissions
    const q = query(
      collection(db, 'contactSubmissions'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} recent contact form submissions:`);
    console.log('---------------------------------------------------');
    
    // Display each submission
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`Name: ${data.name}`);
      console.log(`Email: ${data.email}`);
      console.log(`Subject: ${data.subject}`);
      console.log(`Message: ${data.message}`);
      console.log(`Timestamp: ${data.timestamp?.toDate?.() || data.timestamp}`);
      console.log(`Source: ${data.source || 'unknown'}`);
      console.log('---------------------------------------------------');
    });
    
    if (querySnapshot.size === 0) {
      console.log('No contact form submissions found.');
    }
    
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('Error checking contact form submissions:', error);
    return false;
  }
}

// Run the check
checkContactSubmissions()
  .then(success => {
    console.log('Check completed with status:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error during check:', error);
    process.exit(1);
  });
