import { cn } from "@/lib/utils"
import { PxListShell } from "@/patterns/px-list-shell"
import { PX_NAV_LABELS, type PxShellNavKey, type PxShellRailMode } from "@/components/px-shell-rail"

// -----------------------------------------------------------------------------
// WorkInProgress — placeholder screen for every nav item that doesn't have a
// real page built yet. Primary-only header (moduleName sourced from the
// shared PX_NAV_LABELS map so it can never drift from the rail label), empty
// content card.
// -----------------------------------------------------------------------------

type WorkInProgressProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  mode: PxShellRailMode
  onModeChange: (mode: PxShellRailMode) => void
}

function WorkInProgress({ activeKey, onNavigate, mode, onModeChange }: WorkInProgressProps) {
  return (
    <PxListShell
      nav={{ activeKey, onNavigate, mode, onModeChange }}
      header={{ moduleName: PX_NAV_LABELS[activeKey] }}
    >
      <div
        className={cn(
          "flex h-full min-h-[480px] flex-col items-center justify-center",
          "rounded-[var(--p-radius-150)]",
          "border border-[var(--s-color-line-default)]",
          "bg-[var(--s-color-surface-default)]",
          "shadow-[var(--e-shadow-100)]",
        )}
      >
        <p
          className={cn(
            "text-[length:var(--p-font-size-h5)]",
            "font-[var(--p-font-weight-semi-bold)]",
            "leading-[var(--p-font-line-height-h5)]",
            "text-[var(--s-color-text-default)]",
          )}
        >
          Work in progress
        </p>
      </div>
    </PxListShell>
  )
}

export { WorkInProgress }
