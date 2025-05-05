# Appwrite Setup Instructions

This document provides instructions for setting up the Appwrite backend for the contact form with email notifications.

## Automated Setup

I've created a comprehensive setup script that will automatically configure everything in Appwrite for you. This includes:

1. Creating the database and collection for contact form submissions
2. Setting up the email notification function
3. Configuring the database event trigger
4. Setting up environment variables for email notifications

### Running the Setup Script

To run the automated setup script:

```bash
# Run the complete setup script
npm run setup-appwrite-complete
```

The script will:
- Install required dependencies (archiver, nodemailer)
- Create or update the database and collection
- Create all necessary attributes in the collection
- Create and deploy the email notification function
- Set up the function variables for your Gmail account
- Create the database event trigger

### After Setup

Once the setup is complete:
1. Test the contact form on your website
2. Check your email for notifications when forms are submitted
3. **Important**: For security reasons, please revoke or rotate the API key used for this setup when you're done

## Manual Setup

If you prefer to set things up manually, you can follow these steps:

### 1. Database and Collection Setup

```bash
# Run the database and collection setup script
npm run setup-appwrite
```

### 2. Email Notification Function Setup

1. Go to your Appwrite Console
2. Navigate to Functions
3. Create a new function:
   - Name: Contact Form Email Notification
   - Runtime: Node.js 16.0
   - Timeout: 15 seconds
4. Deploy the function code from `functions/email-notification`
5. Add environment variables:
   - `EMAIL_USER`: jacobsamuelbarkin@gmail.com
   - `EMAIL_PASSWORD`: your-app-password
6. Set up a database event trigger for document creation in your contact form collection

## Testing

To test the email functionality:

```bash
# Test the email sending functionality
npm run test:email
```

## Troubleshooting

If you encounter issues:

1. Check the function logs in Appwrite Console
2. Verify your Gmail app password is correct
3. Check your spam folder for email notifications
4. Make sure the database event trigger is set up correctly

## Security Note

For security reasons:
- Revoke or rotate your API key after setup
- Consider using a dedicated app password for this application
- Regularly rotate your app passwords
