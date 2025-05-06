import { EmailData } from './email-service';

/**
 * Email template types
 */
export enum EmailTemplateType {
  CONTACT_FORM_SUBMISSION = 'contact_form_submission',
  ADMIN_NOTIFICATION = 'admin_notification',
  USER_CONFIRMATION = 'user_confirmation',
}

/**
 * Interface for email template data
 */
export interface EmailTemplateData extends EmailData {
  templateType?: EmailTemplateType;
  adminName?: string;
  websiteName?: string;
  contactPageUrl?: string;
}

/**
 * Get email subject based on template type
 */
export function getEmailSubject(data: EmailTemplateData): string {
  const websiteName = data.websiteName || 'Jacob Barkin Portfolio';
  
  switch (data.templateType) {
    case EmailTemplateType.ADMIN_NOTIFICATION:
      return `New Contact Form Submission: ${data.subject || 'Contact Form Submission'}`;
    
    case EmailTemplateType.USER_CONFIRMATION:
      return `Thank you for contacting ${websiteName}`;
    
    case EmailTemplateType.CONTACT_FORM_SUBMISSION:
    default:
      return `New Contact Form Submission: ${data.subject || 'Contact Form Submission'}`;
  }
}

/**
 * Get plain text email body based on template type
 */
export function getPlainTextEmailBody(data: EmailTemplateData): string {
  const websiteName = data.websiteName || 'Jacob Barkin Portfolio';
  const adminName = data.adminName || 'Jacob Barkin';
  
  switch (data.templateType) {
    case EmailTemplateType.ADMIN_NOTIFICATION:
      return `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'Contact Form Submission'}

Message:
${data.message}

Timestamp: ${data.timestamp || new Date().toISOString()}
Source: ${data.source || 'website_contact_form'}
IP Address: ${data.ipAddress || 'Unknown'}
User Agent: ${data.userAgent || 'Unknown'}

This email was sent automatically from your website contact form.
`;
    
    case EmailTemplateType.USER_CONFIRMATION:
      return `
Hello ${data.name},

Thank you for contacting ${websiteName}. I have received your message and will get back to you as soon as possible.

Here's a copy of your message:

Subject: ${data.subject || 'Contact Form Submission'}
Message:
${data.message}

Best regards,
${adminName}
`;
    
    case EmailTemplateType.CONTACT_FORM_SUBMISSION:
    default:
      return `
New contact form submission:

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'Contact Form Submission'}

Message:
${data.message}

Timestamp: ${data.timestamp || new Date().toISOString()}
Source: ${data.source || 'website_contact_form'}
IP Address: ${data.ipAddress || 'Unknown'}
User Agent: ${data.userAgent || 'Unknown'}
`;
  }
}

/**
 * Get HTML email body based on template type
 */
export function getHtmlEmailBody(data: EmailTemplateData): string {
  const websiteName = data.websiteName || 'Jacob Barkin Portfolio';
  const adminName = data.adminName || 'Jacob Barkin';
  const contactPageUrl = data.contactPageUrl || 'https://jacobbarkin.com/contact';
  
  switch (data.templateType) {
    case EmailTemplateType.ADMIN_NOTIFICATION:
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4a6cf7; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
    .message { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4a6cf7; margin: 15px 0; }
    .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
    .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; width: 120px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Contact Form Submission</h2>
  </div>
  <div class="content">
    <p>You have received a new contact form submission:</p>
    
    <table class="info-table">
      <tr>
        <td>Name:</td>
        <td>${data.name}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td>Subject:</td>
        <td>${data.subject || 'Contact Form Submission'}</td>
      </tr>
      <tr>
        <td>Timestamp:</td>
        <td>${data.timestamp || new Date().toISOString()}</td>
      </tr>
    </table>
    
    <p><strong>Message:</strong></p>
    <div class="message">
      ${data.message.replace(/\n/g, '<br>')}
    </div>
    
    <p><strong>Additional Information:</strong></p>
    <table class="info-table">
      <tr>
        <td>Source:</td>
        <td>${data.source || 'website_contact_form'}</td>
      </tr>
      <tr>
        <td>IP Address:</td>
        <td>${data.ipAddress || 'Unknown'}</td>
      </tr>
      <tr>
        <td>User Agent:</td>
        <td>${data.userAgent || 'Unknown'}</td>
      </tr>
    </table>
  </div>
  <div class="footer">
    <p>This email was sent automatically from your website contact form.</p>
  </div>
</body>
</html>
`;
    
    case EmailTemplateType.USER_CONFIRMATION:
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Us</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4a6cf7; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
    .message { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4a6cf7; margin: 15px 0; }
    .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h2>Thank You for Contacting ${websiteName}</h2>
  </div>
  <div class="content">
    <p>Hello ${data.name},</p>
    
    <p>Thank you for contacting ${websiteName}. I have received your message and will get back to you as soon as possible.</p>
    
    <p><strong>Here's a copy of your message:</strong></p>
    <p><strong>Subject:</strong> ${data.subject || 'Contact Form Submission'}</p>
    <div class="message">
      ${data.message.replace(/\n/g, '<br>')}
    </div>
    
    <p>If you have any additional questions or information, please don't hesitate to reply to this email.</p>
    
    <p>Best regards,<br>${adminName}</p>
  </div>
  <div class="footer">
    <p>This is an automated response to your contact form submission at <a href="${contactPageUrl}">${websiteName}</a>.</p>
  </div>
</body>
</html>
`;
    
    case EmailTemplateType.CONTACT_FORM_SUBMISSION:
    default:
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4a6cf7; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }
    .message { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4a6cf7; margin: 15px 0; }
    .footer { margin-top: 20px; font-size: 12px; color: #777; text-align: center; }
    .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .info-table td { padding: 8px; border-bottom: 1px solid #eee; }
    .info-table td:first-child { font-weight: bold; width: 120px; }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Contact Form Submission</h2>
  </div>
  <div class="content">
    <p>You have received a new contact form submission:</p>
    
    <table class="info-table">
      <tr>
        <td>Name:</td>
        <td>${data.name}</td>
      </tr>
      <tr>
        <td>Email:</td>
        <td><a href="mailto:${data.email}">${data.email}</a></td>
      </tr>
      <tr>
        <td>Subject:</td>
        <td>${data.subject || 'Contact Form Submission'}</td>
      </tr>
    </table>
    
    <p><strong>Message:</strong></p>
    <div class="message">
      ${data.message.replace(/\n/g, '<br>')}
    </div>
  </div>
  <div class="footer">
    <p>This email was sent automatically from your website contact form.</p>
  </div>
</body>
</html>
`;
  }
}