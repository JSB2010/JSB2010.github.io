import { NextResponse } from 'next/server';

// Define the expected request body structure
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  [key: string]: any; // Allow additional properties
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// Handle POST requests for form submissions
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Log the submission (this will appear in the server logs)
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      messageLength: body.message.length,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you would send this data to a database or email service
    // For now, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      id: `next-${Date.now()}`
    });
  } catch (error: any) {
    console.error('Error processing contact form submission:', error);
    
    return NextResponse.json({
      error: 'Failed to process form submission',
      message: error.message
    }, { status: 500 });
  }
}
