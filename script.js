// script.js — drop this into your site folder and reference it after the GSAP CDN
// (If you prefer, remove the CDN from the pages — this file will load GSAP if it's missing.)

document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP is loaded (load from CDN if not)
  function ensureGSAP(cb) {
    if (window.gsap) return cb();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    s.onload = cb;
    s.onerror = () => console.error("Failed to load GSAP CDN.");
    document.head.appendChild(s);
  }

  ensureGSAP(initAnimations);

  function initAnimations() {
    const logo = document.querySelector(".logo");
    const navLinks = document.querySelector(".nav-links");
    const hamburger = document.getElementById("hamburger");

    // Check if nav animations already ran this session
    const alreadyAnimated = sessionStorage.getItem("navAnimated");

    if (!alreadyAnimated && logo && navLinks && window.gsap) {
      // Mark as animated
      sessionStorage.setItem("navAnimated", "true");

      // Logo typing animation
      gsap.to(logo, {
        duration: 1.5,
        width: "2ch",
        ease: "steps(2)",
        onComplete: () => gsap.set(logo, { borderRight: "none" }),
      });

      // Nav links stagger in (desktop only)
      const links = navLinks.querySelectorAll("a");
      const computed = window.getComputedStyle(navLinks);
      if (computed.display !== "none" && window.innerWidth > 768) {
        gsap.from(links, {
          opacity: 0,
          y: -20,
          duration: 0.6,
          stagger: 0.18,
          delay: 1.5,
        });
      }
    } else {
      // Skip animation — show instantly
      if (logo && window.gsap) gsap.set(logo, { width: "2ch", borderRight: "none" });
    }

    // Main content animations (run every time)
    if (window.gsap) {
      gsap.from(".home h1", { opacity: 0, y: -30, duration: 1, delay: 0.2 });
      gsap.from(".box", { opacity: 0, y: 50, duration: 0.8, stagger: 0.3, delay: 0.6 });
      gsap.from(".contact", { opacity: 0, y: 30, duration: 1, delay: 1 });
    }

    // Mobile hamburger / dropdown animation — measured height approach
    if (hamburger && navLinks && window.gsap) {
      hamburger.addEventListener("click", () => {
        const isOpen = navLinks.classList.contains("open");

        if (!isOpen) {
          // prepare dropdown for measurement
          navLinks.style.display = "flex";          // make it render
          navLinks.style.overflow = "hidden";
          navLinks.style.height = "auto";           // let it settle to natural height
          const full = navLinks.scrollHeight + "px";
          navLinks.style.height = "0px";            // collapse to 0 to start animation

          // open animation
          gsap.to(navLinks, {
            height: full,
            autoAlpha: 1,
            duration: 0.32,
            ease: "power1.out",
            onComplete: () => {
              navLinks.style.height = "";            // restore natural height
              navLinks.style.overflow = "";
            },
          });

          // stagger child link animation
          const anchors = navLinks.querySelectorAll("a");
          gsap.fromTo(
            anchors,
            { opacity: 0, x: 24 },
            { opacity: 1, x: 0, stagger: 0.08, duration: 0.28, delay: 0.04 }
          );

          navLinks.classList.add("open");
          hamburger.setAttribute("aria-expanded", "true");
        } else {
          // close animation
          navLinks.style.overflow = "hidden";
          const currentH = navLinks.scrollHeight + "px";
          // animate to 0 then hide
          gsap.fromTo(
            navLinks,
            { height: currentH, autoAlpha: 1 },
            {
              height: 0,
              autoAlpha: 0,
              duration: 0.26,
              ease: "power1.in",
              onComplete: () => {
                navLinks.style.display = "none";
                navLinks.classList.remove("open");
                navLinks.style.height = "";
                navLinks.style.overflow = "";
                hamburger.setAttribute("aria-expanded", "false");
              },
            }
          );
        }
      });
    }
  }
});
