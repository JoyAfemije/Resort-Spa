// Navigation Toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navbar = document.getElementById("navbar");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });
}

// Close menu when clicking nav links
const navLinks = document.querySelectorAll(".nav-menu a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  });
});

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Animated Counter for Statistics
function animateCounter(element) {
  const target = parseInt(element.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  };

  updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Animate counters
      if (entry.target.classList.contains("stat-number")) {
        animateCounter(entry.target);
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements with fade-in animation
document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-in-on-scroll");
  fadeElements.forEach((el) => observer.observe(el));

  // Observe stat numbers
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers.forEach((el) => {
    el.classList.add("fade-in-on-scroll");
    observer.observe(el);
  });

  // Observe feature cards
  const featureCards = document.querySelectorAll(".feature-card");
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add("fade-in-on-scroll");
    observer.observe(card);
  });

  // Observe testimonial cards
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  testimonialCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`;
    card.classList.add("fade-in-on-scroll");
    observer.observe(card);
  });

  // Observe gallery items
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add("fade-in-on-scroll");
    observer.observe(item);
  });
});

// Newsletter form submission
const newsletterForm = document.querySelector(".newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector("input").value;
    // try sending email notification
    if (typeof sendEmailUsingEmailJS === "function") {
      sendEmailUsingEmailJS("template_newsletter", {
        to_email: "joyafemije@gmail.com",
        subscriber_email: email,
      }).catch(() => {});
    }

    alert(`Thank you for subscribing with email: ${email}`);
    // analytics hook
    if (typeof trackEvent === "function")
      trackEvent("newsletter_subscribe", { email });
    newsletterForm.reset();
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Room card hover effect (for accommodations page)
const roomCards = document.querySelectorAll(".room-card");
roomCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0)";
  });
});

// Booking form validation
const bookingForm = document.querySelector(".booking-form");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (
      !data.name ||
      !data.email ||
      !data.phone ||
      !data.checkin ||
      !data.checkout
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check dates
    const checkin = new Date(data.checkin);
    const checkout = new Date(data.checkout);

    if (checkout <= checkin) {
      alert("Check-out date must be after check-in date");
      return;
    }

    // analytics hook
    if (typeof trackEvent === "function") trackEvent("booking_submit", data);

    // try sending booking details by email (EmailJS or server endpoint)
    if (typeof sendEmailUsingEmailJS === "function") {
      sendEmailUsingEmailJS("template_booking", {
        to_email: "joyafemije@gmail.com",
        name: data.name,
        email: data.email,
        phone: data.phone,
        checkin: data.checkin,
        checkout: data.checkout,
        guests: data.guests || "",
        roomtype: data.roomtype || "",
        message: data.message || "",
      }).catch(() => {});
    }

    alert("Booking request submitted successfully! We will contact you soon.");
    bookingForm.reset();
  });
}

// Image lazy loading
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  const lazyImages = document.querySelectorAll("img.lazy");
  lazyImages.forEach((img) => imageObserver.observe(img));
}

// Add parallax effect to hero image
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector(".hero-image");

  if (heroImage && scrolled < window.innerHeight) {
    heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Gallery lightbox effect
const galleryImages = document.querySelectorAll(".gallery-item");
galleryImages.forEach((item) => {
  item.addEventListener("click", function () {
    const img = this.querySelector("img");
    if (img) {
      // Track event
      if (typeof trackEvent === "function")
        trackEvent("lightbox_open", { src: img.src, alt: img.alt });

      // Create lightbox
      const lightbox = document.createElement("div");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = "hidden";

      // Accessibility: focus trap
      const closeBtn = lightbox.querySelector(".lightbox-close");
      closeBtn.focus();

      // Close lightbox
      function closeLightbox() {
        if (document.body.contains(lightbox)) {
          document.body.removeChild(lightbox);
          document.body.style.overflow = "auto";
          if (typeof trackEvent === "function")
            trackEvent("lightbox_close", { src: img.src });
        }
      }

      lightbox.addEventListener("click", function (e) {
        if (
          e.target === lightbox ||
          e.target.classList.contains("lightbox-close")
        ) {
          closeLightbox();
        }
      });

      // keyboard handlers
      function onKey(e) {
        if (e.key === "Escape") closeLightbox();
      }
      document.addEventListener("keydown", onKey);

      // cleanup listeners when closed
      const observerForLightbox = new MutationObserver(() => {
        if (!document.body.contains(lightbox)) {
          document.removeEventListener("keydown", onKey);
          observerForLightbox.disconnect();
        }
      });
      observerForLightbox.observe(document.body, { childList: true });
    }
  });
});
// Analytics / Event Tracking
function trackEvent(eventName, payload = {}) {
  try {
    // Push to dataLayer if available (e.g., Google Tag Manager)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });

    // Optional: send to analytics endpoint if configured
    if (window.__ANALYTICS_ENDPOINT__) {
      fetch(window.__ANALYTICS_ENDPOINT__, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: eventName,
          payload,
          url: location.href,
          ts: Date.now(),
        }),
      }).catch(() => {});
    } else {
      // fallback debug log
      console.log("trackEvent", eventName, payload);
    }
  } catch (err) {
    console.warn("trackEvent error", err);
  }
}

// Back-to-top button
(function initBackToTop() {
  const btn = document.createElement("button");
  btn.id = "backToTop";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "↑";
  btn.style.display = "none";
  btn.style.position = "fixed";
  btn.style.right = "20px";
  btn.style.bottom = "30px";
  btn.style.width = "44px";
  btn.style.height = "44px";
  btn.style.borderRadius = "50%";
  btn.style.border = "none";
  btn.style.background = "var(--color-primary)";
  btn.style.color = "var(--color-white)";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "var(--shadow-md)";
  btn.style.zIndex = "10000";
  btn.style.fontSize = "22px";
  document.body.appendChild(btn);

  function toggle() {
    if (window.scrollY > 300) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  }
  window.addEventListener("scroll", throttle(toggle, 150));
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    trackEvent("back_to_top");
  });
})();

// Cookie consent banner
(function initCookieConsent() {
  const KEY = "sh_cookie_consent";
  if (localStorage.getItem(KEY) === "accepted") return;

  const banner = document.createElement("div");
  banner.id = "cookieConsent";
  banner.innerHTML = `
        <div class="cookie-inner">
            <p>We use cookies to improve your experience. By using this site you agree to our use of cookies.</p>
            <div class="cookie-actions">
                <button id="cookieAccept" class="btn">Accept</button>
            </div>
        </div>
    `;
  Object.assign(banner.style, {
    position: "fixed",
    left: "20px",
    right: "20px",
    bottom: "20px",
    background: "rgba(26,26,26,0.95)",
    color: "white",
    padding: "16px",
    borderRadius: "8px",
    zIndex: "10001",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  });
  document.body.appendChild(banner);

  document.getElementById("cookieAccept").addEventListener("click", () => {
    localStorage.setItem(KEY, "accepted");
    banner.remove();
    trackEvent("cookie_consent", { accepted: true });
  });
})();

// Utility: throttle
function throttle(func, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      func.apply(this, args);
    }
  };
}

// Email sending helper (EmailJS)
function sendEmailUsingEmailJS(templateId, templateParams = {}) {
  // Config: set these on window.__EMAILJS_CONFIG__ or replace placeholders
  const cfg = window.__EMAILJS_CONFIG__ || {};
  const PUBLIC_KEY = cfg.publicKey || "YOUR_EMAILJS_PUBLIC_KEY";
  const SERVICE_ID = cfg.serviceId || "YOUR_EMAILJS_SERVICE_ID";
  const TEMPLATE_ID =
    templateId || cfg.templateId || "YOUR_EMAILJS_TEMPLATE_ID";

  if (PUBLIC_KEY.startsWith("YOUR_") || SERVICE_ID.startsWith("YOUR_")) {
    console.warn(
      "EmailJS not configured. Set window.__EMAILJS_CONFIG__ with publicKey and serviceId.",
    );
    return Promise.resolve(null);
  }

  if (typeof emailjs === "undefined") {
    console.warn("EmailJS SDK not loaded.");
    return Promise.resolve(null);
  }

  try {
    emailjs.init(PUBLIC_KEY);
    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  } catch (err) {
    console.warn("sendEmailUsingEmailJS error", err);
    return Promise.reject(err);
  }
}

// Add lightbox styles dynamically
const style = document.createElement("style");
style.textContent = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .lightbox-content {
        max-width: 90%;
        max-height: 90%;
        position: relative;
    }

    .lightbox img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }

    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 40px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .lightbox-close:hover {
        color: var(--color-secondary);
        transform: scale(1.2);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);
