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
    seen.add(el);
    elements.push(el);
    el.classList.add("reveal-item");
    if (!reduceMotion) {
      el.style.setProperty("--reveal-delay", `${Math.min((elements.length - 1) % 5, 4) * 38}ms`);
      const index = elements.length - 1;
      if (index % 3 === 1) el.classList.add("reveal-left");
      else if (index % 3 === 2) el.classList.add("reveal-right");
    }
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
    }, { threshold: 0.04, rootMargin: "0px 0px -12px 0px" });
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

  // Gentle Home-only parallax: foreground content, glows and constellation layers move at different rates.
  if (!reduceMotion && document.body.classList.contains("home-page")) {
    const layers = [
      ...document.querySelectorAll(".hero-glow"),
      ...document.querySelectorAll(".ai-network-one"),
      ...document.querySelectorAll(".ai-network-two")
    ];
    if (layers.length) {
      let ticking = false;
      const updateParallax = () => {
        const y = window.scrollY || 0;
        layers.forEach((layer, index) => {
          const speed = index === 0 ? 0.055 : index === 1 ? 0.035 : index === 2 ? -0.022 : -0.012;
          layer.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        });
        ticking = false;
      };
      window.addEventListener("scroll", () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      }, { passive: true });
      updateParallax();
    }
  }
})();
