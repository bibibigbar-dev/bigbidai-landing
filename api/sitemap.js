const { listPublishedPosts } = require("./_lib/supabase");
const { SITE_URL } = require("./_lib/layout");

function xmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).end("Method not allowed");
    return;
  }

  const staticUrls = [
    { loc: `${SITE_URL}/`, changefreq: "weekly", priority: "1.0" },
    { loc: `${SITE_URL}/blog`, changefreq: "daily", priority: "0.9" },
    { loc: `${SITE_URL}/contact`, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/privacy`, changefreq: "yearly", priority: "0.4" },
    { loc: `${SITE_URL}/terms`, changefreq: "yearly", priority: "0.4" },
  ];

  let posts = [];
  try {
    posts = await listPublishedPosts({ limit: 500 });
  } catch {
    posts = [];
  }

  const postUrls = (Array.isArray(posts) ? posts : []).map((post) => {
    const lastmod = post.updated_at || post.published_at || post.created_at;
    return {
      loc: `${SITE_URL}/blog/${post.slug}`,
      changefreq: "monthly",
      priority: "0.8",
      lastmod: lastmod ? new Date(lastmod).toISOString() : undefined,
    };
  });

  const urls = [...staticUrls, ...postUrls]
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : "";
      return `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>${lastmod}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
  res.status(200).send(xml);
};
