// Middleware for Cloudflare Pages Functions
export async function onRequest(context) {
  // Log the request for debugging
  console.log(`${context.request.method} ${new URL(context.request.url).pathname}`);
  
  // Continue to the next handler
  return await context.next();
}
