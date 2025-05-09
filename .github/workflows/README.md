# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating various tasks in the jacobbarkin.com repository.

## Available Workflows

### Cloudflare Pages Deployment (`cloudflare-pages.yml`)

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

> **Note:** The Appwrite Functions Deployment workflow has been removed. Appwrite functions are now deployed automatically using Appwrite's Git integration feature.

## Setting Up Secrets

To set up the required secrets for the Cloudflare Pages workflow:

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages permissions
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## Local Development

For local development, you can use the following environment variables in your `.env.local` file:

```
# Appwrite Client Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6816ef35001da24d113d
NEXT_PUBLIC_APPWRITE_DATABASE_ID=contact-form-db
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=contact-submissions
NEXT_PUBLIC_APPWRITE_FUNCTION_ID=681c08e2003d92a504ba

# Cloudflare Configuration
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

## Appwrite Functions

Appwrite functions are now deployed automatically using Appwrite's Git integration feature. The function ID for the email notification function is `681c08e2003d92a504ba`.

## Troubleshooting

If the Cloudflare Pages workflow is failing:

1. Check that the Cloudflare secrets are set correctly
2. Ensure your Cloudflare API token has the correct permissions
3. Check the workflow logs for specific error messages

For more detailed information, see the [Appwrite Setup Guide](../APPWRITE_SETUP_GUIDE.md) and the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/).
