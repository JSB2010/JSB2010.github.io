import nodemailer from 'nodemailer';
import { logger } from '@/lib/appwrite';
import { 
  EmailTemplateType, 
  EmailTemplateData, 
  getEmailSubject, 
  getPlainTextEmailBody, 
  getHtmlEmailBody 
} from './email-templates';
import { env } from '@/lib/env';

// Types for email service
export interface EmailData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  timestamp?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Validates an email address format and checks for disposable domains
 * @param email The email address to validate
 * @returns An object containing validation result and error message if any
 */
export function validateEmail(email: string): { valid: boolean; reason?: string } {
  // Simple regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }

  // Simple check for disposable email domains
  const disposableDomains = [
    'tempmail.com', 'throwawaymail.com', 'mailinator.com', 'guerrillamail.com',
    'yopmail.com', 'maildrop.cc', 'temp-mail.org', 'fake-email.com'
  ];
  
  const domain = email.split('@')[1].toLowerCase();
  if (disposableDomains.includes(domain)) {
    return { valid: false, reason: 'Disposable email domains are not allowed' };
  }

  return { valid: true };
}

// Email configuration
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD || '' // Should be set in environment variables
  }
};

/**
 * Format email body for contact form submission
 * @deprecated Use getPlainTextEmailBody from email-templates.ts instead
 */
export function formatEmailBody(data: EmailData): string {
  return getPlainTextEmailBody({
    ...data,
    templateType: EmailTemplateType.CONTACT_FORM_SUBMISSION
  });
}

/**
 * Send email notification for contact form submission
 * This function will be called from the API routes
 * @param data The email data
 * @param templateType The type of email template to use
 * @param sendUserCopy Whether to send a copy to the user
 */
export async function sendContactFormEmail(
  data: EmailData, 
  templateType: EmailTemplateType = EmailTemplateType.ADMIN_NOTIFICATION,
  sendUserCopy: boolean = false
): Promise<{ success: boolean; message: string; messageId?: string; deliveryStatus?: string }> {
  try {
    // Check if we're in a test/development environment
    if (env.NODE_ENV === 'development' && !env.EMAIL_PASSWORD) {
      // Log the email content in development mode if no password is set
      const templateData: EmailTemplateData = {
        ...data,
        templateType
      };

      logger.info('Email notification would be sent (development mode):', {
        to: emailConfig.auth.user,
        subject: getEmailSubject(templateData),
        templateType,
        sendUserCopy
      });

      return {
        success: true,
        message: 'Email notification simulated in development mode'
      };
    }

    // Create email transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Prepare template data
    const templateData: EmailTemplateData = {
      ...data,
      templateType
    };

    // Format the email subject and content
    const subject = getEmailSubject(templateData);
    const text = getPlainTextEmailBody(templateData);
    const html = getHtmlEmailBody(templateData);

    // Send the email to admin
    logger.info('Sending email notification to admin...');
    const info = await transporter.sendMail({
      from: `"Website Contact Form" <${emailConfig.auth.user}>`,
      to: emailConfig.auth.user,
      replyTo: data.email,
      subject: subject,
      text: text,
      html: html
    });

    logger.info('Email sent successfully to admin:', { 
      messageId: info.messageId,
      response: info.response
    });

    // Send a copy to the user if requested
    if (sendUserCopy && validateEmail(data.email)) {
      try {
        // Prepare user confirmation template data
        const userTemplateData: EmailTemplateData = {
          ...data,
          templateType: EmailTemplateType.USER_CONFIRMATION
        };

        // Format the user email
        const userSubject = getEmailSubject(userTemplateData);
        const userText = getPlainTextEmailBody(userTemplateData);
        const userHtml = getHtmlEmailBody(userTemplateData);

        logger.info('Sending confirmation email to user...');
        const userInfo = await transporter.sendMail({
          from: `"Jacob Barkin" <${emailConfig.auth.user}>`,
          to: data.email,
          subject: userSubject,
          text: userText,
          html: userHtml
        });

        logger.info('Confirmation email sent to user:', { 
          messageId: userInfo.messageId,
          response: userInfo.response
        });
      } catch (userEmailError) {
        // Log error but don't fail the whole operation
        logger.error('Error sending confirmation email to user:', userEmailError);
      }
    }

    return {
      success: true,
      message: 'Email notification sent successfully',
      messageId: info.messageId,
      deliveryStatus: info.response
    };
  } catch (error) {
    logger.error('Error sending email notification:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error sending email'
    };
  }
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send email with retry mechanism
 * This function will retry sending the email if it fails
 */
export async function sendEmailWithRetry(
  data: EmailData, 
  maxRetries = 3
): Promise<{ success: boolean; message: string; messageId?: string }> {
  let retries = 0;
  let lastError: any = null;

  while (retries < maxRetries) {
    try {
      // Attempt to send the email
      const result = await sendContactFormEmail(data);

      if (result.success) {
        // If successful, return the result
        if (retries > 0) {
          logger.info(`Email sent successfully after ${retries} retries`);
        }
        return result;
      }

      // If not successful but no error was thrown, store the error and retry
      lastError = new Error(result.message);
    } catch (error) {
      // Store the error
      lastError = error;
    }

    // Increment retry count
    retries++;

    if (retries < maxRetries) {
      // Calculate delay with exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.pow(2, retries - 1) * 1000;
      logger.warn(`Email sending failed, retrying in ${delay}ms (attempt ${retries}/${maxRetries})`, {
        error: lastError?.message
      });

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // If we've exhausted all retries, log and return the error
  logger.error(`Failed to send email after ${maxRetries} attempts`, {
    error: lastError?.message
  });

  return {
    success: false,
    message: lastError?.message || `Failed to send email after ${maxRetries} attempts`
  };
}
