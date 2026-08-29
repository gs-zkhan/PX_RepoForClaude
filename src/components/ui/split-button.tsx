import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PrismIcon } from "@/components/ui/prism-icon"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"

// -----------------------------------------------------------------------------
// SplitButton — Figma "Type=Primary-Split" (Button page, node 20:10;
// representative symbol 4044:24089). Figma models this as a single visual
// variant of Button, but its own AI Instructions describe two functionally
// distinct zones: a primary action (pl=16px, chevron side pr=8px) and a
// dropdown trigger, joined by a divider (button/primarySplit/divider at 30%
// opacity). A single native <button> cannot expose two independently
// operable, independently labelled regions, so this composes two real
// <button> elements rather than rendering one — the WAI-ARIA "split button"
// pattern is universally implemented this way, never as one element.
//
// Composed entirely from existing approved components:
//   - Button (variant="primary", the new additive `radiusEdge` prop squares
//     off the adjoining edge of each segment instead of a className
//     override — see button.tsx).
//   - DropdownMenu/DropdownMenuTrigger/DropdownMenuContent for the actual
//     secondary-options popover (src/components/ui/dropdown-menu.tsx,
//     unmodified) — matches Figma's own "Related" annotation ("Menu —
//     multiple actions in a dropdown list") and this repo's established
//     precedent (PxAnalyticsSecondaryNav's collapsed-rail flyout reuses the
//     same primitive for the same reason).
//   - PrismIcon for the chevron, which flips per Figma: chevron-down at
//     Default/Hover/Disabled, chevron-up while the menu is open ("Click").
//
// Token/geometry note (visual-parity, not a behaviour requirement): Figma's
// divider is a hairline element sized independently of the segments'
// padding; this implementation renders it as a 1px-wide span using
// --c-button-primary-split-divider at 30% opacity, matching the AI
// Instructions exactly ("Divider = button/primarySplit/divider at 30%
// opacity").
//
// STATUS: Visual Review: Approved. Approved for AI use: Yes. Approval date:
// 2026-08-29 — design-owner visually verified the distinct primary-action
// and dropdown-trigger segments, divider, and chevron states, as part of a
// 4-item review batch (Link, Divider, Button Bulk Action, Button
// Primary-Split). See ai/figma-coverage.json (id
// component-button-split-variant).
// -----------------------------------------------------------------------------

type SplitButtonSize = "large" | "medium" | "small"

type SplitButtonProps = {
  /** The primary action's label/content — plain text or text + PrismIcon. */
  children: React.ReactNode
  /** Called when the primary action segment is activated. */
  onAction: () => void
  /** Content rendered inside the dropdown (typically DropdownMenuItem elements). */
  menuContent: React.ReactNode
  /**
   * Accessible label for the menu-trigger segment — required, since it has
   * no visible text (chevron only). E.g. "More save options".
   */
  menuLabel: string
  size?: SplitButtonSize
  disabled?: boolean
  className?: string
}

function SplitButton({
  children,
  onAction,
  menuContent,
  menuLabel,
  size = "large",
  disabled = false,
  className,
}: SplitButtonProps) {
  const [open, setOpen] = React.useState(false)
  const chevronSize = size === "small" ? 16 : 24

  return (
    <div data-slot="split-button" className={cn("inline-flex items-stretch", className)}>
      <Button
        type="button"
        variant="primary"
        size={size}
        radiusEdge="start"
        disabled={disabled}
        onClick={onAction}
        className="pr-[var(--c-button-padding-icon)]"
      >
        {children}
      </Button>

      <span
        aria-hidden="true"
        className="shrink-0 self-stretch bg-[var(--c-button-primary-split-divider)] opacity-30"
        style={{ width: "var(--p-border-width-100)" }}
      />

      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="primary"
            size={size}
            radiusEdge="end"
            disabled={disabled}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={menuLabel}
            className="px-[var(--c-button-padding-icon)]"
          >
            <PrismIcon name={open ? "chevron-up" : "chevron-down"} size={chevronSize} decorative />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{menuContent}</DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { SplitButton }
export type { SplitButtonProps }
