const SUPPORT_EMAIL = "support@bigbidai.com";
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("contact-status");
const submitBtn = document.getElementById("contact-submit");

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `form-status${type ? ` ${type}` : ""}`;
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("");

  if (form._honey?.value) return;

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !subject || !message) {
    setStatus("Please fill in all fields.", "err");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending…";
  setStatus("Sending your message…");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _honey: form._honey?.value || "",
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok === false) {
      throw new Error(data.message || "Unable to send message.");
    }

    form.reset();
    setStatus("Thanks! Your message was sent. We typically reply within 1–2 business days.", "ok");
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    const isConfigError = /not configured/i.test(detail);
    setStatus(
      isConfigError
        ? `Contact form is not configured yet. Please email ${SUPPORT_EMAIL} directly.`
        : `Could not send right now. Please email ${SUPPORT_EMAIL} directly.`,
      "err"
    );
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send message";
  }
});
