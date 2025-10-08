"use client";

import Link from 'next/link';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Head from 'next/head';

// --- Configuration & Constants (STABLE on Server/Client) ---
const EVENT_START_DATE = new Date('2025-10-30T00:00:00');
const DAYS_BEFORE_CLOSURE = 7; 
const REGISTRATION_CLOSURE_DATE = new Date(EVENT_START_DATE.getTime() - DAYS_BEFORE_CLOSURE * 24 * 60 * 60 * 1000);

// Data Mappings (Rest of the mappings remain the same)
const PRODUCT_CATEGORIES = [
    'Fashion & Apparel (Clothing, Accessories)', 
    'Food & Beverages (Packaged Goods, Catering)', 
    'Arts & Crafts (Handmade, Decor)', 
    'Technology & Gadgets (Electronics, Software)', 
    'Health & Wellness (Supplements, Fitness)', 
    'Education & Books (Publishing, Tutoring)', 
    'Consulting & Professional Services (Finance, Marketing)', 
    'Other'
];

const BOOTH_PRICING: { [key: string]: number } = {
    '3x3': 25000,
    '3x6': 50000,
    '3x9': 75000,
};
const STUDENTPRENEUR_FEE = 2000;

// Validation Rules
const MIN_NAME_LENGTH = 2; 

// --- Component Interfaces (Unchanged) ---
interface FormData {
    fname: string; 
    lname: string; 
    email: string;
    dialCode: string;
    phone: string; 
    phoneAlternative: string;
    designation: string;
    businessName: string;
    businessType: string; 
    businessAddress: string;
    websiteHandle: string;
    productsServices: string;
    registrationType: 'Exhibitor' | 'Sponsor' | 'Studentpreneur' | 'Participant' | 'Others' | '';
    otherRegistrationType: string;
    boothSize: '3x3' | '3x6' | '3x9' | 'N/A' | ''; 
    exhibitedBefore: 'Yes' | 'No' | '';
    staffCount: number;
    additionalSupport: 'Yes' | 'No' | '';
    supportSpecification: string;
    interestPitching: boolean;
    interestCooking: boolean;
    boothFee: number; 
    declarationName: string;
    declarationDate: string;
    honeyName: string;
    captchaAnswer: string;
}
interface ValidationErrors {
    fname?: string;
    lname?: string;
    email?: string;
    phone?: string;
    otherRegistrationType?: string;
    boothSize?: string;
    declarationName?: string;
    captchaAnswer?: string;
}
interface CaptchaState {
    num1: number;
    num2: number;
    answer: number;
}


// --- Initial State Functions ---

// 1. Initial State for Form Data (mostly stable/static)
const getInitialState = (): FormData => ({
    fname: '', lname: '', email: '', dialCode: '+234', phone: '', phoneAlternative: '', designation: '',
    businessName: '', businessType: '', businessAddress: '', websiteHandle: '', productsServices: '',
    registrationType: '', otherRegistrationType: '', boothSize: '', exhibitedBefore: '', staffCount: 1, additionalSupport: 'No', supportSpecification: '',
    interestPitching: false, interestCooking: false,
    // Use a stable date format for SSR (client will correct if necessary)
    boothFee: 0, declarationName: '', declarationDate: new Date().toISOString().split('T')[0],
    honeyName: '', captchaAnswer: ''
});

// 2. CAPTCHA Generator (Deterministic function, but uses Math.random)
const generateCaptcha = (): CaptchaState => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: num1 + num2 };
};

// 3. STABLE CAPTCHA State for Server Render
const INITIAL_CAPTCHA_STATE: CaptchaState = { num1: 0, num2: 0, answer: 0 }; 
// Use 0, 0, 0 so the server renders a predictable value, 
// and the client updates it immediately after mounting.


// --- MAIN COMPONENT ---
export default function Register() {
    const formActionUrl = '/api/register'; 

    // FIX: Initialize dynamic state variables (status, countdown, captcha) with a stable value.
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false); // Assume closed until client confirms
    const [daysToEvent, setDaysToEvent] = useState(0); 

    const [formData, setFormData] = useState<FormData>(getInitialState);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [isError, setIsError] = useState(false);
    const [captcha, setCaptcha] = useState<CaptchaState>(INITIAL_CAPTCHA_STATE); // FIX: Use stable initial state

    // --- Strict Validation Patterns --- (Unchanged)
    const email_pattern = /^\S+@\S+\.\S+$/;
    const phone_pattern = /^\d{9,11}$/; 
    const name_pattern = /^[a-zA-Z\s'-]+$/; 
    const NON_DIGIT_PATTERN = /[^\d]/g; 
    
    // --- EFFECT: Client-side Initialization (SOLVES HYDRATION) ---
    useEffect(() => {
        const currentDateOnClient = new Date(); // Get fresh date on client (safe here)

        // 1. Initialize Captcha
        setCaptcha(generateCaptcha());
        
        // 2. Initialize Registration Status
        if (currentDateOnClient > REGISTRATION_CLOSURE_DATE) {
            setIsRegistrationOpen(false);
        } else {
            setIsRegistrationOpen(true);
        }

        // 3. Initialize Countdown
        const timeDiff = EVENT_START_DATE.getTime() - currentDateOnClient.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setDaysToEvent(days > 0 ? days : 0);
    }, []); // Runs once on client mount

    // --- Dynamic Fee Calculation --- (Unchanged)
    useEffect(() => {
        let fee = 0;
        if (formData.registrationType === 'Exhibitor' && formData.boothSize && formData.boothSize !== 'N/A') {
            fee = BOOTH_PRICING[formData.boothSize] || 0;
        } else if (formData.registrationType === 'Studentpreneur') {
            fee = STUDENTPRENEUR_FEE;
        }
        setFormData(prev => ({ ...prev, boothFee: fee }));
    }, [formData.registrationType, formData.boothSize]);


    // --- Enhanced Change Handler with Live Validation --- (Unchanged)
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number | boolean = value;
        let errorMsg = '';

        if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        } else if (name === 'staffCount') {
            newValue = parseInt(value) || 0;
        }

        if (name === 'phone' || name === 'phoneAlternative') {
            newValue = value.replace(NON_DIGIT_PATTERN, '');
            if (newValue.length > 0 && (newValue.length < 9 || newValue.length > 11)) {
                errorMsg = 'Must be 9-11 digits.';
            }
        }
        
        if (name === 'fname' || name === 'lname' || name === 'declarationName') {
            if (/\d/.test(value)) {
                errorMsg = 'Name cannot contain digits.';
            } else if (value.trim().length > 0 && value.trim().length < MIN_NAME_LENGTH) {
                errorMsg = `Must be at least ${MIN_NAME_LENGTH} characters.`;
            }
        }
        
        if (name === 'email' && value.trim().length > 0 && !email_pattern.test(value)) {
            errorMsg = 'Invalid email format.';
        }

        if (name === 'otherRegistrationType' && value.trim() === '') {
            errorMsg = 'Please specify the registration type.';
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));

        setErrors(prev => ({ 
            ...prev, 
            [name]: errorMsg,
            ...(!errorMsg && name !== 'captchaAnswer' ? { [name]: undefined } : {})
        }));

        if (name === 'registrationType' && newValue !== 'Exhibitor') {
            setFormData(prev => ({ ...prev, boothSize: '' as FormData['boothSize'] }));
        }
        if (name === 'additionalSupport' && newValue === 'No') {
            setFormData(prev => ({ ...prev, supportSpecification: '' }));
        }
    }, [formData.registrationType, formData.additionalSupport]);
    
    // --- Final Submission Validation --- (Unchanged)
    const validateFormOnSubmit = () => {
        let formIsValid = true;
        const newErrors: ValidationErrors = {};

        if (!name_pattern.test(formData.fname) || formData.fname.trim().length < MIN_NAME_LENGTH) {
            newErrors.fname = `Minimum ${MIN_NAME_LENGTH} chars required and no digits.`;
            formIsValid = false;
        }
        if (!name_pattern.test(formData.lname) || formData.lname.trim().length < MIN_NAME_LENGTH) {
            newErrors.lname = `Minimum ${MIN_NAME_LENGTH} chars required and no digits.`;
            formIsValid = false;
        }
        if (!name_pattern.test(formData.declarationName) || formData.declarationName.trim().length < MIN_NAME_LENGTH) {
            newErrors.declarationName = `Minimum ${MIN_NAME_LENGTH} chars required and no digits.`;
            formIsValid = false;
        }

        if (!email_pattern.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            formIsValid = false;
        }
        
        if (!phone_pattern.test(formData.phone)) {
            newErrors.phone = 'Primary phone must be 9-11 digits.';
            formIsValid = false;
        }

        if (formData.registrationType === 'Others' && formData.otherRegistrationType.trim() === '') {
            newErrors.otherRegistrationType = 'You must specify the "Other" registration type.';
            formIsValid = false;
        }
        if (formData.registrationType === 'Exhibitor' && formData.boothSize === '') {
            newErrors.boothSize = 'Exhibitors must select a booth size.';
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };


    // --- Form Submission --- (Unchanged logic, uses the new state structure)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isRegistrationOpen) {
            setMessage('Registration is currently closed.');
            setIsError(true);
            setLoading(false);
            return;
        }

        setLoading(true);
        setMessage('');
        setShowMessage(true);
        setIsError(false);
        
        if (!validateFormOnSubmit()) {
            setMessage('Please fix the errors indicated in the form before submitting.');
            setIsError(true);
            setLoading(false);
            setCaptcha(generateCaptcha()); // Regenerate captcha on client
            return;
        }

        if (parseInt(formData.captchaAnswer) !== captcha.answer) {
            setMessage('Incorrect CAPTCHA answer. Please try again.');
            setErrors(prev => ({ ...prev, captchaAnswer: 'Incorrect CAPTCHA answer.' }));
            setIsError(true);
            setLoading(false);
            setCaptcha(generateCaptcha()); // Regenerate captcha on client
            return;
        }
        
        if (formData.honeyName) {
            setMessage('Submission successful! (Bot blocked)');
            setIsError(false);
            setLoading(false);
            setCaptcha(generateCaptcha()); // Regenerate captcha on client
            setTimeout(() => setMessage(''), 5000);
            return;
        }

        try {
            const payload = {
                ...formData,
                contactPerson: `${formData.fname} ${formData.lname}`,
                phoneWhatsapp: `${formData.dialCode}${formData.phone}`,
                // Clean up unnecessary fields for the API
                captchaAnswer: undefined, honeyName: undefined, fname: undefined, lname: undefined, phone: undefined, dialCode: undefined,
            };

            const response = await fetch(formActionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message || 'Registration successful! Check email for payment and next steps.');
                setIsError(false);
                setFormData(getInitialState());
            } else {
                setMessage(result.message || 'Server error: Could not complete registration.');
                setIsError(true);
            }
        } catch (error) {
            console.error('Submission error:', error);
            setMessage('An unexpected error occurred. Check your network connection.');
            setIsError(true);
        } finally {
            setLoading(false);
            setCaptcha(generateCaptcha()); // Regenerate captcha on client
            setTimeout(() => {
                setMessage('');
                setShowMessage(false);
            }, 8000); 
        }
    };


    // Memoize the payment details display 
    const paymentDisplay = useMemo(() => (
        <div className="alert alert-info mt-3 p-4">
            <h4 className='text-ui-dark-blue mb-3'>Payment Required: ₦{formData.boothFee.toLocaleString()}</h4>
            <p><strong>Please pay the calculated amount (₦{formData.boothFee.toLocaleString()}) before submitting the form. Your slot is reserved but not confirmed until payment is verified.</strong></p>
            <div className='bg-ui-surface p-3 rounded'>
                <p className='mb-1'><strong>Bank:</strong> FIRST BANK OF NIG.</p>
                <p className='mb-1'><strong>Account Name:</strong> UNIBADAN MICROFINANCE BANK LTD.</p>
                <p className='mb-0'><strong>Account No:</strong> 3103676217</p>
            </div>
            <p className='mt-3 text-danger fw-bold'><b>NOTE: You will receive an email confirmation requesting proof of payment after submission.</b></p>
        </div>
    ), [formData.boothFee]);


    // --- Inline Error Message Component ---
    const ErrorMessage = ({ message }: { message: string | undefined }) => {
        if (!message) return null;
        return <div className="text-danger small mt-1">{message}</div>;
    };
    
    // --- Component for Registration Closed Banner ---
    const RegistrationClosedBanner = () => (
        <div className="container my-5 text-center" data-aos="zoom-in">
            <div className="alert alert-danger p-5 shadow-lg">
                <i className="bi bi-x-octagon-fill display-3 text-danger mb-3"></i>
                <h1 className="display-4 fw-bold text-danger">REGISTRATION IS NOW CLOSED</h1>
                <p className="lead mt-4">
                    Thank you for your overwhelming interest! Our exhibitor and studentpreneur registration has reached capacity.
                </p>
                <p className="lead fw-bold">
                    The UI SME Fair begins in just <b>{daysToEvent} days</b> (on <b>{EVENT_START_DATE.toDateString()}</b>).
                </p>
                <p className="mt-4">
                    You can still attend the fair as a general visitor for free. For sponsorship or media inquiries, please contact our team directly.
                </p>
                <Link href="/contact" className="btn btn-dark btn-lg mt-3">
                    <i className="bi bi-telephone-fill me-2" /> Contact Corporate Relations
                </Link>
            </div>
        </div>
    );
    // ----------------------------------------------------


    return (
        <>
            <Head>
                <title>Register for UI SME Fair 2025</title>
                <meta name="description" content="Secure your booth for the University of Ibadan 77th Anniversary SME Fair. Complete the exhibitor or studentpreneur registration form now." />
                <meta property="og:title" content="Register for UI SME Fair 2025" />
                <meta property="og:description" content="Secure your booth for the University of Ibadan 77th Anniversary SME Fair. Complete the exhibitor or studentpreneur registration form now." />
            </Head>

            {/* Page Title */}
            <div className="page-title">
                <div className="breadcrumbs">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">
                                    <i className="bi bi-house" /> Home
                                </Link>
                            </li>
                            <li className="breadcrumb-item active current">Registration</li>
                        </ol>
                    </nav>
                </div>
                <div className="title-wrapper">
                    <h1>SME Fair 2025 Registration</h1>
                    <p>
                        Secure your spot! Complete the form to register as an Exhibitor, Sponsor, or Studentpreneur.
                    </p>
                </div>
            </div>
            {/* End Page Title */}

            <section id="register" className="register section">
                
                {!isRegistrationOpen && <RegistrationClosedBanner />}
                
                <div className="container" data-aos="fade-up" data-aos-delay={100} style={{ display: isRegistrationOpen ? 'block' : 'none' }}>
                    <div className="row gy-4">
                        {/* Registration Info / Instructions */}
                        <div className="col-lg-6">
                            <div className="registration-info">
                                <h3>Registration Steps & Instructions</h3>
                                <p className="mb-4">
                                    Please read carefully to ensure your application is processed quickly.
                                </p>
                                <div className="info-items">
                                    <div className="info-item d-flex align-items-center mb-3">
                                        <div className="icon-wrapper me-3"><i className="bi bi-wallet2" /></div>
                                        <div>
                                            <h5>Step 1: Determine Fee</h5>
                                            <p className="mb-0">
                                                Select your booth size/type to calculate the required payment fee.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-item d-flex align-items-center mb-3">
                                        <div className="icon-wrapper me-3"><i className="bi bi-bank" /></div>
                                        <div>
                                            <h5>Step 2: Make Payment</h5>
                                            <p className="mb-0">
                                                Transfer the exact fee to the <b>First Bank</b> account provided on the form.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-item d-flex align-items-center mb-3">
                                        <div className="icon-wrapper me-3"><i className="bi bi-envelope-fill" /></div>
                                        <div>
                                            <h5>Step 3: Submit Form</h5>
                                            <p className="mb-0">
                                                Fill out all sections and submit. Proof of payment will be requested via email after verification.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="important-note mt-4">
                                    <div className="alert alert-danger p-3">
                                        <h6 className="mb-2"><i className="bi bi-exclamation-triangle-fill me-2" /> Important!</h6>
                                        <p className="mb-0">
                                            Your slot is reserved upon submission, but <b>not confirmed</b> until payment is verified by the Fair Organising Committee.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* End Registration Info */}

                        {/* Registration Form */}
                        <div className="col-lg-6">
                            <div className="registration-form-wrapper" data-aos="fade-up" data-aos-delay={200}>
                                <form onSubmit={handleSubmit} className="registration-form php-email-form">
                                    
                                    {/* --- 1. Contact & Business Information --- */}
                                    <h4 className="form-heading mb-4">1. Contact & Business Information</h4>
                                    <div className="row gy-3">
                                        {/* Name Fields */}
                                        <div className="col-md-6">
                                            <input type="text" name="fname" className={`form-control ${errors.fname ? 'is-invalid' : ''}`} placeholder="Contact First Name" value={formData.fname} onChange={handleChange} minLength={MIN_NAME_LENGTH} required />
                                            <ErrorMessage message={errors.fname} />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="text" name="lname" className={`form-control ${errors.lname ? 'is-invalid' : ''}`} placeholder="Contact Last Name" value={formData.lname} onChange={handleChange} minLength={MIN_NAME_LENGTH} required />
                                            <ErrorMessage message={errors.lname} />
                                        </div>
                                        {/* Email */}
                                        <div className="col-md-12">
                                            <input type="email" name="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                            <ErrorMessage message={errors.email} />
                                        </div>
                                        {/* Phone Fields */}
                                        <div className="col-md-6">
                                            <div className="input-group">
                                                <input type="tel" readOnly name="dialCode" className="form-control" value={formData.dialCode} onChange={handleChange} style={{ maxWidth: '80px', borderRight: 'none', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} inputMode="numeric" required />
                                                <input type="tel" name="phone" className={`form-control ${errors.phone ? 'is-invalid' : ''}`} placeholder="Primary Phone (WhatsApp)" value={formData.phone} onChange={handleChange} maxLength={11} inputMode="numeric" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} required />
                                            </div>
                                            <ErrorMessage message={errors.phone} />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="tel" name="phoneAlternative" className="form-control" placeholder="Alternative Phone" value={formData.phoneAlternative} onChange={handleChange} maxLength={11} inputMode="numeric" />
                                        </div>
                                        {/* Designation/Role */}
                                        <div className="col-md-6">
                                            <input type="text" name="designation" className="form-control" placeholder="Your Designation / Role" value={formData.designation} onChange={handleChange} required />
                                        </div>
                                        {/* Business Name */}
                                        <div className="col-md-6">
                                            <input type="text" name="businessName" className="form-control" placeholder="Company / Business Name" value={formData.businessName} onChange={handleChange} required />
                                        </div>
                                        {/* Business Type / Handle */}
                                        <div className="col-md-6">
                                            <select name="businessType" className="form-select" value={formData.businessType} onChange={handleChange} required>
                                                <option value="">Select Business Industry</option>
                                                {PRODUCT_CATEGORIES.map((category, index) => (
                                                    <option key={index} value={category}>{category}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <input type="text" name="websiteHandle" className="form-control" placeholder="Website / Social Media Handle" value={formData.websiteHandle} onChange={handleChange} />
                                        </div>
                                        {/* Business Address */}
                                        <div className="col-12">
                                            <textarea className="form-control" name="businessAddress" rows={2} placeholder="Business Address" value={formData.businessAddress} onChange={handleChange} required />
                                        </div>
                                        {/* Products/Services */}
                                        <div className="col-12">
                                            <textarea className="form-control" name="productsServices" rows={3} placeholder="Briefly describe the Products / Services to be Exhibited" value={formData.productsServices} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    
                                    {/* --- 2. Participation & Booth Details --- */}
                                    <h4 className="form-heading mt-5 mb-4">2. Participation & Booth Details</h4>
                                    <div className="row gy-3">
                                        <div className="col-md-12">
                                            <label className="form-label">Type of Registration *</label>
                                            <select name="registrationType" className="form-select" value={formData.registrationType} onChange={handleChange} required>
                                                <option value="">Select Registration Type</option>
                                                <option value="Exhibitor">A. Exhibitor (Booth Required)</option>
                                                <option value="Studentpreneur">B. Studentpreneur (₦{STUDENTPRENEUR_FEE.toLocaleString()})</option>
                                                <option value="Sponsor">C. Sponsor (Contact for details)</option>
                                                <option value="Participant">D. Participant (General attendee)</option>
                                                <option value="Others">E. Others (Specify below)</option>
                                            </select>
                                        </div>

                                        {/* Conditional Input for 'Others' Registration Type */}
                                        {formData.registrationType === 'Others' && (
                                            <div className="col-md-12">
                                                <input 
                                                    type="text" 
                                                    name="otherRegistrationType" 
                                                    className={`form-control ${errors.otherRegistrationType ? 'is-invalid' : ''}`} 
                                                    placeholder="Please specify your Registration Type" 
                                                    value={formData.otherRegistrationType} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                                <ErrorMessage message={errors.otherRegistrationType} />
                                            </div>
                                        )}

                                        {/* Conditional Booth Size Selection (ONLY for Exhibitor) */}
                                        {formData.registrationType === 'Exhibitor' && (
                                            <div className="col-md-12">
                                                <label className="form-label">Preferred Booth Size (2 days exhibition) *</label>
                                                <select name="boothSize" className={`form-select ${errors.boothSize ? 'is-invalid' : ''}`} value={formData.boothSize} onChange={handleChange} required={formData.registrationType === 'Exhibitor'}>
                                                    <option value="">Select Booth Size</option>
                                                    <option value="3x3">3x3 m = ₦{BOOTH_PRICING['3x3'].toLocaleString()} (Per Booth)</option>
                                                    <option value="3x6">3x6 m = ₦{BOOTH_PRICING['3x6'].toLocaleString()} (Per Booth)</option>
                                                    <option value="3x9">3x9 m = ₦{BOOTH_PRICING['3x9'].toLocaleString()} (Per Booth)</option>
                                                </select>
                                                <ErrorMessage message={errors.boothSize} />
                                            </div>
                                        )}

                                        <div className="col-md-6">
                                            <label className="form-label">Exhibited at U.I. SME fair before?</label>
                                            <select name="exhibitedBefore" className="form-select" value={formData.exhibitedBefore} onChange={handleChange} required>
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Expected Number of Staff at Booth:</label>
                                            <input type="number" name="staffCount" className="form-control" value={formData.staffCount} onChange={handleChange} min="1" required />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Require Additional Support?</label>
                                            <select name="additionalSupport" className="form-select" value={formData.additionalSupport} onChange={handleChange} required>
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                        </div>
                                        {formData.additionalSupport === 'Yes' && (
                                            <div className="col-md-6">
                                                <input type="text" name="supportSpecification" className="form-control" placeholder="Specify requirements" value={formData.supportSpecification} onChange={handleChange} required />
                                            </div>
                                        )}
                                    </div>

                                    {/* --- 3. Competition Interest (NEW) --- */}
                                    <h4 className="form-heading mt-5 mb-4">3. Competition Interest</h4>
                                    <div className="row gy-3">
                                        <div className="col-12">
                                            <label className="form-label">Are you interested in participating in any of the following competitions?</label>
                                        </div>
                                        {/* Pitching Competition */}
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    name="interestPitching" 
                                                    id="interestPitching" 
                                                    className="form-check-input" 
                                                    checked={formData.interestPitching} 
                                                    onChange={handleChange} 
                                                />
                                                <label className="form-check-label" htmlFor="interestPitching">
                                                    Student Pitching Competition
                                                </label>
                                            </div>
                                        </div>
                                        {/* Cooking Competition */}
                                        <div className="col-md-6">
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    name="interestCooking" 
                                                    id="interestCooking" 
                                                    className="form-check-input" 
                                                    checked={formData.interestCooking} 
                                                    onChange={handleChange} 
                                                />
                                                <label className="form-check-label" htmlFor="interestCooking">
                                                    Inter-Hall Cooking Competition
                                                </label>
                                            </div>
                                        </div>
                                        
                                        {/* Optional note for competition eligibility */}
                                        {(formData.interestPitching || formData.interestCooking) && (
                                            <div className="col-12 mt-3">
                                                <div className="alert alert-info py-2 small" role="alert">
                                                    <b>Note:</b> Participation may be subject to <b>Student</b> or <b>Exhibitor</b> status and specific competition rules. Details will be sent via email.
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* --- 4. Payment Details --- */}
                                    {formData.boothFee > 0 && (
                                        <>
                                            <h4 className="form-heading mt-5 mb-3">4. Payment Details</h4>
                                            {paymentDisplay}
                                        </>
                                    )}

                                    {/* --- 5. Declaration --- */}
                                    <h4 className="form-heading mt-5 mb-3">5. Declaration</h4>
                                    <div className="col-12 declaration-box p-3 bg-ui-surface rounded mb-3">
                                        <p className="mb-2 small fst-italic text-ui-maroon">
                                            I, the undersigned, hereby declare that the information provided above is true and accurate to the best of my knowledge. I agree to abide by the exhibition guidelines and regulations set by the organizers.
                                        </p>
                                    </div>
                                    <div className="row gy-3">
                                        <div className="col-md-6">
                                            <input type="text" name="declarationName" className={`form-control ${errors.declarationName ? 'is-invalid' : ''}`} placeholder="Full Name (for Declaration)" value={formData.declarationName} onChange={handleChange} minLength={MIN_NAME_LENGTH} required />
                                            <ErrorMessage message={errors.declarationName} />
                                        </div>
                                        <div className="col-md-6">
                                            <input type="date" name="declarationDate" className="form-control" value={formData.declarationDate} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    {/* Honeypot field for bot detection */}
                                    <div style={{ display: 'none' }}>
                                        <input type="text" name="honeyName" value={formData.honeyName} onChange={handleChange} />
                                    </div>
                                    
                                    {/* Captcha field for bot detection */}
                                    <div className="col-12 mt-4">
                                        <div className="input-group">
                                            <span className="input-group-text captcha-text">
                                                Security Check: {captcha.num1} + {captcha.num2} =
                                            </span>
                                            <input type="text" name="captchaAnswer" className={`form-control ${errors.captchaAnswer ? 'is-invalid' : ''}`} placeholder="Your Answer" value={formData.captchaAnswer} onChange={handleChange} required />
                                            <ErrorMessage message={errors.captchaAnswer} />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="col-12 mt-4">
                                        <div className="text-center">
                                            {message && showMessage && (
                                                <div className={isError ? "error-message text-danger p-2 bg-white border border-danger rounded mb-3" : "sent-message text-success p-2 bg-white border border-success rounded mb-3"} style={{ display: 'block' }}>
                                                    {message}
                                                </div>
                                            )}
                                            <button type="submit" className="btn register-btn w-100" disabled={loading || !isRegistrationOpen}>
                                                <i className="bi bi-person-check me-2" />
                                                {loading ? 'Submitting...' : 'Complete Registration'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}