(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const selectors = [
    "main > section",
    "main > .container > section",
    ".hero-content > *",
    ".section-header",
    ".card",
    ".dataset-card",
    ".tool-card",
    ".feature-card",
    ".stats-grid > *",
    ".tools-grid > *",
    ".datasets-grid > *",
    ".docs-section",
    ".about-section",
    ".tool-page-content > main > *"
  ];

  const seen = new Set();
  const elements = [];
  document.querySelectorAll(selectors.join(",")).forEach((el) => {
    if (seen.has(el)) return;
    seen.add(el);
    elements.push(el);
  });

  elements.forEach((el, index) => {
    if (el.closest(".tool-sidebar") || el.closest(".site-header") || el.closest(".site-footer")) return;
    el.classList.add("reveal-item");
    const delay = Math.min((index % 5) * 70, 280);
    el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.10, rootMargin: "0px 0px -40px 0px" });

  elements.forEach((el) => {
    if (el.classList.contains("reveal-item")) observer.observe(el);
  });

  // Subtle pointer depth on larger cards; intentionally restrained for a premium feel.
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tool-card, .dataset-card, .feature-card, .card").forEach((card) => {
      card.classList.add("reveal-float");
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 1.8).toFixed(2)}deg) rotateY(${(x * 1.8).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }
})();
