import { cn } from "@/lib/utils"
import { PxShellRail } from "@/components/px-shell-rail"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PxHeader } from "@/patterns/px-list-shell"

import type { PxMainContainerProps } from "./types"

// -----------------------------------------------------------------------------
// PxMainContainer — the navigation + header + content anatomy common to every
// full-page PX shell, extracted out of PxListShell so list-specific behaviour
// (the filter slider) doesn't leak into non-list shells (Create/Edit forms).
//
// Figma source: Shell/MainContainer (node 3792:8575) — the page holding every
// PX shell variant. This component's own anatomy (rail + header + one content
// row, no filter slot) matches the lightest composed variant on that page,
// Shell/Nav+PrimaryHeader (node 3796:2273, "PRE-COMPOSED PATTERN — Full page
// shell with left nav + PX Header... Use for detail or settings pages"),
// extended with PxHeader's own existing one-or-two-bar capability (see
// PxHeader.tsx) rather than a second, separate component — Figma's own AI
// instructions frame (4191:21696) describes the 7 shell variants as each
// combining "a Left Navigation variant with a specific header pattern," i.e.
// nav+header composition is already the common substrate Figma itself
// factors these variants from.
//
// Named PxMainContainer (not PxAppShell) deliberately, to track Figma's own
// "MainContainer" vocabulary rather than inventing a new term for the same
// concept.
//
// Owns: rail, header, page background, and the single content-row wrapper
// (flex, min-h-0, full height). Does NOT own: content padding, a filter
// slot, or any assumption about what `children` contains — those are
// PxListShell's (or any other consumer's) responsibility to add on top.
// -----------------------------------------------------------------------------

function PxMainContainer({ nav, header, children, className }: PxMainContainerProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div
        data-slot="px-main-container"
        className={cn("flex h-screen w-full", "bg-[var(--s-color-surface-page)]", className)}
      >
        <PxShellRail
          activeKey={nav.activeKey}
          onNavigate={nav.onNavigate}
          mode={nav.mode}
          onModeChange={nav.onModeChange}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <PxHeader {...header} />

          <div className="flex min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export { PxMainContainer }
