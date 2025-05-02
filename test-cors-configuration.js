// Script to test CORS configuration for Firebase
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where, limit } = require('firebase/firestore');

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

async function testCorsConfiguration() {
  console.log('Testing CORS configuration for Firebase...');
  
  try {
    // Create a test submission
    const testId = `cors-test-${Date.now()}`;
    const submissionData = {
      name: 'CORS Test User',
      email: 'cors-test@example.com',
      subject: 'CORS Test Message',
      message: `This is a test message to verify CORS configuration. Test ID: ${testId}`,
      timestamp: new Date(),
      source: 'cors_test_script',
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
    
    console.log('CORS configuration is working correctly!');
    return true;
  } catch (error) {
    console.error('Error testing CORS configuration:', error);
    
    if (error.name === 'FirebaseError' && error.code === 'permission-denied') {
      console.error('CORS configuration is not working correctly. Permission denied error.');
      console.error('Please follow the instructions in firebase-cors-instructions.md to update the CORS configuration.');
    } else if (error.message && error.message.includes('CORS')) {
      console.error('CORS configuration is not working correctly. CORS error.');
      console.error('Please follow the instructions in firebase-cors-instructions.md to update the CORS configuration.');
    } else {
      console.error('Unknown error. Please check the Firebase Console for more details.');
    }
    
    return false;
  }
}

// Run the test
testCorsConfiguration()
  .then(success => {
    console.log('Test completed with status:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error during test:', error);
    process.exit(1);
  });
