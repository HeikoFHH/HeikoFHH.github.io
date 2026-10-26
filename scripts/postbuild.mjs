// GitHub Pages only serves real files. Copy the SPA shell to every client-side
// route so /impressum and /privacy load directly (with a 200) and unknown URLs
// fall back to 404.html, which the router renders as "not found".
import { copyFileSync, mkdirSync } from "node:fs";

const shell = "dist/index.html";
for (const route of ["impressum", "privacy"]) {
  mkdirSync(`dist/${route}`, { recursive: true });
  copyFileSync(shell, `dist/${route}/index.html`);
}
copyFileSync(shell, "dist/404.html");
