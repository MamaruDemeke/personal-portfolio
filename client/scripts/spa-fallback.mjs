/* Emits dist/404.html as a copy of index.html.
   Static hosts that do not offer rewrite rules (GitHub Pages, many "upload the
   dist folder" platforms, some preview environments) serve this file instead of
   their own 404 page, which lets client-side routes like /admin load. */
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const index = join(dist, "index.html");
const fallback = join(dist, "404.html");

if (!existsSync(index)) {
  console.error("[spa-fallback] dist/index.html not found - run the build first.");
  process.exit(1);
}

copyFileSync(index, fallback);
console.log("[spa-fallback] wrote dist/404.html for static hosts without rewrites.");
