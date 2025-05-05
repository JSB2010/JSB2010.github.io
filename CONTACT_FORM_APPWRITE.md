# Appwrite Contact Form Implementation

This document provides information about the Appwrite contact form implementation for the portfolio website.

## Overview

The contact form uses Appwrite as a backend service to store form submissions and send email notifications. The implementation follows modern best practices and uses the latest Appwrite SDK (v14.0.1).

## Components

1. **Contact Form Component**: `src/components/contact/contact-form-new.tsx`
   - React component with form validation using Zod and React Hook Form
   - Handles form submission to Appwrite
   - Provides error handling and loading states
   - Includes a fallback email option

2. **Appwrite Configuration**: `src/lib/appwrite/config.ts`
   - Sets up the Appwrite client
   - Provides a function to submit form data to Appwrite

3. **Email Service**: `src/lib/appwrite/email-service.ts`
   - Handles email notification formatting
   - Can be extended to use a real email service

4. **Cloudflare Pages Function**: `functions/api/contact-form.js`
   - Server-side function to handle form submissions
   - Provides CORS support
   - Submits data to Appwrite database
   - Handles email notifications

## Setup

### 1. Appwrite Setup

#### Manual Setup
1. Create an Appwrite project
2. Create a database (e.g., "contact-form-db")
3. Create a collection (e.g., "contact-submissions")
4. Add the following attributes to the collection:
   - `name` (string, required)
   - `email` (string, required)
   - `subject` (string, required)
   - `message` (string, required)
   - `timestamp` (string, optional)
   - `userAgent` (string, optional)
   - `source` (string, optional)
   - `ipAddress` (string, optional)
5. Set appropriate permissions (allow create for guests)

#### Automated Setup
You can use the provided script to set up the Appwrite collection schema automatically:

```bash
# Set your Appwrite API key
export APPWRITE_API_KEY=your-api-key

# Run the setup script
node scripts/setup-appwrite-schema.js
```

This script will create the collection and add all the necessary attributes with the correct settings.

### 2. Environment Variables

Add the following environment variables to your project:

```
# Appwrite Client Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=contact-form-db
NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID=contact-submissions

# Appwrite Server Configuration (for Cloudflare Pages)
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=contact-form-db
APPWRITE_CONTACT_COLLECTION_ID=contact-submissions
```

### 3. Cloudflare Pages Setup

When deploying to Cloudflare Pages, add all the environment variables in the Cloudflare Pages dashboard.

## Usage

The contact form is used in the Contact page (`src/app/contact/page.tsx`). It provides a user-friendly interface for visitors to send messages, with proper validation and error handling.

## Email Notifications

The project includes an Appwrite Function for email notifications. Here's how to set it up:

### Setting Up Email Notifications with Gmail

1. **Deploy the Email Notification Function**:
   - Go to your Appwrite Console
   - Navigate to Functions
   - Click "Create Function"
   - Fill in the details:
     - **Name**: Contact Form Email Notification
     - **Runtime**: Node.js 16.0 (or newer)
     - **Timeout**: 15 seconds
     - **Execute permissions**: Any

2. **Deploy the Function Code**:
   - Option 1: Deploy from GitHub by connecting your repository
   - Option 2: Zip the `functions/email-notification` directory and upload it manually

3. **Set Up Environment Variables**:
   - `EMAIL_USER`: Your Gmail address (e.g., jacobsamuelbarkin@gmail.com)
   - `EMAIL_PASSWORD`: Your Gmail app password

4. **Create a Database Event Trigger**:
   - Go to your function settings > Events
   - Add a new event:
     - **Event Type**: Database
     - **Database ID**: Your database ID (e.g., contact-form-db)
     - **Collection ID**: Your collection ID (e.g., contact-submissions)
     - **Event**: Document Created

### Alternative Options

If you prefer not to use the included function, you can:

1. **Use a Different Email Service**:
   - Sign up for an email service like SendGrid, Mailgun, etc.
   - Modify the function to use your preferred service
   - Update the environment variables accordingly

2. **Use a Third-Party Integration**:
   - Connect Appwrite to Zapier, Make.com, or similar services
   - Set up a workflow to send emails when new documents are created

## Troubleshooting

If you encounter issues:

1. Check the browser console for client-side errors
2. Check the Cloudflare Pages logs for function errors
3. Verify your Appwrite credentials and permissions
4. Ensure your environment variables are correctly set
5. Check CORS settings in Appwrite

## Future Improvements

- Add reCAPTCHA integration for spam protection
- Implement rate limiting to prevent abuse
- Add analytics tracking for form submissions
- Enhance error reporting and monitoring
