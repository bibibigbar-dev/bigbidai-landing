function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, message: "Method not allowed." });
    return;
  }

  const body = readBody(req);
  if (body._honey) {
    res.status(200).json({ ok: true });
    return;
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !subject || !message) {
    res.status(400).json({ ok: false, message: "Please fill in all fields." });
    return;
  }

  if (!isValidEmail(email) || name.length > 120 || email.length > 160 || message.length > 5000) {
    res.status(400).json({ ok: false, message: "Please check your details and try again." });
    return;
  }

  const apiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "support@bigbidai.com";

  if (!apiKey || !toEmail) {
    res.status(503).json({
      ok: false,
      message: "Contact form is not configured.",
    });
    return;
  }

  const safeSubject = subject.slice(0, 140);
  const htmlMessage = escapeHtml(message).replaceAll("\n", "<br>");
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "bigbid AI Contact", email: senderEmail },
      to: [{ email: toEmail }],
      replyTo: { email, name },
      subject: `[bigbid AI Contact] ${safeSubject}`,
      textContent: `Name: ${name}\nEmail: ${email}\nSubject: ${safeSubject}\n\n${message}`,
      htmlContent: `
        <h2>New contact form message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
        <p><strong>Message:</strong><br>${htmlMessage}</p>
      `,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    console.error("Brevo email failed", response.status, errorBody.slice(0, 500));
    res.status(502).json({ ok: false, message: "Unable to send message." });
    return;
  }

  res.status(200).json({ ok: true });
};
