const { listPublishedPosts } = require("../_lib/supabase");
const { escapeHtml } = require("../_lib/markdown");
const { formatDate, renderPage } = require("../_lib/layout");
const { BLOG_CATEGORIES, categoryLabel, isBlogCategory } = require("../_lib/categories");

function renderPostCards(posts) {
  if (!posts.length) {
    return `<div class="blog-empty">
      <p class="lead">No published posts yet. Check back soon for auction listing tips and product updates.</p>
    </div>`;
  }

  return `<div class="blog-grid">
    ${posts
      .map((post) => {
        const date = formatDate(post.published_at || post.created_at);
        const excerpt = escapeHtml(post.excerpt || "");
        const label = categoryLabel(post.category);
        const meta = [label, date].filter(Boolean).map((part) => escapeHtml(part)).join(" · ");
        const cover = post.cover_image_url
          ? `<img class="blog-card-image" src="${escapeHtml(post.cover_image_url)}" alt="" loading="lazy" width="640" height="360">`
          : "";
        return `<article class="blog-card">
          <a class="blog-card-link" href="/blog/${escapeHtml(post.slug)}">
            ${cover}
            <div class="blog-card-body">
              ${meta ? `<div class="blog-meta">${meta}</div>` : ""}
              <h2>${escapeHtml(post.title)}</h2>
              ${excerpt ? `<p>${excerpt}</p>` : ""}
              <span class="blog-read">Read article &rarr;</span>
            </div>
          </a>
        </article>`;
      })
      .join("\n")}
  </div>`;
}

function requestedCategory(req) {
  const url = new URL(req.url || "/", "http://localhost");
  const category = url.searchParams.get("category") || "";
  return isBlogCategory(category) ? category : "";
}

function renderFilters(active) {
  const all = `<a href="/blog"${active ? "" : ' class="is-active"'}>All</a>`;
  const links = BLOG_CATEGORIES.map((item) => {
    const current = item.slug === active ? ' class="is-active"' : "";
    return `<a href="/blog?category=${escapeHtml(item.slug)}"${current}>${escapeHtml(item.label)}</a>`;
  }).join("");
  return `<nav class="blog-filters" aria-label="Blog categories">${all}${links}</nav>`;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).setHeader("Allow", "GET, HEAD").end("Method not allowed");
    return;
  }

  try {
    const category = requestedCategory(req);
    const posts = await listPublishedPosts({ limit: 100, category });
    const categoryName = categoryLabel(category);
    const bodyHtml = `<section class="page-hero">
  <div class="wrap">
    <div class="eyebrow">Blog</div>
    <h1>${categoryName ? escapeHtml(categoryName) : "Auction listing insights"}</h1>
    <p class="lead">Practical guides for resellers, auction houses, and liquidation teams using AI to list inventory faster.</p>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap">
    ${renderFilters(category)}
    ${renderPostCards(Array.isArray(posts) ? posts : [])}
  </div>
</section>`;

    const html = renderPage({
      title: categoryName ? `${categoryName} | bigbid AI Blog` : "Blog | bigbid AI",
      description:
        "Guides and updates from bigbid AI on auction listing automation, HiBid workflows, MSRP research, and high-volume inventory.",
      canonicalPath: category ? `/blog?category=${category}` : "/blog",
      activeNav: "blog",
      bodyHtml,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "bigbid AI Blog",
        url: "https://bigbidai.com/blog",
        description:
          "Guides and updates on AI auction listing and inventory automation for resellers.",
        publisher: {
          "@type": "Organization",
          name: "bigbid AI",
          url: "https://bigbidai.com/",
        },
      },
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (error) {
    const missingTable =
      error &&
      error.details &&
      typeof error.details === "object" &&
      String(error.details.code || "") === "PGRST205";

    const message = missingTable
      ? "Blog is almost ready. Run the Supabase migration in supabase/migrations/20260924_blog_posts.sql, then publish your first post from /admin."
      : "Blog posts are temporarily unavailable. Please try again shortly.";

    const html = renderPage({
      title: "Blog | bigbid AI",
      description: "Guides and updates from bigbid AI.",
      canonicalPath: "/blog",
      activeNav: "blog",
      bodyHtml: `<section class="page-hero"><div class="wrap"><div class="eyebrow">Blog</div><h1>Auction listing insights</h1><p class="lead">${escapeHtml(
        message
      )}</p></div></section>`,
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(missingTable ? 503 : 500).send(html);
  }
};
