const { escapeHtml } = require("./markdown");

const SITE_URL = "https://bigbidai.com";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function navHtml(active = "") {
  const items = [
    { href: "/#product", label: "Product" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog", key: "blog" },
  ];

  return items
    .map((item) => {
      const isActive = item.key && item.key === active;
      const attrs = isActive ? ' aria-current="page"' : "";
      return `<a href="${item.href}"${attrs}>${item.label}</a>`;
    })
    .join("\n        ");
}

function footerHtml() {
  return `<footer>
  <div class="wrap foot">
    <div>
      <a class="brand" href="/"><img src="/assets/logo.png?v=2" width="160" height="53" alt="BigbidAI"></a>
      <div class="muted" style="font-size:12px;margin-top:5px">bigbidai.com &middot; AI-powered inventory and auction listing automation.</div>
    </div>
    <div class="footlinks">
      <a href="/#product">Product</a>
      <a href="/#pricing">Pricing</a>
      <a href="/#faq">FAQ</a>
      <a href="/contact">Contact</a>
      <a href="/blog">Blog</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </div>
  </div>
</footer>`;
}

function renderPage({
  title,
  description,
  canonicalPath,
  activeNav = "",
  bodyHtml,
  ogType = "website",
  jsonLd,
  image,
}) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description || "");
  const ogImage = image || `${SITE_URL}/assets/mainproduct.jpg`;
  const jsonLdBlock = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
  <meta property="og:type" content="${escapeHtml(ogType)}" />
  <meta property="og:site_name" content="bigbid AI" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDescription}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDescription}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css" />
  ${jsonLdBlock}
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
  <header class="nav">
    <div class="wrap navin">
      <a class="brand" href="/"><img src="/assets/logo.png?v=2" width="180" height="60" alt="BigbidAI"></a>
      <nav class="links" aria-label="Primary">
        ${navHtml(activeNav)}
        <a class="btn primary small" href="https://my.bigbidai.com/">Try for Free</a>
      </nav>
    </div>
  </header>
  <main>
    ${bodyHtml}
  </main>
  ${footerHtml()}
</body>
</html>`;
}

module.exports = {
  SITE_URL,
  formatDate,
  renderPage,
};
