# Manual Appwrite Setup Guide

Since we're encountering issues with the automated setup, here's a step-by-step guide to manually set up the Appwrite function for email notifications.

## 1. Create the Function in Appwrite Console

1. Go to your [Appwrite Console](https://cloud.appwrite.io/console)
2. Navigate to your project (ID: 6816ef35001da24d113d)
3. Click on "Functions" in the left sidebar
4. Click "Create Function"
5. Fill in the details:
   - **Name**: Contact Form Email Notification
   - **ID**: contact-email-notification (or any ID you prefer)
   - **Runtime**: Node.js (select the latest version available)
   - **Timeout**: 15 seconds
   - **Execute permissions**: Any
6. Click "Create"

## 2. Set Up Function Variables

1. In the function details page, go to the "Variables" tab
2. Add the following variables:
   - **EMAIL_USER**: jacobsamuelbarkin@gmail.com
   - **EMAIL_PASSWORD**: dwzm vsxv gipu tlsi

## 3. Deploy the Function Code

### Option 1: Deploy from GitHub

If your repository is connected to Appwrite:

1. In the function details page, go to the "Deployments" tab
2. Click "Create Deployment"
3. Select "GitHub"
4. Choose your repository and the `functions/email-notification` directory
5. Click "Deploy"

### Option 2: Deploy Manually

1. Zip the `functions/email-notification` directory:
   ```bash
   cd functions
   zip -r email-notification.zip email-notification
   ```
2. In the function details page, go to the "Deployments" tab
3. Click "Create Deployment"
4. Select "Manual"
5. Upload the zip file
6. Click "Deploy"

## 4. Set Up Database Event Trigger

1. In the function details page, go to the "Settings" tab
2. Scroll down to "Events"
3. Click "Add Event"
4. Select "Database"
5. Choose your database (ID: contact-form-db)
6. Choose your collection (ID: contact-submissions)
7. Select the "Document Created" event
8. Click "Add"

## 5. Test the Function

1. Submit a contact form on your website
2. Check your email for the notification
3. If you don't receive an email, check the function logs in the Appwrite Console

## Troubleshooting

If you encounter issues:

1. Check the function logs in the Appwrite Console
2. Verify your Gmail app password is correct
3. Check your spam folder for email notifications
4. Make sure the database event trigger is set up correctly

## Security Note

For security reasons:
- Consider using a dedicated app password for this application
- Regularly rotate your app passwords
