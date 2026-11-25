// Rlino Photo — photobooth page interactions
// Scroll progress, camera flash, parallax blobs, card tilt, quote calculator.

document.addEventListener("DOMContentLoaded", () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  initProgress();
  initFlash();
  if (!reduce) {
    initParallax();
    initTilt();
  }
  initPricing(reduce);
});

function initProgress() {
  const bar = document.querySelector(".pb-progress");
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// White "camera flash" when pressing a [data-flash] button, then scroll on.
function initFlash() {
  const flash = document.querySelector(".pb-flash");
  if (!flash) return;
  document.querySelectorAll("[data-flash]").forEach((el) => {
    el.addEventListener("click", () => {
      flash.classList.remove("go");
      void flash.offsetWidth;
      flash.classList.add("go");
    });
  });
}

function initParallax() {
  const hero = document.querySelector(".hero");
  const blobs = document.querySelectorAll(".pb-blob");
  if (!hero || !blobs.length) return;
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    blobs.forEach((b, i) => {
      const d = (i + 1) * 30;
      b.style.transform = `translate(${x * d}px, ${y * d}px)`;
    });
  });
}

// Subtle 3D tilt on cards (mouse only)
function initTilt() {
  document.querySelectorAll(".service-card, .pricing-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || !card.classList.contains("in-view")) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transitionDelay = "0s";
      card.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

function initPricing(reduce) {
  const cards = [...document.querySelectorAll(".pricing-card[data-package]")];
  const tabs = [...document.querySelectorAll(".pb-tabs button")];
  const range = document.getElementById("pb-hours");
  const hoursOut = document.getElementById("pb-hours-out");
  const amountEl = document.getElementById("pb-amount");
  const breakdownEl = document.getElementById("pb-breakdown");
  const quoteBtn = document.getElementById("pb-quote");
  if (!cards.length || !range) return;

  const TRAVEL = 50;
  let current = cards.find((c) => c.dataset.default !== undefined) || cards[0];
  let shown = 0;
  let raf;
  let settle;

  const rate = () => Number(current.dataset.rate);
  const hours = () => Number(range.value);
  const total = () => rate() * hours() + TRAVEL;

  function animateTo(target) {
    cancelAnimationFrame(raf);
    clearTimeout(settle);
    // Guarantee the final value even if animation frames are paused (background tab)
    settle = setTimeout(() => {
      shown = target;
      amountEl.textContent = `€${target}`;
    }, 450);
    if (reduce) {
      shown = target;
      amountEl.textContent = `€${target}`;
      return;
    }
    const from = shown;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / 350, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      shown = Math.round(from + (target - from) * eased);
      amountEl.textContent = `€${shown}`;
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  function render() {
    cards.forEach((c) => c.classList.toggle("selected", c === current));
    tabs.forEach((t) => {
      const on = t.dataset.package === current.dataset.package;
      t.classList.toggle("active", on);
      t.setAttribute("aria-pressed", String(on));
    });
    const h = hours();
    hoursOut.textContent = `${h} ${h === 1 ? "hour" : "hours"}`;
    breakdownEl.textContent = `${h} × €${rate()} + €${TRAVEL} travel costs · excl. VAT`;
    animateTo(total());
  }

  function select(name) {
    const next = cards.find((c) => c.dataset.package === name);
    if (next) {
      current = next;
      render();
    }
  }

  cards.forEach((c) => {
    c.addEventListener("click", () => select(c.dataset.package));
    const btn = c.querySelector(".pb-choose");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        select(c.dataset.package);
        document.querySelector(".pb-calc").scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "center",
        });
      });
    }
  });
  tabs.forEach((t) => t.addEventListener("click", () => select(t.dataset.package)));
  range.addEventListener("input", render);

  // Send the chosen package into the booking form's message box
  quoteBtn.addEventListener("click", () => {
    const h = hours();
    const line = `Package: ${current.dataset.package}, ${h} ${h === 1 ? "hour" : "hours"} — estimate €${total()} excl. VAT (incl. €${TRAVEL} travel costs).`;
    const msg = document.getElementById("message");
    if (msg && !msg.value.includes(line)) {
      msg.value = msg.value.replace(/^Package: .*\n?/m, "");
      msg.value = msg.value ? `${line}\n${msg.value}` : line;
    }
    const type = document.getElementById("session-type");
    if (type) type.value = "Photobooth";
  });

  render();
}

// Services dropdown: tap/click toggle, close on outside click or Escape
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".has-dropdown").forEach((item) => {
    const btn = item.querySelector(".dropdown-toggle");
    if (!btn) return;
    const set = (open) => {
      item.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
    };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      set(!item.classList.contains("open"));
    });
    document.addEventListener("click", (e) => {
      if (!item.contains(e.target)) set(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        set(false);
        btn.blur();
      }
    });
  });
});
