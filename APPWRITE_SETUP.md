# Appwrite Setup for Contact Form

This document provides instructions for setting up Appwrite for the contact form functionality.

## Prerequisites

1. Create an Appwrite account at [https://appwrite.io/](https://appwrite.io/)
2. Create a new project in Appwrite

## Setup Steps

### 1. Create a Database

1. Go to your Appwrite Console
2. Navigate to Databases
3. Create a new database (e.g., "website")
4. Note the Database ID for your environment variables

### 2. Create a Collection for Contact Submissions

1. In your database, create a new collection named "contact-submissions"
2. Set the appropriate permissions (allow create for guests)
3. Note the Collection ID for your environment variables

### 3. Define Attributes for the Collection

Create the following attributes for the collection:

| Attribute Name | Type   | Required | Default | Description                       |
|----------------|--------|----------|---------|-----------------------------------|
| name           | string | Yes      | -       | Name of the person submitting     |
| email          | string | Yes      | -       | Email of the person submitting    |
| subject        | string | No       | -       | Subject of the message            |
| message        | string | Yes      | -       | The message content               |
| timestamp      | string | No       | -       | Timestamp of submission           |
| userAgent      | string | No       | -       | User agent of the submitter       |
| source         | string | No       | -       | Source of the submission          |
| ipAddress      | string | No       | -       | IP address of the submitter       |

### 4. Create an API Key

1. Go to API Keys in your Appwrite Console
2. Create a new API key with the following permissions:
   - `databases.collections.{collectionId}.documents.write`
   - `databases.collections.{collectionId}.documents.read`
3. Note the API Key for your environment variables

### 5. Set Environment Variables

Add the following environment variables to your project:

```
# Appwrite Client Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID=contact-submissions

# Appwrite Server Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_CONTACT_COLLECTION_ID=contact-submissions
```

Replace the placeholder values with your actual Appwrite project details.

### 6. Deploy to Cloudflare Pages

When deploying to Cloudflare Pages, make sure to add all the environment variables in the Cloudflare Pages dashboard.

## Email Notifications

For email notifications, you have two options:

### Option 1: Use Appwrite Functions

1. Create a new Appwrite Function
2. Set up a database event trigger for new documents in the contact-submissions collection
3. Implement email sending logic in the function

### Option 2: Use a Third-Party Email Service

1. Sign up for an email service like SendGrid, Mailgun, etc.
2. Implement the email sending logic in the API route
3. Add the necessary environment variables for your email service

## Testing

To test the contact form:

1. Run the development server: `npm run dev`
2. Navigate to the contact page
3. Fill out and submit the form
4. Check the Appwrite Console to verify the submission was saved
5. Check your email to verify the notification was sent

## Troubleshooting

If you encounter issues:

1. Check the browser console for client-side errors
2. Check the server logs for API route errors
3. Verify your Appwrite credentials and permissions
4. Ensure your environment variables are correctly set
