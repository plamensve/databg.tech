(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const selectors = [
    "main > section", "main > .container > section", ".hero-content > *",
    ".section-header", ".card", ".dataset-card", ".tool-card", ".feature-card",
    ".stats-grid > *", ".tools-grid > *", ".datasets-grid > *", ".docs-section",
    ".about-section", ".tool-page-content > main > *"
  ];

  const seen = new Set();
  const elements = [];
  document.querySelectorAll(selectors.join(",")).forEach((el) => {
    if (seen.has(el) || el.closest(".tool-sidebar") || el.closest(".site-header") || el.closest(".site-footer")) return;
    seen.add(el); elements.push(el);
    el.classList.add("reveal-item");
    if (!reduceMotion) el.style.setProperty("--reveal-delay", `${Math.min((elements.length - 1) % 6, 5) * 60}ms`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.10, rootMargin: "0px 0px -40px 0px" });
    elements.forEach(el => observer.observe(el));
  }

  if (!reduceMotion && finePointer) {
    document.querySelectorAll(".tool-card, .dataset-card, .feature-card, .card").forEach(card => {
      card.classList.add("reveal-float");
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${(-y * 1.8).toFixed(2)}deg) rotateY(${(x * 1.8).toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
})();
