# Contact Form Email Notification Function

This Appwrite Function sends an email notification when a new contact form submission is received.

## Setup Instructions

### 1. Create the Function in Appwrite Console

1. Go to your Appwrite Console
2. Navigate to Functions
3. Click "Create Function"
4. Fill in the details:
   - **Name**: Contact Form Email Notification
   - **Runtime**: Node.js 16.0 (or newer)
   - **Timeout**: 15 seconds
   - **Execute permissions**: Any

### 2. Deploy the Function

You can deploy this function in two ways:

#### Option 1: Deploy from GitHub

1. Connect your GitHub repository to Appwrite
2. Select this directory (`functions/email-notification`) as the source
3. Click "Deploy"

#### Option 2: Deploy Manually

1. Zip this directory
2. Upload the zip file to Appwrite Console
3. Click "Deploy"

### 3. Set Up Environment Variables

Add the following environment variables to your function:

- `EMAIL_USER`: Your Gmail address (e.g., jacobsamuelbarkin@gmail.com)
- `EMAIL_PASSWORD`: Your Gmail app password

### 4. Create a Database Event Trigger

1. Go to your Appwrite Console
2. Navigate to Functions > Your Function > Settings > Events
3. Add a new event:
   - **Event Type**: Database
   - **Database ID**: Your database ID (e.g., contact-form-db)
   - **Collection ID**: Your collection ID (e.g., contact-submissions)
   - **Event**: Document Created

## Testing

You can test the function by:

1. Submitting a new contact form on your website
2. Checking your email for the notification
3. Checking the function logs in Appwrite Console

## Troubleshooting

If you're not receiving emails:

1. Check the function logs for errors
2. Verify your Gmail app password is correct
3. Check your spam folder
4. Make sure the database event trigger is set up correctly
