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
| Events            | None (triggered via HTTP endpoint) |

## 📝 How It Works

1. The function receives a POST request directly from the contact form
2. It validates the required fields (name, email, message)
3. It formats an email with the submission details
4. It sends the email using Nodemailer and Gmail SMTP
5. It returns a JSON response with success or error information

## 📊 Request Format

The function expects a POST request with a JSON body containing:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "message": "Hello, I'd like to get in touch...",
  "phone": "123-456-7890" // Optional
}
```

## 📬 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Contact form submission received and notification sent"
}
```

### Error Responses

```json
{
  "success": false,
  "message": "Error message explaining what went wrong"
}
```

## 🔍 Troubleshooting

If you're not receiving emails:
- Check the function logs in the Appwrite Console
- Verify your Gmail app password is correct
- Check your spam folder
- Make sure the database event trigger is set up correctly
