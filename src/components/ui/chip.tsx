import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Chip — Figma "Chip Prism 🟢" (node 4049:9748, Prism V1 - ShadCN).
//
// Compact label for status, category or metadata. Not interactive by
// default — for interactive filtering use <FilterChip> instead.
//
// Figma defines Hover/Selected/Disabled states only for the four base colors
// (gray/green/red/yellow) — the six accent colors (beta/new/tutorial/tip/
// active/inactive) only vary by Default/Disabled. `selected` therefore has no
// effect on accent colors (no token exists for it); `disabled` applies
// uniformly via the shared neutral/subtlest + text/disabled tokens.
// -----------------------------------------------------------------------------

const chipVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap",
    "font-[number:var(--t-chip-font-weight)]",
  ].join(" "),
  {
    variants: {
      color: {
        gray: "bg-[var(--c-chip-gray-bg)] text-[var(--s-color-text-default)]",
        green: "bg-[var(--c-chip-green-bg)] text-[var(--s-color-text-default)]",
        red: "bg-[var(--c-chip-red-bg)] text-[var(--s-color-text-default)]",
        yellow: "bg-[var(--c-chip-yellow-bg)] text-[var(--s-color-text-default)]",
        beta: "bg-[var(--c-chip-beta-bg)] text-[var(--c-chip-beta-text)]",
        new: "bg-[var(--c-chip-new-bg)] text-[var(--c-chip-new-text)]",
        tutorial: "bg-[var(--c-chip-tutorial-bg)] text-[var(--c-chip-tutorial-text)]",
        tip: "bg-[var(--c-chip-tip-bg)] text-[var(--c-chip-tip-text)]",
        active: "bg-[var(--c-chip-active-bg)] text-[var(--c-chip-active-text)]",
        inactive: "bg-[var(--c-chip-inactive-bg)] text-[var(--c-chip-inactive-text)]",
      },
      size: {
        regular: [
          "gap-[var(--p-space-050)] rounded-[var(--c-chip-radius)] px-[var(--p-space-100)]",
          "py-[3px]",
          "text-[length:var(--t-chip-font-size)] leading-[var(--t-chip-font-line-height)]",
        ].join(" "),
        small: [
          "gap-[var(--p-space-050)] rounded-[var(--c-chip-radius-small)] px-[6px]",
          "text-[11px] leading-[var(--t-chip-font-line-height)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      color: "gray",
      size: "regular",
    },
  }
)

// Selected treatment only exists (as a token) for the four base colors —
// dark/status-toned background with inverse text.
const selectedClassName: Partial<Record<ChipColor, string>> = {
  gray: "bg-[var(--s-color-status-neutral-selected)] text-[var(--s-color-text-inverse)]",
  green: "bg-[var(--s-color-status-success-selected)] text-[var(--s-color-text-inverse)]",
  red: "bg-[var(--s-color-status-danger-selected)] text-[var(--s-color-text-inverse)]",
  yellow: "bg-[var(--s-color-status-warning-selected)] text-[var(--s-color-text-inverse)]",
}

type ChipColor = NonNullable<VariantProps<typeof chipVariants>["color"]>
type ChipSize = NonNullable<VariantProps<typeof chipVariants>["size"]>

type ChipProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> & {
  color?: ChipColor
  size?: ChipSize
  /** Dark/status-toned treatment. Only visible on gray/green/red/yellow. */
  selected?: boolean
  /** Uniform neutral/subtlest background + disabled text, all colors. */
  disabled?: boolean
  /** Shows a 16px dismiss ("cancel") icon after the label. */
  dismissible?: boolean
  /** Called when the dismiss icon is activated. Requires `dismissible`. */
  onDismiss?: () => void
  children: React.ReactNode
}

function Chip({
  className,
  color = "gray",
  size = "regular",
  selected = false,
  disabled = false,
  dismissible = false,
  onDismiss,
  children,
  ...props
}: ChipProps) {
  return (
    <span
      data-slot="chip"
      className={cn(
        chipVariants({ color, size }),
        selected && selectedClassName[color],
        disabled && "bg-[var(--s-color-status-neutral-subtlest)] text-[var(--s-color-text-disabled)]",
        dismissible && "pr-[var(--p-space-050)]",
        className
      )}
      {...props}
    >
      {children}
      {dismissible && (
        // Native <button>, not <IconButton>: IconButton is a fixed 24px hit
        // box with its own hover/active chrome, which doesn't fit a 16px
        // glyph sitting flush inside a compact chip. No approved component
        // covers this tight inline-dismiss anatomy.
        <button
          type="button"
          disabled={disabled}
          onClick={onDismiss}
          aria-label="Remove"
          className="inline-flex shrink-0 items-center justify-center rounded-[var(--p-radius-full)] disabled:pointer-events-none"
        >
          <PrismIcon name="cancel" size={16} sourceSize={24} decorative />
        </button>
      )}
    </span>
  )
}

export { Chip, chipVariants }
export type { ChipProps, ChipColor, ChipSize }
