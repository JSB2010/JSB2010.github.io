# Cloudflare Pages Deployment Guide

This document provides detailed instructions for deploying the Jacob Barkin Portfolio website to Cloudflare Pages.

## Overview

[Cloudflare Pages](https://pages.cloudflare.com/) is a JAMstack platform for frontend developers to collaborate and deploy websites. It offers:

- Global CDN distribution
- Automatic HTTPS
- Continuous deployment from Git
- Preview deployments for pull requests
- Custom domains
- Environment variables

## Prerequisites

- Cloudflare account
- GitHub repository with your project
- Cloudflare API token with Pages permissions (for GitHub Actions deployment)

## Deployment Methods

There are two primary methods for deploying to Cloudflare Pages:

1. **Direct GitHub Integration**: Cloudflare Pages connects to your GitHub repository and automatically deploys when changes are pushed.
2. **GitHub Actions Deployment**: A GitHub Actions workflow deploys to Cloudflare Pages using the Cloudflare API.

This project uses the GitHub Actions method for more control over the build and deployment process.

## GitHub Actions Deployment

### Workflow Configuration

The GitHub Actions workflow is defined in `.github/workflows/cloudflare-pages.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Upload build output
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: out

  deploy:
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: build-output
          path: out
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: jacobbarkin-com
          directory: out
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Required Secrets

Add the following secrets to your GitHub repository:

1. `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages permissions
2. `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Environment Variables

Add the following environment variables to your Cloudflare Pages project:

1. `NEXT_PUBLIC_APPWRITE_ENDPOINT`: Appwrite API endpoint
2. `NEXT_PUBLIC_APPWRITE_PROJECT_ID`: Appwrite project ID
3. `NEXT_PUBLIC_APPWRITE_DATABASE_ID`: Appwrite database ID
4. `NEXT_PUBLIC_APPWRITE_COLLECTION_ID`: Appwrite collection ID
5. `NEXT_PUBLIC_APPWRITE_FUNCTION_ID`: Appwrite function ID

## Manual Cloudflare Setup

If you prefer to set up Cloudflare Pages manually:

1. **Create a Cloudflare Pages Project**:
   - Log in to the Cloudflare Dashboard
   - Navigate to Pages > Create a project
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: 18.x (or later)

3. **Add Environment Variables**:
   - Add all `NEXT_PUBLIC_*` variables from your `.env.local`
   - Make sure to set these for both "Production" and "Preview" environments

4. **Configure Custom Domain**:
   - In Cloudflare Pages, go to your project > Custom domains
   - Add your domain (e.g., `jacobbarkin.com`)
   - Configure DNS settings as instructed by Cloudflare
   - Enable HTTPS with Cloudflare's SSL certificate

## Custom Headers and Redirects

### Custom Headers

The project includes custom headers for caching and security in `public/_headers`:

```
# Cache static assets for 1 year
/images/*
  Cache-Control: public, max-age=31536000, immutable

# Cache JS and CSS for 1 week, stale while revalidate for 1 day
/_next/static/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400

# Cache HTML pages for 1 hour
/*
  Cache-Control: public, max-age=3600, must-revalidate

# Security headers for all pages
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://nyc.cloud.appwrite.io;
```

### Redirects

The project includes redirects for SPA routing in `public/_redirects`:

```
# Specific routes for SPA pages
/about              /about/index.html    200
/projects           /projects/index.html 200
/contact            /contact/index.html  200
/admin              /admin/index.html    200

# Assets should be served directly
/_next/*            /_next/:splat  200
/images/*           /images/:splat 200
/fonts/*            /fonts/:splat  200

# Fallback for all other routes
/*                  /index.html    200
```

## Performance Optimizations

### Caching Strategy

The website uses a comprehensive caching strategy:

- **Static assets** (images): Cache for 1 year (immutable)
- **JavaScript/CSS**: Cache for 1 week with stale-while-revalidate for 1 day
- **HTML pages**: Cache for 1 hour with must-revalidate

### Content Security Policy

The Content Security Policy (CSP) is configured to allow:

- Scripts from the same origin
- Styles from the same origin
- Images from the same origin, data URLs, and HTTPS sources
- Fonts from the same origin
- Connections to the same origin and Appwrite API

### Image Optimization

Images are optimized before deployment:

```bash
npm run optimize-all-images
```

This creates WebP versions of all images in the `public/images/optimized` directory.

## Monitoring and Analytics

### Cloudflare Analytics

Cloudflare provides analytics for your website:

1. Log in to the Cloudflare Dashboard
2. Navigate to Analytics > Web Analytics
3. Select your domain

### Lighthouse Performance Monitoring

The project includes a GitHub Actions workflow for monitoring performance:

```bash
npm run monitor-performance
```

This runs Lighthouse tests and generates reports in the `performance-metrics/` directory.

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check the build logs for errors
   - Verify that your dependencies are installed correctly
   - Make sure your Next.js configuration is valid

2. **Deployment Failures**:
   - Check that your Cloudflare API token has sufficient permissions
   - Verify that your account ID is correct
   - Make sure your project name matches the Cloudflare Pages project name

3. **CORS Errors**:
   - Check that your Content Security Policy allows connections to required domains
   - Verify that your Appwrite project has the correct platform settings

### Debugging

For debugging deployment issues:

```bash
# Build with verbose logging
DEBUG=* npm run build

# Deploy with verbose logging
DEBUG=* npx wrangler pages publish out
```

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)
