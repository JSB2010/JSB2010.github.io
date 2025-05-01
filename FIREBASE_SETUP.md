# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Jacob Barkin website.

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase account (create one at [firebase.google.com](https://firebase.google.com/))

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter "jacob-barkin-website" as the project name
4. Enable Google Analytics if desired
5. Choose your Analytics account or create a new one
6. Click "Create project"

## Step 2: Set Up Firebase Services

### Firestore Database

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location closest to your users
5. Click "Enable"

### Firebase Authentication (Optional)

1. In the Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable the authentication methods you want to use (Email/Password, Google, etc.)

### Firebase Functions

1. In the Firebase Console, go to "Functions"
2. Click "Get started"
3. Follow the prompts to set up Firebase Functions

## Step 3: Get Firebase Configuration

1. In the Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click the web app icon (</>) to add a web app if you haven't already
4. Enter "Jacob Barkin Website" as the app nickname
5. Register the app
6. Copy the Firebase configuration object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

## Step 4: Set Up Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables with your Firebase configuration:

```
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

# Firebase Admin Configuration (Optional)
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
```

## Step 5: Set Up Firebase CLI

1. Open a terminal and log in to Firebase:

```bash
firebase login
```

2. Initialize Firebase in your project:

```bash
firebase init
```

3. Select the following features:
   - Firestore
   - Functions
   - Hosting (optional)

4. Select your Firebase project
5. Accept the default options for Firestore rules and indexes
6. Choose TypeScript for Functions
7. Say yes to ESLint
8. Say yes to installing dependencies

## Step 6: Configure Email for Contact Form

To enable email notifications for the contact form, you need to set up email configuration in Firebase Functions:

```bash
firebase functions:config:set email.host="smtp.example.com" email.port="587" email.secure="false" email.user="your-email@example.com" email.pass="your-password"
```

Replace the values with your SMTP server details. You can use services like:
- Gmail: `smtp.gmail.com`
- Outlook: `smtp.office365.com`
- SendGrid: `smtp.sendgrid.net`

Note: If you're using Gmail, you'll need to create an app password instead of using your regular password.

## Step 7: Deploy Firebase Functions

Deploy your Firebase Functions to make them available:

```bash
firebase deploy --only functions
```

## Step 8: Set Up Firestore Security Rules

The project includes basic security rules in `firestore.rules`. Review and modify them as needed, then deploy:

```bash
firebase deploy --only firestore:rules
```

## Step 9: Set Up Firestore Indexes

Deploy the Firestore indexes:

```bash
firebase deploy --only firestore:indexes
```

## Step 10: Test the Integration

1. Start your Next.js development server:

```bash
npm run dev
```

2. Open your browser and navigate to the contact page
3. Fill out the contact form and submit it
4. Check the Firebase Console to verify that the submission was stored in Firestore
5. Check your email to verify that you received the notification

## Troubleshooting

### Firebase Functions Not Working

- Check the Firebase Functions logs in the Firebase Console
- Verify that your email configuration is correct
- Make sure you've deployed the latest version of your functions

### Contact Form Not Submitting

- Check the browser console for errors
- Verify that your Firebase configuration is correct in `.env.local`
- Make sure the Firebase project is properly set up

### Email Notifications Not Working

- Check the Firebase Functions logs for email-related errors
- Verify your SMTP server settings
- If using Gmail, make sure you're using an app password

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Web SDK Documentation](https://firebase.google.com/docs/web/setup)
- [Nodemailer Documentation](https://nodemailer.com/)
