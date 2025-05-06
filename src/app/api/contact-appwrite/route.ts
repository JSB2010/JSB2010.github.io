// App Router API route for contact form submissions using Appwrite
import { NextRequest } from 'next/server';
import { Client, Databases, ID } from 'appwrite';
import { sendContactFormEmail } from '@/lib/appwrite/email-service';
import { z } from 'zod';
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
  userAgent: z.string().optional()
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
    const { name, email, subject, message, timestamp, source, userAgent } = result.data;

    // Log the submission
    console.log('Contact form submission (Appwrite):', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: timestamp || new Date().toISOString()
    });

    // Initialize Appwrite
    const { databases } = initAppwrite();

    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for') || 'Unknown';

    // Prepare submission data
    const submissionData = {
      name,
      email,
      subject: subject || 'Contact Form Submission',
      message,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || request.headers.get('user-agent') || 'Unknown',
      source: source || 'app_router_appwrite_api',
      ipAddress
    };

    // Submit to Appwrite Database
    console.log('Submitting to Appwrite...');

    const databaseId = env.APPWRITE_DATABASE_ID;
    const collectionId = env.APPWRITE_CONTACT_COLLECTION_ID;

    const document = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      submissionData
    );

    console.log(`Successfully submitted to Appwrite with ID: ${document.$id}`);

    // Send an email notification
    try {
      await sendContactFormEmail({
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
        timestamp: timestamp || new Date().toISOString(),
        source: source || 'app_router_appwrite_api',
        ipAddress,
        userAgent: userAgent || request.headers.get('user-agent') || 'Unknown'
      });

      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // Continue even if email fails - we don't want to block the form submission
    }    // Return a success response
    return createSuccessResponse({
      id: document.$id,
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
