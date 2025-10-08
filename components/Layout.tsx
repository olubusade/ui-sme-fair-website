// components/Layout.tsx
"use client";

import { useEffect, ReactNode } from 'react';
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  className?: string; // Optional className for the main tag
}

export default function Layout({ children, className = '' }: LayoutProps) {
  
  useEffect(() => {
    const initClientScripts = async () => {
      const select = (el: string | HTMLElement, all = false): any => {
        if (typeof el === 'string') {
          return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
        }
        return el;
      };
      
      const on = (type: string, el: any, listener: any, all = false) => {
        const selectEl = select(el, all);
        if (selectEl) {
          if (all) {
            selectEl.forEach((e: any) => e.addEventListener(type, listener));
          } else {
            selectEl.addEventListener(type, listener);
          }
        }
      };

      // All of your original scripts go here
      const toggleScrolled = () => {
        const body = document.body;
        const header = select("#header");
        if (
          header &&
          (header.classList.contains("scroll-up-sticky") ||
            header.classList.contains("sticky-top") ||
            header.classList.contains("fixed-top"))
        ) {
          window.scrollY > 100
            ? body.classList.add("scrolled")
            : body.classList.remove("scrolled");
        }
      };
      
      on("scroll", document, toggleScrolled);
      window.addEventListener("load", toggleScrolled);

      // Mobile nav toggle
      const mobileNavToggleBtn = select(".mobile-nav-toggle");
      const mobileNavToggle = () => {
        document.body.classList.toggle("mobile-nav-active");
        mobileNavToggleBtn?.classList.toggle("bi-list");
        mobileNavToggleBtn?.classList.toggle("bi-x");
      };
      mobileNavToggleBtn?.addEventListener("click", mobileNavToggle);

      // Hide nav on link click
      on("click", "#navmenu a", () => {
        if (document.body.classList.contains("mobile-nav-active")) {
          mobileNavToggle();
        }
      }, true);

      // Mobile nav dropdown toggle
      on("click", ".navmenu .toggle-dropdown", function (e: Event) {
        e.preventDefault();
        const parent = (e.target as HTMLElement).parentElement;
        if (parent) {
          parent.classList.toggle("active");
          parent.nextElementSibling?.classList.toggle("dropdown-active");
        }
      }, true);

      // Preloader
      const preloader = select("#preloader");
      if (preloader) {
        window.addEventListener("load", () => {
          preloader.remove();
        });
      }

      // Scroll top button
      const scrollTop = select(".scroll-top");
      const toggleScrollTop = () => {
        if (scrollTop) {
          scrollTop.classList.toggle("active", window.scrollY > 100);
        }
      };
      scrollTop?.addEventListener("click", (e: Event) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      window.addEventListener("load", toggleScrollTop);
      on("scroll", document, toggleScrollTop);
      
      try {
        const Swiper = (await import('swiper')).default;
        document.querySelectorAll(".swiper").forEach(function(swiperElement) {
          if (swiperElement instanceof HTMLElement) {
            let config:any = {};
            const configElement = swiperElement.querySelector(".swiper-config");
            if (configElement) {
              try {
                config = JSON.parse(configElement.innerHTML.trim());
              } catch (e) {
                console.error("Error parsing Swiper config:", e);
              }
            } else {
              // Default config if no swiper-config script is present
              config = {
                  speed: 600,
                  loop: true,
                  autoplay: {
                      delay: 5000,
                      disableOnInteraction: false,
                  },
                  slidesPerView: "auto",
                  pagination: {
                      el: ".swiper-pagination",
                      type: "bullets",
                      clickable: true,
                  },
                  breakpoints: {
                      320: {
                          slidesPerView: 1,
                          spaceBetween: 40
                      },
                      1200: {
                          slidesPerView: 1,
                          spaceBetween: 40
                      }
                  },
                  navigation: {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                  },
              };
            }
            new Swiper(swiperElement, config);
          }
        });
        
        // Dynamic import and initialization of client-side libraries
        const AOS = (await import('aos')).default;
        AOS.init({
          duration: 600,
          easing: 'ease-in-out',
          once: true,
          mirror: false
        });

        const PureCounter = (await import('@srexi/purecounterjs')).default;
        new PureCounter();
      
      } catch (error) {
        console.error("Error loading client-side libraries:", error);
      }
    };
    
    if (typeof window !== 'undefined') {
      initClientScripts();
    }
  }, []);

  return (
    <>
      <Header />
        <main className={`main ${className}`}>
          {children}
        </main>
      <Footer />
    </>
  );
}
