"use client"; 

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Keeping your existing scroll effect logic for consistency.
    const header: any = document.querySelector('#header');
    const body: any = document.querySelector('body');

    if (!header) return;

    const toggleScrolled = () => {
      const hasStickyClass =
        header.classList.contains('scroll-up-sticky') ||
        header.classList.contains('sticky-top') ||
        header.classList.contains('fixed-top');
      if (hasStickyClass) {
        window.scrollY > 100
          ? body.classList.add('scrolled')
          : body.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', toggleScrolled);
    window.addEventListener('load', toggleScrolled);

    return () => {
      window.removeEventListener('scroll', toggleScrolled);
      window.removeEventListener('load', toggleScrolled);
    };
  }, []);
  

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
    <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
      
      {/* Logo & Title */}
      <div className="header-brand d-flex align-items-center">
        <Link href="/" className="header-logo d-flex align-items-center">
          <Image
            width={80}
            height={80}
            src="/ui-logo.png" // Assumes UI logo is in public folder
            alt="UI SME Fair Logo"
            />
            <h1 className="header-logo-title ms-2">
              <span className='header-label'>University of Ibadan</span> <span className="specialist">SME Fair</span> <span className='header-label'>2025</span>
        </h1>
        </Link>
        
      </div>
  
      {/* Navigation for Essential Pages: Focused on the Core Flow */}
      <nav id="navmenu" className="navmenu">
        <ul>
          {[
            { href: '/', label: 'Home' },
            // Removed /about
            { href: '/packages', label: 'Pricing & Packages' }, // Clarified verbiage
            // Removed /faq, /guidelines, /terms
            { href: '/contact', label: 'Contact' },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>

  
      {/* Primary Call-to-Action */}
      <Link className="btn-getstarted" href="/register"> 
        {/* Effective, high-conversion button text */}
        Secure Your Booth
      </Link>
    </div>
  </header>
  
  );
};

export default Header;