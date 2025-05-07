// Unified App Router API route for contact form submissions
// This route handles both regular and Appwrite submissions
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { Client, Databases, ID } from 'appwrite';
// Import directly from email-service
import { EmailTemplateType } from '@/lib/email-templates';
import { queueEmail } from '@/lib/email-queue';
import { incrementRateLimit } from '@/lib/rate-limiter';
import { detectSpam } from '@/lib/spam-detector';
import { logger } from '@/lib/logger';

// Configure for static export
export const dynamic = "force-static";
export const revalidate = false;

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  timestamp: z.string().optional(),
  source: z.string().optional(),
  userAgent: z.string().optional(),
  honeypot: z.string().optional()
});

// Handler for POST requests
export async function POST(request: NextRequest) {
  // For static export, return a placeholder success response
  return new Response(JSON.stringify({
    success: true,
    message: "This is a placeholder response for static export"
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
