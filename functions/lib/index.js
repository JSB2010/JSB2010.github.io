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
exports.submitProjectFeedback = exports.getProjectViews = exports.trackProjectView = exports.submitContactForm = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer = __importStar(require("nodemailer"));
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
/**
 * Cloud Function to handle contact form submissions
 * Stores the submission in Firestore and sends an email notification
 */
exports.submitContactForm = functions.https.onCall(async (data, context) => {
    try {
        // Validate the data
        if (!data.name || !data.email || !data.subject || !data.message) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid email format');
        }
        // Create a timestamp
        const timestamp = admin.firestore.Timestamp.now();
        // Prepare the data for Firestore
        const contactData = {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            timestamp,
        };
        // Save to Firestore
        const docRef = await db.collection('contactSubmissions').add(contactData);
        // Send email notification
        await sendEmailNotification(contactData, docRef.id);
        return {
            success: true,
            message: 'Contact form submitted successfully',
            id: docRef.id,
        };
    }
    catch (error) {
        console.error('Error submitting contact form:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while processing your request');
    }
});
/**
 * Send an email notification for new contact form submissions
 */
async function sendEmailNotification(data, submissionId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        // Get email configuration from environment variables
        const emailConfig = {
            host: (_b = (_a = functions.config().email) === null || _a === void 0 ? void 0 : _a.host) !== null && _b !== void 0 ? _b : 'smtp.gmail.com',
            port: parseInt((_d = (_c = functions.config().email) === null || _c === void 0 ? void 0 : _c.port) !== null && _d !== void 0 ? _d : '587'),
            secure: ((_e = functions.config().email) === null || _e === void 0 ? void 0 : _e.secure) === 'true', // true for 465, false for other ports
            auth: {
                user: (_g = (_f = functions.config().email) === null || _f === void 0 ? void 0 : _f.user) !== null && _g !== void 0 ? _g : 'jacobsamuelbarkin@gmail.com',
                pass: (_j = (_h = functions.config().email) === null || _h === void 0 ? void 0 : _h.pass) !== null && _j !== void 0 ? _j : '', // App password from environment
            },
        };
        // Create a transporter
        const transporter = nodemailer.createTransport(emailConfig);
        // Format the date
        const formattedDate = new Date(data.timestamp.toDate()).toLocaleString();
        // Prepare email content
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
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    }
    catch (error) {
        console.error('Error sending email notification:', error);
        // Don't throw an error here, as we still want to return success for the form submission
    }
}
/**
 * Cloud Function to track project views
 * Increments a counter in Firestore for each project view
 */
exports.trackProjectView = functions.https.onCall(async (data, context) => {
    try {
        // Validate the data
        if (!data.projectId) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing project ID');
        }
        const projectId = data.projectId;
        // Reference to the project document
        const projectRef = db.collection('projectViews').doc(projectId);
        // Use a transaction to safely increment the view count
        await db.runTransaction(async (transaction) => {
            var _a, _b;
            const projectDoc = await transaction.get(projectRef);
            if (!projectDoc.exists) {
                // If the document doesn't exist, create it with an initial count of 1
                transaction.set(projectRef, {
                    views: 1,
                    lastViewed: admin.firestore.Timestamp.now()
                });
            }
            else {
                // If the document exists, increment the view count
                const currentViews = (_b = (_a = projectDoc.data()) === null || _a === void 0 ? void 0 : _a.views) !== null && _b !== void 0 ? _b : 0;
                transaction.update(projectRef, {
                    views: currentViews + 1,
                    lastViewed: admin.firestore.Timestamp.now()
                });
            }
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error tracking project view:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while tracking the project view');
    }
});
/**
 * Cloud Function to get project views
 * Returns the view count for a specific project
 */
exports.getProjectViews = functions.https.onCall(async (data, context) => {
    try {
        // Validate the data
        if (!data.projectId) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing project ID');
        }
        const projectId = data.projectId;
        // Reference to the project document
        const projectRef = db.collection('projectViews').doc(projectId);
        // Get the project document
        const projectDoc = await projectRef.get();
        if (!projectDoc.exists) {
            return { data: null };
        }
        return { data: projectDoc.data() };
    }
    catch (error) {
        console.error('Error getting project views:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while getting the project views');
    }
});
/**
 * Cloud Function to submit project feedback
 * Stores user feedback for projects in Firestore
 */
exports.submitProjectFeedback = functions.https.onCall(async (data, context) => {
    var _a, _b;
    try {
        // Validate the data
        if (!data.projectId || !data.rating || !data.feedback) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
        }
        // Validate rating (1-5)
        const rating = parseInt(data.rating);
        if (isNaN(rating) || rating < 1 || rating > 5) {
            throw new functions.https.HttpsError('invalid-argument', 'Rating must be between 1 and 5');
        }
        // Prepare the feedback data
        const feedbackData = {
            projectId: data.projectId,
            rating,
            feedback: data.feedback,
            timestamp: admin.firestore.Timestamp.now(),
            // Include user info if available
            userEmail: (_a = data.userEmail) !== null && _a !== void 0 ? _a : null,
            userName: (_b = data.userName) !== null && _b !== void 0 ? _b : null,
        };
        // Save to Firestore
        await db.collection('projectFeedback').add(feedbackData);
        return { success: true };
    }
    catch (error) {
        console.error('Error submitting project feedback:', error);
        throw new functions.https.HttpsError('internal', 'An error occurred while submitting project feedback');
    }
});
//# sourceMappingURL=index.js.map