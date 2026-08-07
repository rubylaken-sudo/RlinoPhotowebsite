// Rlino Photo — nav toggle + booking form handling

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  const dateInput = document.getElementById("session-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }

  const form = document.getElementById("booking-form");
  if (form) {
    initBookingForm(form);
  }

  initScrollReveal();
});

function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function initBookingForm(form) {
  const status = document.getElementById("form-status");
  const submitBtn = form.querySelector('button[type="submit"]');
  const recaptchaWrapper = form.querySelector('[data-field="recaptcha"]');

  const validators = {
    name: (v) => v.trim().length >= 2 || "Please enter your full name.",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
      "Please enter a valid email address.",
    phone: (v) => v.trim().length >= 7 || "Please enter a valid phone number.",
    "session-type": (v) => v !== "" || "Please choose a session type.",
    "session-date": (v) => v !== "" || "Please choose a preferred date.",
    "session-time": (v) => v !== "" || "Please choose a preferred time.",
  };

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    let valid = true;
    Object.keys(validators).forEach((id) => {
      const field = document.getElementById(id);
      if (field && !validateField(field)) valid = false;
    });

    let recaptchaOk = true;
    if (recaptchaWrapper) {
      recaptchaOk =
        typeof grecaptcha !== "undefined" && grecaptcha.getResponse().length > 0;
      recaptchaWrapper.classList.toggle("error", !recaptchaOk);
    }

    if (!valid || !recaptchaOk) {
      showStatus("Please fix the highlighted fields above.", "error");
      return;
    }

    // Honeypot: if filled, silently drop (bot submission)
    const honey = form.querySelector('input[name="_honey"]');
    if (honey && honey.value) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (response.ok) {
        showStatus(
          "Thank you! Your booking request has been sent. We'll reply within 1-2 business days to confirm your date.",
          "success"
        );
        form.reset();
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
      } else {
        throw new Error("Request failed");
      }
    } catch (err) {
      showStatus(
        "Something went wrong sending your request. Please email us directly or try again.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Request Booking";
    }
  });

  function validateField(field) {
    const rule = validators[field.id];
    const wrapper = field.closest(".field");
    if (!rule) return true;

    const result = rule(field.value);
    if (result === true) {
      wrapper.classList.remove("error");
      return true;
    }

    wrapper.classList.add("error");
    const errorEl = wrapper.querySelector(".field-error");
    if (errorEl) errorEl.textContent = result;
    return false;
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `form-status visible ${type}`;
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}
