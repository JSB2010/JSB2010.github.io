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

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

// Provide static params for build time
export function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

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
  // For static export, return a placeholder response
  return NextResponse.json({
    success: true,
    submission: {
      $id: params.id,
      name: "Static Export Placeholder",
      email: "placeholder@example.com",
      subject: "This is a static export placeholder",
      message: "This is a placeholder message for static export.",
      timestamp: new Date().toISOString(),
      status: 'new',
      priority: 3,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString()
    }
  });
}

/**
 * PATCH handler for updating submission status, priority, or tags
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // For static export, return a placeholder success response
  return NextResponse.json({
    success: true,
    message: "This is a placeholder response for static export",
    updates: ["status", "priority", "tags"],
    submission: {
      $id: params.id,
      name: "Static Export Placeholder",
      email: "placeholder@example.com",
      subject: "This is a static export placeholder",
      message: "This is a placeholder message for static export.",
      timestamp: new Date().toISOString(),
      status: 'read',
      priority: 3,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString()
    }
  });
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
