"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmailNotification = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
/**
 * Cloud Function triggered when a new document is added to the contactSubmissions collection
 * Sends an email notification with the contact form details
 */
exports.sendContactEmailNotification = (0, firestore_1.onDocumentCreated)({
    document: 'contactSubmissions/{submissionId}',
    region: 'us-east1'
}, async (event) => {
    var _a, _b;
    const snapshot = event.data;
    if (!snapshot) {
        console.log('No data associated with the event');
        return { success: false, error: 'No data associated with the event' };
    }
    const submissionId = event.params.submissionId;
    const data = snapshot.data();
    console.log(`New contact form submission detected with ID: ${submissionId}`);
    try {
        // Email configuration with your provided credentials
        const emailConfig = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'jacobsamuelbarkin@gmail.com',
                pass: 'phnv varx llta soll', // Your app password
            },
        };
        console.log('Email configuration loaded:', {
            host: emailConfig.host,
            port: emailConfig.port,
            secure: emailConfig.secure,
            user: emailConfig.auth.user,
            // Don't log the password
        });
        // Create a transporter
        console.log('Creating nodemailer transporter...');
        const transporter = nodemailer.createTransport(emailConfig);
        // Verify SMTP connection configuration
        console.log('Verifying SMTP connection...');
        try {
            await transporter.verify();
            console.log('SMTP connection verified successfully');
        }
        catch (verifyError) {
            console.error('SMTP connection verification failed:', verifyError);
            throw new Error(`SMTP verification failed: ${(_a = verifyError.message) !== null && _a !== void 0 ? _a : 'Unknown error'}`);
        }
        // Format the date
        const timestamp = data.timestamp instanceof admin.firestore.Timestamp
            ? data.timestamp.toDate()
            : new Date(((_b = data.timestamp) === null || _b === void 0 ? void 0 : _b._seconds) * 1000 || Date.now());
        const formattedDate = timestamp.toLocaleString();
        console.log('Formatted date:', formattedDate);
        // Prepare email content
        console.log('Preparing email content...');
        const mailOptions = {
            from: `"Jacob Barkin Website" <${emailConfig.auth.user}>`,
            to: 'jacobsamuelbarkin@gmail.com', // Your email address
            replyTo: data.email,
            subject: `New Contact Form: ${data.subject}`,
            text: `
          New contact form submission from your website:

          Name: ${data.name}
          Email: ${data.email}
          Subject: ${data.subject}

          Message:
          ${data.message}

          Submission ID: ${submissionId}
          Timestamp: ${formattedDate}
        `,
            html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line;">${data.message}</p>
          <hr>
          <p><small>Submission ID: ${submissionId}</small></p>
          <p><small>Timestamp: ${formattedDate}</small></p>
        `,
        };
        console.log('Email content prepared');
        // Send the email
        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully', info.messageId);
        return { success: true, messageId: info.messageId };
    }
    catch (error) {
        console.error('Error sending email notification:', error);
        // Log detailed error information for debugging
        if (error.code) {
            console.error('Error code:', error.code);
        }
        if (error.message) {
            console.error('Error message:', error.message);
        }
        if (error.response) {
            console.error('SMTP Response:', error.response);
        }
        // Return the error but don't throw - this prevents the function from retrying
        return { success: false, error: error.message };
    }
});
//# sourceMappingURL=contact-email-trigger.js.map