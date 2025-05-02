const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration
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

async function testFirestore() {
  try {
    console.log('Testing Firestore write...');
    
    // Create a test document
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
      timestamp: new Date()
    };
    
    // Add the test document to the contactSubmissions collection
    const docRef = await addDoc(collection(db, 'contactSubmissions'), testData);
    
    console.log('Test document written with ID:', docRef.id);
    console.log('Firestore write test successful!');
  } catch (error) {
    console.error('Error testing Firestore write:', error);
  }
}

// Run the test
testFirestore();
