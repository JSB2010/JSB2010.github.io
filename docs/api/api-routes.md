# API Routes Documentation

This document provides detailed information about the API routes available in the Jacob Barkin Portfolio website.

## Overview

The website uses Next.js API routes for server-side functionality. These routes are located in the `src/app/api` directory and follow the Next.js App Router pattern.

**Note**: With the migration to Firebase, traditional Next.js API routes for backend operations like contact form submission and admin data management have been replaced by Firebase Cloud Functions and direct Firebase SDK interactions.

## Cloud Functions (Firebase)

Instead of traditional REST API endpoints for all backend logic, Firebase Cloud Functions are used.

### Callable Functions

#### `submitContactForm`

*   **Type**: Firebase Callable Cloud Function
*   **Location**: Defined in `functions/src/index.ts`
*   **Invoked Via**: Firebase SDK from the client-side (e.g., in `src/components/contact/contact-form-firebase.tsx`). This is not a traditional REST API endpoint that you call with `fetch` or `axios` to a URL like `/api/submitContactForm`.
*   **Description**: Handles new contact form submissions. It receives data from the contact form, performs validation, and stores it in the `contact-submissions` collection in Firestore.
*   **Request Data (from client using Firebase SDK)**:
    ```javascript
    // Example: { name: "John Doe", email: "john@example.com", subject: "Inquiry", message: "Hello!" }
    ```
*   **Response (to client via Firebase SDK)**:
    ```javascript
    // On success: { data: { success: true, id: "firestore-document-id", message: "Form submitted successfully!" } }
    // On error: Throws HttpsError (e.g., error.code, error.message)
    ```

### Firestore Triggers

#### `onNewSubmissionSendEmail`

*   **Type**: Firebase Firestore Triggered Cloud Function
*   **Location**: Defined in `functions/src/index.ts`
*   **Trigger**: Automatically activates when a new document is created in the `contact-submissions` Firestore collection.
*   **Description**: Sends an email notification (e.g., via SendGrid, configured through environment variables) to a designated admin email address when a new contact form submission is successfully stored. This function is not called directly by the client or via an HTTP request.

## Deprecated API Routes (Previously Appwrite-based)

The following Next.js API routes were part of the previous Appwrite integration and are now **deprecated or removed**. Their functionality has been migrated to Firebase services (Cloud Functions, Firestore direct access, Firebase Authentication).

*   **`/api/contact-unified`**: Functionality replaced by the `submitContactForm` Callable Cloud Function.
*   **`/api/contact-appwrite`**: Specific Appwrite endpoint, now removed.
*   **`/api/admin/submissions`**: Admin operations for listing submissions are now handled by the admin dashboard interacting directly with Firestore via `src/lib/firebase/submissionsService.ts`.
*   **`/api/admin/submissions/[id]`**: Admin operations for getting/updating individual submissions are also handled by the admin dashboard interacting directly with Firestore via `src/lib/firebase/submissionsService.ts`.

## API Utilities (General Information)

While specific Next.js API routes for core backend logic are reduced, the concepts of response formatting, error handling, and rate limiting are now primarily managed within the context of Firebase Cloud Functions and Firestore Security Rules:

*   **Response Formatting**: Callable Cloud Functions return JavaScript objects or throw `HttpsError` instances. Firestore-triggered functions typically don't return HTTP responses but perform actions based on database events (e.g., sending an email).
*   **Error Handling**: Cloud Functions use standard JavaScript `try/catch` blocks. Callable functions can throw `functions.https.HttpsError` to return structured errors to the client. Background functions log errors to Cloud Logging.
*   **Rate Limiting**: Firebase services have built-in usage quotas and limits. For callable functions, custom rate limiting logic can be implemented within the function itself if needed (e.g., using Firestore to track request counts per user).
*   **Authentication & Authorization**:
    *   Callable Cloud Functions can automatically receive the invoking user's Firebase Authentication context (`context.auth`). This allows for server-side validation of user identity and permissions.
    *   Firestore Security Rules are crucial for controlling direct database access from the client-side (e.g., admin dashboard) and can be combined with user authentication state and custom claims.

## Resources

- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Zod Documentation](https://zod.dev/) (Used for validation within Cloud Functions and client-side)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) (Relevant for understanding HttpsError codes)
