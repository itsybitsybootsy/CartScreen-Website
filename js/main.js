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

  /* ---------- mobile nav (Burger-Menü) ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    const setOpen = (open) => {
      navLinks.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };
    navToggle.addEventListener("click", () =>
      setOpen(navToggle.getAttribute("aria-expanded") !== "true")
    );
    navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 680) setOpen(false); });
  }

  /* ---------- E-Mail-Links: Adresse kopieren + Bestätigung ----------
     Ein mailto: öffnet nur dann etwas, wenn ein Mailprogramm eingerichtet ist.
     Damit trotzdem sichtbar etwas passiert, kopieren wir die Adresse und
     zeigen einen kurzen Hinweis. Das Mailprogramm öffnet zusätzlich (kein preventDefault). */
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length) {
    const toast = (msg) => {
      let el = document.getElementById("kc-toast");
      if (!el) { el = document.createElement("div"); el.id = "kc-toast"; el.className = "toast"; document.body.appendChild(el); }
      el.textContent = msg;
      setTimeout(() => el.classList.add("show"), 10);
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove("show"), 2400);
    };
    mailLinks.forEach((a) => a.addEventListener("click", () => {
      const addr = a.getAttribute("href").replace(/^mailto:/, "").split("?")[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr)
          .then(() => toast("E-Mail-Adresse kopiert: " + addr))
          .catch(() => toast(addr));
      } else {
        toast(addr);
      }
    }));
  }

  /* ---------- Kontaktformular (mailto) ----------
     Statische Seite ohne Backend: baut aus den Eingaben eine E-Mail und
     öffnet das Mailprogramm. Kein Drittanbieter, keine zusätzliche Verarbeitung. */
  const kform = document.getElementById("kontaktform");
  if (kform) {
    const status = document.getElementById("kontakt-status");
    kform.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!kform.reportValidity()) return;
      const val = (id) => (document.getElementById(id)?.value || "").trim();
      const name = val("kf-name");
      const body =
        "Name: " + name + "\n" +
        "E-Mail: " + val("kf-email") + "\n" +
        "Organisation / Filiale: " + (val("kf-org") || "—") + "\n\n" +
        val("kf-msg") + "\n";
      window.location.href =
        "mailto:team.keycart@gmail.com?subject=" +
        encodeURIComponent("KeyCart-Anfrage von " + name) +
        "&body=" + encodeURIComponent(body);
      if (status) {
        status.hidden = false;
        status.textContent =
          "Ihr E-Mail-Programm wurde geöffnet. Falls nicht, schreiben Sie bitte direkt an team.keycart@gmail.com.";
      }
    });
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
