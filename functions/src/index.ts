// functions/src/index.ts
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";

// Initialize Firebase Admin SDK
// This is usually done once, and the SDK will be available globally
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore(); // db was already defined for submitContactForm

// --- submitContactForm function (from previous step, ensure it's here) ---
export const submitContactForm = functions.https.onCall(async (data, context) => {
  console.log("Received contact form submission:", {
    name: data.name, email: data.email,
    subject: data.subject, messageLength: data.message?.length,
    uid: context.auth?.uid,
  });
  if (!data.name || typeof data.name !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "Valid 'name' required.");
  }
  // ... (rest of the submitContactForm validation and logic)
  if (!data.email || typeof data.email !== "string" || !data.email.includes("@")) {
    throw new functions.https.HttpsError("invalid-argument", "Valid 'email' required.");
  }
  if (!data.message || typeof data.message !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "Valid 'message' required.");
  }
  const submission = {
    name: data.name, email: data.email,
    subject: data.subject || "Contact Form Submission", message: data.message,
    timestamp: admin.firestore.FieldValue.serverTimestamp(), status: "unread",
    userAgent: context.rawRequest.headers["user-agent"] || null,
    source: "website-contact-form-firebase",
    ...(context.auth?.uid && { userId: context.auth.uid }),
  };
  try {
    const writeResult = await db.collection("contact-submissions").add(submission);
    console.log("Submission written to Firestore:", writeResult.id);
    // Note: Email sending is now handled by a separate Firestore trigger function.
    return { success: true, id: writeResult.id, message: "Form submitted successfully!" };
  } catch (error) {
    console.error("Error writing to Firestore:", error);
    if (error instanceof Error) {
      throw new functions.https.HttpsError("internal", "DB write failed.", error.message);
    }
    throw new functions.https.HttpsError("internal", "Unknown DB write error.");
  }
});
// --- End of submitContactForm function ---


// --- New Email Notification Function ---
// Set SendGrid API Key from environment variables
// User must set this in Firebase environment config:
// firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
// firebase functions:config:set email.to_address="your-receiving-email@example.com"
// firebase functions:config:set email.from_address="noreply@yourdomain.com" (must be a verified sender in SendGrid)

const SENDGRID_API_KEY = functions.config().sendgrid?.key;
const TO_EMAIL_ADDRESS = functions.config().email?.to_address;
const FROM_EMAIL_ADDRESS = functions.config().email?.from_address;

if (SENDGRID_API_KEY) {
    sgMail.setApiKey(SENDGRID_API_KEY);
} else {
    console.warn("SendGrid API key not set. Email notifications will not be sent.");
}

export const onNewSubmissionSendEmail = functions.firestore
    .document("contact-submissions/{submissionId}")
    .onCreate(async (snap, context) => {
        if (!SENDGRID_API_KEY || !TO_EMAIL_ADDRESS || !FROM_EMAIL_ADDRESS) {
            console.error("Missing SendGrid or email configuration. Cannot send email.");
            return null;
        }

        const submissionData = snap.data();
        if (!submissionData) {
            console.error("No data in submission document:", context.params.submissionId);
            return null;
        }

        const { name, email, subject, message, timestamp } = submissionData;
        
        let submissionTimestamp = "Not available";
        if (timestamp && typeof timestamp.toDate === 'function') {
            submissionTimestamp = timestamp.toDate().toLocaleString();
        } else if (timestamp) {
            // Fallback for potential Timestamps not yet converted by Firestore SDK (e.g. from older data)
            submissionTimestamp = new Date(timestamp._seconds * 1000).toLocaleString();
        }


        const msg = {
            to: TO_EMAIL_ADDRESS,
            from: {
                name: "Website Contact Form", // Optional: customize sender name
                email: FROM_EMAIL_ADDRESS,
            },
            subject: `New Contact Form Submission: ${subject || "No Subject"}`,
            html: `
                <p>You have a new contact form submission:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Email:</strong> ${email}</li>
                    <li><strong>Subject:</strong> ${subject || "N/A"}</li>
                    <li><strong>Message:</strong></li>
                    <p style="white-space: pre-wrap;">${message}</p>
                    <li><strong>Submitted At:</strong> ${submissionTimestamp}</li>
                    <li><strong>Submission ID:</strong> ${context.params.submissionId}</li>
                </ul>
                <p>You can view this submission in your admin dashboard.</p>
            `,
        };

        try {
            console.log(`Sending email for submission ID: ${context.params.submissionId} to ${TO_EMAIL_ADDRESS}`);
            await sgMail.send(msg);
            console.log("Email sent successfully for submission:", context.params.submissionId);
            return { success: true, message: "Email sent." };
        } catch (error: any) {
            console.error("Error sending email via SendGrid for submission:", context.params.submissionId);
            if (error.response) {
                console.error("SendGrid Error Response Body:", error.response.body);
            } else {
                console.error("SendGrid Error:", error);
            }
            // Optionally, update the Firestore document with an 'emailSentError' field
            // await snap.ref.update({ emailSentError: true, emailErrorDetails: error.toString() });
            return { success: false, error: error.toString() };
        }
    });
// --- End of Email Notification Function ---
