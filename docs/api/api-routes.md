# API Routes Documentation

This document provides detailed information about the API routes available in the Jacob Barkin Portfolio website.

## Overview

The website uses Next.js API routes for server-side functionality. These routes are located in the `src/app/api` directory and follow the Next.js App Router pattern.

**Note**: For static export to Cloudflare Pages, API routes are excluded from the build. The client-side code uses Appwrite directly for most operations.

## Available API Routes

### Contact Form API

#### Unified Contact Form API

**Route**: `/api/contact-unified`
**File**: `src/app/api/contact-unified/route.ts`
**Method**: POST
**Description**: Handles contact form submissions with multiple backend options (Appwrite, Email, etc.)

**Request Body**:
```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "message": "Hello, I'd like to get in touch...",
  "phone": "123-456-7890" // Optional
}
```

**Response (Success)**:
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

**Response (Error)**:
```json
{
  "success": false,
  "message": "Error message explaining what went wrong",
  "error": {
    "code": "error-code",
    "details": "Additional error details"
  }
}
```

**Implementation Details**:
- Validates form data using Zod schema
- Implements rate limiting to prevent abuse
- Detects and blocks spam submissions
- Supports multiple backend options:
  - Appwrite database storage
  - Email notification via Appwrite function
  - Fallback to direct email sending

#### Appwrite-Specific Contact Form API

**Route**: `/api/contact-appwrite`
**File**: `src/app/api/contact-appwrite/route.ts`
**Method**: POST
**Description**: Handles contact form submissions specifically for Appwrite backend

**Request/Response**: Same as the unified API

**Implementation Details**:
- Focused specifically on Appwrite integration
- Simplified implementation for direct Appwrite usage
- Used as a fallback if the unified API fails

### Admin API

#### List Submissions

**Route**: `/api/admin/submissions`
**File**: `src/app/api/admin/submissions/route.ts`
**Method**: GET
**Description**: Retrieves contact form submissions for the admin dashboard

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (optional)
- `sort`: Sort field (default: "timestamp")
- `order`: Sort order (default: "desc")

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "unique-document-id",
        "name": "Visitor Name",
        "email": "visitor@example.com",
        "message": "Hello, I'd like to get in touch...",
        "phone": "123-456-7890",
        "timestamp": "2023-05-15T12:34:56.789Z",
        "status": "unread"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Error message explaining what went wrong"
}
```

**Authentication**:
- Requires API key authentication via `x-api-key` header
- Validates against `ADMIN_API_KEY` environment variable

#### Get Submission

**Route**: `/api/admin/submissions/[id]`
**File**: `src/app/api/admin/submissions/[id]/route.ts`
**Method**: GET
**Description**: Retrieves a specific contact form submission

**URL Parameters**:
- `id`: Submission ID

**Response (Success)**:
```json
{
  "success": true,
  "data": {
    "id": "unique-document-id",
    "name": "Visitor Name",
    "email": "visitor@example.com",
    "message": "Hello, I'd like to get in touch...",
    "phone": "123-456-7890",
    "timestamp": "2023-05-15T12:34:56.789Z",
    "status": "unread"
  }
}
```

**Response (Error)**:
```json
{
  "success": false,
  "message": "Error message explaining what went wrong"
}
```

**Authentication**:
- Requires API key authentication via `x-api-key` header
- Validates against `ADMIN_API_KEY` environment variable

#### Update Submission

**Route**: `/api/admin/submissions/[id]`
**File**: `src/app/api/admin/submissions/[id]/route.ts`
**Method**: PATCH
**Description**: Updates a specific contact form submission

**URL Parameters**:
- `id`: Submission ID

**Request Body**:
```json
{
  "status": "read" // Can be "unread", "read", or "archived"
}
```

**Response (Success)**:
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

**Response (Error)**:
```json
{
  "success": false,
  "message": "Error message explaining what went wrong"
}
```

**Authentication**:
- Requires API key authentication via `x-api-key` header
- Validates against `ADMIN_API_KEY` environment variable

## API Utilities

### Response Formatting

The API uses consistent response formatting through the `formatResponse` utility:

```typescript
// src/lib/api/response.ts
export function formatResponse(success: boolean, data?: any, message?: string, statusCode = 200) {
  const response: ApiResponse = {
    success,
    ...(message && { message }),
    ...(data && { data })
  };
  
  return Response.json(response, { status: statusCode });
}
```

### Error Handling

API routes use centralized error handling:

```typescript
// src/lib/api/error-handler.ts
export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof AppwriteException) {
    return formatResponse(false, null, error.message, error.code >= 400 ? error.code : 500);
  }
  
  if (error instanceof ZodError) {
    return formatResponse(false, null, 'Validation error', 400);
  }
  
  return formatResponse(false, null, 'An unexpected error occurred', 500);
}
```

### Rate Limiting

API routes implement rate limiting to prevent abuse:

```typescript
// src/lib/api/rate-limiter.ts
export async function rateLimit(ip: string, limit = 5, windowMs = 60000) {
  // Implementation details...
}
```

## Authentication

The admin API routes use API key authentication:

```typescript
// src/lib/api/auth.ts
export function validateApiKey(request: Request) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return false;
  }
  
  return true;
}
```

## Testing API Routes

### Manual Testing

You can test the API routes manually using tools like cURL or Postman:

```bash
# Test contact form submission
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message"}' \
  http://localhost:3000/api/contact-unified
```

### Automated Testing

The project includes tests for API routes using Jest and Supertest:

```typescript
// src/app/api/contact-unified/__tests__/route.test.ts
describe('Contact Unified API', () => {
  it('should accept valid form submissions', async () => {
    // Test implementation...
  });
  
  it('should reject submissions with missing fields', async () => {
    // Test implementation...
  });
});
```

## Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Appwrite API Documentation](https://appwrite.io/docs/apis)
- [Zod Documentation](https://zod.dev/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
