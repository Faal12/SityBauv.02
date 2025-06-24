document.addEventListener("DOMContentLoaded", () => {
  let factsAnimated = false;
function animateFacts() {
  document.querySelectorAll('.fact-number').forEach(el => {
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

window.addEventListener('scroll', function factsOnScroll() {
  if (factsAnimated) return;
  const bar = document.querySelector('.facts-bar');
  if (bar) {
    const top = bar.getBoundingClientRect().top;
    if (top < window.innerHeight - 60) {
      animateFacts();
      factsAnimated = true;
      // удаляем обработчик чтобы не запускался повторно:
      window.removeEventListener('scroll', factsOnScroll);
    }
  }
});

  // Sticky Header, Fade-In, Parallax, Testimonials
  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header.classList.toggle("scrolled", window.scrollY > 10);

    document.querySelectorAll(".fade-in").forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });

    const parallax = document.querySelector(".parallax-bg, .about-bg");
    if (parallax) {
      const scrolled = window.scrollY;
      const speed = window.innerWidth < 768 ? 0.2 : 0.08;
      parallax.style.transform = `translateY(${scrolled * speed}px)`;
    }

    const testimonial = document.getElementById("testimonial-section");
    if (testimonial && testimonial.classList.contains("hidden")) {
      const top = testimonial.getBoundingClientRect().top;
      if (top < window.innerHeight - 100) {
        testimonial.classList.remove("hidden");
        testimonial.classList.add("show");
      }
    }
    
  });
  // Kontakt-Popup
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

  // Partnerkarten → Popup öffnen
  document.querySelectorAll(".partner-card button[data-popup]").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const popupId = button.getAttribute("data-popup");
      openPartnerPopup(popupId);
    });
  });

  // Servicekarten → Popup öffnen
  document.querySelectorAll(".service-card").forEach(card => {
    card.addEventListener("click", () => {
      const popupId = card.getAttribute("data-popup");
      if (popupId) {
        openServiceOverlay(popupId);
      }
    });
  });

  // Кнопки закрытия overlay
  document.querySelectorAll(".close-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const overlay = btn.closest(".service-overlay");
      if (overlay) {
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // IntersectionObserver для fade-in
  document.querySelectorAll(".fade-in").forEach(el => el.classList.remove('visible'));
  const observer = new window.IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, {threshold: 0.12});
  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

  // Scroll top button
  const stBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => {
    stBtn.classList.toggle("show", window.scrollY > 200);
  });
  stBtn.addEventListener("click", () => window.scrollTo({top:0,behavior:"smooth"}));

  // Dark mode toggle
  const darkBtn = document.getElementById("darkModeToggle");
  function setDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    if (darkBtn) darkBtn.innerHTML = on ? "☀️" : "🌙";
    localStorage.setItem("darkMode", on ? "1" : "0");
  }
  if (darkBtn) {
    darkBtn.addEventListener("click", () => setDarkMode(!document.body.classList.contains("dark-mode")));
    if (window.matchMedia('(prefers-color-scheme: dark)').matches || localStorage.getItem("darkMode") === "1") setDarkMode(true);
  }

  // Floating chat hide on mobile keyboard up
  window.addEventListener("resize", () => {
    const fc = document.querySelector('.floating-chat');
    if (fc) {
      if (window.innerHeight < 450) fc.style.display = "none";
      else fc.style.display = "";
    }
  });

  // Hamburger + mobile menu animation
const burger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
if (burger && navLinks) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    navLinks.classList.toggle("show");
  });
  document.addEventListener("click", e => {
    if (window.innerWidth < 800 && !navLinks.contains(e.target) && !burger.contains(e.target)) {
      navLinks.classList.remove("show");
      burger.classList.remove("active");
    }
  });
}

const container = document.getElementById('werteCarousel');
let autoScroll;

function scrollWerte(direction) {
  const cards = container.querySelectorAll('.wert-card');
  const cardWidth = cards[0].offsetWidth + 24;
  const visibleCards = Math.floor(container.offsetWidth / cardWidth);
  const maxScroll = cardWidth * (cards.length - visibleCards);

  if (direction === 1) {
    if (container.scrollLeft >= maxScroll - 2) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  } else {
    if (container.scrollLeft <= 2) {
      container.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }
}
window.scrollWerte = scrollWerte;

// Автоскролл: только если карточек больше, чем видно
function startAutoScroll() {
  const cards = container.querySelectorAll('.wert-card');
  if (!cards.length) return;
  const cardWidth = cards[0].offsetWidth + 24;
  const visibleCards = Math.floor(container.offsetWidth / cardWidth);
  if (cards.length <= visibleCards) return;
  autoScroll = setInterval(() => {
    if (container.scrollLeft >= cardWidth * (cards.length - visibleCards) - 2) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  }, 4000);
}
function stopAutoScroll() { clearInterval(autoScroll); }

if (container) {
  container.addEventListener("mouseenter", stopAutoScroll);
  container.addEventListener("mouseleave", startAutoScroll);
  startAutoScroll();

  // Swipe (mobile)
  let startX = 0, isTouching = false;
  container.addEventListener('touchstart', function(e) {
    if(e.touches.length === 1) {
      startX = e.touches[0].clientX;
      isTouching = true;
      stopAutoScroll();
    }
  }, {passive:true});
  container.addEventListener('touchend', function(e) {
    if (!isTouching) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if (Math.abs(dx) > 35) {
      if (dx < 0) scrollWerte(1);
      else scrollWerte(-1);
    }
    isTouching = false;
    startAutoScroll();
  }, {passive:true});

  // Drag (desktop)
  let dragStart = 0, dragging = false, scrollStart = 0;
  container.addEventListener('mousedown', function(e) {
    dragging = true;
    dragStart = e.clientX;
    scrollStart = container.scrollLeft;
    container.style.cursor = 'grabbing';
    stopAutoScroll();
  });
  window.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    container.scrollLeft = scrollStart - (e.clientX - dragStart);
  });
  window.addEventListener('mouseup', function(e) {
    if (dragging) {
      dragging = false;
      container.style.cursor = '';
      startAutoScroll();
    }
  });
}
  // END WERTE-KARUSSEL
});

// === ВНЕШНИЕ ФУНКЦИИ для Popup (оставь как есть, если нужны) ===
function openPartnerPopup(id) {
  const popup = document.getElementById(id);
  if (popup) popup.classList.add("active");
}
function closePartnerPopup(id) {
  const popup = document.getElementById(id);
  if (popup) popup.classList.remove("active");
}
function openServiceOverlay(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}
function closeServiceOverlay(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("active");
    document.body.style.overflow = "";
  }
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior: "smooth"});
    }
  });
});
document.addEventListener('DOMContentLoaded', function() {
  function handleFadeIn() {
    const fadeEls = document.querySelectorAll('.fade-in');
    const windowBottom = window.innerHeight + window.scrollY;

    fadeEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elTop = rect.top + window.scrollY;
      if (windowBottom > elTop + 50) { // чуть раньше появления
        el.classList.add('visible');
      }
    });
  }
  handleFadeIn();
  window.addEventListener('scroll', handleFadeIn);
});
