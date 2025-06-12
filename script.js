document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.getElementById("nav-links");
  const toggle = document.getElementById("hamburger");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
      toggle.classList.toggle("active");
    });
  }

  document.querySelectorAll("#nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
      navLinks.classList.remove("show");
      toggle.classList.remove("active");
      }
    });
  });

  // Sticky Header und Fade-in
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

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
  });
});
