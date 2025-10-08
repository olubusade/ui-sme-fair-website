"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import Head from 'next/head';

// --- Placeholder Configuration & Data ---

// NOTE: Since departmentsJson is not accessible, this is a placeholder.
const PlaceholderExhibitFeatures = [
     { name: 'Home & Lifestyle Products', image: '/assets/img/fair/ui-sme-fair-conference.jpg', icon: 'bi bi-house-door-fill', description: 'Showcasing home decor, furniture, beauty products, and general retail goods.', homeFlag: true },
    { name: 'Agribusiness & Food', image: '/assets/img/fair/food-exhibit.jpg', icon: 'bi bi-basket-fill', description: 'Connect with food processors, producers, and agricultural innovators.', homeFlag: true },
    { name: 'Fashion & Creative Arts', image: '/assets/img/fair/fashion-exhibit.jpg', icon: 'bi bi-palette-fill', description: 'Exhibit clothing lines, accessories, and unique handcrafted items.', homeFlag: true },
];

interface ExhibitFeature {
    name: string;
    image: string;
    icon: string;
    description: string;
    homeFlag: boolean;
}

interface HomePageProps {
    departments: ExhibitFeature[];
}

// Fair Constants
const EVENT_YEAR = 2025;
const EVENT_DATE = "November 5 - 6";
const FAIR_START_DATE = new Date('2025-11-5T09:00:00'); // Assuming Nov 5, 2025

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
    return {
        props: {
            departments: PlaceholderExhibitFeatures, 
        },
    };
};

export default function Home({ departments }: HomePageProps) {
    const [activeSlide, setActiveSlide] = useState(0);

    // --- State for Accordion/Benefits Section ---
    const [currentDay, setCurrentDay] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    // ------------------------------------------

    // --- Hero Slides adapted for UI SME Fair ---
    const heroSlides = [
        {
            badge: `Nigeria's Biggest Campus Enterprise Fair`,
            title: `Showcasing Innovation: The UI SME Fair ${EVENT_YEAR}`,
            text: "Connect with over 150 exhibitors, investors, and industry leaders at the largest gathering of entrepreneurs on a university campus.",
            image: "/assets/img/fair/hero-bg1.jpg", 
        },
        {
            badge: "Book Your Exhibition Booth Now",
            title: "Your Gateway to Thousands of Ready Customers",
            text: "Secure a prime spot to market your products and services directly to the university community and surrounding city populace.",
            image: "/assets/img/fair/hero-bg2.jpg",
        },
        {
            badge: "Networking and Investment Opportunities",
            title: "Pitch Your Business to Key Stakeholders & VCs",
            text: "Access exclusive mentorship sessions and meet potential investors looking to fund the next generation of Nigerian enterprises.",
            image: "/assets/img/fair/hero-bg3.jpg"      
        },
        {
            badge: "Exhibiting November 5th - 6th, 2025",
            title: "Igniting Entrepreneurship in the Heart of Ibadan",
            text: "Join the University of Ibadan's 77th Anniversary celebration by participating in the premier business exhibition of the year.",
            image: "/assets/img/fair/hero-bg4.jpg",
        },
    ];
    // --- End Hero Slides ---
  
    // --- useEffect for Hero Slideshow ---
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prevSlide) => (prevSlide + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // --- useEffect for Accordion Functionality (DOM Manipulation) ---
    // NOTE: This uses direct DOM manipulation as requested by the user,
    // although a purely React state-based solution is generally preferred.
    useEffect(() => {
        // --- Custom Logic for Day/Time ---
        // Since the fair is NOT 24/7, these are placeholders for a future implementation.
        const date = new Date();
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        setCurrentDay(day);
        setIsOpen(true); // Assuming registration/info is 'open' indefinitely until the event starts
        // ----------------------------------
        
        // --- Accordion Logic (Direct DOM Access) ---
        const faqItems = document.querySelectorAll('.faq-item');
        
        const toggleAccordion = (e: Event) => {
            const item = (e.currentTarget as HTMLElement).closest('.faq-item');
            if (item) {
                item.classList.toggle('faq-active');
            }
        };

        faqItems.forEach(item => {
            const header = item.querySelector('.faq-header');
            if (header) {
                header.addEventListener('click', toggleAccordion);
            }
        });

        // Cleanup function to remove event listeners
        return () => {
            faqItems.forEach(item => {
                const header = item.querySelector('.faq-header');
                if (header) {
                    header.removeEventListener('click', toggleAccordion);
                }
            });
        };
    }, []);

    const registrationOpen = FAIR_START_DATE > new Date(); 

    return (
        <>
            <Head>
                <title>UI SME Fair {EVENT_YEAR} | University of Ibadan Enterprise Exhibition</title>
                <meta name="description" content={`The official website for the University of Ibadan SME Fair ${EVENT_YEAR}. Register your booth, network with investors, and showcase your business. ${EVENT_DATE}, 2025.`} />
                <meta name="keywords" content="UI SME Fair, University of Ibadan, Ibadan exhibition, entrepreneurship fair, Nigerian startups, business fair Ibadan, studentpreneur" />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.uismefairng.com/" />
                <meta property="og:title" content={`UI SME Fair ${EVENT_YEAR} | University of Ibadan Enterprise Exhibition`} />
                <meta property="og:description" content={`The official website for the University of Ibadan SME Fair ${EVENT_YEAR}. Register your booth, network with investors, and showcase your business. ${EVENT_DATE}, 2025.`} />
                <meta property="og:image" content="https://www.uismefairng.com/assets/img/favicon.png" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://www.uismefairng.com/assets/img/favicon.png" />
                <meta property="twitter:title" content={`UI SME Fair ${EVENT_YEAR} | University of Ibadan Enterprise Exhibition`} />
                <meta property="twitter:description" content={`The official website for the University of Ibadan SME Fair ${EVENT_YEAR}. Register your booth, network with investors, and showcase your business. ${EVENT_DATE}, 2025.`} />
                <meta property="twitter:image" content="https://www.uismefairng.com/assets/img/favicon.png" />
            </Head>
            
            {/* Hero Section (Adapted) */}
            <section id="hero" className="hero section dark-background">
                <div className="container-fluid p-0">
                    <div className="hero-wrapper">
                        <div className="hero-image">
                            <Image
                                src={heroSlides[activeSlide].image}
                                alt="SME Fair Exhibition"
                                className="img-fluid"
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                        <div className="hero-content">
                            <div className="container">
                                <div className="row">
                                    <div
                                        className="col-lg-7 col-md-10"
                                        data-aos="fade-right"
                                        data-aos-delay={100}
                                    >
                                        <div className="content-box">
                                            <span
                                                className="badge-accent"
                                                data-aos="fade-up"
                                                data-aos-delay={150}
                                            >
                                                {heroSlides[activeSlide].badge}
                                            </span>
                                            <h1 data-aos="fade-up" data-aos-delay={200}>
                                                {heroSlides[activeSlide].title}
                                            </h1>
                                            <p data-aos="fade-up" data-aos-delay={250}>
                                                {heroSlides[activeSlide].text}
                                            </p>
                                            <div
                                                className="cta-group"
                                                data-aos="fade-up"
                                                data-aos-delay={300}
                                            >
                                                <Link href="/register" className="btn btn-primary">
                                                    Register Your Booth
                                                </Link>
                                                <Link href="/packages" style={{color:'white', borderColor:'white'}} className="btn btn-outline">
                                                    View Packages
                                                </Link>
                                            </div>
                                            <div
                                                className="info-badges"
                                                data-aos="fade-up"
                                                data-aos-delay={350}
                                            >
                                                <div className="badge-item">
                                                    <i className="bi bi-calendar-check-fill" />
                                                    <div className="badge-content">
                                                        <span>Event Dates</span>
                                                        <strong>{EVENT_DATE}, {EVENT_YEAR}</strong>
                                                    </div>
                                                </div>
                                                <div className="badge-item">
                                                    <i className="bi bi-geo-alt-fill" />
                                                    <div className="badge-content">
                                                        <span>Location</span>
                                                        <strong>University of Ibadan</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="features-wrapper">
                                    <div className="row gy-4">
                                        <div className="col-lg-4">
                                            <div
                                                className="feature-item"
                                                data-aos="fade-up"
                                                data-aos-delay={450}
                                            >
                                                <div className="feature-icon">
                                                    <i className="bi bi-cash-stack" />
                                                </div>
                                                <div className="feature-text">
                                                    <h3>Direct Sales Access</h3>
                                                    <p>
                                                        Tap into a huge market of students, staff, and city residents.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div
                                                className="feature-item"
                                                data-aos="fade-up"
                                                data-aos-delay={500}
                                            >
                                                <div className="feature-icon">
                                                    <i className="bi bi-handshake-fill" />
                                                </div>
                                                <div className="feature-text">
                                                    <h3>B2B Networking</h3>
                                                    <p>
                                                        Meet investors, mentors, and corporate partners.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div
                                                className="feature-item"
                                                data-aos="fade-up"
                                                data-aos-delay={550}
                                            >
                                                <div className="feature-icon">
                                                    <i className="bi bi-award-fill" />
                                                </div>
                                                <div className="feature-text">
                                                    <h3>Brand Visibility</h3>
                                                    <p>
                                                        Boost your brand reputation within the academic community.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Hero Section */}
            
            {/* Home About Section (Adapted) */}
            <section id="home-about" className="home-about section">
                <div className="container" data-aos="fade-up" data-aos-delay={100}>
                    <div className="row gy-5 align-items-center">
                        <div className="col-lg-6" data-aos="fade-right" data-aos-delay={200}>
                            <div className="about-image">
                                <Image
                                    src="/assets/img/fair/ui-sme.jpg" // Image of a lecture/conference hall
                                    alt="UI SME Fair Conference"
                                    className="img-fluid rounded-3 mb-4"
                                    width={500}
                                    height={333}
                                    priority={false}
                                />
                                <div className="experience-badge">
                                    <span className="years">77th</span>
                                    <span className="text">Anniversary Edition</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="fade-left" data-aos-delay={300}>
                            <div className="about-content">
                                <h2>Showcasing Innovation and Nigerian Enterprise</h2>
                                <p className="lead">
                                    The University of Ibadan SME Fair is the premier platform bridging the gap between innovative campus-based businesses and the national market.
                                </p>
                                <p>
                                    As part of the University's 77th Anniversary celebrations, the {EVENT_YEAR} edition promises to be the biggest yet, featuring expert-led workshops, keynote speakers on digital transformation, and dedicated pitch sessions for young entrepreneurs.
                                </p>
                                <div className="row g-4 mt-4">
                                    <div
                                        className="col-md-6"
                                        data-aos="fade-up"
                                        data-aos-delay={400}
                                    >
                                        <div className="feature-item">
                                            <div className="icon">
                                                <i className="bi bi-bar-chart-line-fill" />
                                            </div>
                                            <h4>Market Penetration</h4>
                                            <p>
                                                Instantly introduce your brand to the largest youth demographic in the region.
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="col-md-6"
                                        data-aos="fade-up"
                                        data-aos-delay={500}
                                    >
                                        <div className="feature-item">
                                            <div className="icon">
                                                <i className="bi bi-person-workspace" />
                                            </div>
                                            <h4>Entrepreneurship Workshops</h4>
                                            <p>
                                                Gain actionable knowledge from industry leaders on scaling your business.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Home About Section */}
            
            {/* Featured Departments Section (Adapted to Exhibit Highlights) */}
            <section id="featured-departments" className="featured-departments section">
                {/* Section Title */}
                <div className="container section-title" data-aos="fade-up">
                    <h2>Exhibit Highlights & Sectors</h2>
                    <p>
                        Explore the diverse range of industries and innovative businesses that will be exhibiting at this year's fair.
                    </p>
                </div>
                {/* End Section Title */}
                <div className="container" data-aos="fade-up" data-aos-delay={100}>
                    <div className="row gy-4">
                        {departments.map((feature, index) => (
                            <div
                                key={index}
                                className="col-lg-4 col-md-6"
                                data-aos="fade-up"
                                data-aos-delay={100 * (index + 1)}
                            >
                                <div className="department-card">
                                    <div className="department-image">
                                        <Image src={feature.image} alt={feature.name} className="img-fluid" width={400} height={200} loading="lazy" />
                                    </div>
                                    <div className="department-content">
                                        <div className="department-icon">
                                            <i className={feature.icon} />
                                        </div>
                                        <h3>{feature.name}</h3>
                                        <p>{feature.description}</p>
                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* /Featured Departments Section */}
            
            {/* Featured Services Section (Adapted to Why Exhibit/Visit) */}
            <section
                id="featured-services"
                className="featured-services section light-background"
            >
                {/* Section Title */}
                <div className="container section-title" data-aos="fade-up">
                    <h2>Why You Must Participate</h2>
                    <p>
                        We are dedicated to providing the maximum value and exposure for every entrepreneur, exhibitor, and visitor.
                    </p>
                </div>
                {/* End Section Title */}
                <div className="container" data-aos="fade-up" data-aos-delay={100}>
                    <div className="row gy-4">
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay={200}>
                            <div className="service-card">
                                <div className="service-icon">
                                    <i className="fas fa-chart-line" />
                                </div>
                                <div className="service-content">
                                    <h3>Unmatched Market Access</h3>
                                    <p>
                                        Position your brand directly in front of thousands of students, faculty, alumni, and Ibadan city residents—a highly engaged consumer base.
                                    </p>
                                    <ul className="service-features">
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            High foot traffic for direct sales
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Immediate consumer feedback
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            On-site product demonstrations
                                        </li>
                                    </ul>
                                    <Link href="/register" className="service-btn">
                                        Secure Your Booth
                                        <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* End Service Card */}
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay={300}>
                            <div className="service-card">
                                <div className="service-icon">
                                    <i className="fas fa-lightbulb" />
                                </div>
                                <div className="service-content">
                                    <h3>Innovation & Knowledge Hub</h3>
                                    <p>
                                        Stay ahead of the curve with insights from market leaders and discover disruptive business models from local entrepreneurs.
                                    </p>
                                    <ul className="service-features">
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Keynote sessions from industry giants
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Practical business scaling workshops
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Dedicated studentpreneur mentorship
                                        </li>
                                    </ul>
                                    <Link href="/register" className="service-btn">
                                        Register Now
                                        <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* End Service Card */}
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay={400}>
                            <div className="service-card">
                                <div className="service-icon">
                                    <i className="fas fa-coins" />
                                </div>
                                <div className="service-content">
                                    <h3>Investment & Partnership</h3>
                                    <p>
                                        Meet potential investors, venture capitalists, and high-net-worth individuals looking to finance promising SMEs and startups.
                                    </p>
                                    <ul className="service-features">
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Structured B2B networking lounges
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Exclusive investor pitch events
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Opportunities for corporate sponsorship deals
                                        </li>
                                    </ul>
                                    <Link href="/register" className="service-btn">
                                        Invest Now
                                        <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* End Service Card */}
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay={500}>
                            <div className="service-card">
                                <div className="service-icon">
                                    <i className="fas fa-trophy" />
                                </div>
                                <div className="service-content">
                                    <h3>Innovation & Skill Competitions</h3>
                                    <p>
                                        Engage directly with attendees and gain high-visibility brand association by sponsoring the fair's exciting student-focused contests.
                                    </p>
                                    <ul className="service-features">
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            The high-stakes **Student Pitching Competition**
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            The popular **Inter-Hall Cooking Competition**
                                        </li>
                                        <li>
                                            <i className="fas fa-check-circle" />
                                            Excellent visibility for sponsors and partners
                                        </li>
                                    </ul>
                                    <Link href="/register" className="service-btn">
                                        Sponsor or Participate
                                        <i className="fas fa-arrow-right" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        {/* End Service Card */}
                    </div>
                </div>
            </section>
            {/* /Featured Services Section */}
            
            {/* Call To Action Section (Adapted) */}
            <section id="call-to-action" className="call-to-action section">
                <div className="container section-title" data-aos="fade-up" data-aos-delay={100}>
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2 data-aos="fade-up" data-aos-delay={200}>
                                Don't Miss Out on the Premier Enterprise Event
                            </h2>
                            <p data-aos="fade-up" data-aos-delay={250}>
                                Booth registration is highly competitive and closes soon. Secure your spot now to guarantee maximum exposure and networking opportunities at the UI SME Fair {EVENT_YEAR}.
                            </p>
                            <div className="cta-buttons mt-4" data-aos="fade-up" data-aos-delay={300}>
                                <Link href="/register" className="btn-primary">
                                    Register Your Booth Today
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="row features-row" data-aos="fade-up" data-aos-delay={400}>
                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="icon-wrapper">
                                    <i className="bi bi-pin-map-fill" />
                                </div>
                                <h5>Prime Exhibition Space</h5>
                                <p>
                                    Get a premium location to showcase your products and attract visitors with high purchasing intent.
                                </p>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="icon-wrapper">
                                    <i className="bi bi-pin" />
                                </div>
                                <h5>Sponsor Investment Forum</h5>
                                <p>
                                    Connect with financial institutions and VCs dedicated to supporting Nigerian innovation and enterprise growth.
                                </p>
                                
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-4">
                            <div className="feature-card">
                                <div className="icon-wrapper">
                                    <i className="bi bi-mortarboard-fill" />
                                </div>
                                <h5>Empowering Studentpreneurs</h5>
                                <p>
                                    Dedicated, subsidized exhibition options and mentorship for student-run campus businesses.
                                </p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Call To Action Section */}

            {/* Benefit Section (Adapted from FAQ) */}
        <section id="benefits" className="faq section">
           {/* Section Title */}
                <div className="container section-title" data-aos="fade-up">
                    <h2>Find Answers to Your Inquiries.</h2>
                </div>
                {/* End Section Title */}
                <div className="container" data-aos="fade-up" data-aos-delay={100}>
                   
                    <div className="row gy-5">
                        <div className="col-lg-6" data-aos="zoom-out" data-aos-delay={200}>
                            <div className="faq-contact-card">
                                <div className="card-icon">
                                    <i className="bi bi-star-fill" />
                                </div>
                                <div className="card-content">
                                    <h3>Maximise Your ROI</h3>
                                    <p>
                                        The UI SME Fair is designed to provide tangible business results—from immediate sales to long-term partnerships. Here’s what you gain:
                                    </p>
                                    <div className="contact-options">
                                        <Link href="/register" className="contact-option">
                                            <i className="bi bi-briefcase" />
                                            <span>Start Exhibiting</span>
                                        </Link>
                                        <Link href="/contact" className="contact-option">
                                            <i className="bi bi-telephone" />
                                            <span>Contact Organizers</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6" data-aos="fade-up" data-aos-delay={300}>
                              <div className="faq-accordion">
                                <div className="faq-item faq-active">
                                    <div className="faq-header">
                                        <h3>What is the purpose of the Small and Medium Scale Enterprises Program?</h3>
                                        <i className="bi bi-chevron-down faq-toggle" />
                                    </div>
                                    <div className="faq-content">
                                        <p>
                                            The Small and Medium Scale Enterprises Program commemorates the 77th anniversary of the University of Ibadan by focusing on the growth and development of SMEs. This initiative aims to engage various stakeholders, including sponsors, entrepreneurs, and studentprenuers, etc.
                                        </p>
                                    </div>
                                </div>
                                 <div className="faq-item">
                                    <div className="faq-header">
                                        <h3>How can I register for the program?</h3>
                                        <i className="bi bi-chevron-down faq-toggle" />
                                    </div>
                                    <div className="faq-content">
                                        <p>
                                            Registering for the Small and Medium Scale Enterprises Program is a seamless process. Participants can visit the dedicated registration page on our website, where they will find necessary forms and guidelines tailored for different stakeholders. 
                                        </p>
                                    </div>
                                  </div>
                               
                                {/* End Benefit Item*/}
                                <div className="faq-item">
                                    <div className="faq-header">
                                        <h3>What is the cost of a standard exhibition booth?</h3>
                                        <i className="bi bi-chevron-down faq-toggle" />
                                    </div>
                                    <div className="faq-content">
                                        <p>
                                            A standard 3x3m booth costs ₦25,000 for the two-day event. Special subsidized rates (₦2,000) are available for verified Studentpreneurs. Full details are on the registration page.
                                        </p>
                                    </div>
                                </div>
                                {/* End Benefit Item*/}
                                <div className="faq-item">
                                    <div className="faq-header">
                                        <h3>What is the minimum booth size available?</h3>
                                        <i className="bi bi-chevron-down faq-toggle" />
                                    </div>
                                    <div className="faq-content">
                                        <p>
                                            The minimum rentable booth size is 3x3 meters. Larger booths (3x6m, 3x9m) are available, and custom spaces can be arranged for platinum sponsors.
                                        </p>
                                    </div>
                                </div>
                                {/* End Benefit Item*/}
                                <div className="faq-item">
                                    <div className="faq-header">
                                        <h3>Is there an opportunity for investors and VCs?</h3>
                                        <i className="bi bi-chevron-down faq-toggle" />
                                    </div>
                                    <div className="faq-content">
                                        <p>
                                            Yes, we host a dedicated Investor & Mentor Lounge and a pitch session where VCs can meet pre-vetted startups and established SMEs seeking funding and strategic partnerships.
                                        </p>
                                    </div>
                                </div>
                                {/* End Benefit Item*/}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* /Benefit Section */}
        </>
    );
}