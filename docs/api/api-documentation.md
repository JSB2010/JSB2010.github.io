# API Documentation

This document provides detailed information about the API endpoints available in the Jacob Barkin Portfolio website, including request/response examples and error handling.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Contact Form API](#contact-form-api)
  - [Submit Contact Form](#submit-contact-form)
- [Admin API](#admin-api)
  - [List Submissions](#list-submissions)
  - [Get Submission](#get-submission)
  - [Update Submission](#update-submission)
- [Appwrite Integration](#appwrite-integration)
  - [Direct Appwrite API Usage](#direct-appwrite-api-usage)
  - [Appwrite Functions](#appwrite-functions)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [CORS Configuration](#cors-configuration)

## Overview

The Jacob Barkin Portfolio website provides several API endpoints for handling contact form submissions and managing the admin dashboard. These endpoints are implemented using Next.js API routes and Appwrite backend services.

### Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://jacobbarkin.com/api`

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "message": "Optional message explaining the result",
  "data": {
    // Response data (if applicable)
  },
  "error": {
    // Error details (if applicable)
  }
}
```

## Authentication

### Admin API Authentication

The Admin API endpoints require authentication using an API key.

**Authentication Header**:
```
x-api-key: YOUR_API_KEY
```

The API key is set in the `ADMIN_API_KEY` environment variable.

### Appwrite Authentication

For direct Appwrite API access, the admin dashboard uses email/password authentication through Appwrite's authentication service.

## Contact Form API

### Submit Contact Form

Submits a new contact form entry.

**Endpoint**: `POST /api/contact-unified`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'd like to discuss a project.",
  "phone": "123-456-7890" // Optional
}
```

**Successful Response** (200 OK):
```json
{
  "success": true,
  "message": "Contact form submission received",
  "data": {
    "id": "unique-document-id",
    "timestamp": "2023-05-15T12:34:56.789Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Validation error",
  "error": {
    "code": "validation_error",
    "details": {
      "name": ["Name is required"],
      "email": ["Invalid email address"]
    }
  }
}
```

**Error Response** (429 Too Many Requests):
```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "error": {
    "code": "rate_limit_exceeded",
    "details": {
      "retryAfter": 60
    }
  }
}
```

**Implementation Details**:

The contact form API uses a unified approach that supports multiple backend options:

1. **Appwrite Database Storage**:
   - Creates a document in the Appwrite database
   - Stores submission details with timestamp and status

2. **Email Notification**:
   - Triggers an Appwrite function to send an email notification
   - Formats the email with submission details

3. **Validation**:
   - Validates form data using Zod schema
   - Checks for required fields and proper formats

4. **Spam Prevention**:
   - Implements rate limiting to prevent abuse
   - Includes basic spam detection

**Code Example**:

```typescript
// src/app/api/contact-unified/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { databases, ID } from '@/lib/appwrite/config';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/response';
import { rateLimit } from '@/lib/api/rate-limiter';

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimited = await rateLimit(ip);
    
    if (rateLimited) {
      return createErrorResponse(
        'rate_limited',
        'Rate limit exceeded. Please try again later.',
        429
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate form data
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return createErrorResponse(
        'validation_error',
        'Validation error',
        400
      );
    }
    
    // Create document in Appwrite
    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!,
      ID.unique(),
      {
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
        phone: result.data.phone || '',
        timestamp: new Date().toISOString(),
        status: 'unread'
      }
    );
    
    // Trigger email notification function
    // Implementation details...
    
    return createSuccessResponse({
      id: document.$id,
      timestamp: document.timestamp
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return createErrorResponse(
      'server_error',
      'An error occurred while processing your submission',
      500
    );
  }
}
```

## Admin API

### List Submissions

Retrieves a paginated list of contact form submissions.

**Endpoint**: `GET /api/admin/submissions`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (optional)
- `sort`: Sort field (default: "timestamp")
- `order`: Sort order (default: "desc")

**Authentication**: Required (API Key)

**Successful Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "unique-document-id",
        "name": "John Doe",
        "email": "john@example.com",
        "message": "Hello, I'd like to discuss a project.",
        "phone": "123-456-7890",
        "timestamp": "2023-05-15T12:34:56.789Z",
        "status": "unread"
      },
      // More submissions...
    ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Unauthorized. Invalid API key.",
  "error": {
    "code": "unauthorized"
  }
}
```

### Get Submission

Retrieves a specific contact form submission by ID.

**Endpoint**: `GET /api/admin/submissions/[id]`

**URL Parameters**:
- `id`: Submission ID

**Authentication**: Required (API Key)

**Successful Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "unique-document-id",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I'd like to discuss a project.",
    "phone": "123-456-7890",
    "timestamp": "2023-05-15T12:34:56.789Z",
    "status": "unread"
  }
}
```

**Error Response** (404 Not Found):
```json
{
  "success": false,
  "message": "Submission not found",
  "error": {
    "code": "not_found"
  }
}
```

### Update Submission

Updates a specific contact form submission.

**Endpoint**: `PATCH /api/admin/submissions/[id]`

**URL Parameters**:
- `id`: Submission ID

**Request Body**:
```json
{
  "status": "read" // Can be "unread", "read", or "archived"
}
```

**Authentication**: Required (API Key)

**Successful Response** (200 OK):
```json
{
  "success": true,
  "message": "Submission updated successfully",
  "data": {
    "id": "unique-document-id",
    "status": "read"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Invalid status value",
  "error": {
    "code": "validation_error",
    "details": {
      "status": ["Status must be one of: unread, read, archived"]
    }
  }
}
```

## Appwrite Integration

### Direct Appwrite API Usage

The website uses Appwrite's JavaScript SDK for direct API access from the client side.

**Example: Creating a Contact Form Submission**:

```typescript
import { databases, ID } from '@/lib/appwrite/config';

async function submitContactForm(formData) {
  try {
    const document = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
      ID.unique(),
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone || '',
        timestamp: new Date().toISOString(),
        status: 'unread'
      }
    );
    
    return { success: true, data: document };
  } catch (error) {
    console.error('Appwrite submission error:', error);
    return { success: false, error };
  }
}
```

### Appwrite Functions

The website uses Appwrite Functions for serverless operations like sending email notifications.

**Example: Email Notification Function**:

```javascript
// functions/email-notification-updated/src/main.js
import nodemailer from 'nodemailer';

export default async ({ req, res, log, error }) => {
  try {
    // Parse request body
    const body = JSON.parse(req.body);
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return res.json({
        success: false,
        message: 'Missing required fields'
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
    
    // Send email
    await transporter.sendMail({
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
      `
    });
    
    return res.json({
      success: true,
      message: 'Email notification sent'
    });
  } catch (err) {
    error(err.message);
    return res.json({
      success: false,
      message: 'Error sending email notification'
    }, 500);
  }
};
```

## Error Handling

The API uses a consistent error handling approach:

```typescript
// src/lib/api/error-handler.ts
import { AppwriteException } from 'appwrite';
import { ZodError } from 'zod';
import { createSuccessResponse, createErrorResponse } from './response';

export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof AppwriteException) {
    return createErrorResponse(
      error.code >= 400 ? String(error.code) : 'server_error',
      error.message,
      error.code >= 400 ? error.code : 500
    );
  }
  
  if (error instanceof ZodError) {
    return createErrorResponse('validation_error', 'Validation error', 400);
  }
  
  return createErrorResponse('server_error', 'An unexpected error occurred', 500);
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

```typescript
// src/lib/api/rate-limiter.ts
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per minute

const ipRequests = new Map<string, { count: number, timestamp: number }>();

export async function rateLimit(ip: string): Promise<boolean> {
  const now = Date.now();
  const requestData = ipRequests.get(ip) || { count: 0, timestamp: now };
  
  // Reset count if window has passed
  if (now - requestData.timestamp > RATE_LIMIT_WINDOW) {
    requestData.count = 0;
    requestData.timestamp = now;
  }
  
  // Increment count
  requestData.count++;
  ipRequests.set(ip, requestData);
  
  // Check if rate limit exceeded
  return requestData.count > MAX_REQUESTS;
}
```

## CORS Configuration

The API includes CORS configuration to allow requests from specific origins:

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'https://jacobbarkin.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```
