// Script to test the contact form by submitting a test message to Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');

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

async function testContactForm() {
  try {
    console.log('Submitting test contact form...');
    
    // Create test submission data
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Contact Form',
      message: 'This is a test message to verify that the contact form and email notification are working correctly.',
      timestamp: serverTimestamp(),
      userAgent: 'Test Script',
      source: 'test_script'
    };
    
    // Submit to Firestore
    const contactSubmissionsRef = collection(db, 'contactSubmissions');
    const docRef = await addDoc(contactSubmissionsRef, testData);
    
    console.log('Test submission successful!');
    console.log('Document ID:', docRef.id);
    console.log('Check your email for the notification.');
    
  } catch (error) {
    console.error('Error submitting test contact form:', error);
  }
}

// Run the test
testContactForm();
