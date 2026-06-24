/* KeyCart — interactions. Vanilla, no deps. Respects reduced-motion.
   Wird auf allen Seiten geladen; Effekte ohne passendes Element werden
   übersprungen (Null-Checks), daher unbedenklich pro Seite. */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- nav shrink on scroll ---------- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- subtle parallax on hero art ---------- */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    const layers = document.querySelectorAll("[data-parallax]");
    const art = document.querySelector(".hero__art");
    let raf = null, tx = 0, ty = 0;
    const apply = () => {
      layers.forEach((el) => {
        const d = parseFloat(el.dataset.parallax);
        el.style.transform = `translate(${tx * d * 40}px, ${ty * d * 40}px)`;
      });
      raf = null;
    };
    if (art) {
      art.addEventListener("mousemove", (e) => {
        const r = art.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - 0.5;
        ty = (e.clientY - r.top) / r.height - 0.5;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      art.addEventListener("mouseleave", () => {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(apply);
      });
    }
  }
})();
