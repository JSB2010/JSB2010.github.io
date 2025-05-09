# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating various tasks in the jacobbarkin.com repository.

## Available Workflows

### 1. Cloudflare Pages Deployment (`cloudflare-pages.yml`)

This workflow builds and deploys the website to Cloudflare Pages.

**Trigger:**
- Push to `modern-redesign-shadcn` branch
- Pull request to `modern-redesign-shadcn` branch
- Manual trigger via workflow_dispatch

**Jobs:**
- `build`: Builds the Next.js application
- `deploy`: Deploys the built application to Cloudflare Pages (only runs on push to the main branch and if secrets are available)

**Required Secrets:**
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages permissions
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

**Environment Variables:**
- Various Appwrite configuration variables (with fallback values)
- `GITHUB_TOKEN`: Automatically provided by GitHub

### 2. Appwrite Functions Deployment (`appwrite-deploy.yml`)

This workflow deploys the email notification function to Appwrite.

**Trigger:**
- Push to `modern-redesign-shadcn` branch with changes to:
  - `functions/email-notification/**`
  - `functions/email-notification-updated/**`
  - `.github/workflows/appwrite-deploy.yml`
- Manual trigger via workflow_dispatch

**Jobs:**
- `check_secrets`: Checks if all required secrets are available
- `deploy_appwrite_functions`: Deploys the function to Appwrite (only runs if secrets are available)
- `build_function`: Tests that the function builds correctly (runs if secrets are not available)

**Required Secrets:**
- `APPWRITE_EMAIL`: Email address for Appwrite account
- `APPWRITE_PASSWORD`: Password for Appwrite account
- `APPWRITE_PROJECT_ID`: Appwrite project ID
- `APPWRITE_EMAIL_FUNCTION_ID`: ID of the email notification function in Appwrite

## Setting Up Secrets

To set up the required secrets for these workflows:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add each of the required secrets listed above

## Local Development

For local development, you can use the following environment variables in your `.env.local` file:

```
# Appwrite Client Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_APPWRITE_CONTACT_COLLECTION_ID=contact-submissions
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your-bucket-id
NEXT_PUBLIC_APPWRITE_FUNCTION_ID=your-function-id

# Cloudflare Configuration
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

## Troubleshooting

If the workflows are failing:

1. Check that all required secrets are set correctly
2. Verify that the Appwrite project and function exist
3. Ensure your Cloudflare API token has the correct permissions
4. Check the workflow logs for specific error messages

For more detailed information, see the [Appwrite Setup Guide](../APPWRITE_SETUP_GUIDE.md) and the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).
