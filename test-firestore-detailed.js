// Detailed test script to check Firestore connectivity
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, limit } = require('firebase/firestore');

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

// Test data
const testData = {
  name: "Test User",
  email: "test@example.com",
  subject: "Test Submission",
  message: "This is a test submission from the detailed test script.",
  timestamp: new Date(), // Using regular Date instead of serverTimestamp for immediate visibility
  userAgent: "Test Script",
  source: "test_script_detailed"
};

// Function to test Firestore read
async function testFirestoreRead() {
  console.log("\n--- Testing Firestore Read ---");
  
  try {
    // Get the most recent submissions
    const contactSubmissionsRef = collection(db, 'contactSubmissions');
    const q = query(contactSubmissionsRef, limit(5));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} recent submissions:`);
    
    if (querySnapshot.empty) {
      console.log("No documents found in the contactSubmissions collection.");
    } else {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`- Document ID: ${doc.id}`);
        console.log(`  Name: ${data.name}`);
        console.log(`  Email: ${data.email}`);
        console.log(`  Subject: ${data.subject}`);
        console.log(`  Source: ${data.source || 'not specified'}`);
        console.log(`  Timestamp: ${data.timestamp ? (data.timestamp.toDate ? data.timestamp.toDate().toISOString() : data.timestamp.toString()) : 'no timestamp'}`);
        console.log('---');
      });
    }
    
    return true;
  } catch (error) {
    console.error("ERROR during Firestore read:", error);
    return false;
  }
}

// Function to test Firestore write
async function testFirestoreWrite() {
  console.log("\n--- Testing Firestore Write ---");
  console.log("Attempting to write test data:", testData);
  
  try {
    // Submit to Firestore
    const contactSubmissionsRef = collection(db, 'contactSubmissions');
    const docRef = await addDoc(contactSubmissionsRef, testData);
    
    console.log(`SUCCESS: Document written with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("ERROR during Firestore write:", error);
    return null;
  }
}

// Function to verify the written document
async function verifyWrittenDocument(docId) {
  if (!docId) return false;
  
  console.log("\n--- Verifying Written Document ---");
  console.log(`Checking if document with ID ${docId} exists...`);
  
  try {
    // Get the most recent submissions again to verify our write
    const contactSubmissionsRef = collection(db, 'contactSubmissions');
    const q = query(contactSubmissionsRef, limit(5));
    const querySnapshot = await getDocs(q);
    
    let found = false;
    
    querySnapshot.forEach((doc) => {
      if (doc.id === docId) {
        found = true;
        console.log(`SUCCESS: Found the document we just wrote with ID: ${docId}`);
        console.log("Document data:", doc.data());
      }
    });
    
    if (!found) {
      console.log(`ERROR: Could not find the document we just wrote with ID: ${docId}`);
    }
    
    return found;
  } catch (error) {
    console.error("ERROR during verification:", error);
    return false;
  }
}

// Run the tests
async function runTests() {
  try {
    console.log("Starting Firestore tests...");
    console.log("Firebase Config:", firebaseConfig);
    
    // Test reading from Firestore
    const readSuccess = await testFirestoreRead();
    
    // Test writing to Firestore
    const docId = await testFirestoreWrite();
    
    // Verify the written document
    if (docId) {
      const verifySuccess = await verifyWrittenDocument(docId);
      
      if (verifySuccess) {
        console.log("\nAll tests completed successfully!");
      } else {
        console.log("\nVerification test failed - document was written but could not be verified.");
      }
    } else {
      console.log("\nWrite test failed - could not proceed with verification.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("\nUnexpected error during tests:", error);
    process.exit(1);
  }
}

// Run the tests
runTests();
