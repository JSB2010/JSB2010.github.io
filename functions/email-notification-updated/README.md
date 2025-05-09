# 📧 Email Notification Function for Contact Form

This function sends email notifications when new contact form submissions are received in the Appwrite database.

## 🔐 Environment Variables

This function requires the following environment variables:

| Variable        | Description                                  |
|-----------------|----------------------------------------------|
| EMAIL_USER      | Your Gmail address (e.g., your@gmail.com)    |
| EMAIL_PASSWORD  | Your Gmail app password                      |

**Note:** For Gmail, you need to use an App Password instead of your regular password. You can create one at https://myaccount.google.com/apppasswords

## 🚀 Deployment

### Using Appwrite Console

1. Navigate to your Appwrite Console
2. Click on Functions in the side menu
3. Select your function
4. Click on the Deploy tab
5. Upload the code from this directory
6. Set the required environment variables

### Using Appwrite CLI

```bash
cd functions/email-notification-updated
appwrite functions createDeployment \
  --functionId=YOUR_FUNCTION_ID \
  --entrypoint=src/main.js \
  --code=.
```

## ⚙️ Configuration

| Setting           | Value                     |
|-------------------|---------------------------|
| Runtime           | Node.js (18.0)            |
| Entrypoint        | src/main.js               |
| Build Commands    | npm install               |
| Timeout (Seconds) | 15                        |
| Events            | databases.*.collections.contact-submissions.documents.*.create |

## 📝 How It Works

1. The function is triggered when a new document is created in the contact-submissions collection
2. It extracts the contact form data from the document
3. It formats an email with the submission details
4. It sends the email using Nodemailer and Gmail SMTP
5. It returns a success or error response

## 🔍 Troubleshooting

If you're not receiving emails:
- Check the function logs in the Appwrite Console
- Verify your Gmail app password is correct
- Check your spam folder
- Make sure the database event trigger is set up correctly
