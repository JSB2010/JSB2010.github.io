// Simple email notification function
// This is a placeholder - in a real implementation, you would use a proper email service

export async function formatEmailBody(data) {
  return `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'Contact Form Submission'}

Message:
${data.message}

Timestamp: ${data.timestamp}
Source: ${data.source}
IP Address: ${data.ipAddress}
User Agent: ${data.userAgent}
`;
}

export async function sendEmailNotification(data) {
  // In a real implementation, you would use an email service like SendGrid, Mailgun, etc.
  // For now, we'll just log the email content
  const emailBody = await formatEmailBody(data);
  
  console.log('Email notification would be sent with the following content:');
  console.log(emailBody);
  
  // Return success
  return {
    success: true,
    message: 'Email notification would be sent (simulated)'
  };
}
