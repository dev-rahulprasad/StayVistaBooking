import { copyFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const distDir = resolve(process.cwd(), "dist")
const indexFile = resolve(distDir, "index.html")
const notFoundFile = resolve(distDir, "404.html")

if (!existsSync(indexFile)) {
  console.error("dist/index.html not found. Run build before create-404.")
  process.exit(1)
}

copyFileSync(indexFile, notFoundFile)
console.log("Created dist/404.html for GitHub Pages SPA fallback.")
