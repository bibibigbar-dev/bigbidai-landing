const { getPublishedPostBySlug } = require("../_lib/supabase");
const { escapeHtml, markdownToHtml } = require("../_lib/markdown");
const { formatDate, renderPage, SITE_URL } = require("../_lib/layout");

function getSlug(req) {
  if (req.query && req.query.slug) return String(req.query.slug);
  const url = new URL(req.url, "http://localhost");
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).setHeader("Allow", "GET, HEAD").end("Method not allowed");
    return;
  }

  const slug = getSlug(req)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  if (!slug) {
    res.statusCode = 302;
    res.setHeader("Location", "/blog");
    res.end();
    return;
  }

  try {
    const post = await getPublishedPostBySlug(slug);
    if (!post) {
      const html = renderPage({
        title: "Post not found | bigbid AI",
        description: "This blog post could not be found.",
        canonicalPath: `/blog/${slug}`,
        activeNav: "blog",
        bodyHtml: `<section class="page-hero"><div class="wrap"><div class="eyebrow">Blog</div><h1>Post not found</h1><p class="lead">The article you requested is unavailable.</p><p style="margin-top:24px"><a class="btn" href="/blog">Back to blog</a></p></div></section>`,
      });
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.status(404).send(html);
      return;
    }

    const date = formatDate(post.published_at || post.created_at);
    const description = post.excerpt || post.title;
    const contentHtml = markdownToHtml(post.content);
    const cover = post.cover_image_url
      ? `<img class="blog-cover" src="${escapeHtml(post.cover_image_url)}" alt="" width="1200" height="630">`
      : "";

    const bodyHtml = `<article class="blog-article">
  <section class="page-hero">
    <div class="wrap blog-article-head">
      <div class="eyebrow">Blog</div>
      ${date ? `<div class="blog-meta">${escapeHtml(date)}</div>` : ""}
      <h1>${escapeHtml(post.title)}</h1>
      ${post.excerpt ? `<p class="lead">${escapeHtml(post.excerpt)}</p>` : ""}
    </div>
  </section>
  <section class="section" style="padding-top:0">
    <div class="wrap blog-article-wrap">
      ${cover}
      <div class="blog-prose">
        ${contentHtml}
      </div>
      <div class="blog-article-footer">
        <a class="btn" href="/blog">More articles</a>
        <a class="btn primary" href="https://my.bigbidai.com/">Try bigbid AI</a>
      </div>
    </div>
  </section>
</article>`;

    const html = renderPage({
      title: `${post.title} | bigbid AI`,
      description,
      canonicalPath: `/blog/${post.slug}`,
      activeNav: "blog",
      bodyHtml,
      ogType: "article",
      image: post.cover_image_url || undefined,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description,
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.published_at || post.created_at,
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        image: post.cover_image_url ? [post.cover_image_url] : undefined,
        author: {
          "@type": "Organization",
          name: "bigbid AI",
          url: SITE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: "bigbid AI",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/assets/logo.png?v=2`,
          },
        },
      },
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    res.status(200).send(html);
  } catch (error) {
    const html = renderPage({
      title: "Blog error | bigbid AI",
      description: "This blog post could not be loaded.",
      canonicalPath: `/blog/${slug}`,
      activeNav: "blog",
      bodyHtml: `<section class="page-hero"><div class="wrap"><div class="eyebrow">Blog</div><h1>Something went wrong</h1><p class="lead">Please try again in a moment.</p><p style="margin-top:24px"><a class="btn" href="/blog">Back to blog</a></p></div></section>`,
    });
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.status(error.statusCode === 503 ? 503 : 500).send(html);
  }
};
