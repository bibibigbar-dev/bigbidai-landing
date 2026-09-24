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
