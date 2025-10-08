import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// --- Event Data and Links ---

// Centralized event details
const eventName = "UI SME Fair";
const eventYear = new Date().getFullYear();
const generalEmail = "smefair@ui.edu.ng";
const sponsorshipContact = "+234 903 084 1958";
const eventAddress = "International Conference Centre, University of Ibadan, Nigeria";

// Event Navigation Links
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/packages', label: 'Packages & Pricing' },
  
];

// Exhibitor/Sponsor Links (Replaces Services/Departments)
const businessLinks = [
    { href: '/register', label: 'Register as Exhibitor' },
    { href: '/packages', label: 'View Booth Packages' },
    { href: '/contact?subject=Sponsorship', label: 'Custom Sponsorship' },
    { href: '/contact?subject=Media', label: 'Media/Press' },
];

// Updated Social Handles (Use common placeholders from previous update)
const socialLinks = {
  facebook: "https://www.facebook.com/uismefairng",
  twitter: "https://twitter.com/uismefairng",
  instagram: "https://www.instagram.com/uismefairng",
  linkedin: "https://www.linkedin.com/company/uismefairng",
};


function Footer() {
  return (
    <>
      <footer id="footer" className="footer position-relative light-background">
        <div className="container footer-top">
          <div className="row gy-4">
            
            {/* Column 1: About & Contact */}
            <div className="col-lg-4 col-md-6 footer-about">
            <Link href="/" className="d-flex align-items-center ml-2">
              <Image
                width={160}
                height={160}
                src="/ui-logo.png"
                alt={`${eventName} Official Logo`}
                className="footer-logo"
              />
            </Link>
              <div className="footer-contact pt-3">
                {/* Event Name */}
                <h5 className="sitename-footer">{eventName}</h5> 
                <p>{eventAddress}</p>
                
                {/* Contact Info */}
                <p className="mt-3">
                  <strong>Corporate Contact:</strong>{" "}
                  <span>{sponsorshipContact}</span>
                </p>
                <p>
                  <strong>General Email:</strong>{" "}
                  <span>{generalEmail}</span>
                </p>
              </div>
              
              {/* Social Links */}
              <div className="social-links d-flex mt-4">
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></a>
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer"><i className="bi bi-twitter-x"></i></a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a>
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>

            {/* Column 2: Quick Links (Updated) */}
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Quick Links</h4>
              <ul>
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Exhibitor Hub (Replaces Our Services) */}
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Exhibitor Hub</h4>
              <ul>
                {businessLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
    

            {/* Column 5: Map/Visit Link */}
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Visit Us</h4>
              <ul>
                <li><Link href="/contact">📍 Locate Venue</Link></li>
                <li><Link href="/register">🎟️ Secure Your Booth</Link></li>
                <li><Link href="/contact">📧 Send Inquiry</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container copyright text-center mt-4">
          <p>
             © <span>Copyright {eventYear}</span>{" "}
            <strong className="px-1 sitename">{eventName}</strong>{" "}
            <span>All Rights Reserved</span>
          </p>
          {/* Credits section can be uncommented if applicable */}
          {/* <div className="credits">
            Designed by <a href="">Your Company</a>
          </div> */}
        </div>
        
        {/* Scroll Top */}
        <a
          href="#"
          id="scroll-top"
          className="scroll-top d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-arrow-up-short"></i>
        </a>
      </footer>
    </>
  );
}

export default Footer;