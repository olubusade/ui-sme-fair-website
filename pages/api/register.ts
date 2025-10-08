import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Define the comprehensive type for the SME Fair Registration form
interface FairRegistrationData {
  // 1. Company / Business Information
  businessName: string;
  businessType: string; // Updated from 'Type of Business / Industry'
  businessAddress: string;

  // 2. Contact Information
  contactPerson: string;
  designation: string;
  phoneWhatsapp: string; // Primary phone
  phoneAlternative: string;
  email: string;
  websiteHandle: string; // Website / Social Media Handle(s)

  // 3. Exhibition Details & Pricing
  productsServices: string;
  // This field will determine the pricing logic: 'Exhibitor', 'Sponsor', 'Studentpreneur', 'Attendee', 'Others'
  registrationType: 'Exhibitor' | 'Sponsor' | 'Studentpreneur' | 'Attendee' | 'Others';
  
  // Exhibitor Specific
  boothSize: '3x3' | '3x6' | '3x9' | 'N/A'; // N/A for non-exhibitors
  boothFee: number; // Calculated fee based on selection (e.g., 25000, 50000, 2000)

  // 4. Participation Details
  exhibitedBefore: 'Yes' | 'No';
  staffCount: number; // Expected Number of Staff at Booth
  additionalSupport: 'Yes' | 'No';
  supportSpecification: string; // If yes, please specify

  // 5. Payment Information
  paymentReceipt: string; // Base64 or URL of the uploaded receipt
  declarationName: string;
  declarationDate: string;
}

// Map the list of product/service categories
const PRODUCT_CATEGORIES = [
    'Fashion & Apparel', 'Food & Beverages', 'Arts & Crafts', 'Technology & Gadgets', 
    'Health & Wellness', 'Education & Books', 'Consulting & Services', 'Other'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Use the new interface for destructuring
  const data = req.body as FairRegistrationData;

  // --- 1. Server-Side Validation ---
  // Ensure critical fields are present
  if (
    !data.businessName || !data.email || !data.contactPerson || !data.registrationType || !data.declarationName || !data.paymentReceipt
  ) {
    return res.status(400).json({ message: 'Missing critical registration fields. Please check all required sections.' });
  }

  // --- 2. Price/Payment Validation (Crucial for exhibitors/studentpreneurs) ---
  if (['Exhibitor', 'Studentpreneur'].includes(data.registrationType)) {
    if (!data.boothFee || !data.paymentReceipt) {
        return res.status(400).json({ message: 'Payment information (Fee and Receipt) is required for your selected registration type.' });
    }
  }

  // --- 3. Payment Receipt Handling ---
  // ⚠️ IMPORTANT: In a production environment, you would save the 'data.paymentReceipt'
  // to a secure cloud storage service (e.g., AWS S3 or Cloudinary) 
  // and get a publicly accessible URL to include in the email. 
  const receiptLink = "Link to be generated after secure upload/storage...";


  // --- 4. Nodemailer Configuration and Sending ---
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  try {
    const emailBodyHtml = `
      <p>A <strong>NEW ${data.registrationType.toUpperCase()}</strong> has registered for the UI 77th Anniversary SME Fair.</p>
      <p><strong>Registration Status:</strong> PENDING REVIEW (Payment Receipt Attached/Linked)</p>
      <hr>

      <h3>1. Company / Business Information</h3>
      <p><strong>Business Name:</strong> ${data.businessName}</p>
      <p><strong>Industry:</strong> ${data.businessType}</p>
      <p><strong>Address:</strong> ${data.businessAddress}</p>

      <h3>2. Contact Information</h3>
      <p><strong>Contact Person:</strong> ${data.contactPerson} (${data.designation})</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Primary Phone:</strong> ${data.phoneWhatsapp}</p>
      <p><strong>Website/Social:</strong> ${data.websiteHandle || 'N/A'}</p>

      <h3>3. Exhibition Details</h3>
      <p><strong>Type:</strong> <strong>${data.registrationType}</strong></p>
      <p><strong>Products/Services:</strong> ${data.productsServices}</p>
      <p><strong>Booth Size:</strong> ${data.boothSize} (Exhibition for 2 days)</p>
      <p><strong>Fee Paid:</strong> ₦${data.boothFee.toLocaleString()}</p>
      <p><strong>Payment Receipt Link:</strong> <a href="${receiptLink}">${receiptLink}</a></p>
      
      <h3>4. Participation Details</h3>
      <p><strong>Exhibited Before:</strong> ${data.exhibitedBefore}</p>
      <p><strong>Staff Count:</strong> ${data.staffCount}</p>
      <p><strong>Additional Support Required:</strong> ${data.additionalSupport} - ${data.supportSpecification || 'None specified'}</p>
      
      <hr>
      <p><strong>Declaration Signed By:</strong> ${data.declarationName} on ${data.declarationDate}</p>
    `;

    await transporter.sendMail({
      from: `"UI SME Fair Registration" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO, 
      subject: `[ACTION REQUIRED] New ${data.registrationType} Registration: ${data.businessName}`,
      html: emailBodyHtml,
    });

    return res.status(200).json({ 
        message: `Thank you, ${data.businessName}! Your registration and payment receipt have been successfully submitted for review.` 
    });
  } catch (error) {
    console.error('Nodemailer error:', error);
    return res.status(500).json({ message: 'Server error: Failed to process your registration. Please check your network and try again.' });
  }
}