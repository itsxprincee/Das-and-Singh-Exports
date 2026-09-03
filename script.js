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

    // 2. Header & Navbar Scroll Effect
    const siteHeader = document.getElementById("siteHeader");
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
        if (window.scrollY > 30) {
            siteHeader?.classList.add("scrolled");
            navbar?.classList.add("scrolled");
        } else {
            siteHeader?.classList.remove("scrolled");
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

        // Mobile dropdown toggles
        document.querySelectorAll(".nav-dropdown-toggle").forEach((toggleBtn) => {
            toggleBtn.addEventListener("click", (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    e.stopPropagation();
                    const parentDropdown = toggleBtn.closest(".nav-dropdown");
                    if (parentDropdown) {
                        // Close other dropdowns
                        document.querySelectorAll(".nav-dropdown").forEach((d) => {
                            if (d !== parentDropdown) d.classList.remove("open");
                        });
                        parentDropdown.classList.toggle("open");
                    }
                }
            });
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

        // Close mobile menu when clicking anywhere outside
        document.addEventListener("click", (e) => {
            if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
                navMenu.classList.remove("open");
                const icon = menuBtn.querySelector("i");
                if (icon) {
                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");
                }
            }
        });
    }

    // 4. Smooth Redirect to Top for Logo & Home Links (Homepage only)
    document.addEventListener("click", (e) => {
        const path = window.location.pathname;
        const isHomePage = path.endsWith("index.html") || path === "/" || path.endsWith("/") || !path.includes(".html");
        
        const homeAnchor = e.target.closest("a[href='#home'], a[href='#top']");
        const logo = e.target.closest(".logo");
        
        if (homeAnchor && isHomePage) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
            if (window.history.pushState) {
                window.history.pushState(null, null, "#home");
            }
        } else if (logo && isHomePage) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
        }
    });

    // 5. ScrollSpy / Active Navigation State
    const sections = document.querySelectorAll("section[id], footer[id]");
    const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 140;
        const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

        if (window.scrollY < 200) {
            navLinks.forEach((link) => link.classList.remove("active"));
            const homeLink = document.querySelector(".nav-menu a[href='#home']");
            if (homeLink) homeLink.classList.add("active");
            return;
        }

        if (isBottom) {
            navLinks.forEach((link) => link.classList.remove("active"));
            const contactLink = document.querySelector(".nav-menu a[href='#contact']");
            if (contactLink) contactLink.classList.add("active");
            return;
        }

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
    updateActiveNav();

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
            const params = new URLSearchParams();
            for (const [key, value] of formData.entries()) {
                params.append(key, value);
            }
            params.append("submittedAt", new Date().toLocaleString());

            // Loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Sending Inquiry...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            }

            try {
                if (GOOGLE_SHEETS_WEBAPP_URL && GOOGLE_SHEETS_WEBAPP_URL.trim() !== "") {
                    // Send data to Google Apps Script Web App
                    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
                        method: "POST",
                        mode: "no-cors",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: params.toString()
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
                console.error("Error submitting inquiry:", error);
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


    // 7. One-Click Copy for HSN & Tax Codes
    document.querySelectorAll(".hsn-badge, .cert-code-value span").forEach((elem) => {
        elem.style.cursor = "pointer";
        elem.title = "Click to copy code";
        elem.addEventListener("click", () => {
            const textToCopy = elem.innerText.replace("HSN", "").trim();
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (toast) {
                    toast.innerHTML = `<i class="fa-solid fa-copy"></i> <span>Copied "${textToCopy}" to clipboard!</span>`;
                    toast.classList.add("show");
                    setTimeout(() => {
                        toast.classList.remove("show");
                    }, 3500);
                }
            });
        });
    });

    // 8. International Trade FAQ Accordion
    document.querySelectorAll(".faq-question").forEach((btn) => {
        btn.addEventListener("click", () => {
            const parentItem = btn.closest(".faq-item");
            if (parentItem) {
                const isOpen = parentItem.classList.contains("open");
                // Close other open FAQ items
                document.querySelectorAll(".faq-item").forEach((item) => {
                    item.classList.remove("open");
                });
                if (!isOpen) {
                    parentItem.classList.add("open");
                }
            }
        });
    });

    // 9. Download / Print Spec Sheet Triggers
    document.querySelectorAll(".download-specs-btn, [data-action='print-specs']").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            window.print();
        });
    });
});


