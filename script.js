// ==========================================
// CONFIGURATION: Google Sheets Web App URL
// Paste your deployed Google Apps Script Web App URL below:
// ==========================================
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzdfvS6xFffAvf-kxyRbWcmuB1UbrALHSwH6cRbQZxynrAtP9_7NYGOPKD28gFaicXIpA/exec";

document.addEventListener("DOMContentLoaded", () => {
    // 1. Dynamic Year in Footer
    const yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // 3. Mobile Menu Toggle
    const menuBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");
            const icon = menuBtn.querySelector("i");
            if (icon) {
                if (isOpen) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");
                } else {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });

        // Close mobile menu when a nav link is clicked
        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            });
        });
    }

    // 4. ScrollSpy / Active Navigation State
    const sections = document.querySelectorAll("section[id], footer[id]");
    const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    };
    window.addEventListener("scroll", updateActiveNav, { passive: true });

    // 5. Quote Form Submission -> Google Sheets Web App
    const quoteForm = document.getElementById("quoteForm");
    const toast = document.getElementById("toast");

    if (quoteForm) {
        quoteForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = quoteForm.querySelector("button[type='submit']");
            const originalBtnContent = submitBtn ? submitBtn.innerHTML : "Send Export Inquiry";

            // Collect form data
            const formData = new FormData(quoteForm);
            const data = {
                name: formData.get("name") || "",
                company: formData.get("company") || "",
                email: formData.get("email") || "",
                country: formData.get("country") || "",
                product: formData.get("product") || "",
                message: formData.get("message") || "",
                submittedAt: new Date().toLocaleString()
            };

            // Loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `Sending Inquiry... <i class="fa-solid fa-spinner fa-spin"></i>`;
            }

            try {
                if (GOOGLE_SHEETS_WEBAPP_URL && GOOGLE_SHEETS_WEBAPP_URL.trim() !== "") {
                    // Send data to Google Apps Script Web App (no-cors prevents browser CORS blocking)
                    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                } else {
                    console.info("Google Sheets Web App URL not configured in script.js yet. Simulating success.");
                }

                // Show success toast notification
                if (toast) {
                    toast.classList.add("show");
                    setTimeout(() => {
                        toast.classList.remove("show");
                    }, 5000);
                }

                // Reset the form fields
                quoteForm.reset();
            } catch (error) {
                console.error("Error submitting inquiry to Google Sheets:", error);
                alert("There was an issue sending your inquiry. Please contact us directly via email or WhatsApp.");
            } finally {
                // Restore button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }
            }
        });
    }

    // 6. Scroll Reveal Observer
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0 && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    }
});
