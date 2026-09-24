const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("primary-menu");

function setMenuOpen(isOpen) {
  if (!nav || !menuToggle || !menu) return;
  nav.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", isOpen);
}

function closeMenu() {
  setMenuOpen(false);
}

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    setMenuOpen(!nav.classList.contains("is-open"));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target)) return;
    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 981px)").matches) closeMenu();
  });
}
