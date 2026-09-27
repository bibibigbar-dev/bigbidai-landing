const BLOG_CATEGORIES = [
  { slug: "auction-tips", label: "Auction Tips" },
  { slug: "product-research", label: "Product Research" },
  { slug: "hibid-guides", label: "HiBid Guides" },
  { slug: "liquidation", label: "Liquidation" },
  { slug: "automation-ai", label: "Automation & AI" },
];

function categoryLabel(slug) {
  const found = BLOG_CATEGORIES.find((item) => item.slug === slug);
  return found ? found.label : "";
}

function isBlogCategory(slug) {
  return BLOG_CATEGORIES.some((item) => item.slug === slug);
}

module.exports = {
  BLOG_CATEGORIES,
  categoryLabel,
  isBlogCategory,
};
