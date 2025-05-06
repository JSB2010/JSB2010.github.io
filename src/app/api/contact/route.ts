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
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body
    const result = contactFormSchema.safeParse(body);    if (!result.success) {
      // Return validation errors
      return createErrorResponse(
        ErrorCodes.VALIDATION_ERROR,
        'Form validation failed',
        result.error.format(),
        HttpStatus.BAD_REQUEST
      );
    }

    // Extract validated data
    const { name, email, subject, message, timestamp, source, userAgent } = result.data;

    // Log the submission
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: timestamp || new Date().toISOString()
    });

    // Send an email notification
    try {
      await sendContactFormEmail({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
        timestamp: timestamp || new Date().toISOString(),
        source: source || 'app_router_api',
        userAgent: userAgent || request.headers.get('user-agent') || 'Unknown'
      });

      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails - we don't want to block the form submission
    }    // Return a success response
    return createSuccessResponse({
      id: `app-router-${Date.now()}`,
      message: 'Form submitted successfully'
    }, {
      requestId: `req-${Date.now()}`
    });
  } catch (error) {
    console.error('Error processing contact form submission:', error);    // Return an error response
    return createErrorResponse(
      ErrorCodes.SERVER_ERROR,
      'Failed to process form submission',
      { message: error instanceof Error ? error.message : 'Unknown error' },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return createCorsResponse('POST, OPTIONS');
}