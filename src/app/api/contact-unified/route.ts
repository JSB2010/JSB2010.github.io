// Unified App Router API route for contact form submissions
// This route handles both regular and Appwrite submissions
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { Client, Databases, ID } from 'appwrite';
import { validateEmail } from '@/lib/email-service';
import { EmailTemplateType } from '@/lib/email-templates';
import { queueEmail } from '@/lib/email-queue';
import { incrementRateLimit } from '@/lib/rate-limiter';
import { detectSpam } from '@/lib/spam-detector';
import { logger } from '@/lib/appwrite';
import { env } from '@/lib/env';
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
  userAgent: z.string().optional(),
  method: z.enum(['appwrite', 'email', 'api']).optional()
});

// Initialize Appwrite client (server-side)
const initAppwrite = () => {
  const client = new Client();

  client
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY || ''); // Server API key

  return {
    client,
    databases: new Databases(client)
  };
};

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
    const { name, email, subject, message, timestamp, source, userAgent, method = 'api' } = result.data;

    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';

    // Apply rate limiting based on IP address and email
    // This helps prevent abuse of the contact form
    const ipRateLimit = incrementRateLimit(`ip:${ipAddress}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5 // 5 requests per hour per IP
    });

    const emailRateLimit = incrementRateLimit(`email:${email}`, {
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      maxRequests: 10 // 10 requests per day per email
    });

    // Check if rate limited
    if (ipRateLimit.isLimited || emailRateLimit.isLimited) {
      logger.warn('Rate limit exceeded', { 
        ipAddress, 
        email,
        ipLimit: ipRateLimit,
        emailLimit: emailRateLimit
      });      // Return rate limit error
      return createErrorResponse(
        ErrorCodes.RATE_LIMITED,
        'Too many requests. Please try again later.',
        { 
          resetTime: new Date(Math.max(
            ipRateLimit.resetTime.getTime(),
            emailRateLimit.resetTime.getTime()
          )).toISOString() 
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Check for spam
    const spamResult = detectSpam({
      name,
      email,
      subject,
      message,
      // Include any honeypot fields from the request
      ...body
    });

    if (spamResult.isSpam) {
      logger.warn('Spam submission rejected', { 
        email,
        score: spamResult.score,
        reasons: spamResult.reasons
      });      // Return a 200 status to avoid giving feedback to spammers
      // but don't actually process the submission
      return createSuccessResponse({
        id: `spam-${Date.now()}`,
        message: 'Form submitted successfully'
      });
    }

    // Prepare submission data
    const submissionData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || request.headers.get('user-agent') || 'Unknown',
      source: source || 'unified_api',
      ipAddress,
      method
    };

    // Log the submission
    logger.info('Contact form submission (Unified API):', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: submissionData.timestamp,
      method
    });

    let documentId = `unified-${Date.now()}`;

    // If method is appwrite, submit to Appwrite Database
    if (method === 'appwrite') {
      try {
        logger.info('Submitting to Appwrite...');

        // Initialize Appwrite
        const { databases } = initAppwrite();

        const databaseId = env.APPWRITE_DATABASE_ID;
        const collectionId = env.APPWRITE_CONTACT_COLLECTION_ID;

        const document = await databases.createDocument(
          databaseId,
          collectionId,
          ID.unique(),
          submissionData
        );

        documentId = document.$id;
        logger.info(`Successfully submitted to Appwrite with ID: ${documentId}`);
      } catch (appwriteError) {
        logger.error('Error submitting to Appwrite:', appwriteError);
        // Fall back to API method if Appwrite fails
        logger.info('Falling back to API method...');
      }
    }

    // Process email notifications
    try {
      // Validate email before sending
      if (!validateEmail(email)) {
        logger.warn('Invalid email address, skipping email notification', { email });
      } else {
        // Prepare email data
        const emailData = {
          name,
          email,
          subject: subject || 'Contact Form Submission',
          message,
          timestamp: submissionData.timestamp,
          source: submissionData.source,
          ipAddress,
          userAgent: submissionData.userAgent
        };

        // Determine if we should send a copy to the user based on method
        const sendUserCopy = method === 'email';

        // Queue the email instead of sending directly
        // This helps with handling high volumes and prevents blocking the API response
        const queueId = queueEmail(
          emailData,
          EmailTemplateType.ADMIN_NOTIFICATION,
          sendUserCopy,
          // Higher priority for direct email method
          method === 'email' ? 2 : 1
        );

        logger.info('Email notification queued successfully', { 
          queueId, 
          method,
          sendUserCopy
        });
      }
    } catch (emailError) {
      logger.error('Error queueing email notification:', emailError);
      // Continue even if email queueing fails - we don't want to block the form submission
    }    // Return a success response
    return createSuccessResponse({
      id: documentId,
      method,
      message: 'Form submitted successfully'
    }, {
      requestId: `req-${Date.now()}`
    });
  } catch (error) {
    logger.error('Error processing contact form submission:', error);    // Return an error response
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
