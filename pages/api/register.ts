import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Define the comprehensive type for the SME Fair Registration form
interface FairRegistrationData {
  // 1. Company / Business Information
  businessName: string;
  businessType: string;
  businessAddress: string;

  // 2. Contact Information
  contactPerson: string; // fname + lname (combined by frontend)
  designation: string;
  phoneWhatsapp: string; // dialCode + phone (combined by frontend)
  phoneAlternative: string;
  email: string;
  websiteHandle: string;

  // 3. Exhibition Details & Pricing
  productsServices: string;
  registrationType: 'Exhibitor' | 'Sponsor' | 'Studentpreneur' | 'Participant' | 'Others' | '';
  otherRegistrationType: string; // Handled if registrationType is 'Others'
  
  // Exhibitor Specific
  boothSize: '3x3' | '3x6' | '3x9' | 'N/A' | '';
  boothFee: number; // Calculated fee based on selection (e.g., 25000, 50000, 2000)

  // 4. Participation Details
  exhibitedBefore: 'Yes' | 'No' | '';
  staffCount: number;
  additionalSupport: 'Yes' | 'No' | '';
  supportSpecification: string;

  // 5. Competition Interest (NEW SECTION)
  interestPitching: boolean;
  interestCooking: boolean;

  // 6. Declaration & Payment (Note: PaymentReceipt is now handled client-side/separately)
  declarationName: string;
  declarationDate: string;
  
  // Security fields for server-side processing
  honeyName?: string;
  captchaAnswer: string;
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

  const data = req.body as FairRegistrationData;
  const isPaidRegistration = ['Exhibitor', 'Studentpreneur'].includes(data.registrationType);
  
  // Determine final registration type for email subject
  const finalRegistrationType = data.registrationType === 'Others' && data.otherRegistrationType 
                                ? data.otherRegistrationType 
                                : data.registrationType;

  // --- 1. Security Checks (Honeypot) ---
  if (data.honeyName) {
    console.warn('Bot detected via honeypot on registration form.');
    return res.status(200).json({ 
        message: 'Submission received successfully. (Bot blocked)', 
        status: 'success' 
    });
  }
  
  // ⚠️ NOTE: The CAPTCHA logic is handled entirely on the client, and the server 
  // currently does not know the correct answer. We must trust the client validation. 
  // For production security, the correct answer should be generated and stored on the server (e.g., session).

  // --- 2. Server-Side Validation ---
  if (
    !data.businessName || !data.email || !data.contactPerson || !data.registrationType || !data.declarationName
  ) {
    return res.status(400).json({ message: 'Missing critical registration fields. Please check all required sections.', status: 'error' });
  }
  
  // Check conditional fields
  if (data.registrationType === 'Others' && !data.otherRegistrationType) {
       return res.status(400).json({ message: 'Please specify the "Other" registration type.', status: 'error' });
  }
  if (data.registrationType === 'Exhibitor' && !data.boothSize) {
       return res.status(400).json({ message: 'Exhibitors must select a booth size.', status: 'error' });
  }

  // --- 3. Nodemailer Configuration ---
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  // --- 4. Email Content Generation ---

  // Admin Email Body
  const adminHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
        <h3 style="color: #8b0000;">🎉 NEW ${finalRegistrationType.toUpperCase()} REGISTRATION 🎉</h3>
        <p><strong>Business Name:</strong> ${data.businessName}</p>
        <p><strong>Registration Status:</strong> ${isPaidRegistration ? 'FEE PAID - PENDING RECEIPT CONFIRMATION' : 'Registration Complete'}</p>
        <hr>

        <h4>1. Business Details</h4>
        <p><strong>Industry:</strong> ${data.businessType}</p>
        <p><strong>Address:</strong> ${data.businessAddress}</p>
        <p><strong>Website/Social:</strong> ${data.websiteHandle || 'N/A'}</p>
        <p><strong>Products/Services:</strong> ${data.productsServices}</p>

        <h4>2. Contact Info</h4>
        <p><strong>Contact Person:</strong> ${data.contactPerson} (${data.designation})</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Primary Phone:</strong> ${data.phoneWhatsapp}</p>
        <p><strong>Alternative Phone:</strong> ${data.phoneAlternative || 'N/A'}</p>
        
        <h4>3. Exhibition & Fees</h4>
        <p><strong>Type:</strong> <strong>${finalRegistrationType}</strong></p>
        ${isPaidRegistration ? `
          <p><strong>Booth Size:</strong> ${data.boothSize}</p>
          <p><strong>Fee Amount:</strong> ₦${data.boothFee.toLocaleString()}</p>
          <p style="color: red;"><strong>⚠️ ACTION:</strong> Please check payment system for receipt from ${data.contactPerson}.</p>
        ` : `<p><strong>Note:</strong> No payment required for this registration type.</p>`}
        
        <h4>4. Other Details</h4>
        <p><strong>Expected Staff:</strong> ${data.staffCount}</p>
        <p><strong>Exhibited Before:</strong> ${data.exhibitedBefore}</p>
        <p><strong>Support Required:</strong> ${data.additionalSupport} - ${data.supportSpecification || 'None specified'}</p>
        <p><strong>Pitching Interest:</strong> ${data.interestPitching ? 'YES' : 'No'}</p>
        <p><strong>Cooking Interest:</strong> ${data.interestCooking ? 'YES' : 'No'}</p>
        
        <hr>
        <p><strong>Declaration Signed By:</strong> ${data.declarationName} on ${data.declarationDate}</p>
      </div>
  `;

  // Applicant Confirmation Email Body
  const applicantHtml = `
      <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #004d40; border-radius: 5px;">
        <h3 style="color: #004d40;">Your UI SME Fair 2025 Registration is Submitted!</h3>
        <p><b><i>Dear ${data.contactPerson},</i></b></p>
        <p>Thank you for registering your business, <strong>${data.businessName}</strong>, for the UI SME Fair 2025 as a <b>${finalRegistrationType}</b>
        ${isPaidRegistration ? `
          <p style="background-color: #fff3cd; padding: 15px; border-left: 5px solid #ffc107;">
            <strong>Next Step: Payment Confirmation</strong><br>
            Your registration is complete, but your <b>booth/space is not confirmed</b> until our team validates the payment receipt you will provide separately.<br>
            <b>Fee:</b> ₦${data.boothFee.toLocaleString()} (for ${data.boothSize} space).
          </p>
        ` : `<p>Your registration as a <b>${finalRegistrationType}</b> is complete and is now under review.</p>`}
        
        <hr style="border-top: 1px dashed #ddd;"/>
        <p><strong>Registration Summary:</strong></p>
        <ul>
          <li><strong>Business:</strong> ${data.businessName}</li>
          <li><strong>Registration Type:</strong> ${finalRegistrationType}</li>
          <li><strong>Contact Email:</strong> ${data.email}</li>
        </ul>
        <p style="margin-top: 20px;">We will contact you within <b>72 hours</b> regarding the status of your registration and payment confirmation.</p>
        <p><i>Best regards,</i><br><b>The UI SME Fair Organizing Committee</b></p>
      </div>
  `;

  try {
    // 5a. Send the email to the **Administrator**
    await transporter.sendMail({
      from: `"UI SME Fair Registration System" <${process.env.EMAIL_USER}>`, 
      to: process.env.EMAIL_TO, // Admin email
      subject: `[ACTION: New ${finalRegistrationType} Reg] ${data.businessName}`,
      html: adminHtml,
    });
    
    // 5b. Send the confirmation email to the **Applicant**
    await transporter.sendMail({
      from: `"UI SME Fair Committee" <${process.env.EMAIL_USER}>`, 
      to: data.email, // Applicant's email
      subject: `Confirmation: Your Registration for UI SME Fair 2025`,
      html: applicantHtml,
    });

    // Respond with a success message
    return res.status(200).json({ 
        message: `Thank you, ${data.contactPerson}! Your registration has been submitted successfully for review. A confirmation email has been sent to ${data.email}.`, 
        status: 'success' 
    });
  } catch (error) {
    console.error('Nodemailer error:', error);
    // Return 500 status code for server-side mailing error
    return res.status(500).json({ 
        message: 'Server error: Failed to process your registration. Please check your network and try again.', 
        status: 'error' 
    });
  }
}