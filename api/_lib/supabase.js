// Same Supabase project as my.bigbidai.com / bigbid_v2.
// The anon key is a public client key (already shipped in the app bundle).
const DEFAULT_SUPABASE_URL = "https://lpdnokievjxlzqrfrohi.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZG5va2lldmp4bHpxcmZyb2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0ODE4NTYsImV4cCI6MjEwNTA1Nzg1Nn0.5UnhT8n7HNER5wtLHfRSywvA-RcpTPHiZiXKinBYckY";

function getConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    DEFAULT_SUPABASE_ANON_KEY;

  return { url, anonKey };
}

function assertConfig() {
  const config = getConfig();
  if (!config.anonKey) {
    const error = new Error("Missing SUPABASE_ANON_KEY");
    error.statusCode = 503;
    throw error;
  }
  return config;
}

async function supabaseFetch(path, { method = "GET", token, body, prefer } = {}) {
  const { url, anonKey } = assertConfig();
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${token || anonKey}`,
    Accept: "application/json",
  };

  if (prefer) headers.Prefer = prefer;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error_description || data.error)) ||
      text ||
      response.statusText;
    const error = new Error(String(message));
    error.statusCode = response.status;
    error.details = data;
    throw error;
  }

  return data;
}

async function listPublishedPosts({ limit = 50 } = {}) {
  const params = new URLSearchParams({
    select: "id,slug,title,excerpt,cover_image_url,published_at,updated_at,created_at",
    status: "eq.published",
    order: "published_at.desc.nullslast",
    limit: String(limit),
  });
  return supabaseFetch(`blog_posts?${params.toString()}`);
}

async function getPublishedPostBySlug(slug) {
  const params = new URLSearchParams({
    select: "id,slug,title,excerpt,content,cover_image_url,published_at,updated_at,created_at",
    slug: `eq.${slug}`,
    status: "eq.published",
    limit: "1",
  });
  const rows = await supabaseFetch(`blog_posts?${params.toString()}`);
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

module.exports = {
  getConfig,
  assertConfig,
  supabaseFetch,
  listPublishedPosts,
  getPublishedPostBySlug,
};
