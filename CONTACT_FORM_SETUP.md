# Contact Form with Firestore and Email Notifications

This document explains how the contact form works in the website.

## Overview

The contact form implementation consists of three main parts:

1. **Frontend Form Component**: A React component that collects user input and submits it to Firestore
2. **Firestore Database**: Stores the contact form submissions
3. **Cloud Function**: Triggers when a new submission is added to Firestore and sends an email notification

## How It Works

1. When a user submits the contact form, the data is sent directly to Firestore
2. A Firebase Cloud Function is triggered by the new document in Firestore
3. The Cloud Function sends an email notification with the contact form details

## Setup Instructions

### 1. Deploy Firebase Functions

The Firebase Functions are already set up with your email credentials. To deploy them, simply run:

```bash
./deploy-firebase-functions.sh
```

This script will build and deploy the functions to Firebase.

### 2. Email Credentials

The email credentials (jacobsamuelbarkin@gmail.com and the app password) are already configured in the Cloud Function.

### 3. Test the Contact Form

1. Open your browser and navigate to the contact page
2. Fill out the contact form and submit it
3. Check the Firebase Console to verify that the submission was stored in Firestore
4. Check your email to verify that you received the notification

## Troubleshooting

### Firebase Functions Not Working

- Check the Firebase Functions logs in the Firebase Console
- Make sure you've deployed the latest version of your functions
- Verify that the Firebase project is properly set up

### Contact Form Not Submitting

- Check the browser console for errors
- Verify that your Firebase configuration is correct
- Check the Firestore security rules to ensure they allow anonymous submissions

### Email Notifications Not Working

- Check the Firebase Functions logs for email-related errors
- Check your spam folder
- Verify that the Gmail app password is still valid (they can expire)

## Security

The Firestore security rules are set up to allow anonymous submissions to the contactSubmissions collection:

```javascript
// Contact form submissions - allow anonymous creation and reading
match /contactSubmissions/{submission} {
  // Allow anyone to create contact submissions with no restrictions
  allow create: if true;

  // Allow reading for testing purposes
  allow read: if true;

  // No one can update or delete submissions
  allow update, delete: if false;
}
```

## Data Structure

Each contact form submission is stored in Firestore with the following structure:

```javascript
{
  name: string,
  email: string,
  subject: string,
  message: string,
  timestamp: Timestamp,
  userAgent: string,
  source: string
}
```
