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

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

// Simple admin authentication check
const ADMIN_API_KEY = env.ADMIN_API_KEY;

// Placeholder submissions data for static export
const PLACEHOLDER_SUBMISSIONS = [
  {
    $id: "placeholder1",
    name: "John Doe",
    email: "john@example.com",
    subject: "Sample Inquiry",
    message: "This is a sample inquiry message for the static export.",
    status: "new",
    priority: 2,
    timestamp: new Date().toISOString(),
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  },
  {
    $id: "placeholder2",
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Another Example",
    message: "This is another example message for the static export.",
    status: "read",
    priority: 3,
    timestamp: new Date().toISOString(),
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  }
];

/**
 * GET handler for retrieving all submissions
 */
export async function GET(request: NextRequest) {
  // For static export, return placeholder data
  return createSuccessResponse({
    submissions: PLACEHOLDER_SUBMISSIONS,
    total: PLACEHOLDER_SUBMISSIONS.length
  });
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return createCorsResponse();
}
