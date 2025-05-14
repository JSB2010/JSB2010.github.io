# Appwrite Integration

This document provides detailed information about the Appwrite integration in the Jacob Barkin Portfolio website.

## Overview

[Appwrite](https://appwrite.io/) is an open-source backend server that provides essential backend services for web and mobile applications. In this project, Appwrite is used for:

1. **Database**: Storing contact form submissions
2. **Functions**: Serverless functions for email notifications
3. **Authentication**: User authentication for the admin dashboard

## Setup

### Prerequisites

- Appwrite account (free tier available)
- Appwrite project created
- Appwrite API key with appropriate permissions

### Automated Setup

The project includes scripts for setting up Appwrite resources:

```bash
# Complete setup (recommended)
npm run setup-appwrite-complete

# Individual setup scripts
npm run setup-appwrite        # Basic schema setup
npm run setup-appwrite-enhanced # Enhanced schema setup
npm run setup-appwrite-auth   # Authentication setup
npm run setup-appwrite-function # Function setup
```

### Manual Setup

If you prefer to set up Appwrite manually, follow these steps:

1. **Create a Project**:
   - Log in to the Appwrite Console
   - Create a new project (e.g., "Jacob Barkin Portfolio")
   - Note the Project ID for environment variables

2. **Create a Database**:
   - Go to Databases > Create Database
   - Name: "contact-form-db"
   - Enable Document Security

3. **Create a Collection**:
   - Go to the database > Create Collection
   - Name: "contact-submissions"
   - Set permissions as needed (typically only authenticated users can read)

4. **Define Attributes**:
   - Add the following attributes to the collection:
     - name (string, required)
     - email (string, required)
     - message (string, required)
     - phone (string, optional)
     - timestamp (datetime, required)
     - status (string, required, default: "unread")

5. **Create Indexes**:
   - Create an index on the timestamp field for sorting
   - Create an index on the status field for filtering

6. **Create a Function**:
   - Go to Functions > Create Function
   - Name: "email-notification"
   - Runtime: Node.js 18.0
   - Entrypoint: src/main.js
   - Upload the code from functions/email-notification-updated
   - Set environment variables:
     - EMAIL_USER: Your email address
     - EMAIL_PASSWORD: Your app-specific password

## Environment Variables

The following environment variables are required for Appwrite integration:

### Client-Side Variables

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=contact-form-db
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=contact-submissions
NEXT_PUBLIC_APPWRITE_FUNCTION_ID=your-function-id
```

### Server-Side Variables

```
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=contact-form-db
APPWRITE_CONTACT_COLLECTION_ID=contact-submissions
APPWRITE_FUNCTION_ID=your-function-id
```

## Database Schema

### Contact Submissions Collection

| Attribute  | Type     | Required | Description                       |
|------------|----------|----------|-----------------------------------|
| name       | string   | Yes      | Submitter's name                  |
| email      | string   | Yes      | Submitter's email                 |
| message    | string   | Yes      | Message content                   |
| phone      | string   | No       | Submitter's phone number          |
| timestamp  | datetime | Yes      | Submission timestamp              |
| status     | string   | Yes      | Status (unread, read, archived)   |
| ip         | string   | No       | Submitter's IP address (hashed)   |
| user_agent | string   | No       | Submitter's browser information   |
| referrer   | string   | No       | Referrer URL                      |

## Authentication

The admin dashboard uses Appwrite authentication for secure access:

1. **Email/Password Authentication**:
   - Used for admin login
   - Configured with secure password policies

2. **Session Management**:
   - Sessions are persisted for convenience
   - Automatic session refresh

3. **Access Control**:
   - Role-based access control for admin users
   - Document-level security for contact submissions

## Functions

### Email Notification Function

The email notification function sends an email when a new contact form submission is received:

1. **Trigger**:
   - HTTP request from the contact form

2. **Functionality**:
   - Validates the submission data
   - Formats an email with the submission details
   - Sends the email using Nodemailer and Gmail SMTP
   - Returns a success or error response

3. **Configuration**:
   - Runtime: Node.js 18.0
   - Entrypoint: src/main.js
   - Environment variables:
     - EMAIL_USER: Your email address
     - EMAIL_PASSWORD: Your app-specific password

## Client Integration

### Appwrite Client Configuration

The Appwrite client is configured in `src/lib/appwrite/config.ts`:

```typescript
import { Client, Databases, ID } from 'appwrite';

// Initialize Appwrite client
const client = new Client();

// Configure Appwrite client
client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? fallbackConfig.endpoint)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? fallbackConfig.projectId);

// Initialize Databases service
const databases = new Databases(client);

export { client, databases, ID };
```

### Contact Form Integration

The contact form integrates with Appwrite in `src/components/contact/contact-form-api.tsx`:

```typescript
import { databases, ID } from '@/lib/appwrite/config';

// Submit form data to Appwrite
const submitToAppwrite = async (formData) => {
  try {
    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || '',
        timestamp: new Date().toISOString(),
        status: 'unread'
      }
    );
    return { success: true, data: document };
  } catch (error) {
    console.error('Appwrite submission error:', error);
    return { success: false, error };
  }
};
```

## Admin Dashboard Integration

The admin dashboard integrates with Appwrite for authentication and data retrieval:

1. **Authentication**:
   - Login form in `src/app/admin/page.tsx`
   - Session management in `src/lib/appwrite/auth.ts`

2. **Submissions Management**:
   - List submissions in `src/app/admin/submissions/page.tsx`
   - View submission details in `src/components/admin/submission-details.tsx`
   - Update submission status in `src/components/admin/submission-actions.tsx`

## Backup and Restore

The project includes scripts for backing up and restoring Appwrite data:

```bash
# Create a backup
npm run backup-appwrite

# List available backups
npm run list-appwrite-backups

# Restore from a backup
npm run restore-appwrite-backup
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**:
   - Check that your API key has sufficient permissions
   - Verify that your project ID is correct

2. **CORS Errors**:
   - Add your domain to the Appwrite project's platforms list
   - Check that your endpoint URL is correct

3. **Function Deployment Errors**:
   - Check that your function code is valid
   - Verify that your environment variables are set correctly

### Debugging

For debugging Appwrite integration issues:

```bash
# Run with verbose logging
NODE_ENV=development DEBUG=appwrite:* npm run dev
```

## Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite JavaScript SDK](https://appwrite.io/docs/sdks/javascript/overview)
- [Appwrite Functions](https://appwrite.io/docs/products/functions)
- [Appwrite Authentication](https://appwrite.io/docs/products/auth)
