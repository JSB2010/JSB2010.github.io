// Test script to check Firebase connection
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

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

async function testFirestoreConnection() {
  console.log('Testing Firestore connection...');
  
  try {
    // Try to read from the contactSubmissions collection
    console.log('Attempting to read from contactSubmissions collection...');
    const querySnapshot = await getDocs(collection(db, 'contactSubmissions'));
    console.log(`Successfully read ${querySnapshot.size} documents from contactSubmissions collection`);
    
    // Try to write a test document
    console.log('Attempting to write a test document...');
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message to verify Firestore connectivity.',
      timestamp: new Date(),
      isTest: true
    };
    
    const docRef = await addDoc(collection(db, 'contactSubmissions'), testData);
    console.log('Test document written successfully with ID:', docRef.id);
    
    console.log('Firestore connection test completed successfully!');
    return true;
  } catch (error) {
    console.error('Error testing Firestore connection:', error);
    return false;
  }
}

// Run the test
testFirestoreConnection()
  .then(success => {
    console.log('Test completed with status:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error during test:', error);
    process.exit(1);
  });
