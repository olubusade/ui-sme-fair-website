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

  // --- 3. Nodemailer Configuration and Sending ---
  const transporter = nodemailer.createTransport({
    // Using environment variables is crucial for production
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true', // Use 'true' for port 465, 'false' for 587
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    }
  });

  try {
    // Send the email to the administrator
    await transporter.sendMail({
      from: `"${name}" <${email}>`, 
      to: process.env.EMAIL_TO, // The admin email address
      subject: `New UI SME Fair Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
          <h3 style="color: #8b0000;">New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // Respond with a success message
    return res.status(200).json({ message: 'Your message has been sent successfully! We will respond shortly.', status: 'success' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({ message: 'Failed to send your message due to a server error. Please try again later or contact us directly.', status: 'error' });
  }
}