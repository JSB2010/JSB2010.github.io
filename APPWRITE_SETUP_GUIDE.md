# Appwrite Setup Guide

This comprehensive guide explains how to set up Appwrite for the portfolio website, including the contact form and email notifications.

## Project Information

- **API Endpoint**: https://nyc.cloud.appwrite.io/v1
- **Project ID**: 6816ef35001da24d113d

## Setup Options

You can set up Appwrite using either the automated script or manual configuration.

### Option 1: Automated Setup (Recommended)

I've created a comprehensive setup script that will automatically configure everything in Appwrite for you:

```bash
# Run the complete setup script
npm run setup-appwrite-complete
```

The script will:
- Install required dependencies
- Create or update the database and collection
- Create all necessary attributes in the collection
- Create and deploy the email notification function
- Set up the function variables for your Gmail account
- Create the database event trigger

### Option 2: Manual Setup

If you prefer to set things up manually, follow these steps:

#### 1. Database and Collection Setup

1. Go to your [Appwrite Console](https://cloud.appwrite.io/console)
2. Navigate to Databases
3. Create a new database (e.g., "contact-form-db")
4. Create a collection named "contact-submissions"
5. Set the appropriate permissions (allow create for guests)
6. Add the following attributes to the collection:
   - `name` (string, required)
   - `email` (string, required)
   - `subject` (string, required)
   - `message` (string, required)
   - `timestamp` (string, optional)
   - `userAgent` (string, optional)
   - `source` (string, optional)
   - `ipAddress` (string, optional)

#### 2. Email Notification Function Setup

1. Go to your Appwrite Console
2. Navigate to Functions
3. Create a new function:
   - **Name**: Contact Form Email Notification
   - **Runtime**: Node.js (latest version)
   - **Timeout**: 15 seconds
   - **Execute permissions**: Any
4. Add environment variables:
   - **EMAIL_USER**: jacobsamuelbarkin@gmail.com
   - **EMAIL_PASSWORD**: your-app-password
5. Deploy the function code:
   - Option A: Zip the `functions/email-notification-updated` directory and upload it
   - Option B: Deploy from GitHub by connecting your repository
6. Set up a database event trigger:
   - **Database**: your database ID
   - **Collection**: contact-submissions
   - **Event**: Document Created

## Environment Variables

Add the following environment variables to your project:

```
# Appwrite Client Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID=contact-submissions

# Appwrite Server Configuration (for Cloudflare Pages)
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_CONTACT_COLLECTION_ID=contact-submissions
```

When deploying to Cloudflare Pages, add all these environment variables in the Cloudflare Pages dashboard.

## Testing

To test the contact form and email notifications:

1. Submit a test message through your contact form
2. Check the Appwrite Console to verify the submission was saved
3. Check your email to see if you received the notification

You can also use the provided test scripts:

```bash
# Test the email sending functionality
npm run test:email

# Test the contact form submission
npm run test-contact-form
```

## Troubleshooting

If you encounter issues:

1. Check the function logs in the Appwrite Console
2. Verify your Gmail app password is correct
3. Check your spam folder for email notifications
4. Make sure the database event trigger is set up correctly
5. Ensure your environment variables are correctly set
6. Check CORS settings in Appwrite

## Security Best Practices

For security reasons:
- Use an app password for your Gmail account, not your regular password
- Regularly rotate your app passwords
- Consider using a dedicated email address for notifications
- Revoke or rotate your API key after setup
- Set appropriate permissions on your Appwrite collections

## Email Notification Function Details

The email notification function is triggered when a new document is created in the contact-submissions collection. It:

1. Extracts the contact form data from the document
2. Formats an email with the submission details
3. Sends the email using Nodemailer and Gmail SMTP
4. Returns a success or error response

The function requires the following environment variables:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Your Gmail app password

## Future Improvements

Consider these enhancements for your contact form:
- Add reCAPTCHA integration for spam protection
- Implement rate limiting to prevent abuse
- Add analytics tracking for form submissions
- Enhance error reporting and monitoring
