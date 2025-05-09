# Environment Configuration Guide

This document explains how environment variables are used in the jacobbarkin.com project.

## Environment Files

The project uses the following environment files:

1. `.env.example` - Template file with example values (safe to commit)
2. `.env` - Main environment file for development (DO NOT COMMIT)
3. `.env.local` - Local overrides for development (DO NOT COMMIT)
4. `.env.development` - Development-specific settings (safe to commit)

## Setting Up Your Environment

1. Copy `.env.example` to `.env.local` for local development
2. Fill in your actual values in `.env.local`
3. For production, add the environment variables to Cloudflare Pages

## Environment Variables

### Client-Side Variables

These variables are exposed to the browser with the `NEXT_PUBLIC_` prefix:

- `NEXT_PUBLIC_APPWRITE_ENDPOINT` - Appwrite API endpoint
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID` - Appwrite project ID
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID` - Appwrite database ID
- `NEXT_PUBLIC_APPWRITE_COLLECTION_ID` - Appwrite collection ID
- `NEXT_PUBLIC_APPWRITE_FUNCTION_ID` - Appwrite function ID

### Server-Side Variables

These variables are only used on the server and are not exposed to the browser:

- `APPWRITE_ENDPOINT` - Appwrite API endpoint
- `APPWRITE_PROJECT_ID` - Appwrite project ID
- `APPWRITE_API_KEY` - Appwrite API key
- `APPWRITE_DATABASE_ID` - Appwrite database ID
- `APPWRITE_CONTACT_COLLECTION_ID` - Appwrite collection ID
- `APPWRITE_FUNCTION_ID` - Appwrite function ID
- `APPWRITE_EMAIL_FUNCTION_ID` - Appwrite email function ID
- `EMAIL_USER` - Email address for notifications
- `EMAIL_PASSWORD` - Email password (app-specific password for Gmail)
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

## Production Environment

For production, add the client-side variables to Cloudflare Pages environment variables:

1. Go to the Cloudflare Dashboard
2. Navigate to "Pages"
3. Select your project "jacobbarkin-com"
4. Click on "Settings" > "Environment variables"
5. Add the `NEXT_PUBLIC_*` variables
6. Make sure to set these for both "Production" and "Preview" environments

## Appwrite Function Environment

For the Appwrite email function, add these environment variables:

1. Go to the Appwrite Console
2. Navigate to "Functions"
3. Select your function with ID `681c08e2003d92a504ba`
4. Click on "Settings" > "Variables"
5. Add:
   - `EMAIL_USER`: jacobsamuelbarkin@gmail.com
   - `EMAIL_PASSWORD`: [Your Gmail app password]

## Security Notes

1. Never commit `.env` or `.env.local` files to your repository
2. Rotate your API keys and tokens regularly
3. Use app-specific passwords for email services, not your main password
4. For production, set these as environment variables in your hosting platform
5. Consider using a password manager to store your API keys and tokens securely
