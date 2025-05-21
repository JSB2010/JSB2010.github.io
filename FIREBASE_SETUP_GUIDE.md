# Firebase Setup Guide

This guide outlines the steps required to set up a Firebase project to replace the previous Appwrite integration for this application.

## 1. Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on "**Add project**" (or "**Create a project**").
3.  Enter a name for your project (e.g., "My Portfolio App") and click **Continue**.
4.  Choose whether to enable Google Analytics for your project (optional) and click **Continue**.
5.  If prompted, accept the terms and click **Create project**.

## 2. Set Up Firebase Services

Once your project is created, you'll need to enable and configure the following Firebase services:

### a. Firestore Database

Firestore will be used to store data, such as contact form submissions.

1.  From your Firebase project dashboard, go to **Build > Firestore Database**.
2.  Click on **Create database**.
3.  Choose **Start in production mode** or **Start in test mode**.
    *   **Production mode** (Recommended for security): Your data will be private by default. You'll need to set up security rules to allow your application to write to the database.
    *   **Test mode**: Your data will be open for reads and writes for a limited time. This is useful for initial development but **must be secured** before going live.
4.  Select a Cloud Firestore location (choose a region close to your users). This cannot be changed later.
5.  Click **Enable**.
6.  **Data Structure (Collections and Documents)**:
    *   You will need a collection for contact form submissions, let's call it `contact-submissions`.
    *   The documents in this collection should have fields similar to the previous Appwrite setup:
        *   `name` (string)
        *   `email` (string)
        *   `subject` (string)
        *   `message` (string)
        *   `timestamp` (timestamp) - Firebase Timestamps are recommended.
        *   `status` (string, e.g., "unread", "read", "archived" - default to "unread")
        *   `userAgent` (string, optional)
        *   `ipAddress` (string, optional - be mindful of privacy regulations)
        *   `source` (string, optional, e.g., "website-contact-form")
7.  **Security Rules**:
    *   Navigate to the **Rules** tab within Firestore.
    *   You'll need to define rules to allow your application (and Cloud Functions) to read and write data. Example basic rules (you'll need to refine these based on your authentication setup):
        ```rules
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Allow authenticated users to create contact submissions
            match /contact-submissions/{submissionId} {
              allow create: if request.auth != null; // Or allow unauthenticated if it's a public form
              // Allow only authenticated admin users to read/update/delete
              allow read, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
            }
            // Add rules for admin user roles if needed
            match /users/{userId} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```
    *   **Important**: Secure your data appropriately. The example above is a starting point.

### b. Firebase Authentication

Firebase Authentication will handle user sign-in for the admin section.

1.  From your Firebase project dashboard, go to **Build > Authentication**.
2.  Click on **Get started**.
3.  In the **Sign-in method** tab, enable the desired sign-in providers. For an admin panel, **Email/Password** is a common choice.
    *   Click on **Email/Password** and enable it.
4.  (Optional) Add your first admin user manually through the Firebase console in the **Users** tab.

### c. Firebase Cloud Functions

Cloud Functions will be used for backend logic, such as sending email notifications or processing form submissions.

1.  You'll need to set up Node.js and the Firebase CLI on your local development machine.
    *   Install Node.js (if you haven't already): [https://nodejs.org/](https://nodejs.org/)
    *   Install Firebase CLI: `npm install -g firebase-tools`
2.  Log in to Firebase using the CLI: `firebase login`
3.  Initialize Firebase in your project directory:
    *   Navigate to your project's root folder in your terminal.
    *   Run `firebase init`.
    *   Select **Functions**.
    *   Choose "Use an existing project" and select the Firebase project you created.
    *   Choose your Functions language (e.g., TypeScript or JavaScript).
    *   Choose whether to use ESLint (recommended).
    *   Choose whether to install dependencies with npm now (recommended).
    *   This will create a `functions` folder in your project with the necessary configuration.
4.  **Billing Account**: Cloud Functions (especially those making outbound network requests, like sending emails) require your Firebase project to be on the **Blaze (pay as you go)** plan. You can set this up in Project settings > Usage and billing. A free tier is included.

## 3. Obtain Firebase Configuration for Your Application

You need to get your Firebase project's configuration details to connect your web application to Firebase.

1.  In the Firebase Console, go to **Project settings** (click the gear icon next to "Project Overview").
2.  In the **General** tab, scroll down to the "**Your apps**" section.
3.  Click on the **Web** icon ( `</>` ) to add a web app.
4.  Enter an "App nickname" (e.g., "Portfolio Web App") and click **Register app**.
5.  Firebase will provide you with a `firebaseConfig` object. This object contains your project's API keys and identifiers. **Copy this object.**

    ```javascript
    // Example firebaseConfig
    const firebaseConfig = {
      apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXX",
      authDomain: "your-project-id.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "XXXXXXXXXXXX",
      appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXX",
      measurementId: "G-XXXXXXXXXX" // Optional, for Google Analytics
    };
    ```

## 4. Environment Variables

You will need to store these Firebase configuration details and other sensitive information as environment variables in your application. Create or update your `.env.local` (or similar environment file for your project type, e.g., Next.js uses `.env.local`) with the following:

**Client-Side (prefixed with `NEXT_PUBLIC_` for Next.js):**

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="XXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_APP_ID="1:XXXXXXXXXXXX:web:XXXXXXXXXXXXXX"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX" # Optional
```

**Server-Side (for Cloud Functions or backend processes, if you initialize Firebase Admin SDK):**

If you use the Firebase Admin SDK in your Cloud Functions (which is typical), you usually don't need to manage service account keys directly if the functions are deployed within the same Firebase project. Firebase automatically provides credentials.

However, if you need to access Firebase Admin from an external server or a different environment, you would generate a service account key:

1.  In the Firebase Console, go to **Project settings > Service accounts**.
2.  Click on **Generate new private key** and confirm. A JSON file will be downloaded.
3.  **Store this file securely and do not commit it to your repository.**
4.  You can then set the path to this file using the `GOOGLE_APPLICATION_CREDENTIALS` environment variable for server-side Admin SDK initialization, or store its content in an environment variable.

**For Cloud Functions (within the same project):**
You typically don't need to manually set these for the Admin SDK. It auto-initializes.

**For Email Notifications (within Cloud Functions):**
You'll need environment variables for your email sending service (e.g., SendGrid API Key, or SMTP credentials if using Nodemailer directly).

```env
# Example for SendGrid (used in a Cloud Function)
SENDGRID_API_KEY="YOUR_SENDGRID_API_KEY"
TO_EMAIL_ADDRESS="your-email@example.com" # Email address to send notifications to
FROM_EMAIL_ADDRESS="noreply@yourdomain.com" # Email address to send notifications from
```

**Important Security Notes:**

*   **Never commit private keys or sensitive credentials directly into your repository.** Use environment variables.
*   Configure your **Firestore Security Rules** carefully to protect your data.
*   Regularly review permissions and access for your Firebase project.

This guide provides the foundational steps. You will adapt and extend this configuration as you implement the specific Firebase services in your application code.

## 5. Cleaning Up Old Appwrite Environment Variables

After migrating your application to Firebase and ensuring all Firebase environment variables (as listed above) are correctly configured in your deployment environments (e.g., `.env.local`, `.env.production`, Vercel/Netlify environment settings, GitHub Actions secrets, etc.), you should remove any old Appwrite-specific environment variables.

Keeping old, unused environment variables can lead to confusion and potential misconfigurations.

**Common Appwrite variables to remove would include (but are not limited to):**

*   `APPWRITE_ENDPOINT`
*   `APPWRITE_PROJECT_ID`
*   `APPWRITE_API_KEY` (server-side)
*   `APPWRITE_DATABASE_ID`
*   `APPWRITE_CONTACT_COLLECTION_ID` (or any other collection IDs)
*   `APPWRITE_FUNCTION_ID`

*   `NEXT_PUBLIC_APPWRITE_ENDPOINT`
*   `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
*   `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
*   `NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID`
*   `NEXT_PUBLIC_APPWRITE_FUNCTION_ID`

**Action Required:**

*   **Review your environment variable configurations** in all relevant places (local development files, hosting provider settings, CI/CD pipelines).
*   **Delete any Appwrite-related variables** that are no longer in use by the application.
*   Ensure your application deploys and runs correctly with only the new Firebase environment variables.
