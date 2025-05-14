# Appwrite Functions Deployment Guide

This document provides detailed instructions for deploying Appwrite functions for the Jacob Barkin Portfolio website.

## Overview

[Appwrite Functions](https://appwrite.io/docs/products/functions) are serverless functions that run your custom code in response to events or HTTP requests. In this project, Appwrite functions are used for:

1. **Email Notifications**: Sending email notifications when new contact form submissions are received

## Prerequisites

- Appwrite account
- Appwrite project created
- Appwrite API key with functions permissions
- Node.js 18.x or later
- Appwrite CLI (optional for manual deployment)

## Function Structure

The email notification function is located in the `functions/email-notification-updated` directory:

```
functions/email-notification-updated/
├── node_modules/           # Dependencies
├── src/
│   └── main.js             # Main function code
├── .gitignore              # Git ignore file
├── package.json            # Dependencies and scripts
├── package-lock.json       # Lock file
└── README.md               # Function documentation
```

## Deployment Methods

There are three methods for deploying Appwrite functions:

1. **Automated Script**: Using the provided npm script
2. **Appwrite Console**: Manual deployment through the Appwrite web console
3. **Appwrite CLI**: Manual deployment using the Appwrite CLI

### Method 1: Automated Script (Recommended)

The project includes a script for deploying Appwrite functions:

```bash
npm run setup-appwrite-function
```

This script:
- Creates or updates the function in your Appwrite project
- Uploads the function code
- Sets required environment variables
- Creates necessary API endpoints

### Method 2: Appwrite Console

To deploy the function manually through the Appwrite Console:

1. **Navigate to the Appwrite Console**:
   - Log in to your Appwrite account
   - Select your project

2. **Create a Function**:
   - Click on Functions in the side menu
   - Click on "Create Function"
   - Fill in the function details:
     - Name: "Email Notification"
     - Runtime: Node.js 18.0
     - Entrypoint: src/main.js
     - Timeout: 15 seconds (or as needed)

3. **Upload the Code**:
   - Click on the "Deploy" tab
   - Click on "Upload Code"
   - Select the `functions/email-notification-updated` directory
   - Click "Deploy"

4. **Set Environment Variables**:
   - Click on the "Settings" tab
   - Click on "Variables"
   - Add the following variables:
     - `EMAIL_USER`: Your email address
     - `EMAIL_PASSWORD`: Your app-specific password

### Method 3: Appwrite CLI

To deploy the function using the Appwrite CLI:

1. **Install the Appwrite CLI**:
   ```bash
   npm install -g appwrite-cli
   ```

2. **Login to Appwrite**:
   ```bash
   appwrite login
   ```

3. **Deploy the Function**:
   ```bash
   cd functions/email-notification-updated
   appwrite functions createDeployment \
     --functionId=YOUR_FUNCTION_ID \
     --entrypoint=src/main.js \
     --code=.
   ```

4. **Set Environment Variables**:
   ```bash
   appwrite functions createVariable \
     --functionId=YOUR_FUNCTION_ID \
     --key=EMAIL_USER \
     --value=your-email@gmail.com

   appwrite functions createVariable \
     --functionId=YOUR_FUNCTION_ID \
     --key=EMAIL_PASSWORD \
     --value=your-gmail-app-password
   ```

## Function Configuration

### Runtime Settings

| Setting           | Value                     |
|-------------------|---------------------------|
| Runtime           | Node.js 18.0              |
| Entrypoint        | src/main.js               |
| Build Commands    | npm install               |
| Timeout (Seconds) | 15                        |
| Events            | None (HTTP endpoint only) |

### Environment Variables

| Variable        | Description                                  |
|-----------------|----------------------------------------------|
| EMAIL_USER      | Your Gmail address (e.g., your@gmail.com)    |
| EMAIL_PASSWORD  | Your Gmail app password                      |

**Note**: For Gmail, you need to use an App Password instead of your regular password. You can create one at https://myaccount.google.com/apppasswords

## Function Code

The main function code is in `src/main.js`:

```javascript
import { Client, Users } from 'node-appwrite';
import nodemailer from 'nodemailer';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  try {
    // Parse request body
    const body = JSON.parse(req.body);
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return res.json({
        success: false,
        message: 'Missing required fields: name, email, and message are required'
      }, 400);
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Format email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${body.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${body.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This email was sent automatically from the contact form on jacobbarkin.com</em></p>
      `
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Return success response
    return res.json({
      success: true,
      message: 'Contact form submission received and notification sent'
    });
  } catch (err) {
    // Log error
    error(err.message);
    
    // Return error response
    return res.json({
      success: false,
      message: 'Error processing contact form submission: ' + err.message
    }, 500);
  }
};
```

## Testing the Function

### Using the Test Script

The project includes a script for testing the email notification function:

```bash
npm run test:email
```

This script sends a test submission to the function and verifies that an email is sent.

### Manual Testing

To test the function manually:

1. **Get the Function Endpoint**:
   - In the Appwrite Console, go to Functions
   - Select your function
   - Copy the execution endpoint

2. **Send a Test Request**:
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","message":"This is a test message"}' \
     https://nyc.cloud.appwrite.io/v1/functions/YOUR_FUNCTION_ID/executions
   ```

## Troubleshooting

### Common Issues

1. **Deployment Errors**:
   - Check that your API key has sufficient permissions
   - Verify that your function code is valid
   - Make sure your dependencies are correctly specified in package.json

2. **Execution Errors**:
   - Check the function logs in the Appwrite Console
   - Verify that your environment variables are set correctly
   - Make sure your email provider allows sending emails from your account

3. **Email Delivery Issues**:
   - Check your spam folder
   - Verify that your Gmail app password is correct
   - Make sure your Gmail account has less secure apps access enabled

### Debugging

For debugging function issues:

1. **View Function Logs**:
   - In the Appwrite Console, go to Functions
   - Select your function
   - Click on the "Executions" tab
   - Click on an execution to view logs

2. **Test Locally**:
   - Create a local test script that simulates the function environment
   - Run the function code with test data
   - Check for errors and debug as needed

## Resources

- [Appwrite Functions Documentation](https://appwrite.io/docs/products/functions)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Appwrite CLI Documentation](https://appwrite.io/docs/tooling/command-line)
