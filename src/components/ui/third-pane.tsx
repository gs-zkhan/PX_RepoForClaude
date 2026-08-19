import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import { IconButton } from "@/components/ui/icon-button"

// -----------------------------------------------------------------------------
// ThirdPane — Figma "Third Pane" (node 1273:20, Prism V1 - ShadCN), built on
// @radix-ui/react-dialog (installed this session — reused by the upcoming
// Modal system) per its own AI instructions: "role='dialog' ... apply focus
// trap when used as a modal overlay."
//
// Right-anchored contextual panel that slides in and overlays page content —
// no header frame, no footer, no border, no border-radius (verified: Figma's
// own Dos/Don'ts explicitly forbid adding any of these). Title + close icon
// sit directly on the panel surface; back arrow is optional for in-panel
// drill-down navigation.
//
// Sizes verified via metadata: Small 336px, Medium 584px (minimum for
// form-heavy content per Figma's own rule — Small is too narrow for
// label+input layouts), Large 840px, XLarge 1064px. All are a fixed 900px
// tall in the Figma spec, but this component stretches to viewport height
// (inset-y-0) since 900px is that specific artboard's height, not a real
// constraint — no token or instruction ties the panel to a fixed 900px.
//
// Content area padding mirrors the title row's horizontal inset (verified)
// with --p-space-300 (24px) vertical padding — Figma's own spec doesn't
// define content-region spacing (it's explicitly caller-owned), so this is a
// documented, token-only default rather than a fabricated value.
//
// Deferred: the "InlinePanel" variant (node 3420:3441) has an entirely
// different anatomy (4 unlabeled content slots, no title/close/shadow, sits
// inline rather than overlaying) — not built here; see
// project_pending_exceptions.md.
// -----------------------------------------------------------------------------

type ThirdPaneSize = "small" | "medium" | "large" | "xlarge"

const SIZE_WIDTH: Record<ThirdPaneSize, string> = {
  small: "336px",
  medium: "584px",
  large: "840px",
  xlarge: "1064px",
}

// Verified title-row left inset per size (48px for XLarge, 32px for the rest).
const SIZE_INSET: Record<ThirdPaneSize, number> = {
  small: 32,
  medium: 32,
  large: 32,
  xlarge: 48,
}

type ThirdPaneProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  size?: ThirdPaneSize
  title: string
  onBack?: () => void
  children: React.ReactNode
  className?: string
}

function ThirdPane({
  open,
  onOpenChange,
  size = "medium",
  title,
  onBack,
  children,
  className,
}: ThirdPaneProps) {
  const inset = SIZE_INSET[size]
  // Verified: back-arrow variant reduces the title-row left inset by
  // space/100 (8px) to make room for the arrow + its 16px gap to the title.
  const headerInset = onBack ? inset - 8 : inset

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/20",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <DialogPrimitive.Content
          data-slot="third-pane"
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex flex-col outline-none",
            "bg-[var(--s-color-surface-default)]",
            "shadow-[var(--e-shadow-400)]",
            "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
            "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
            className
          )}
          style={{ width: SIZE_WIDTH[size] }}
        >
          <div
            className="relative flex h-10 shrink-0 items-center pt-4"
            style={{ paddingLeft: headerInset, paddingRight: 48 }}
          >
            {onBack ? (
              <button
                type="button"
                aria-label="Go back"
                onClick={onBack}
                className="mr-[var(--p-space-200)] inline-flex shrink-0 items-center justify-center text-[var(--c-icon-color-default)]"
              >
                <PrismIcon name="arrow-left" size={24} decorative />
              </button>
            ) : null}
            <DialogPrimitive.Title
              className={cn(
                "truncate",
                "text-[length:var(--t-font-heading-medium-size)]",
                "font-[number:var(--t-font-heading-medium-weight)]",
                "leading-[var(--t-font-heading-medium-line-height)]",
                "text-[var(--s-color-text-default)]"
              )}
            >
              {title}
            </DialogPrimitive.Title>
          </div>

          <DialogPrimitive.Close asChild>
            <IconButton icon="cancel" label="Close panel" className="absolute right-4 top-6" />
          </DialogPrimitive.Close>

          <div
            className="min-h-0 flex-1 overflow-y-auto pt-[var(--p-space-300)] pb-[var(--p-space-300)]"
            style={{ paddingLeft: inset, paddingRight: inset }}
          >
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { ThirdPane }
export type { ThirdPaneProps, ThirdPaneSize }
