const faqButtons = Array.from(document.querySelectorAll(".faq-q"));

faqButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const answer = document.getElementById(btn.getAttribute("aria-controls"));
    item.classList.toggle("open");
    const isOpen = item.classList.contains("open");
    btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (answer) {
      answer.hidden = !isOpen;
      answer.setAttribute("aria-hidden", isOpen ? "false" : "true");
    }
  });

  btn.addEventListener("keydown", (event) => {
    let nextIndex = index;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % faqButtons.length;
    if (event.key === "ArrowUp") nextIndex = (index - 1 + faqButtons.length) % faqButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = faqButtons.length - 1;
    if (nextIndex !== index) {
      event.preventDefault();
      faqButtons[nextIndex].focus();
    }
  });
});

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
