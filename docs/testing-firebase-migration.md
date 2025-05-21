# Testing Guide: Appwrite to Firebase Migration

This document outlines key areas to test manually to ensure the migration from Appwrite to Firebase was successful and all functionalities are working as expected. It also suggests areas for potential new automated tests.

## 1. Manual Testing Checklist

### a. Contact Form Submission

*   **Action**: Navigate to the contact page and submit the contact form with valid data.
*   **Expected Result**:
    *   The form should show a success message.
    *   A new document should appear in the `contact-submissions` collection in your Firestore database with the correct data.
    *   The `timestamp` field should be correctly set.
    *   The default `status` (e.g., "unread" or "new") should be set.
*   **Action**: Submit the form with invalid data (e.g., missing email, short message).
*   **Expected Result**: Validation errors should be displayed on the form, and no data should be submitted to Firestore.
*   **Action**: Test form submission with network connectivity issues (if possible to simulate, e.g., using browser developer tools to go offline).
*   **Expected Result**: The form should handle the error gracefully, display an appropriate message, and not lose user input if possible (form persistence might be a separate feature).

### b. Email Notification for New Submissions

*   **Action**: After a successful contact form submission (see above).
*   **Expected Result**:
    *   An email notification should be sent to the address configured in your Firebase Cloud Function environment variables (`TO_EMAIL_ADDRESS`).
    *   The email content should correctly reflect the submitted data (name, email, subject, message).
    *   Check the logs for the `onNewSubmissionSendEmail` Cloud Function in the Firebase console for any errors if the email is not received.
    *   Check SendGrid (or your configured email provider) activity logs.

### c. Admin Panel - Authentication

*   **Action**: Navigate to the admin login page.
*   **Expected Result**: The login page should be displayed.
*   **Action**: Attempt to log in with valid admin credentials.
*   **Expected Result**: Successful login, and the user should be redirected to the admin dashboard. User session should be established.
*   **Action**: Attempt to log in with invalid credentials.
*   **Expected Result**: An error message should be displayed, and login should fail.
*   **Action**: If logged in, attempt to sign out.
*   **Expected Result**: Successful sign-out, and the user should be redirected (e.g., to the login page or home page). Access to admin areas should be restricted.
*   **Action**: Test accessing admin pages directly without being logged in.
*   **Expected Result**: User should be redirected to the login page (or shown an unauthorized message).

### d. Admin Panel - Submissions Dashboard

*   **Action**: Navigate to the contact form submissions page in the admin dashboard.
*   **Expected Result**:
    *   Submissions from Firestore should be listed correctly.
    *   Pagination, sorting (by date, name, status, priority), and filtering (by status, priority) should work as expected.
    *   The total number of submissions and pages should be accurate.
    *   Dates and statuses should be displayed correctly.
*   **Action**: View details of a submission.
*   **Expected Result**: A dialog or separate page should display all relevant information for the selected submission (name, email, message, timestamp, etc.).
*   **Action**: Update the status of a submission (e.g., from "new" to "read" or "replied") if this functionality is present in the UI.
*   **Expected Result**: The status should update in the UI and in the Firestore database.
*   **Action**: Delete a submission (if functionality exists).
*   **Expected Result**: The submission should be removed from the list and the Firestore database.
*   **Action**: Test search functionality on the dashboard (if implemented for Firestore).
*   **Expected Result**: Search results should be accurate based on the query.
*   **Action**: Test CSV export functionality.
*   **Expected Result**: A CSV file containing the submissions should be downloaded correctly.

### e. General Site Functionality

*   **Action**: Browse through all pages of the website.
*   **Expected Result**: All pages should load correctly without console errors related to Firebase or data fetching.
*   **Action**: Check for any broken links or missing images.
*   **Expected Result**: All resources should load as expected.
*   **Action**: Review browser developer console for any errors, especially related to Firebase SDK initialization or operations.

## 2. Suggestions for New Automated Tests (User Implementation)

While manual testing is crucial after a migration, consider adding automated tests for long-term stability:

### a. Firebase Cloud Functions

*   **Unit Tests**: For each Cloud Function (`submitContactForm`, `onNewSubmissionSendEmail`), write unit tests using the Firebase Test SDK (`firebase-functions-test`).
    *   Mock input data and context objects.
    *   Verify expected interactions with Firestore (e.g., data being written correctly for `submitContactForm`).
    *   Verify expected interactions with external services like SendGrid (you might mock the SendGrid client).
    *   Test validation logic and error handling within the functions.
*   **Integration Tests**: (More complex)
    *   For `submitContactForm`: Use a client (e.g., Firebase client SDK in a test script) to call the deployed function and verify data persistence in a test Firestore instance.
    *   For `onNewSubmissionSendEmail`: Write a document to a test Firestore instance and verify that the email function is triggered (e.g., by checking for logs or a mocked SendGrid call).

### b. Client-Side Components (e.g., React Testing Library, Jest)

*   **Contact Form Component (`contact-form-firebase.tsx`)**:
    *   Test form rendering, input validation, and submission states (loading, success, error).
    *   Mock the Firebase Functions call and test that it's invoked with the correct data.
*   **Admin Authentication Components**:
    *   Test login form interaction and calls to the Firebase auth service.
    *   Test that the `AdminAuthContext` correctly provides user state and auth functions.
*   **Admin Dashboard Components**:
    *   Mock the `submissionsService` to provide test data.
    *   Test that submissions are rendered correctly in the table.
    *   Test pagination, sorting, and filtering UI interactions and that they call the service functions with expected parameters.

### c. End-to-End Tests (e.g., Playwright, Cypress)

*   Simulate user flows:
    *   User submits the contact form successfully.
    *   Admin logs in, views submissions, and interacts with the dashboard.
*   These tests are higher level and can catch issues in the integration between frontend and backend.

## 3. Post-Migration Monitoring

*   Closely monitor Firebase project dashboards (Firestore usage, Authentication, Cloud Functions invocations and errors) after deployment.
*   Check SendGrid (or your email provider) logs for email delivery rates and any reported issues.
*   Review client-side error tracking logs if you have a service like Sentry integrated.

Thorough testing will help ensure a smooth transition and maintain application quality.
```
