// ===== Основные функции для шапки, меню и исчезновения header =====
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const burger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Hide/Show Header при скролле вниз/вверх (супер оптимизация)
  function onScroll() {
    // Эффект прозрачности
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    // Скрыть header при скролле вниз, показать при вверх
    if (
      window.scrollY > 80 &&
      window.scrollY > lastScrollY &&
      !(navLinks && navLinks.classList.contains("show"))
    ) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
    lastScrollY = window.scrollY;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  });

  // Мобильное меню (бургер)
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("active");
      navLinks.classList.toggle("show");
      if (navLinks.classList.contains("show")) {
        header.classList.remove("hide");
      }
    });
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth < 800 &&
        !navLinks.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        navLinks.classList.remove("show");
        burger.classList.remove("active");
      }
    });
  }

  // ===== Цифры-аниматор (факты) =====
  let factsAnimated = false;
  function animateFacts() {
    document.querySelectorAll(".fact-number").forEach((el) => {
      const target = +el.dataset.target;
      let current = 0;
      const inc = Math.ceil(target / 70);
      function update() {
        current += inc;
        if (current > target) current = target;
        el.textContent = current;
        if (current < target) requestAnimationFrame(update);
      }
      update();
    });
  }
  function factsOnScroll() {
    if (factsAnimated) return;
    const bar = document.querySelector(".facts-bar");
    if (bar) {
      const top = bar.getBoundingClientRect().top;
      if (top < window.innerHeight - 60) {
        animateFacts();
        factsAnimated = true;
        window.removeEventListener("scroll", factsOnScroll);
      }
    }
  }
  window.addEventListener("scroll", factsOnScroll);

  // ===== Fade-in (плавное появление блоков) =====
  document.querySelectorAll(".fade-in").forEach((el) => el.classList.remove("visible"));
  const observer = new window.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

  // ===== Parallax (герой-блоки) =====
  window.addEventListener("scroll", () => {
    const parallax = document.querySelector(".parallax-bg, .about-bg");
    if (parallax) {
      const scrolled = window.scrollY;
      const speed = window.innerWidth < 768 ? 0.2 : 0.08;
      parallax.style.transform = `translateY(${scrolled * speed}px)`;
    }
  });

  // ===== Testimonials fade-in =====
  window.addEventListener("scroll", () => {
    const testimonial = document.getElementById("testimonial-section");
    if (testimonial && testimonial.classList.contains("hidden")) {
      const top = testimonial.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        testimonial.classList.remove("hidden");
        testimonial.classList.add("show");
      }
    }
  });

  // ===== Scroll to top =====
  const stBtn = document.getElementById("scrollTopBtn");
  if (stBtn) {
    window.addEventListener("scroll", () => {
      stBtn.classList.toggle("show", window.scrollY > 200);
    });
    stBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // ===== Popup формы контактов =====
const contactBtn = document.getElementById("contactBtn");
const contactPopup = document.getElementById("contactPopup");
const closePopup = document.getElementById("closePopup");
if (contactBtn && contactPopup) {
  contactBtn.addEventListener("click", () => {
    contactPopup.classList.toggle("show");
  });
}
if (closePopup && contactPopup) {
  closePopup.addEventListener("click", () => {
    contactPopup.classList.remove("show");
  });
}


  // ===== Popup для партнёров =====
  document
    .querySelectorAll(".partner-card button[data-popup]")
    .forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        const popupId = button.getAttribute("data-popup");
        openPartnerPopup(popupId);
      });
    });

  // ===== Popup для сервис-карт =====
  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => {
      const popupId = card.getAttribute("data-popup");
      if (popupId) openServiceOverlay(popupId);
    });
  });

  // ===== Закрытие оверлеев =====
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const overlay = btn.closest(".service-overlay");
      if (overlay) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // ===== Dark mode toggle =====
  const darkBtn = document.getElementById("darkModeToggle");
  function setDarkMode(on) {
    document.body.classList.toggle("dark-mode", on);
    if (darkBtn) darkBtn.innerHTML = on ? "☀️" : "🌙";
    localStorage.setItem("darkMode", on ? "1" : "0");
  }
  if (darkBtn) {
    darkBtn.addEventListener("click", () =>
      setDarkMode(!document.body.classList.contains("dark-mode"))
    );
    if (
      window.matchMedia("(prefers-color-scheme: dark)").matches ||
      localStorage.getItem("darkMode") === "1"
    )
      setDarkMode(true);
  }

  // ===== Floating chat hide on mobile keyboard up =====
  window.addEventListener("resize", () => {
    const fc = document.querySelector(".floating-chat");
    if (fc) {
      if (window.innerHeight < 450) fc.style.display = "none";
      else fc.style.display = "";
    }
  });

  // ===== Карусель ценностей (werteCarousel) =====
  const container = document.getElementById("werteCarousel");
  let autoScroll;
  function scrollWerte(direction) {
    const cards = container.querySelectorAll(".wert-card");
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 24;
    const visibleCards = Math.floor(container.offsetWidth / cardWidth);
    const maxScroll = cardWidth * (cards.length - visibleCards);

    if (direction === 1) {
      if (container.scrollLeft >= maxScroll - 2) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    } else {
      if (container.scrollLeft <= 2) {
        container.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    }
  }
  window.scrollWerte = scrollWerte;

  // Автоскролл
  function startAutoScroll() {
    const cards = container.querySelectorAll(".wert-card");
    if (!cards.length) return;
    const cardWidth = cards[0].offsetWidth + 24;
    const visibleCards = Math.floor(container.offsetWidth / cardWidth);
    if (cards.length <= visibleCards) return;
    autoScroll = setInterval(() => {
      if (
        container.scrollLeft >= cardWidth * (cards.length - visibleCards) - 2
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 4000);
  }
  function stopAutoScroll() {
    clearInterval(autoScroll);
  }
  if (container) {
    container.addEventListener("mouseenter", stopAutoScroll);
    container.addEventListener("mouseleave", startAutoScroll);
    startAutoScroll();

    // Swipe (mobile)
    let startX = 0,
      isTouching = false;
    container.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length === 1) {
          startX = e.touches[0].clientX;
          isTouching = true;
          stopAutoScroll();
        }
      },
      { passive: true }
    );
    container.addEventListener(
      "touchend",
      function (e) {
        if (!isTouching) return;
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX;
        if (Math.abs(dx) > 35) {
          if (dx < 0) scrollWerte(1);
          else scrollWerte(-1);
        }
        isTouching = false;
        startAutoScroll();
      },
      { passive: true }
    );

    // Drag (desktop)
    let dragStart = 0,
      dragging = false,
      scrollStart = 0;
    container.addEventListener("mousedown", function (e) {
      dragging = true;
      dragStart = e.clientX;
      scrollStart = container.scrollLeft;
      container.style.cursor = "grabbing";
      stopAutoScroll();
    });
    window.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      container.scrollLeft = scrollStart - (e.clientX - dragStart);
    });
    window.addEventListener("mouseup", function (e) {
      if (dragging) {
        dragging = false;
        container.style.cursor = "";
        startAutoScroll();
      }
    });
  }

  // ===== Плавный scroll по якорям =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}); // END DOMContentLoaded

// ===== ВНЕШНИЕ ФУНКЦИИ для Popup (оставь если нужны для inline onclick) =====
function openPartnerPopup(popupId) {
  document.querySelectorAll(".partner-popup").forEach((p) => p.classList.remove("active"));
  const popup = document.getElementById(popupId);
  if (popup) popup.classList.add("active");
  document.body.style.overflow = "hidden";
}
window.openPartnerPopup = openPartnerPopup;

function closePartnerPopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) popup.classList.remove("active");
  document.body.style.overflow = "";
}
window.closePartnerPopup = closePartnerPopup;

function openServiceOverlay(popupId) {
  const overlay = document.getElementById(popupId);
  if (overlay) overlay.classList.add("active");
  document.body.style.overflow = "hidden";
}
window.openServiceOverlay = openServiceOverlay;

function closeServiceOverlay(popupId) {
  const overlay = document.getElementById(popupId);
  if (overlay) overlay.classList.remove("active");
  document.body.style.overflow = "";
}
window.closeServiceOverlay = closeServiceOverlay;
