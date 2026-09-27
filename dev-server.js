const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 3000;

const routes = {
  "/blog": "./api/blog/index.js",
  "/sitemap.xml": "./api/sitemap.js",
  "/api/config": "./api/config.js",
  "/api/contact": "./api/contact.js",
  "/api/blog": "./api/blog/index.js",
  "/api/sitemap": "./api/sitemap.js",
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function enhance(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.send = (body) => {
    if (!res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
    }
    res.end(body);
  };
  res.json = (body) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body));
  };
  return res;
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  res.setHeader("Content-Type", types[ext] || "application/octet-stream");
  fs.createReadStream(filePath).pipe(res);
}

function resolveStatic(pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const candidates = [requested, `${requested}.html`];
  for (const candidate of candidates) {
    const filePath = path.normalize(path.join(root, candidate));
    if (!filePath.startsWith(root)) continue;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return filePath;
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  enhance(res);
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";

  try {
    if (pathname.startsWith("/blog/") || pathname.startsWith("/api/blog/")) {
      const slug = pathname.split("/").filter(Boolean).pop();
      req.query = { ...(req.query || {}), slug };
      await require("./api/blog/[slug].js")(req, res);
      return;
    }

    const route = routes[pathname];
    if (route) {
      await require(route)(req, res);
      return;
    }

    const filePath = resolveStatic(pathname);
    if (!filePath) {
      res.status(404).send("Not found");
      return;
    }
    sendFile(res, filePath);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.status(500).send("Local server error");
  }
});

server.listen(port, () => {
  console.log(`bigbid landing http://localhost:${port}`);
});
