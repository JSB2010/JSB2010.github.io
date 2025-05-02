// Script to simulate a contact form submission
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } = require('firebase/firestore');

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

async function simulateContactSubmission() {
  console.log('Simulating a contact form submission...');
  
  try {
    // Create a unique identifier for this test
    const testId = `test-${Date.now()}`;
    
    // Create a test submission
    const submissionData = {
      name: 'Simulation Test User',
      email: 'simulation-test@example.com',
      subject: 'Simulation Test Message',
      message: `This is a simulated contact form submission with ID: ${testId}`,
      timestamp: new Date(),
      source: 'simulation_script',
      userAgent: 'Simulation Script',
      submittedAt: new Date().toISOString(),
      environment: 'test',
      testId: testId
    };
    
    console.log('Submitting test data to Firestore:', submissionData);
    
    // Add the document to Firestore
    const docRef = await addDoc(collection(db, 'contactSubmissions'), submissionData);
    
    console.log('Test submission successful with ID:', docRef.id);
    
    // Wait a moment to ensure the document is fully written
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify the submission was saved by querying for it
    console.log('Verifying the submission was saved...');
    
    const q = query(
      collection(db, 'contactSubmissions'),
      where('testId', '==', testId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('Verification failed: Could not find the test submission in Firestore');
      return false;
    }
    
    console.log('Verification successful: Found the test submission in Firestore');
    console.log('Document ID:', querySnapshot.docs[0].id);
    
    return true;
  } catch (error) {
    console.error('Error simulating contact form submission:', error);
    return false;
  }
}

// Run the simulation
simulateContactSubmission()
  .then(success => {
    console.log('Simulation completed with status:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error during simulation:', error);
    process.exit(1);
  });
