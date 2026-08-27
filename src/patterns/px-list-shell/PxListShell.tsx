import { cn } from "@/lib/utils"
import { PxMainContainer } from "@/patterns/px-main-container"

import type { PxListShellProps } from "./types"

// -----------------------------------------------------------------------------
// PxListShell — outermost layout for PX list-type pages.
//
// Figma source:
//   - Shell/MainContainer (node 3792:8575), assembled variant Shell/ListPage
//     (node 7306:20074).
//   - Shell/Page Header & Title (node 1273:19)  ← consumed via PxHeader.
//   - Shell/Filter Panel (node 20:36)           ← consumed via PxFilterSlider
//     slot.
//
// Layout constants (from Figma AI-instructions frame 4191:21696):
//   - Nav collapsed width: 48px (PxShellRail default `mode="collapsed"`).
//   - Header height: 96px (Primary 48 + Secondary 48).
//   - Page background: color/surface/page.
//   - Content SLOT padding: 24px (space/300) on all four sides.
//   - Filter Slider width: 336px, right-aligned, full height.
//
// Composed from PxMainContainer (rail + header + content row — see
// src/patterns/px-main-container) plus the one thing that's genuinely
// list-specific: the padded <main> + optional filterSlider sitting side by
// side in that content row. This is a pure extraction — the rendered DOM
// for the rail/header/main/filterSlider is unchanged; only the outermost
// wrapper's data-slot moved from "px-list-shell" to PxMainContainer's own
// "px-main-container" (nothing in the repo queries that attribute's value).
//
// Composition rules (see README):
//   1. Always compose page content via `children`.
//   2. Never re-add page padding inside children — the shell handles 24px.
//   3. Never render PxShellRail or PxHeader as siblings of this shell.
//   4. Overlays (Modal, Drawer) are siblings of PxListShell in the tree.
// -----------------------------------------------------------------------------

function PxListShell({
  nav,
  header,
  filterSlider,
  children,
}: PxListShellProps) {
  return (
    <PxMainContainer nav={nav} header={header}>
      <main
        data-slot="px-list-shell-content"
        className={cn(
          "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
          "p-[var(--p-space-300)]",
        )}
      >
        {children}
      </main>

      {filterSlider}
    </PxMainContainer>
  )
}

export { PxListShell }
