import { NextResponse } from 'next/server';

/**
 * Standard API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  };
}

/**
 * Creates a successful API response
 * @param data - The data to return
 * @param meta - Additional metadata
 * @param status - HTTP status code (default: 200)
 * @returns NextResponse with standardized format
 */
export function createSuccessResponse<T = any>(
  data: T,
  meta?: Omit<ApiResponse['meta'], 'timestamp'>,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status }
  );
}

/**
 * Creates an error API response
 * @param code - Error code
 * @param message - Error message
 * @param details - Additional error details
 * @param status - HTTP status code (default: 400)
 * @returns NextResponse with standardized format
 */
export function createErrorResponse(
  code: string,
  message: string,
  details?: any,
  status = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Common error codes for consistent error responses
 */
export const ErrorCodes = {
  VALIDATION_ERROR: 'validation_error',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  NOT_FOUND: 'not_found',
  RATE_LIMITED: 'rate_limited',
  SPAM_DETECTED: 'spam_detected',
  DATABASE_ERROR: 'database_error',
  EMAIL_ERROR: 'email_error',
  SERVER_ERROR: 'server_error',
};

/**
 * Predefined HTTP status codes
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

/**
 * Creates a standard CORS response for OPTIONS requests
 * @param allowedMethods - HTTP methods to allow
 * @returns NextResponse with CORS headers
 */
export function createCorsResponse(
  allowedMethods = 'GET, POST, PUT, DELETE, OPTIONS'
): NextResponse {
  return NextResponse.json(
    null,
    {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': allowedMethods,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    }
  );
}
