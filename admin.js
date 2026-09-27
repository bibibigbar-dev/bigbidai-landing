import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import Quill from "https://cdn.jsdelivr.net/npm/quill@2.0.3/+esm";

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

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["12px", "14px", "16px", "18px", "20px", "24px", "32px"];
Quill.register(Size, true);

let supabase = null;
let currentUser = null;
let slugTouched = false;
let quill = null;

function setStatus(message, type = "") {
  statusEl.textContent = message || "";
  statusEl.className = `form-status${type ? ` ${type}` : ""}`;
}

function showToast(message, type = "ok") {
  let toast = document.getElementById("admin-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "admin-toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `admin-toast${type ? ` ${type}` : ""}`;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 3200);
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getEditorHtml() {
  if (!quill) return "";
  const html = quill.root.innerHTML.trim();
  if (!html || html === "<p><br></p>" || html === "<p></p>") return "";
  return html;
}

function setEditorHtml(html) {
  if (!quill) return;
  const value = String(html || "").trim();
  quill.setContents([]);
  if (!value) {
    quill.setText("");
    return;
  }
  quill.clipboard.dangerouslyPasteHTML(value);
}

function isEditorEmpty() {
  if (!quill) return true;
  return !quill.getText().replace(/\n/g, "").trim();
}

async function uploadEditorImage(file) {
  if (!currentUser) throw new Error("Sign in required to upload images.");
  if (!file || !file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5MB or smaller.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${currentUser.id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("blog-images").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
  if (!data || !data.publicUrl) throw new Error("Could not get image URL.");
  return data.publicUrl;
}

function initQuill() {
  if (quill) return quill;

  quill = new Quill("#editor", {
    theme: "snow",
    placeholder: "Write your article…",
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ size: Size.whitelist }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image() {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.click();
            input.onchange = async () => {
              const file = input.files && input.files[0];
              if (!file) return;
              try {
                setStatus("Uploading image…");
                const url = await uploadEditorImage(file);
                const range = quill.getSelection(true);
                quill.insertEmbed(range.index, "image", url, "user");
                quill.setSelection(range.index + 1);
                setStatus("Image inserted.", "ok");
              } catch (error) {
                const fallback = window.prompt("Upload failed. Paste an image URL instead:");
                if (fallback) {
                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, "image", fallback.trim(), "user");
                  quill.setSelection(range.index + 1);
                  setStatus("Image URL inserted.", "ok");
                } else {
                  setStatus(error.message || "Image upload failed.", "err");
                }
              }
            };
          },
        },
      },
    },
  });

  return quill;
}

function fillScheduleFields(iso) {
  const date = iso ? new Date(iso) : null;
  const valid = date && !Number.isNaN(date.getTime());
  const pad = (value) => String(value).padStart(2, "0");
  document.getElementById("schedule-month").value = valid ? String(date.getMonth()) : "";
  document.getElementById("schedule-day").value = valid ? String(date.getDate()) : "";
  document.getElementById("schedule-year").value = valid ? String(date.getFullYear()) : "";
  document.getElementById("schedule-time").value = valid
    ? `${pad(date.getHours())}:${pad(date.getMinutes())}`
    : "";
}

function readScheduledAt() {
  const month = document.getElementById("schedule-month").value;
  const day = Number(document.getElementById("schedule-day").value);
  const year = Number(document.getElementById("schedule-year").value);
  const time = document.getElementById("schedule-time").value;
  if (month === "" || !day || !year || !time) return null;
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(year, Number(month), day, hours, minutes);
  if (Number.isNaN(date.getTime())) return null;
  if (date.getMonth() !== Number(month) || date.getDate() !== day) return null;
  return date;
}

function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isLivePost(post) {
  if (!post) return false;
  if (post.status === "published") return true;
  if (post.status !== "scheduled" || !post.published_at) return false;
  return new Date(post.published_at).getTime() <= Date.now();
}

function syncScheduleField() {
  const status = document.getElementById("status").value;
  const field = document.getElementById("schedule-field");
  field.hidden = status !== "scheduled";
}

function resetForm() {
  postForm.reset();
  document.getElementById("post-id").value = "";
  document.getElementById("status").value = "draft";
  fillScheduleFields("");
  syncScheduleField();
  slugTouched = false;
  setEditorHtml("");
  viewPostLink.href = "/blog";
  viewPostLink.textContent = "View blog";
}

function fillForm(post) {
  document.getElementById("post-id").value = post.id || "";
  titleInput.value = post.title || "";
  slugInput.value = post.slug || "";
  document.getElementById("excerpt").value = post.excerpt || "";
  document.getElementById("cover_image_url").value = post.cover_image_url || "";
  setEditorHtml(post.content || "");
  document.getElementById("status").value = post.status || "draft";
  fillScheduleFields(post.status === "scheduled" ? post.published_at : "");
  syncScheduleField();
  slugTouched = Boolean(post.slug);
  if (post.slug && isLivePost(post)) {
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
    const when = post.status === "scheduled" && post.published_at ? formatWhen(post.published_at) : "";
    const live = post.status === "scheduled" && isLivePost(post) ? " (live)" : "";
    const statusLabel = when ? `scheduled${live} · ${when}` : post.status;
    button.innerHTML = `<strong>${escapeHtml(post.title)}</strong><span>${escapeHtml(statusLabel)} · ${escapeHtml(
      post.slug
    )}</span>`;
    button.addEventListener("click", () => openPost(post.id));
    postsList.appendChild(button);
  }
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
  setHero("editor");
  initQuill();
  resetForm();
  await loadPosts();
  setStatus(`Signed in as ${user.email}`);
}

function showLogin(message = "") {
  currentUser = null;
  loginPanel.hidden = false;
  editorPanel.hidden = true;
  setHero("login");
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

document.getElementById("status").addEventListener("change", syncScheduleField);

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!currentUser) return;

  const id = document.getElementById("post-id").value;
  const status = document.getElementById("status").value;
  const content = getEditorHtml();
  const scheduledAt = readScheduledAt();
  if (status === "scheduled" && (!scheduledAt || Number.isNaN(scheduledAt.getTime()))) {
    setStatus("Choose a date and time to schedule this post.", "err");
    return;
  }

  const payload = {
    title: titleInput.value.trim(),
    slug: slugify(slugInput.value),
    excerpt: document.getElementById("excerpt").value.trim(),
    cover_image_url: document.getElementById("cover_image_url").value.trim() || null,
    content,
    status,
    author_id: currentUser.id,
    published_at:
      status === "scheduled"
        ? scheduledAt.toISOString()
        : status === "published"
          ? new Date().toISOString()
          : null,
  };

  if (!payload.title || !payload.slug || isEditorEmpty()) {
    setStatus("Title, slug, and content are required.", "err");
    return;
  }

  setStatus("Saving…");

  let result;
  if (id) {
    if (status === "published") {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("status,published_at")
        .eq("id", id)
        .maybeSingle();
      const alreadyLive =
        existing &&
        existing.published_at &&
        (existing.status === "published" || new Date(existing.published_at).getTime() <= Date.now());
      if (alreadyLive) payload.published_at = existing.published_at;
    }
    result = await supabase.from("blog_posts").update(payload).eq("id", id).select("*").single();
  } else {
    result = await supabase.from("blog_posts").insert(payload).select("*").single();
  }

  if (result.error) {
    setStatus(result.error.message, "err");
    showToast(result.error.message, "err");
    return;
  }

  fillForm(result.data);
  await loadPosts();
  if (status === "published") {
    setStatus("Published. Live at /blog/" + result.data.slug, "ok");
  } else if (status === "scheduled") {
    setStatus("Scheduled for " + formatWhen(result.data.published_at) + ".", "ok");
  } else {
    setStatus("Draft saved.", "ok");
  }
  showToast("Saved.");
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
