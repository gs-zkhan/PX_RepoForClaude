import { cn } from "@/lib/utils"
import { PxShellRail } from "@/components/px-shell-rail"
import { TooltipProvider } from "@/components/ui/tooltip"

import { PxHeader } from "./PxHeader"
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
    <TooltipProvider delayDuration={300}>
      <div
        data-slot="px-list-shell"
        className={cn(
          "flex h-screen w-full",
          "bg-[var(--s-color-surface-page)]",
        )}
      >
        <PxShellRail
          activeKey={nav.activeKey}
          onNavigate={nav.onNavigate}
          mode={nav.mode}
          onModeChange={nav.onModeChange}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <PxHeader {...header} />

          <div className="flex min-h-0 flex-1">
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
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export { PxListShell }
