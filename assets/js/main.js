(() => {
  "use strict";

  const doc = document.documentElement;
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const progressBar = document.getElementById("progressBar");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header + scroll progress ---------- */

  let scrollTicking = false;

  const updateOnScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 24);

    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(y / max, 1) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
    scrollTicking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateOnScroll);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateOnScroll);
  updateOnScroll();

  /* ---------- Mobile menu ---------- */

  const closeMenu = (returnFocus = false) => {
    if (!body.classList.contains("menu-open")) return;
    body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "打开菜单";
    if (returnFocus) menuToggle.focus();
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.querySelector(".sr-only").textContent = isOpen ? "关闭菜单" : "打开菜单";

    if (isOpen) {
      const firstLink = nav.querySelector("a");
      if (firstLink) {
        window.setTimeout(() => firstLink.focus({ preventScroll: true }), 60);
      }
    } else {
      menuToggle.focus({ preventScroll: true });
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("menu-open")) {
      closeMenu(true);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });

  /* ---------- Scroll reveal ---------- */

  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));

  revealElements.forEach((el) => {
    const gallery = el.closest(".gallery");
    if (gallery) {
      const siblings = Array.from(gallery.querySelectorAll("[data-reveal]"));
      const index = siblings.indexOf(el);
      if (index > 0) el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
    }
  });

  if ("IntersectionObserver" in window && !prefersReduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Hero parallax ---------- */

  const heroImage = document.querySelector(".hero__media img");
  const finePointer = window.matchMedia("(pointer: fine)");

  if (heroImage && finePointer.matches && !prefersReduced) {
    let frame = null;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener(
      "mousemove",
      (event) => {
        targetX = (event.clientX / window.innerWidth - 0.5) * 20;
        targetY = (event.clientY / window.innerHeight - 0.5) * 14;

        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          heroImage.style.transform = `scale(1.045) translate3d(${targetX}px, ${targetY}px, 0)`;
          frame = null;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Lightbox ---------- */

  const shots = Array.from(document.querySelectorAll(".shot__btn[data-full]"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxIndex = document.getElementById("lightboxIndex");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  if (shots.length && lightbox) {
    let current = 0;
    let lastFocused = null;
    let isOpen = false;

    const pad = (n) => String(n).padStart(2, "0");

    const preloadNeighbors = () => {
      [current + 1, current - 1].forEach((i) => {
        const index = (i + shots.length) % shots.length;
        const img = new Image();
        img.src = shots[index].dataset.full;
      });
    };

    const render = () => {
      const shot = shots[current];
      const thumbnail = shot.querySelector("img");

      lightboxImage.src = shot.dataset.full;
      lightboxImage.alt = thumbnail ? thumbnail.alt : "";
      lightboxCaption.textContent = shot.dataset.caption || "";
      lightboxIndex.textContent = `${pad(current + 1)} / ${pad(shots.length)}`;

      preloadNeighbors();
    };

    const open = (index) => {
      lastFocused = document.activeElement;
      current = index;
      render();

      isOpen = true;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      body.classList.add("no-scroll");

      window.setTimeout(() => lightboxClose.focus({ preventScroll: true }), 60);
    };

    const close = () => {
      isOpen = false;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      body.classList.remove("no-scroll");

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus({ preventScroll: true });
      }
    };

    const go = (delta) => {
      current = (current + delta + shots.length) % shots.length;
      render();
    };

    shots.forEach((shot, index) => {
      shot.addEventListener("click", () => open(index));
    });

    lightboxClose.addEventListener("click", close);
    lightboxPrev.addEventListener("click", () => go(-1));
    lightboxNext.addEventListener("click", () => go(1));

    lightbox.querySelector("[data-close]").addEventListener("click", close);

    document.addEventListener("keydown", (event) => {
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
        return;
      }

      if (event.key === "Tab") {
        const focusables = [lightboxClose, lightboxPrev, lightboxNext];
        const index = focusables.indexOf(document.activeElement);
        event.preventDefault();

        const nextIndex = event.shiftKey
          ? index <= 0
            ? focusables.length - 1
            : index - 1
          : index === -1 || index === focusables.length - 1
            ? 0
            : index + 1;

        focusables[nextIndex].focus();
      }
    });
  }
})();
