# API Documentation

This document provides detailed information about the API endpoints available in the Jacob Barkin Portfolio website, including request/response examples and error handling.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Contact Form API](#contact-form-api)
  - [Submit Contact Form](#submit-contact-form)
- [Firebase Cloud Functions](#firebase-cloud-functions)
  - [Callable Function: `submitContactForm`](#callable-function-submitcontactform)
  - [Firestore Trigger: `onNewSubmissionSendEmail`](#firestore-trigger-onnewsubmissionsendemail)
- [Admin Data Management](#admin-data-management)
- [Error Handling in Firebase](#error-handling-in-firebase)
- [Rate Limiting and Quotas in Firebase](#rate-limiting-and-quotas-in-firebase)
- [CORS Configuration](#cors-configuration)

## Overview

With the migration to Firebase, the primary backend interactions for the Jacob Barkin Portfolio website are handled through Firebase services (Firestore, Firebase Authentication, and Firebase Cloud Functions) rather than traditional REST API endpoints hosted via Next.js.

### Base URLs

Direct REST API endpoints for core backend logic (like form submission or data querying by the admin panel) are largely deprecated. Interactions occur via the Firebase SDK.

### Response Format (for Callable Cloud Functions)

Callable Cloud Functions return a Promise that resolves with a result object, or an error.
A typical successful response from a callable function like `submitContactForm` might implicitly be:
```json
// Resolved promise from firebase.functions().httpsCallable('submitContactForm')(data)
{
  "data": { // This 'data' field is standard for callable function responses
    "success": true,
    "message": "Contact form submission received",
    "id": "firestore-document-id"
    // Other relevant data
  }
}
```
Errors are instances of `functions.https.HttpsError`.

```json
{
  "success": true|false,
  "message": "Optional message explaining the result",
  "data": {
    // Response data (if applicable)
  },
  "error": {
    // Error details (if applicable)
  }
}
```

## Authentication (Firebase)

Admin dashboard authentication is handled by **Firebase Authentication**.
- **Method**: Email/Password sign-in.
- **Session Management**: Firebase SDK handles session persistence (typically IndexedDB).
- **Authorization**:
    - **Callable Functions**: Can inspect `context.auth` to verify user identity (UID, token, custom claims).
    - **Firestore Security Rules**: Control direct database access from the client (admin panel). Rules can be based on user UID, custom claims (e.g., `isAdmin`), or roles stored in Firestore.

Refer to `src/lib/firebase/authService.ts` for client-side authentication logic.

## Firebase Cloud Functions

### Callable Function: `submitContactForm`

This function replaces the traditional REST API endpoint for contact form submissions.

*   **Invoked Via**: Firebase SDK from the client (`src/components/contact/contact-form-firebase.tsx`).
*   **Functionality**:
    1.  Receives form data (`name`, `email`, `subject`, `message`).
    2.  Performs server-side validation (e.g., using Zod or basic checks).
    3.  Stores the validated submission into the `contact-submissions` collection in Firestore.
    4.  Returns a success or error response to the client.
*   **Request Data (Example)**:
    ```javascript
    {
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Project Inquiry",
      message: "Details about the project..."
    }
    ```
*   **Successful Response (Example, wrapped in `data` object by SDK)**:
    ```javascript
    {
      success: true,
      id: "generated-firestore-doc-id",
      message: "Form submitted successfully!"
    }
    ```
*   **Error Response**: Throws `functions.https.HttpsError`. For example:
    ```javascript
    // If validation fails
    // error.code: 'invalid-argument'
    // error.message: 'The function must be called with a valid "name" argument.'
    
    // If Firestore write fails
    // error.code: 'internal'
    // error.message: 'Failed to save submission to database.'
    ```
*   **Code Location**: `functions/src/index.ts`

### Firestore Trigger: `onNewSubmissionSendEmail`

This function handles email notifications automatically upon new submissions.

*   **Trigger**: When a new document is created in the `contact-submissions` Firestore collection.
*   **Functionality**:
    1.  Retrieves the data from the newly created submission document.
    2.  Formats an email message containing the submission details.
    3.  Uses SendGrid (configured via Firebase environment variables: `sendgrid.key`, `email.to_address`, `email.from_address`) to send the email notification.
*   **Interaction**: This function is not called directly by any client or API. It's an automated backend process.
*   **Code Location**: `functions/src/index.ts`

## Admin Data Management

Admin operations (listing, viewing, updating, deleting submissions) are no longer handled by dedicated Next.js API routes (`/api/admin/...`). Instead:

*   The admin dashboard (`src/app/admin/submissions/page.tsx` and related components) interacts **directly with Firestore** using the Firebase client SDK.
*   Service functions in `src/lib/firebase/submissionsService.ts` encapsulate Firestore queries for these operations.
*   **Security** for these operations is enforced by **Firestore Security Rules**, which should be configured to only allow authenticated admin users to read and write to the `contact-submissions` collection.

## Error Handling in Firebase

*   **Callable Cloud Functions**: Use `try/catch`. Throw `functions.https.HttpsError(code, message, details?)` to return structured errors to the client. Common codes include `invalid-argument`, `unauthenticated`, `permission-denied`, `not-found`, `internal`.
*   **Firestore-triggered Functions**: Use `try/catch`. Log errors to Cloud Logging. Can optionally write error status back to Firestore if needed.
*   **Client-Side SDK Calls**: Firebase SDK methods return Promises that reject with Firebase-specific error objects (e.g., `FirebaseError`) containing a `code` (like `auth/user-not-found`) and `message`.

## Rate Limiting and Quotas in Firebase

*   **Cloud Functions**: Have invocation quotas. You can set concurrent execution limits. For callable functions, implement custom rate limiting inside the function if needed (e.g., using Firestore to track recent requests per user).
*   **Firestore**: Has usage quotas (reads, writes, deletes per second/project). Firestore Security Rules do not directly enforce rate limits but can prevent abuse through conditional access.
*   **Firebase Authentication**: Has limits on operations like email sending for verification/password reset, and sign-in attempts.

## CORS Configuration

CORS is generally not an issue for:
*   **Callable Cloud Functions**: Invoked via the Firebase SDK, which handles the underlying HTTP requests correctly. By default, callable functions allow requests from any origin unless restricted via `functions.options.cors`.
*   **Direct Firestore Access**: Handled by the Firebase SDK. Firestore rules manage data access, not HTTP origins directly for client SDKs.

If you were to expose HTTP-triggered Cloud Functions (not callable ones) that need to be accessed from different web origins, you would configure CORS within those functions using standard Node.js middleware like `cors`.
