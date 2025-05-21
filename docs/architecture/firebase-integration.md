# Firebase Integration

This document provides detailed information about the Firebase integration in this project, which replaces the previous Appwrite backend.

## Overview

[Firebase](https://firebase.google.com/) is a comprehensive app development platform by Google. In this project, Firebase is used for:

1.  **Firestore Database**: Storing contact form submissions.
2.  **Firebase Authentication**: User authentication for the admin dashboard.
3.  **Firebase Cloud Functions**:
    *   Handling contact form submissions from the client.
    *   Sending email notifications upon new contact form submissions.

## Setup

Refer to the `FIREBASE_SETUP_GUIDE.md` located in the root of the project for detailed step-by-step instructions on:
*   Creating a Firebase project.
*   Setting up Firestore, Firebase Authentication, and Cloud Functions.
*   Obtaining Firebase configuration for your application.
*   Configuring required environment variables.

## Environment Variables

The necessary Firebase environment variables (client-side and for Cloud Functions) are detailed in `FIREBASE_SETUP_GUIDE.md`. Ensure these are correctly set up in your development environment (`.env.local`) and your deployment environments.

Key variables include:
*   `NEXT_PUBLIC_FIREBASE_API_KEY`
*   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
*   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
*   ... (and others for client SDK)
*   `SENDGRID_API_KEY` (for email Cloud Function)
*   `TO_EMAIL_ADDRESS` (for email Cloud Function)
*   `FROM_EMAIL_ADDRESS` (for email Cloud Function)

**Important**: Remember to remove any old Appwrite-related environment variables from your configurations.

## Database Schema (Firestore)

### Contact Submissions Collection (`contact-submissions`)

Data for contact form submissions is stored in a Firestore collection named `contact-submissions`. Each document in this collection typically has the following fields:

| Attribute   | Type              | Description                                     |
|-------------|-------------------|-------------------------------------------------|
| `name`      | string            | Submitter's name                                |
| `email`     | string            | Submitter's email                               |
| `subject`   | string            | Subject of the message                          |
| `message`   | string            | Message content                                 |
| `timestamp` | Firestore Timestamp| Submission timestamp (server-generated preferred) |
| `status`    | string            | Status (e.g., "new", "read", "replied", "archived") |
| `priority`  | number (optional) | Priority of the submission                      |
| `userAgent` | string (optional) | Submitter's browser/client information          |
| `source`    | string (optional) | E.g., "website-contact-form-firebase"           |
| `ipAddress` | string (optional) | Submitter's IP (handle with privacy in mind)    |
| `userId`    | string (optional) | UID of authenticated user if submission is linked |

**Firestore Security Rules** are configured to control access to this data (see `FIREBASE_SETUP_GUIDE.md` and your Firebase project console).

## Authentication (Firebase Authentication)

The admin dashboard uses Firebase Authentication for secure access:

1.  **Email/Password Authentication**: Used for admin login.
2.  **Session Management**: Firebase Authentication handles session persistence automatically (typically using IndexedDB).
3.  **Access Control**: Firestore Security Rules are used in conjunction with Firebase Authentication to control access to data based on user roles (e.g., an `isAdmin` custom claim or a separate user roles collection).

The core authentication logic is implemented in `src/lib/firebase/authService.ts` and integrated via `src/components/admin/auth-context.tsx`.

## Cloud Functions (Firebase Cloud Functions)

Firebase Cloud Functions are located in the `functions/` directory at the project root.

### 1. `submitContactForm`
*   **Type**: Callable Function (`https.onCall`)
*   **Trigger**: Called directly by the client-side contact form (`src/components/contact/contact-form-firebase.tsx`).
*   **Functionality**:
    *   Receives form data (name, email, subject, message).
    *   Performs basic validation.
    *   Writes the submission data to the `contact-submissions` collection in Firestore.
    *   Returns a success or error response to the client.

### 2. `onNewSubmissionSendEmail`
*   **Type**: Firestore Triggered Function (`firestore.document("contact-submissions/{submissionId}").onCreate`)
*   **Trigger**: Automatically executes when a new document is created in the `contact-submissions` Firestore collection.
*   **Functionality**:
    *   Retrieves the data from the newly created submission.
    *   Formats an email message.
    *   Uses SendGrid (configured via environment variables) to send an email notification to a designated recipient.

Deployment of functions is done via the Firebase CLI: `firebase deploy --only functions`.

## Client Integration

### Firebase SDK Initialization
The Firebase client SDK is initialized in `src/lib/firebase/firebaseConfig.ts` using environment variables. Core Firebase services (Auth, Firestore, Functions) are exported from `src/lib/firebase/firebaseClient.ts`.

### Contact Form (`src/components/contact/contact-form-firebase.tsx`)
This component now uses the Firebase Functions SDK to call the `submitContactForm` callable function.

### Admin Dashboard (`src/app/admin/` and `src/components/admin/`)
The admin dashboard components integrate with:
*   Firebase Authentication via `src/lib/firebase/authService.ts` and `src/components/admin/auth-context.tsx` for login/logout and user state management.
*   Firestore via `src/lib/firebase/submissionsService.ts` for fetching, displaying, and managing contact submissions.

## Scripts
Any previous Appwrite-related setup or data management scripts in the `scripts/` directory have been removed or will need to be replaced with Firebase equivalents if similar functionality (e.g., data backup/restore, schema management beyond Firestore console) is required.
*   **Data Backup/Restore**: Firestore has built-in export/import functionality that can be managed via the `gcloud` command-line tool or the Firebase console. Scheduled backups can also be configured.
*   **Schema Management**: Firestore is schema-flexible, but data structure is managed by application code and security rules. Indexes are typically managed via the Firebase console or `firebase.json`.

## Troubleshooting
*   **Firebase Console**: Check your Firebase project console for errors related to Firestore, Authentication, and Cloud Functions (logs).
*   **Firestore Security Rules**: Ensure your rules allow the intended operations. Use the Firestore Rules Playground in the console for testing.
*   **Cloud Function Logs**: Use `firebase functions:log` or the GCP Cloud Logging interface to view logs from your functions.
*   **Environment Variables**: Double-check that all Firebase environment variables are correctly set in your client-side and server-side (Cloud Functions) environments.

## Resources
*   [Firebase Documentation](https://firebase.google.com/docs)
*   [Firestore Documentation](https://firebase.google.com/docs/firestore)
*   [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
*   [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
*   [Firebase CLI Reference](https://firebase.google.com/docs/cli)
```
