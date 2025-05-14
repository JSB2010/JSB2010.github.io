# 📧 Email Notification Function for Contact Form

This function sends email notifications when new contact form submissions are received from the Jacob Barkin Portfolio website. It uses Nodemailer with Gmail SMTP to deliver formatted HTML emails with submission details.

## 🔐 Environment Variables

This function requires the following environment variables to be set in the Appwrite Console:

| Variable        | Description                                  | Required |
|-----------------|----------------------------------------------|----------|
| EMAIL_USER      | Your Gmail address (e.g., your@gmail.com)    | Yes      |
| EMAIL_PASSWORD  | Your Gmail app password                      | Yes      |

### Gmail App Password Setup

For Gmail, you need to use an App Password instead of your regular password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password:
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter a name like "Jacobbarkin Website"
5. Copy the generated 16-character password
6. Use this password for the `EMAIL_PASSWORD` environment variable

## 🚀 Deployment

### Method 1: Using the Automated Script (Recommended)

The project includes a script for deploying Appwrite functions:

```bash
# From the project root directory
npm run setup-appwrite-function
```

This script:
- Creates or updates the function in your Appwrite project
- Uploads the function code
- Sets required environment variables
- Creates necessary API endpoints

### Method 2: Using Appwrite Console

To deploy manually through the Appwrite Console:

1. Navigate to your Appwrite Console
2. Click on Functions in the side menu
3. Select your function (or create a new one)
4. Click on the Deploy tab
5. Upload the code from this directory:
   - Click "Upload Code"
   - Select the entire `functions/email-notification-updated` directory
   - Click "Deploy"
6. Set the required environment variables:
   - Go to Settings > Variables
   - Add `EMAIL_USER` and `EMAIL_PASSWORD`

### Method 3: Using Appwrite CLI

For CLI deployment (requires Appwrite CLI installed):

```bash
# Install Appwrite CLI if not already installed
npm install -g appwrite-cli

# Login to Appwrite
appwrite login

# Deploy the function
cd functions/email-notification-updated
appwrite functions createDeployment \
  --functionId=681c08e2003d92a504ba \
  --entrypoint=src/main.js \
  --code=.
```

## ⚙️ Configuration

### Function Settings

| Setting           | Value                     | Description                                  |
|-------------------|---------------------------|----------------------------------------------|
| Runtime           | Node.js (18.0)            | JavaScript runtime environment               |
| Entrypoint        | src/main.js               | Main function file                           |
| Build Commands    | npm install               | Commands to run during deployment            |
| Timeout (Seconds) | 15                        | Maximum execution time                       |
| Events            | None                      | Function is triggered via HTTP endpoint only |
| Execute           | any                       | Who can execute the function                 |

### Current Function IDs

| Deployment Method | Function ID                | Status      |
|-------------------|----------------------------|-------------|
| CLI Deployment    | 681d02077be251f34e7b      | Active      |
| Git Integration   | 681c08e2003d92a504ba      | Active      |

**Note:** The project is configured to use the function deployed through GitHub Actions workflow (681d02077be251f34e7b) rather than the one automatically deployed when the git repo is updated.

## 📝 How It Works

### Function Flow

1. **Request Reception**:
   - The function receives a POST request directly from the contact form
   - The request body is parsed as JSON

2. **Validation**:
   - Required fields (name, email, message) are validated
   - If any required field is missing, an error response is returned

3. **Email Preparation**:
   - A Nodemailer transporter is created using Gmail SMTP
   - An HTML email is formatted with the submission details
   - The email includes styling to match the website design

4. **Email Sending**:
   - The email is sent to the address specified in `EMAIL_USER`
   - The same address is used as the sender (for reply-to functionality)

5. **Response**:
   - A JSON response is returned with success or error information
   - Logs are created for monitoring and debugging

### Code Highlights

```javascript
// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Format email with HTML template
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: `New Contact Form Submission from ${body.name}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #0070f3; border-bottom: 2px solid #0070f3; padding-bottom: 10px;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${body.name}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ''}
      <p><strong>Message:</strong></p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
        ${body.message.replace(/\n/g, '<br>')}
      </div>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
      <p style="color: #666; font-size: 12px;"><em>This email was sent automatically from the contact form on jacobbarkin.com</em></p>
    </div>
  `
};
```

## 📊 API Reference

### Request Format

The function expects a POST request with a JSON body containing:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "message": "Hello, I'd like to get in touch...",
  "phone": "123-456-7890" // Optional
}
```

### Response Format

#### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Contact form submission received and notification sent"
}
```

#### Error Responses

**Bad Request (400)**
```json
{
  "success": false,
  "message": "Missing required fields: name, email, and message are required"
}
```

**Internal Server Error (500)**
```json
{
  "success": false,
  "message": "Error processing contact form submission: [error details]"
}
```

## 🔍 Troubleshooting

### Common Issues

1. **Not Receiving Emails**:
   - Check the function logs in the Appwrite Console
   - Verify your Gmail app password is correct (not your regular password)
   - Check your spam/junk folder
   - Ensure Gmail hasn't blocked the sending due to security settings

2. **Function Execution Errors**:
   - Check for syntax errors in the function code
   - Verify that all dependencies are correctly installed
   - Check that environment variables are set correctly

3. **Request Errors**:
   - Ensure the request body is properly formatted JSON
   - Check that all required fields are included
   - Verify the content type is set to `application/json`

### Viewing Function Logs

To view function execution logs:

1. Go to the Appwrite Console
2. Navigate to Functions
3. Select your function
4. Click on the "Executions" tab
5. Click on a specific execution to view detailed logs

### Testing the Function

You can test the function directly using cURL:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message"}' \
  https://nyc.cloud.appwrite.io/v1/functions/681d02077be251f34e7b/executions
```

Or use the built-in test script:

```bash
npm run test:email
```
