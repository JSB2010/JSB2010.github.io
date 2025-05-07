// App Router API route for contact form submissions
import { NextRequest } from 'next/server';
import { sendContactFormEmail } from '@/lib/email-service';
import { z } from 'zod';
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

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  timestamp: z.string().optional(),
  source: z.string().optional(),
  userAgent: z.string().optional()
});

export async function POST(request: NextRequest) {
  // For static export, return a simple placeholder response
  return createSuccessResponse({
    message: "This is a placeholder response for static export"
  });
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return createCorsResponse();
}
