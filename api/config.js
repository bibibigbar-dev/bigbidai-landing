const { getConfig } = require("./_lib/supabase");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.status(405).json({ ok: false, message: "Method not allowed." });
    return;
  }

  const { url, anonKey } = getConfig();
  if (!anonKey) {
    res.status(503).json({ ok: false, message: "Supabase is not configured." });
    return;
  }

  res.status(200).json({
    ok: true,
    supabaseUrl: url,
    supabaseAnonKey: anonKey,
  });
};
