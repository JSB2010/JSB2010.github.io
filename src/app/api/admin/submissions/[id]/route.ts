import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionStatus, updateSubmissionPriority, updateSubmissionTags } from '@/lib/appwrite';
import { logger } from '@/lib/appwrite';
import { z } from 'zod';
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
 * GET handler for retrieving a single submission
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return createErrorResponse(
      ErrorCodes.UNAUTHORIZED,
      'Unauthorized access',
      null,
      HttpStatus.UNAUTHORIZED
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Get submission
    const result = await getSubmissionById(id);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      submission: result.submission
    });
  } catch (error) {
    logger.error(`Error retrieving submission`, error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for updating submission status, priority, or tags
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate request body
    const updateSchema = z.object({
      status: z.enum(['new', 'read', 'replied', 'archived']).optional(),
      priority: z.number().min(1).max(5).optional(),
      tags: z.array(z.string()).optional()
    });

    const validationResult = updateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request body',
          details: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const { status, priority, tags } = validationResult.data;

    // Track what was updated
    const updates: string[] = [];
    let result: any = { success: true };

    // Update status if provided
    if (status) {
      const statusResult = await updateSubmissionStatus(id, status);
      if (!statusResult.success) {
        return NextResponse.json(
          { success: false, error: statusResult.message },
          { status: 500 }
        );
      }
      updates.push('status');
      result.statusUpdate = statusResult;
    }

    // Update priority if provided
    if (priority !== undefined) {
      const priorityResult = await updateSubmissionPriority(id, priority);
      if (!priorityResult.success) {
        return NextResponse.json(
          { success: false, error: priorityResult.message },
          { status: 500 }
        );
      }
      updates.push('priority');
      result.priorityUpdate = priorityResult;
    }

    // Update tags if provided
    if (tags) {
      const tagsResult = await updateSubmissionTags(id, tags);
      if (!tagsResult.success) {
        return NextResponse.json(
          { success: false, error: tagsResult.message },
          { status: 500 }
        );
      }
      updates.push('tags');
      result.tagsUpdate = tagsResult;
    }

    // If nothing was updated
    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No updates provided' },
        { status: 400 }
      );
    }

    // Get updated submission
    const updatedSubmission = await getSubmissionById(id);

    return NextResponse.json({
      success: true,
      message: `Updated submission ${updates.join(', ')}`,
      updates,
      submission: updatedSubmission.success ? updatedSubmission.submission : null
    });
  } catch (error) {
    logger.error(`Error updating submission`, error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}
