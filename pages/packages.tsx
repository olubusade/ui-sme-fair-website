import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GetStaticProps } from 'next';
import Head from 'next/head';

// Import the new JSON data
import boothPackagesJson from '../data/booth-packages.json';

// Define TypeScript interfaces for our new data shapes
interface BoothPackage {
    name: string;
    size: string; // Booth dimensions (e.g., "3m x 3m")
    price_ngn: string;
    is_recommended?: boolean;
    icon: string;
    target_audience: string;
    value_proposition: string; 
    benefits: string[]; // Key selling points
}

interface PackagesPageProps {
    packages: BoothPackage[];
}

// Data Fetching remains the same
export const getStaticProps: GetStaticProps<PackagesPageProps> = async () => {
    return {
        props: {
            packages: boothPackagesJson as BoothPackage[],
        },
    };
};

// Function to determine the card's visual style
const getCardClassName = (isRecommended?: boolean) => {
    // Custom classes for professional styling: border, shadow, and a distinct primary color highlight
    return isRecommended
        ? "pricing-card shadow-lg recommended-card" 
        : "pricing-card shadow-sm";
};

// --- MAIN COMPONENT ---
export default function Packages({ packages }: PackagesPageProps) {
    const baseURL = "https://www.uismefairng.com"; 
    const eventName = "UI SME Fair"; 
    const studentPackage = "₦2,000"; 
    const eventDuration = "2-Day Exhibition";

    return (
        <>
            <Head>
                <title>Exhibitor Packages & Pricing | {eventName}</title>
                <meta name="description" content={`Secure your premium booth space for the ${eventName}. View our transparent pricing for 2-Day Exhibition packages: 3x3m, 3x6m, and 3x9m.`} />
                <meta property="og:title" content={`Exhibitor Packages & Pricing | ${eventName}`} />
                <meta property="og:image" content={`${baseURL}/ui-logo.png`} />
            </Head>
            {/* Page Title */}
            <div className="page-title">
                {/* Use the uploaded logo for a professional header look */}
                <div className="logo-header">
                    <Image src="/ui-logo.png" alt={`${eventName} Logo`} width={50} height={50} className="me-2" />
                    <span className="event-name-title">{eventName}</span>
                </div>
                <div className="breadcrumbs">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href="/"><i className="bi bi-house"></i> Home</Link></li>
                            <li className="breadcrumb-item active current">Packages & Pricing</li>
                        </ol>
                    </nav>
                </div>
                <div className="title-wrapper">
                    <h1>Your Investment for Visibility</h1>
                    <p className="lead">
                        Choose the right {eventDuration} package to maximize your impact. All packages include a standard shell scheme (walls, fascia board, light).
                    </p>
                </div>
            </div>
            {/* End Page Title */}

            {/* Packages Section: Professional Tiered Design */}
            <section id="packages" className="packages section py-5">
                <div className="container" data-aos="fade-up">
                    <div className="row justify-content-center g-4">
                        {packages.map((pkg, index) => (
                            <div 
                                key={index} 
                                className="col-lg-4 col-md-6" 
                                data-aos="zoom-in" 
                                data-aos-delay={100 * (index + 1)}
                            >
                                <div className={getCardClassName(pkg.is_recommended)}>
                                    
                                    {/* Recommended Tag */}
                                    {pkg.is_recommended && <div className="recommended-tag">BEST VALUE</div>}

                                    {/* Header */}
                                    <div className="pricing-header">
                                        <i className={`${pkg.icon} package-icon-large`}></i> 
                                        <h3 className="mt-3">{pkg.name}</h3>
                                        <p className="target-text">Ideal for: {pkg.target_audience}</p>
                                    </div>

                                    {/* Price Box */}
                                    <div className="price-box">
                                        <span className="price-ngn">{pkg.price_ngn}</span>
                                        <span className="price-details-small"> / {eventDuration}</span>
                                        <p className="size-label">Booth Size: {pkg.size}</p>
                                    </div>

                                    {/* Value Proposition */}
                                    <p className="value-prop-text mb-4 fst-italic">{pkg.value_proposition}</p>
                                    
                                    {/* Benefits List */}
                                    <ul className="list-unstyled feature-list mb-5">
                                        {pkg.benefits.map((benefit, bIndex) => (
                                            <li key={bIndex} className="d-flex align-items-start mb-2">
                                                <i className="bi bi-check-circle-fill text-primary me-2 flex-shrink-0"></i> 
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    
                                    {/* Call to Action */}
                                    <div className="text-center">
                                        <Link 
                                            href={`/register?package=${encodeURIComponent(pkg.name)}`} 
                                            className="btn btn-primary-ui btn-lg w-100 mt-auto book-btn" 
                                        >
                                            Secure My {pkg.size} Booth
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {/* /Packages Section */}
            
            {/* Student & Sponsorship CTA Section */}
            <section id="ctas" className="cta-section py-5 bg-light-gray">
                <div className="container">
                    <div className="row gy-4">
                        {/* Student Entrepreneur CTA */}
                        <div className="col-md-6" data-aos="fade-right">
                            <div className="cta-card student-cta p-4 p-md-5 rounded-3 border-start border-4 border-success h-100">
                                <h3 className="mb-3"><i className="bi bi-mortarboard-fill me-2"></i> Student Entrepreneur</h3>
                                <p className="lead">Are you a UI student innovator? Showcase your project at a subsidized rate.</p>
                                <p className="price-display">Investment: {studentPackage}</p>
                                <Link href="/register?package=Studentpreneur" className="btn btn-success-ui mt-3">
                                    <i className="bi bi-box-arrow-in-right"></i> Register as Student
                                </Link>
                            </div>
                        </div>

                        {/* Custom Sponsorship CTA */}
                        <div className="col-md-6" data-aos="fade-left">
                            <div className="cta-card sponsorship-cta p-4 p-md-5 rounded-3 border-start border-4 border-warning h-100">
                                <h3 className="mb-3"><i className="bi bi-trophy-fill me-2"></i> Custom Sponsorship</h3>
                                <p className="lead">Achieve Maximum Brand Reach with a bespoke partnership package.</p>
                                <p className="price-display">Investment: Custom Price</p>
                                <Link href="/contact" className="btn btn-warning-ui mt-3">
                                    <i className="bi bi-envelope"></i> Explore Partnership Tiers
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}