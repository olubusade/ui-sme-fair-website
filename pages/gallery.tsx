"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "glightbox/dist/css/glightbox.min.css";
import galleryData from "@/data/gallery.json"; // ✅ Import JSON
import Head from "next/head";

export default function Gallery() {
  useEffect(() => {
    let lightbox: any;
    let iso: any;

    (async () => {
      const GLightbox = (await import("glightbox")).default;
      const Isotope = (await import("isotope-layout")).default;

      lightbox = GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
        closeButton: true
      });

      const grid = document.querySelector(".isotope-container");
      if (grid) {
        iso = new Isotope(grid as HTMLElement, {
          itemSelector: ".isotope-item",
          layoutMode: "masonry"
        });

        const filterButtons = document.querySelectorAll<HTMLLIElement>(
          ".isotope-filters li"
        );

        filterButtons.forEach((button) => {
          button.addEventListener("click", function () {
            filterButtons.forEach((btn) =>
              btn.classList.remove("filter-active")
            );
            this.classList.add("filter-active");

            const filterValue = this.getAttribute("data-filter") || "*";
            iso?.arrange({ filter: filterValue });
          });
        });
      }
    })();

    return () => {
      lightbox?.destroy();
      iso?.destroy();
    };
  }, []);

  return (
    <>
      <Head>
        <title>Hospital Gallery | Bethel Specialist Hospital</title>
        <meta name="description" content="Explore our hospital gallery to see images of our modern facilities, state-of-the-art equipment, and dedicated medical staff in Ibadan, Nigeria." />
        <meta name="keywords" content="hospital gallery, Bethel Specialist Hospital photos, modern facilities, medical staff, Ibadan clinic pictures" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.uismefairng.com/gallery" />
        <meta property="og:title" content="Hospital Gallery | Bethel Specialist Hospital" />
        <meta property="og:description" content="Explore our hospital gallery to see images of our modern facilities, state-of-the-art equipment, and dedicated medical staff in Ibadan, Nigeria." />
        <meta property="og:image" content="https://www.uismefairng.com/bsh-logo.webp" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.uismefairng.com/gallery" />
        <meta property="twitter:title" content="Hospital Gallery | Bethel Specialist Hospital" />
        <meta property="twitter:description" content="Explore our hospital gallery to see images of our modern facilities, state-of-the-art equipment, and dedicated medical staff in Ibadan, Nigeria." />
        <meta property="twitter:image" content="https://www.uismefairng.com/bsh-logo.webp" />
      </Head>
      {/* Page Title */}
      <div className="page-title">
        <div className="breadcrumbs">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/"><i className="bi bi-house" /> Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="#">Category</Link>
              </li>
              <li className="breadcrumb-item active current">Gallery</li>
            </ol>
          </nav>
        </div>
        <div className="title-wrapper">
          <h1>Bethel Specialist Hospital Gallery</h1>
          <p>
            A look into our modern facilities, dedicated staff, and compassionate care.
          </p>
        </div>
      </div>

      {/* Gallery Section */}
      <section id="gallery" className="gallery section">
        <div className="container" data-aos="fade-up" data-aos-delay={100}>
          <div
            className="isotope-layout"
            data-default-filter="*"
            data-layout="masonry"
            data-sort="original-order"
          >
            {/* Filter Tabs */}
            <ul className="gallery-filters isotope-filters" data-aos="fade-up" data-aos-delay={100}>
              <li data-filter="*" className="filter-active">All</li>
              <li data-filter=".filter-facilities">Facilities</li>
              <li data-filter=".filter-staff">Staff</li>
              <li data-filter=".filter-patient-care">Patient Care</li>
              <li data-filter=".filter-community">Community</li>
            </ul>

            {/* Gallery Items */}
            <div className="row g-4 isotope-container" data-aos="fade-up" data-aos-delay={200}>
              {galleryData.map((item) => (
                <div
                  key={item.id}
                  className={`col-lg-4 col-md-6 gallery-item isotope-item ${item.category}`}
                >
                  <div className="gallery-card">
                    <div className="gallery-img">
                      <Image
                        src={item.image}
                        className="img-fluid"
                        alt={item.alt}
                        loading="lazy"
                        width={600}
                        height={400}
                      />
                      <div className="gallery-overlay">
                        <div className="gallery-info">
                          <h4>{item.title}</h4>
                          <p>{item.description}</p>
                          <a
                            href={item.image}
                            className="glightbox gallery-link"
                            data-gallery="gallery-images"
                          >
                            <i className="bi bi-plus-circle" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
