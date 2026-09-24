import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const statusEl = document.getElementById("admin-status");
const loginPanel = document.getElementById("login-panel");
const editorPanel = document.getElementById("editor-panel");
const loginForm = document.getElementById("login-form");
const postForm = document.getElementById("post-form");
const postsList = document.getElementById("posts-list");
const newPostBtn = document.getElementById("new-post-btn");
const deletePostBtn = document.getElementById("delete-post-btn");
const signOutBtn = document.getElementById("sign-out-btn");
const viewPostLink = document.getElementById("view-post-link");
const titleInput = document.getElementById("title");
const slugInput = document.getElementById("slug");
const adminHeading = document.getElementById("admin-heading");
const adminLead = document.getElementById("admin-lead");

let supabase = null;
let currentUser = null;
let slugTouched = false;

function setStatus(message, type = "") {
  statusEl.textContent = message || "";
  statusEl.className = `form-status${type ? ` ${type}` : ""}`;
}

function setHero(mode) {
  if (!adminHeading || !adminLead) return;
  if (mode === "editor") {
    adminHeading.textContent = "Blog editor";
    adminLead.textContent = "Write and publish SEO pages on bigbidai.com using the shared bigbid Supabase database.";
    return;
  }
  adminHeading.textContent = "Admin sign in";
  adminLead.textContent = "Sign in with your bigbid AI admin account to write and publish blog posts.";
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

function resetForm() {
  postForm.reset();
  document.getElementById("post-id").value = "";
  document.getElementById("status").value = "draft";
  slugTouched = false;
  viewPostLink.href = "/blog";
  viewPostLink.textContent = "View blog";
}

function fillForm(post) {
  document.getElementById("post-id").value = post.id || "";
  titleInput.value = post.title || "";
  slugInput.value = post.slug || "";
  document.getElementById("excerpt").value = post.excerpt || "";
  document.getElementById("cover_image_url").value = post.cover_image_url || "";
  document.getElementById("content").value = post.content || "";
  document.getElementById("status").value = post.status || "draft";
  slugTouched = Boolean(post.slug);
  if (post.slug && post.status === "published") {
    viewPostLink.href = `/blog/${post.slug}`;
    viewPostLink.textContent = "View post";
  } else {
    viewPostLink.href = "/blog";
    viewPostLink.textContent = "View blog";
  }
}

async function loadConfig() {
  const response = await fetch("/api/config", { headers: { Accept: "application/json" } });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(data.message || "Failed to load config.");
  return data;
}

async function requireAdmin(user) {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin,email,name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.is_admin) {
    await supabase.auth.signOut();
    throw new Error("This account is not an admin. Set profiles.is_admin = true in Supabase.");
  }
  return data;
}

async function loadPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,slug,title,status,published_at,updated_at,created_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  postsList.innerHTML = "";
  if (!data || !data.length) {
    postsList.innerHTML = `<p class="muted" style="font-size:14px;margin:0">No posts yet.</p>`;
    return;
  }

  for (const post of data) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-post-item";
    button.innerHTML = `<strong>${escapeHtml(post.title)}</strong><span>${escapeHtml(post.status)} · ${escapeHtml(
      post.slug
    )}</span>`;
    button.addEventListener("click", () => openPost(post.id));
    postsList.appendChild(button);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function openPost(id) {
  setStatus("Loading post…");
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (error) {
    setStatus(error.message, "err");
    return;
  }
  fillForm(data);
  setStatus(`Editing “${data.title}”`);
}

async function showEditor(user) {
  currentUser = user;
  await requireAdmin(user);
  loginPanel.hidden = true;
  editorPanel.hidden = false;
  resetForm();
  await loadPosts();
  setStatus(`Signed in as ${user.email}`);
}

function showLogin(message = "") {
  currentUser = null;
  loginPanel.hidden = false;
  editorPanel.hidden = true;
  setStatus(message, message ? "err" : "");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setStatus("Signing in…");
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    setStatus(error.message, "err");
    return;
  }
  try {
    await showEditor(data.user);
  } catch (err) {
    showLogin(err.message || "Admin access required.");
  }
});

signOutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  showLogin("Signed out.");
});

newPostBtn.addEventListener("click", () => {
  resetForm();
  setStatus("New draft");
  titleInput.focus();
});

titleInput.addEventListener("input", () => {
  if (!slugTouched && !document.getElementById("post-id").value) {
    slugInput.value = slugify(titleInput.value);
  }
});

slugInput.addEventListener("input", () => {
  slugTouched = true;
  slugInput.value = slugify(slugInput.value);
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) return;

  const id = document.getElementById("post-id").value;
  const status = document.getElementById("status").value;
  const payload = {
    title: titleInput.value.trim(),
    slug: slugify(slugInput.value),
    excerpt: document.getElementById("excerpt").value.trim(),
    cover_image_url: document.getElementById("cover_image_url").value.trim() || null,
    content: document.getElementById("content").value,
    status,
    author_id: currentUser.id,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  if (!payload.title || !payload.slug || !payload.content.trim()) {
    setStatus("Title, slug, and content are required.", "err");
    return;
  }

  setStatus("Saving…");

  let result;
  if (id) {
    if (status === "published") {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();
      if (existing && existing.published_at) payload.published_at = existing.published_at;
    }
    result = await supabase.from("blog_posts").update(payload).eq("id", id).select("*").single();
  } else {
    result = await supabase.from("blog_posts").insert(payload).select("*").single();
  }

  if (result.error) {
    setStatus(result.error.message, "err");
    return;
  }

  fillForm(result.data);
  await loadPosts();
  setStatus(status === "published" ? "Published. Live at /blog/" + result.data.slug : "Draft saved.", "ok");
});

deletePostBtn.addEventListener("click", async () => {
  const id = document.getElementById("post-id").value;
  if (!id) {
    resetForm();
    return;
  }
  if (!window.confirm("Delete this post permanently?")) return;

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    setStatus(error.message, "err");
    return;
  }
  resetForm();
  await loadPosts();
  setStatus("Post deleted.", "ok");
});

async function boot() {
  try {
    const config = await loadConfig();
    supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    const { data } = await supabase.auth.getSession();
    if (data.session && data.session.user) {
      await showEditor(data.session.user);
    } else {
      showLogin();
    }
  } catch (error) {
    showLogin(error.message || "Could not start admin.");
    loginPanel.hidden = false;
  }
}

boot();
