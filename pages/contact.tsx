"use client";

import Head from 'next/head';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

// Use a local proxy endpoint for the Next.js API route
const contactEndpoint = '/api/contact'; 

export default function Contact() {
  const eventName = "UI SME Fair";
  const baseURL = "https://www.uismefairng.com";
  
  // FIXED MAP URL: Standard Google Maps Embed Source for The International Conference Centre, UI
  const mapEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.514486576826!2d3.896740675005898!3d7.291771192716167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10398d5a2d718a29%3A0xc541e3090623a63!2sInternational%20Conference%20Centre!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng';

  // Contact Details
  const sponsorshipContact = '+234 903 084 1958 (Corporate Relations)'; 
  const generalEmail = 'smefair@ui.edu.ng';
  
  // *** SOCIAL HANDLES (AS PLACEHOLDERS #) ***
  const socialLinks = {
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#", 
    youtube: "#",
  };
  
  // --- STRICT VALIDATION PATTERN ---
  const name_pattern = /^[a-zA-Z\s'-]+$/; 
  const email_pattern = /^\S+@\S+\.\S+$/;
  // ----------------------------------

  // Initial Form State
  const initialFormData = {
    fname: '',
    lname:'',
    email: '',
    subject: '',
    message: '',
    honeyName: '',
    captchaAnswer: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });

  const generateCaptcha = () => {
    // Generates two numbers between 1 and 9 for a realistic captcha
    const num1 = Math.floor(Math.random() * 9) + 1;
    const num2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ num1, num2, answer: num1 + num2 });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // LIVE FILTERING: Block numbers and non-name characters in name fields
    if (name === 'fname' || name === 'lname') {
        // Only allow letters, spaces, hyphens, and apostrophes. Digits are blocked here.
        newValue = value.replace(/[^a-zA-Z\s'-]/g, '');
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    
    // --- FINAL CLIENT-SIDE VALIDATION ---
    
    // 1. Name Validation & Merging
    const fullName = `${formData.fname.trim()} ${formData.lname.trim()}`;
    if (formData.fname.trim().length === 0 || formData.lname.trim().length === 0) {
        setMessage('First and Last Names are required.');
        setIsError(true);
        setLoading(false);
        generateCaptcha();
        setTimeout(() => setMessage(''), 6000);
        return;
    }
    
    if (!name_pattern.test(formData.fname) || !name_pattern.test(formData.lname)) {
        setMessage('Names cannot contain digits or illegal special characters (must be letters only).');
        setIsError(true);
        setLoading(false);
        generateCaptcha();
        setTimeout(() => setMessage(''), 6000);
        return;
    }
    
    // 2. Email Validation
    if (!email_pattern.test(formData.email)) {
        setMessage('Please enter a valid email address.');
        setIsError(true);
        setLoading(false);
        generateCaptcha();
        setTimeout(() => setMessage(''), 6000);
        return;
    }

    // 3. Captcha Check (Client-side)
    if (parseInt(formData.captchaAnswer) !== captcha.answer) {
        setMessage('Incorrect security check answer. Please try again.');
        setIsError(true);
        setLoading(false);
        generateCaptcha();
        setTimeout(() => setMessage(''), 6000);
        return;
    }
    
    // 4. Honeypot check (always before actual submission)
    if (formData.honeyName) {
        setMessage('Submission successful! (Bot blocked)');
        setIsError(false);
        setLoading(false);
        generateCaptcha();
        setTimeout(() => setMessage(''), 6000);
        return;
    }
    
    // --- Data preparation for JSON POST ---
    const payload = {
        name: fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        // Pass necessary security fields to the server
        honeyName: formData.honeyName,
        captchaAnswer: formData.captchaAnswer,
        captchaCorrectAnswer: captcha.answer.toString(),
    };
    
    try {
      // Use JSON submission for Next.js API routes
      const response = await fetch(contactEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        setMessage(result.message || 'Your message has been sent. Thank you!');
        // Clear form upon success
        setFormData(initialFormData);
        setIsError(false);
      } else {
        setMessage(result.message || 'Something went wrong during submission.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('A network or unexpected error occurred. Please try again later.');
      setIsError(true);
    } finally {
      setLoading(false);
      // Regenerate captcha regardless of success/fail
      generateCaptcha();
      setTimeout(() => {
        setMessage('');
      }, 6000); 
    }
  };

  return (
    <>
      <Head>
        <title>Contact & Sponsorship Inquiry </title>
        <meta name="description" content={`Get in touch with the ${eventName} team for general inquiries, media accreditation, or custom sponsorship opportunities. Find our venue, The International Conference Centre at the University of Ibadan, on the map.`} />
        <meta name="keywords" content="contact UI SME Fair, sponsorship inquiry, media accreditation, exhibition contact, International Conference Centre UI map" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseURL}/contact`} />
        <meta property="og:title" content={`Contact & Sponsorship Inquiry | ${eventName}`} />
        <meta property="og:description" content={`Get in touch with the ${eventName} team for general inquiries, media accreditation, or custom sponsorship opportunities. Find our venue, The International Conference Centre at the University of Ibadan, on the map.`} />
        <meta property="og:image" content={`${baseURL}/ui-logo.png`} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`${baseURL}/contact`} />
        <meta property="twitter:title" content={`Contact & Sponsorship Inquiry | ${eventName}`} />
        <meta property="twitter:description" content={`Get in touch with the ${eventName} team for general inquiries, media accreditation, or custom sponsorship opportunities. Find our venue, The International Conference Centre at the University of Ibadan, on the map.`} />
        <meta property="twitter:image" content={`${baseURL}/ui-logo.png`} />
      </Head>

      {/* Page Title (Updated for Event) */}
      <div className="page-title">
        <div className="breadcrumbs">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">
                  <i className="bi bi-house" /> Home
                </Link>
              </li>
              <li className="breadcrumb-item active current">Contact</li>
            </ol>
          </nav>
        </div>
        <div className="title-wrapper">
          <h1>Contact & Corporate Relations</h1>
          <p>
            Have a question about the fair, need media access, or interested in a <b>custom sponsorship package</b>? Reach out to the {eventName} team.
          </p>
        </div>
      </div>
      {/* End Page Title */}
      
      {/* Contact Section */}
      <section id="contact" className="contact section">
        <div className="container">
          <div className="contact-wrapper">
            {/* --- Contact Info Panel (White theme structure) --- */}
            <div className="contact-info-panel">
              <div className="contact-info-header">
                <h3>Event Contact Information</h3>
                <p>
                  Reach the relevant department for immediate assistance.
                </p>
              </div>
              <div className="contact-info-cards">
                {/* Location Card */}
                <div className="info-card">
                  <div className="icon-container">
                    <i className="bi bi-pin-map-fill" />
                  </div>
                  <div className="card-content">
                    <h4>Venue Location</h4>
                    <p>The International Conference Centre, University of Ibadan, Ibadan, Oyo State, Nigeria</p>
                  </div>
                </div>
                {/* General Inquiry Email Card */}
                <div className="info-card">
                  <div className="icon-container">
                    <i className="bi bi-envelope-open" />
                  </div>
                  <div className="card-content">
                    <h4>General Inquiries</h4>
                    <p>{generalEmail}</p>
                  </div>
                </div>
                {/* Sponsorship Hotline Card */}
                <div className="info-card">
                  <div className="icon-container">
                    <i className="bi bi-trophy-fill" />
                  </div>
                  <div className="card-content">
                    <h4>Sponsorship Hotline</h4>
                    <p>
                      {/* --- MODIFIED: Removed inline style, use CSS for styling --- */}
                      <Link
                        style={{color:'white'}}
                        href={`tel:${sponsorshipContact.replace(/\s+/g, '')}`} 
                      >
                        {sponsorshipContact}
                      </Link>
                    </p>
                  </div>
                </div>
                {/* Event Date/Hours Card */}
                <div className="info-card">
                  <div className="icon-container">
                    <i className="bi bi-calendar-check" />
                  </div>
                  <div className="card-content">
                    <h4>Event Dates & Time</h4>
                    <p>5th - 6th November, 2025 (9:00 AM - 5:00 PM Daily)</p>
                  </div>
                </div>
              </div>
              
              {/* --- Social Links Panel (Placeholders) --- */}
              <div className="social-links-panel">
                <h5>Connect with {eventName}</h5>
                <div className="social-icons">
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></a>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"><i className="bi bi-twitter-x" /></a>
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram" /></a>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin" /></a>
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"><i className="bi bi-youtube" /></a>
                </div>
              </div>
            </div>
            
            {/* Contact Form Panel: Map and Form */}
            <div className="contact-form-panel">
              
              {/* GOOGLE MAP EMBED - International Conference Centre, UI */}
              <div className="map-container">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map of The International Conference Centre, UI"
                />
              </div>
              
              <div className="form-container">
                <h3>General & Sponsorship Inquiry</h3>
                <p>
                  Fill out the form below. For corporate partnerships, please detail your interest in the message box.
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="php-email-form"
                >
                  <div className="row">
                    <div className="col-md-6 form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="fnameInput"
                        name="fname"
                        placeholder="First Name"
                        value={formData.fname}
                        onChange={handleChange}
                        required
                        // User guidance
                        title="Name fields cannot contain numbers or special characters." 
                      />
                      <label htmlFor="fnameInput">First Name</label>
                    </div>
                    <div className="col-md-6 form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="lnameInput"
                        name="lname"
                        placeholder="Last Name"
                        value={formData.lname}
                        onChange={handleChange}
                        required
                        // User guidance
                        title="Name fields cannot contain numbers or special characters."
                      />
                      <label htmlFor="lnameInput">Last Name</label>
                    </div>
                  </div>
                  
                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="emailInput">Email Address</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="subjectInput"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="subjectInput">Subject (e.g., Sponsorship, Exhibitor Query, Media)</label>
                  </div>
                  <div className="form-floating mb-3">
                    <textarea
                      className="form-control"
                      id="messageInput"
                      name="message"
                      rows={5}
                      placeholder="Your Message"
                      style={{ height: 150 }}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor="messageInput">Your Message / Partnership Details</label>
                  </div>
                  
                  {/* Status/Loading Messages */}
                  <div className="my-3 text-center">
                      <div className="loading" style={{ display: loading && !message ? 'block' : 'none' }}>Sending...</div>
                      {message && (
                          <div className={isError ? "error-message" : "sent-message"} style={{ display: 'block' }}>
                              {message}
                          </div>
                      )}
                  </div>
                  
                  {/* Honeypot field for bot detection */}
                  <div style={{ display: 'none' }}>
                      <input
                          type="text"
                          name="honeyName"
                          value={formData.honeyName}
                          onChange={handleChange}
                      />
                  </div>
                  
                  {/* Captcha field for bot detection */}
                  <div className="form-floating mb-3">
                      <div className="input-group">
                          <span className="input-group-text captcha-prompt">
                              What is {captcha.num1} + {captcha.num2}?
                          </span>
                          <input
                              type="text"
                              name="captchaAnswer"
                              className="form-control"
                              placeholder="Your Answer"
                              value={formData.captchaAnswer}
                              onChange={handleChange}
                              required
                          />
                           {/* Hidden field for the correct answer to be passed to the API */}
                           <input
                              type="hidden"
                              name="captchaCorrectAnswer"
                              value={captcha.answer}
                           />
                      </div>
                  </div>
                  
                  <div className="d-grid">
                    <button type="submit" className="btn-submit" disabled={loading}>
                      <i className="bi bi-send-fill me-2" /> 
                      {loading ? ' Sending...' : ' Send Inquiry'}
                    </button>                      
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /Contact Section */}
      </>      
    );
  }