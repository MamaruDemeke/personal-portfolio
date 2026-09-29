import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import contactRouter from "./routes/contact.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

/* ---------------- Security & parsing ---------------- */
app.set("trust proxy", 1);
app.use(helmet({ contentSecurityPolicy: false })); // CSP off so Firebase/CDN scripts work
app.use(express.json({ limit: "100kb" }));

const allowed = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin/no-origin (server-rendered assets, curl, health checks)
      if (!origin || allowed.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
  })
);

/* ---------------- API ---------------- */
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, uptime: process.uptime() })
);
app.use("/api/contact", contactRouter);

/* ---------------- Static client (production) ---------------- */
const clientDist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback — let client-side routing handle /admin etc.
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

/* ---------------- Errors ---------------- */
app.use((err, _req, res, _next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "Origin not allowed." });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error." });
});

/* ---------------- Start ---------------- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Portfolio server listening on http://0.0.0.0:${PORT}`);
});
