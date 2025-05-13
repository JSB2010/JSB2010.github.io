# Security Guide

This document outlines the security measures implemented in the Jacob Barkin Portfolio website and provides guidance for maintaining and enhancing security.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Data Protection](#data-protection)
3. [API Security](#api-security)
4. [Content Security Policy](#content-security-policy)
5. [Form Security](#form-security)
6. [Dependency Management](#dependency-management)
7. [Deployment Security](#deployment-security)
8. [Security Headers](#security-headers)
9. [Security Testing](#security-testing)
10. [Incident Response](#incident-response)

## Authentication & Authorization

### Appwrite Authentication

The admin dashboard uses Appwrite authentication to secure access:

- Email/password authentication for admin users
- Session management with secure cookies
- Role-based access control for admin features

### Implementation

- Admin authentication is implemented in `src/lib/appwrite/auth.ts`
- Admin routes are protected with middleware in `src/middleware.ts`
- Role checks are performed in API routes

### Best Practices

- Use strong, unique passwords for admin accounts
- Implement multi-factor authentication when available
- Regularly review and rotate admin credentials
- Limit the number of admin users

## Data Protection

### Environment Variables

Sensitive information is stored in environment variables:

- Appwrite API keys and endpoints
- SMTP credentials for email notifications
- Other service credentials

### Implementation

- Environment variables are validated using Zod in `src/lib/env.ts`
- Different environment files for development and production
- GitHub repository secrets for CI/CD

### Best Practices

- Never commit `.env` files to the repository
- Use different API keys for development and production
- Regularly rotate API keys and credentials
- Limit the scope of API keys to only what's needed

## API Security

### Rate Limiting

API endpoints are protected with rate limiting:

- Limits the number of requests from a single IP
- Prevents brute force attacks and abuse
- Configurable limits based on endpoint sensitivity

### Implementation

- Rate limiting middleware in `src/lib/rate-limiter.ts`
- Applied to all API routes, especially contact form submissions
- Customizable limits and windows

### CORS Configuration

Cross-Origin Resource Sharing (CORS) is properly configured:

- Restricts which domains can access the API
- Prevents cross-site request forgery (CSRF)
- Configurable based on environment

### Implementation

- CORS configuration in API routes
- Proper headers for Cloudflare Pages

## Content Security Policy

A strict Content Security Policy (CSP) is implemented:

- Restricts which resources can be loaded
- Prevents cross-site scripting (XSS) attacks
- Configurable based on environment

### Implementation

- CSP headers in `public/_headers`
- Nonce-based inline script protection
- Report-only mode for testing

## Form Security

### Input Validation

All form inputs are validated:

- Client-side validation with React Hook Form and Zod
- Server-side validation in API routes
- Sanitization to prevent injection attacks

### Implementation

- Form schemas in `src/lib/schemas/`
- Validation in API routes
- Sanitization utilities in `src/lib/sanitize.ts`

### CSRF Protection

Cross-Site Request Forgery protection:

- Token-based CSRF protection
- Secure cookie handling
- Origin validation

### Implementation

- CSRF tokens in forms
- Origin checking in API routes

## Dependency Management

### Dependency Scanning

Regular scanning of dependencies for vulnerabilities:

- GitHub Dependabot for automated updates
- npm audit for vulnerability detection
- Manual review of critical dependencies

### Implementation

- Dependabot configuration in `.github/dependabot.yml`
- Security workflow in `.github/workflows/security.yml`
- Regular npm audit checks

### Best Practices

- Keep dependencies up to date
- Review security advisories
- Use lockfiles for deterministic builds
- Minimize the number of dependencies

## Deployment Security

### Cloudflare Pages

Secure deployment to Cloudflare Pages:

- HTTPS by default
- Automatic TLS certificate management
- Edge caching and protection

### Implementation

- Cloudflare Pages configuration in `wrangler.toml`
- Build and deployment workflow in `.github/workflows/cloudflare-pages.yml`

### Best Practices

- Use environment-specific variables
- Implement proper access controls
- Regular deployment testing
- Maintain deployment documentation

## Security Headers

Comprehensive security headers:

- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

### Implementation

- Headers configuration in `public/_headers`
- Cloudflare Pages configuration

## Security Testing

Regular security testing:

- Automated security scanning
- Manual penetration testing
- Dependency vulnerability scanning

### Implementation

- Security workflow in `.github/workflows/security.yml`
- CodeQL analysis for code scanning
- npm audit for dependency scanning

## Incident Response

Procedure for handling security incidents:

1. Identify and contain the incident
2. Assess the impact and severity
3. Remediate the vulnerability
4. Notify affected users if necessary
5. Document the incident and lessons learned

### Contact

For security issues, please contact:

- Email: [security@jacobbarkin.com](mailto:security@jacobbarkin.com)
- Form: [Contact Form](https://jacobbarkin.com/contact) (mark as "Security Issue")
