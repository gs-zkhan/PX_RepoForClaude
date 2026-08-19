import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { DocsApp } from "@/docs/docs-app"

// Standalone entry point for sharing the docs site outside the PX app shell
// — no PxShellRail, no top bar. Built separately (vite.docs.config.ts) into
// a single self-contained HTML file via vite-plugin-singlefile so it can be
// emailed or dropped in Slack and opened directly, no server required.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-screen w-full bg-[var(--s-color-surface-default)]">
      <DocsApp />
    </div>
  </StrictMode>,
)
