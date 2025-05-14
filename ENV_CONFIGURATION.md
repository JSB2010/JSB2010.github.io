# Environment Configuration Guide

This document provides comprehensive information about environment variables and configuration for the Jacob Barkin Portfolio website.

## Table of Contents

1. [Environment Files](#environment-files)
2. [Setting Up Your Environment](#setting-up-your-environment)
3. [Environment Variables Reference](#environment-variables-reference)
4. [Production Configuration](#production-configuration)
5. [Appwrite Function Configuration](#appwrite-function-configuration)
6. [GitHub Actions Configuration](#github-actions-configuration)
7. [Validation and Type Safety](#validation-and-type-safety)
8. [Security Best Practices](#security-best-practices)
9. [Troubleshooting](#troubleshooting)

## Environment Files

The project uses the following environment files:

| File | Purpose | Commit to Git? |
|------|---------|----------------|
| `.env.example` | Template with example values | ✅ Yes |
| `.env` | Main environment file for development | ❌ No |
| `.env.local` | Local overrides for development | ❌ No |
| `.env.development` | Development-specific settings | ✅ Yes |
| `.env.production` | Production-specific settings | ✅ Yes |

### File Priority

Next.js loads environment variables in the following order (later files override earlier ones):

1. `.env` (base file)
2. `.env.local` (local overrides)
3. `.env.development` or `.env.production` (environment-specific)
4. `.env.development.local` or `.env.production.local` (environment-specific local overrides)

## Setting Up Your Environment

### Local Development Setup

1. **Copy the template**:
   ```bash
   cp .env.example .env.local
   ```

2. **Edit the file**:
   Open `.env.local` in your editor and update the values:
   ```
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_APPWRITE_FUNCTION_ID=your-function-id
   # Add other required variables
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

### Required Variables for Development

At minimum, you need to set:

- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_FUNCTION_ID`

Other variables have sensible defaults for development.

## Environment Variables Reference

### Client-Side Variables

These variables are exposed to the browser with the `NEXT_PUBLIC_` prefix:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite API endpoint | `https://nyc.cloud.appwrite.io/v1` | No |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID | - | Yes |
| `NEXT_PUBLIC_APPWRITE_DATABASE_ID` | Appwrite database ID | `contact-form-db` | No |
| `NEXT_PUBLIC_APPWRITE_COLLECTION_ID` | Appwrite collection ID | `contact-submissions` | No |
| `NEXT_PUBLIC_APPWRITE_FUNCTION_ID` | Appwrite function ID | - | Yes |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA site key (optional) | - | No |

### Server-Side Variables

These variables are only used on the server and are not exposed to the browser:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APPWRITE_ENDPOINT` | Appwrite API endpoint | `https://nyc.cloud.appwrite.io/v1` | No |
| `APPWRITE_PROJECT_ID` | Appwrite project ID | Same as `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | No |
| `APPWRITE_API_KEY` | Appwrite API key | - | Yes* |
| `APPWRITE_DATABASE_ID` | Appwrite database ID | `contact-form-db` | No |
| `APPWRITE_CONTACT_COLLECTION_ID` | Appwrite collection ID | `contact-submissions` | No |
| `APPWRITE_FUNCTION_ID` | Appwrite function ID | Same as `NEXT_PUBLIC_APPWRITE_FUNCTION_ID` | No |
| `EMAIL_USER` | Email address for notifications | `jacobsamuelbarkin@gmail.com` | No |
| `EMAIL_PASSWORD` | Email password (app-specific) | - | Yes* |
| `ADMIN_API_KEY` | Admin API key | `admin-secret-key` (dev only) | No |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | - | Yes* |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | - | Yes* |
| `GITHUB_TOKEN` | GitHub API token (optional) | - | No |

*Required for specific functionality (API routes, deployment, etc.)

## Production Configuration

### Cloudflare Pages Environment Variables

For production, add the client-side variables to Cloudflare Pages:

1. Go to the Cloudflare Dashboard
2. Navigate to "Pages"
3. Select your project "jacobbarkin-com"
4. Click on "Settings" > "Environment variables"
5. Add all `NEXT_PUBLIC_*` variables
6. Set these for both "Production" and "Preview" environments

### Environment Variable Scopes

You can set different values for Production and Preview environments:

| Environment | When Used |
|-------------|-----------|
| Production | Deployments from the main branch |
| Preview | Deployments from other branches and pull requests |

## Appwrite Function Configuration

### Email Notification Function

For the Appwrite email function, add these environment variables:

1. Go to the Appwrite Console
2. Navigate to "Functions"
3. Select your function with ID `681c08e2003d92a504ba`
4. Click on "Settings" > "Variables"
5. Add:
   - `EMAIL_USER`: jacobsamuelbarkin@gmail.com
   - `EMAIL_PASSWORD`: [Your Gmail app password]

### Gmail App Password

For Gmail, you need to use an App Password instead of your regular password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password for "Mail" and "Other (Custom name)"
5. Use the generated password for `EMAIL_PASSWORD`

## GitHub Actions Configuration

For GitHub Actions workflows, add these secrets to your repository:

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## Validation and Type Safety

Environment variables are validated using Zod in `src/lib/env.ts`:

```typescript
// Example of environment validation
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APPWRITE_ENDPOINT: z.string().url().default('https://nyc.cloud.appwrite.io/v1'),
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: z.string().min(1),
  // Other validations...
});

// This throws an error if validation fails
export const clientEnv = clientEnvSchema.parse(process.env);
```

This ensures:
- Required variables are present
- Variables have the correct format
- Sensible defaults are used when possible

## Security Best Practices

1. **Never commit sensitive files**:
   - Add `.env`, `.env.local`, and other local files to `.gitignore`
   - Use `.env.example` as a template without real values

2. **Rotate credentials regularly**:
   - Change API keys and tokens every 90 days
   - Revoke and regenerate compromised credentials immediately

3. **Use least privilege principle**:
   - Create API keys with only the permissions they need
   - Use different keys for different environments

4. **Secure storage**:
   - Use a password manager to store API keys and tokens
   - Never share credentials via unsecured channels

5. **Audit access**:
   - Regularly review who has access to credentials
   - Monitor for unusual activity in service dashboards

## Troubleshooting

### Common Issues

1. **"Cannot find module 'src/lib/env'"**:
   - Make sure you've created `.env.local` with required variables
   - Restart the development server after changing environment files

2. **Appwrite authentication errors**:
   - Check that your API key has sufficient permissions
   - Verify that your project ID is correct

3. **Environment variables not available in production**:
   - Verify that variables are set in Cloudflare Pages
   - Check that variables are prefixed with `NEXT_PUBLIC_` if used client-side

### Debugging Environment Variables

To debug environment variables:

```javascript
// Add this to a page temporarily (remove before production)
export default function DebugPage() {
  return (
    <div>
      <h1>Environment Debug</h1>
      <pre>
        {JSON.stringify({
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_APPWRITE_ENDPOINT: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
          // Add other variables to check
        }, null, 2)}
      </pre>
    </div>
  );
}
```
