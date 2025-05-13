// Server-side proxy for Appwrite API requests to avoid CORS issues
import { NextRequest, NextResponse } from 'next/server';

// Define allowed origins for CORS
const allowedOrigins = [
  'https://jacobbarkin.com',
  'https://www.jacobbarkin.com',
  'https://jacobbarkin-com.pages.dev',
  'https://modern-redesign-shadcn.jsb2010-github-io.pages.dev',
  'http://localhost:3000',
  'http://localhost:3001'
];

// Define Appwrite API endpoint
const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6816ef35001da24d113d';

// CORS headers for preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin') || '';
  
  // Check if the origin is allowed
  if (allowedOrigins.includes(origin)) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Appwrite-Project, X-Appwrite-Key, X-Appwrite-JWT, X-Fallback-Cookies',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  return new NextResponse(null, { status: 204 });
}

// Handle all HTTP methods
export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

// Main request handler
async function handleRequest(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';
    
    // Check if the origin is allowed
    if (!allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { error: 'Origin not allowed' },
        { status: 403 }
      );
    }
    
    // Get the Appwrite API path from the URL search params
    const url = new URL(request.url);
    const appwritePath = url.searchParams.get('path');
    
    if (!appwritePath) {
      return NextResponse.json(
        { error: 'Missing Appwrite API path' },
        { status: 400 }
      );
    }
    
    // Construct the full Appwrite API URL
    const appwriteUrl = `${APPWRITE_ENDPOINT}${appwritePath}`;
    
    // Forward the request to Appwrite
    const response = await fetch(appwriteUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': APPWRITE_PROJECT_ID,
        // Forward authorization header if present
        ...(request.headers.get('Authorization') ? { 'Authorization': request.headers.get('Authorization') || '' } : {}),
        // Forward cookies if present
        ...(request.headers.get('Cookie') ? { 'Cookie': request.headers.get('Cookie') || '' } : {}),
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.text() : undefined,
    });
    
    // Get the response data
    const data = await response.text();
    
    // Create a new response with CORS headers
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Appwrite proxy error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
