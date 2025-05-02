// Simple email service for contact form submissions
// This is a placeholder that logs the email content
// In production, you would use a real email service like SendGrid, Mailgun, etc.

/**
 * Send an email notification for a contact form submission
 * @param {Object} data - The contact form data
 * @param {string} data.name - The name of the person submitting the form
 * @param {string} data.email - The email of the person submitting the form
 * @param {string} data.subject - The subject of the message
 * @param {string} data.message - The message content
 * @returns {Promise<Object>} - A promise that resolves to the result of sending the email
 */
export async function sendContactFormEmail(data) {
  // In a real implementation, you would use an email service API
  // For now, we'll just log the email content
  console.log('Sending email notification for contact form submission:');
  console.log('To: Jacobsamuelbarkin@gmail.com');
  console.log(`From: ${data.name} <${data.email}>`);
  console.log(`Subject: New Contact Form Submission: ${data.subject}`);
  console.log('Body:');
  console.log(`Name: ${data.name}`);
  console.log(`Email: ${data.email}`);
  console.log(`Subject: ${data.subject}`);
  console.log(`Message: ${data.message}`);
  
  // Simulate a delay to mimic sending an email
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a success response
  return {
    success: true,
    message: 'Email notification sent successfully'
  };
}
