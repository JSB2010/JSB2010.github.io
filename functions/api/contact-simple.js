// Simple contact form handler for Cloudflare Pages
export async function onRequest(context) {
  // Log the request details
  console.log("Request method:", context.request.method);
  console.log("Request URL:", context.request.url);
  
  // Set CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  
  // Handle OPTIONS requests (CORS preflight)
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }
  
  // Only allow POST requests
  if (context.request.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed",
        method: context.request.method
      }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
  
  try {
    // Parse the request body
    const formData = await context.request.json();
    console.log("Form data received:", JSON.stringify(formData));
    
    // Return a success response (without actually submitting to Appwrite yet)
    return new Response(
      JSON.stringify({
        success: true,
        message: "Form data received successfully",
        data: formData,
        id: `test-${Date.now()}`
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error processing form data:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process form data",
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
}
