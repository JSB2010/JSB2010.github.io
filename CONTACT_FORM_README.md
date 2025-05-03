# Contact Form Implementation

This document explains how the contact form works in the website.

## Overview

The contact form implementation consists of three main parts:

1. **Frontend Form Component**: A React component that collects user input and submits it to Firestore
2. **Firestore Database**: Stores the contact form submissions
3. **Firebase Cloud Function**: Triggers when a new submission is added to Firestore and sends an email notification

## How It Works

1. When a user submits the contact form, the data is sent directly to Firestore
2. A Firebase Cloud Function is triggered by the new document in Firestore
3. The Cloud Function sends an email notification with the contact form details

## Implementation Details

### Frontend Component

The contact form is implemented in `src/components/contact/contact-form-firestore.tsx`. This component:

- Uses React Hook Form with Zod for form validation
- Submits form data directly to Firestore
- Shows success/error messages to the user
- Provides a fallback mailto link if submission fails

### Firebase Cloud Function

The email notification function is implemented in `functions/src/contact-email-trigger.ts`. This function:

- Triggers when a new document is added to the `contactSubmissions` collection
- Uses Nodemailer to send an email notification
- Includes all form details in the email
- Is configured with your Gmail account and app password

### Firestore Security Rules

The Firestore security rules in `firestore.rules` allow anonymous submissions to the `contactSubmissions` collection:

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

## Deployment

The contact form is deployed as follows:

1. **Firebase Functions**: Deployed to Firebase using the Firebase CLI
2. **Website**: Deployed to Cloudflare Pages via GitHub

## Testing

To test the contact form:

1. Go to the contact page
2. Fill out the form and submit it
3. Check the Firebase Console to verify that the submission was stored in Firestore
4. Check your email to verify that you received the notification

## Troubleshooting

### Form Not Submitting

- Check the browser console for errors
- Verify that your Firebase configuration is correct
- Check the Firestore security rules

### Email Notifications Not Working

- Check the Firebase Functions logs in the Firebase Console
- Verify that the Gmail app password is still valid
- Check your spam folder

## Maintenance

### Updating Email Credentials

If you need to update the email credentials:

1. Edit `functions/src/contact-email-trigger.ts`
2. Update the `emailConfig` object with your new credentials
3. Deploy the functions using `firebase deploy --only functions`

### Viewing Submissions

You can view all contact form submissions in the Firebase Console:

1. Go to the Firebase Console
2. Navigate to Firestore Database
3. Open the `contactSubmissions` collection
