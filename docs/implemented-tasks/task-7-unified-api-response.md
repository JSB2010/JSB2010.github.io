# Task #7: Create a unified API response format for all API endpoints

This task has been implemented to standardize API responses across all endpoints, improving consistency, predictability, and making it easier to handle responses on the client side.

## Implementation Details

### 1. Created a centralized API response utility

A new utility file `src/lib/api/response.ts` has been created with standardized functions and interfaces for API responses:

- `ApiResponse<T>` interface for type-safe responses
- `createSuccessResponse<T>()` function for successful responses
- `createErrorResponse()` function for error responses
- `createCorsResponse()` function for OPTIONS requests (CORS)
- `ErrorCodes` object with standardized error codes
- `HttpStatus` object with HTTP status code constants

### 2. Updated API routes to use the unified format

The following API routes have been updated to use the new response format:

- `src/app/api/contact-unified/route.ts` - Main unified contact form submission API
- `src/app/api/contact-appwrite/route.ts` - Appwrite-specific contact form submission API
- `src/app/api/contact/route.ts` - Basic contact form submission API
- `src/app/api/admin/submissions/route.ts` - Admin API for listing submissions
- `src/app/api/admin/submissions/[id]/route.ts` (partial) - Admin API for managing individual submissions

### 3. Standardized API Response Structure

All API responses now follow a consistent structure:

#### Success Response Format

```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  },
  "meta": {
    "timestamp": "2023-05-01T12:34:56.789Z",
    "requestId": "req-123456789",
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "validation_error",
    "message": "Form validation failed",
    "details": {
      // Error details specific to the error type
    }
  },
  "meta": {
    "timestamp": "2023-05-01T12:34:56.789Z"
  }
}
```

### 4. Standardized Error Codes

Added consistent error codes across all API endpoints:

- `validation_error` - For validation failures
- `unauthorized` - For authentication failures
- `forbidden` - For permission issues
- `not_found` - For missing resources
- `rate_limited` - For rate limiting
- `spam_detected` - For spam detection
- `database_error` - For database operation failures
- `email_error` - For email sending failures
- `server_error` - For general server errors

### 5. Standardized HTTP Status Codes

Ensured consistent HTTP status code usage with the `HttpStatus` constants:

- `OK: 200` - For successful responses
- `CREATED: 201` - For successful resource creation
- `NO_CONTENT: 204` - For successful responses with no content
- `BAD_REQUEST: 400` - For invalid requests
- `UNAUTHORIZED: 401` - For authentication failures
- `FORBIDDEN: 403` - For permission issues
- `NOT_FOUND: 404` - For missing resources
- `CONFLICT: 409` - For resource conflicts
- `TOO_MANY_REQUESTS: 429` - For rate limiting
- `INTERNAL_SERVER_ERROR: 500` - For server errors
- `SERVICE_UNAVAILABLE: 503` - For temporary unavailability

### 6. Standardized CORS Handling

Implemented a consistent approach to handling CORS preflight requests with the `createCorsResponse` function.

## Benefits

1. **Consistency**: All API endpoints now respond with the same structure, making it easier for clients to process responses.
2. **Predictability**: Error handling is now consistent across endpoints, with standardized error codes and messages.
3. **Maintainability**: Centralized response creation makes it easier to update the response format in the future.
4. **Type Safety**: TypeScript interfaces for responses ensure type safety and better IDE support.
5. **Better Error Handling**: Standardized error codes make it easier to handle different error cases on the client.
6. **Improved Metadata**: Added metadata like timestamps and request IDs for better debugging and monitoring.

## Next Steps

- Update documentation for all API endpoints to reflect the new response format
- Create client-side utilities for handling the standardized responses
- Add response format versioning for future changes
