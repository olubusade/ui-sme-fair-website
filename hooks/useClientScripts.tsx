// hooks/useClientScripts.tsx
"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    AOS: any;
    PureCounter: any;
    Swiper: any;
    GLightbox: any;
    Isotope: any;
    imagesLoaded: any;
  }
}

export default function useClientScripts() {
  useEffect(() => {
    const select = (el: string, all = false): any =>
      all ? [...document.querySelectorAll(el)] : document.querySelector(el);

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

    // Toggle .scrolled class on scroll
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

    document.addEventListener("scroll", toggleScrolled);
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
    document.addEventListener("scroll", toggleScrollTop);

    // AOS
    window.addEventListener("load", () => {
      window.AOS?.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    });

    // PureCounter
    if (window.PureCounter) new window.PureCounter();

    // Swiper Init
    const initSwiper = () => {
      select(".init-swiper", true).forEach((swiperElement: any) => {
        const configText = swiperElement.querySelector(".swiper-config")?.innerHTML?.trim();
        if (configText) {
          const config = JSON.parse(configText);
          new window.Swiper(swiperElement, config);
        }
      });
    };
    window.addEventListener("load", initSwiper);

    // Isotope
    select(".isotope-layout", true).forEach((item: any) => {
      const layout = item.dataset.layout || "masonry";
      const filter = item.dataset.defaultFilter || "*";
      const sort = item.dataset.sort || "original-order";

      window.imagesLoaded(item.querySelector(".isotope-container"), () => {
        const iso = new window.Isotope(item.querySelector(".isotope-container"), {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        });

        const filterButtons = document.querySelectorAll(".isotope-filters li");

        filterButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const activeBtn = document.querySelector(".isotope-filters .filter-active");
                activeBtn?.classList.remove("filter-active");

                btn.classList.add("filter-active");

                const filterValue = btn.getAttribute("data-filter");
                if (filterValue) {
                iso.arrange({ filter: filterValue });
                }

                if (typeof window.AOS?.init === "function") {
                window.AOS.init();
                }
            });
        });

      });
    });

    // GLightbox
    window.GLightbox?.({ selector: ".glightbox" });

    // FAQs
    on("click", ".faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header", function (e: Event) {
      const parent = (e.target as HTMLElement).closest(".faq-item");
      parent?.classList.toggle("faq-active");
    }, true);

  }, []);
}
