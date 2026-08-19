import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

// Separate build config, not the main app's — builds ONLY standalone.html
// (the docs site with no PxShellRail/header) into one self-contained .html
// file via vite-plugin-singlefile, so it can be shared directly (Slack,
// email) with no server. `npm run build` for the real app is untouched;
// this only runs via `npm run build:docs-standalone`.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // publicDir: false — the main app's public/ (favicon.svg, icons.svg) isn't
  // referenced by standalone.html and isn't needed once everything is
  // inlined; without this, vite copies it into dist-docs-standalone anyway
  // and the output stops being a single shareable file.
  publicDir: false,
  build: {
    outDir: "dist-docs-standalone",
    rollupOptions: {
      input: path.resolve(__dirname, "standalone.html"),
    },
  },
})
