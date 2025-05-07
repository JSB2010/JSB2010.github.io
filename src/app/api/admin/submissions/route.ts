import { NextRequest } from 'next/server';
// Import appwrite SDK directly since we don't have a local wrapper
import { Client, Databases, Query } from 'appwrite';
import { logger } from '@/lib/logger';
import { env } from '@/lib/env';
import {
  createSuccessResponse,
  createErrorResponse,
  createCorsResponse,
  ErrorCodes,
  HttpStatus
} from '@/lib/api/response';

// Simple admin authentication check
const ADMIN_API_KEY = env.ADMIN_API_KEY;

/**
 * Check if the request is authenticated
 */
function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === ADMIN_API_KEY;
}

/**
 * GET handler for retrieving submissions
 */
export async function GET(request: NextRequest) {  // Check authentication
  if (!isAuthenticated(request)) {
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Unauthorized access',
      null,
      HttpStatus.UNAUTHORIZED
    );
  }

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const orderBy = searchParams.get('orderBy') || '$createdAt';
    const orderType = searchParams.get('orderType') || 'desc';

    // Build queries
    const queries = [];

    // Add filters
    if (status) {
      queries.push(Query.equal('status', status));
    }

    if (priority) {
      queries.push(Query.equal('priority', parseInt(priority, 10)));
    }

    // Add pagination
    queries.push(Query.limit(limit));
    if (offset > 0) {
      queries.push(Query.offset(offset));
    }

    // Add ordering
    if (orderType.toLowerCase() === 'asc') {
      queries.push(Query.orderAsc(orderBy));
    } else {
      queries.push(Query.orderDesc(orderBy));
    }

    // Get submissions
    const result = await getContactFormSubmissions(limit, queries);    if (!result.success) {
      return createErrorResponse(
        ErrorCodes.DATABASE_ERROR,
        result.message || 'Failed to retrieve submissions',
        null,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }    return createSuccessResponse({
      submissions: result.submissions,
    }, {
      pagination: {
        total: result.total,
        limit,
        offset,
        hasMore: offset + limit < result.total
      }
    });
  } catch (error) {
    logger.error('Error in admin submissions API', error);    return createErrorResponse(
      ErrorCodes.SERVER_ERROR,
      'Error retrieving submissions',
      { message: error instanceof Error ? error.message : 'Unknown error occurred' },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return createCorsResponse('GET, OPTIONS');
}
