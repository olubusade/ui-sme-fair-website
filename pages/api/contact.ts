import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Define the precise type for the data received from the client
interface ContactFormData {
  name: string;      // Combined first and last name
  email: string;
  subject: string;
  message: string;
  honeyName?: string; // Honeypot
  captchaAnswer: string;
  captchaCorrectAnswer: string; // The correct answer sent from the client
}

// Define the response type
type ApiResponseData = {
    message: string;
    status: 'success' | 'error';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed', status: 'error' });
  }

  const data = req.body as ContactFormData;

  // --- 1. Security Checks (Honeypot & Captcha) ---
  if (data.honeyName) {
    // Bot detected via honeypot field
    console.warn('Bot detected via honeypot on contact form.');
    return res.status(200).json({ 
        message: 'Submission received successfully. (Bot blocked)', 
        status: 'success' 
    });
  }

  // Captcha Check
  // Note: Server-side check is crucial even if client-side check exists.
  if (parseInt(data.captchaAnswer) !== parseInt(data.captchaCorrectAnswer)) {
    return res.status(400).json({ 
        message: 'Incorrect security check answer. Please try again.', 
        status: 'error' 
    });
  }

  // --- 2. Server-Side Validation ---
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.', status: 'error' });
  }

  console.log('ddd::',data);

  // --- 3. Nodemailer Configuration ---
  const transporter = nodemailer.createTransport({
    // Use environment variables for production security
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    }
  });

  // --- 4. Email Content Generation ---

  // Admin/Organizer Email Body (for internal review)
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
      <h3 style="color: #8b0000;">🚨 New UI SME Fair Inquiry 🚨</h3>
      <p>A new contact form submission has been received.</p>
      <hr/>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; background-color: #f4f4f4; padding: 10px; border-left: 3px solid #004d40;">${message}</p>
      <p style="font-size: small; margin-top: 20px;">Please follow up promptly.</p>
    </div>
  `;

  // Applicant/User Confirmation Email Body
  const applicantHtml = `
    <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #004d40; border-radius: 5px;">
      <h3 style="color: #004d40;">Confirmation: Your Inquiry to the UI SME Fair 2025 Team</h3>
      <p><b><i>Dear ${name},</i></b></p>
      <p>Thank you for reaching out to the UI SME Fair 2025 Organizing Committee. We have successfully received your inquiry and will review your message shortly.</p>
      <p>We aim to respond to all inquiries within <b>48 hours</b>.</p>
      <hr style="border-top: 1px dashed #ddd;"/>
      <p><strong>Your Submitted Details:</strong></p>
      <ul>
        <li><strong>Subject:</strong> ${subject}</li>
        <li><strong>Message Snippet:</strong> ${message.substring(0, 80)}...</li>
      </ul>
      <p style="margin-top: 20px;"><i>Best regards</i>,<br><b>The UI SME Fair Team</b></p>
    </div>
  `;

  try {
    // 5a. Send the email to the **Administrator**
    await transporter.sendMail({
      from: `"UI SME Fair 2025 Inquiry System" <${process.env.EMAIL_USER}>`, 
      to: process.env.EMAIL_TO, // Admin email
      subject: `[NEW INQUIRY] ${subject} from ${name}`,
      html: adminHtml,
    });
    
    // 5b. Send the confirmation email to the **Applicant**
    await transporter.sendMail({
      from: `"UI SME Fair 2025 Committee" <${process.env.EMAIL_USER}>`, 
      to: email, // Applicant's email
      subject: `Received: Your inquiry about the UI SME Fair 2025`,
      html: applicantHtml,
    });


    // Respond with a success message
    return res.status(200).json({ 
        message: 'Your message has been sent successfully! A confirmation email has been sent to your address.', 
        status: 'success' 
    });
  } catch (error) {
    console.error('Nodemailer error:', error);
    // Return 500 status code for server-side mailing error
    return res.status(500).json({ 
        message: 'Failed to send your message due to a server error. Please try again later or contact us directly.', 
        status: 'error' 
    });
  }
}