import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import type { PxCreateEditAction } from "./types"

// -----------------------------------------------------------------------------
// PxCreateEditFooter — the sticky footer bar shared by the Accordion and
// Wizard full-page compositions. Figma "Create Edit Form AI Instructions"
// (node 7128:873), "Sizing" row: "Footer sticky bar (full-page): 56px height
// · shadow/100 (upward) · color/surface/default fill · right-aligned: Cancel
// + primary CTA."
//
// Token note: the spec names "shadow/100 (upward)" but --e-shadow-100 is
// actually a downward-cast shadow in this repo's generated tokens (positive
// y-offset — the same token PxHeader uses to separate itself from the
// content *below* it). The token that actually casts upward is
// --e-shadow-inverse (negative y-offset) — the same one Modal Footer already
// uses for its own upward separation from the body above it. Using
// --e-shadow-inverse here to match the written *intent* ("upward"), not the
// literal (and inconsistent) token name — flagged for design-owner review.
//
// This is NOT the same component as <ModalFooter> — that one has Modal's own
// bottom-corner radius and size-driven height presets (64/48/40px), neither
// of which apply to a full-width, square-cornered, fixed-56px page footer.
// Reuses <Button> for its actions rather than duplicating button markup.
// -----------------------------------------------------------------------------

type PxCreateEditFooterProps = {
  onCancel: () => void
  primaryAction: PxCreateEditAction
  className?: string
}

function PxCreateEditFooter({ onCancel, primaryAction, className }: PxCreateEditFooterProps) {
  return (
    <div
      data-slot="px-create-edit-footer"
      className={cn(
        "flex h-14 shrink-0 items-center justify-end gap-[var(--p-space-200)]",
        "bg-[var(--s-color-surface-default)] px-[var(--p-space-300)]",
        "shadow-[var(--e-shadow-inverse)]",
        className,
      )}
    >
      <Button variant="secondary" size="large" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="primary" size="large" onClick={primaryAction.onClick} disabled={primaryAction.disabled}>
        {primaryAction.label}
      </Button>
    </div>
  )
}

export { PxCreateEditFooter }
export type { PxCreateEditFooterProps }
