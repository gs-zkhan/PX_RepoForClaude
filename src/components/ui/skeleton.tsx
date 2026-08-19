import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Skeleton — Figma "Skeleton Loader 🟢" (node 2683:24440, Prism V1 - ShadCN).
//
// Structural placeholder shown during content fetch — unanimated filled
// shapes in Figma (shimmer is explicitly a "CSS production concern," not
// represented in the design file). Use when the layout of arriving content
// is known; use Spinner instead for indeterminate/unknown-structure loading
// or micro-interactions (button loading, inline refresh, tooltips).
//
// 4 variants: Line (text rows, 12px tall, pill radius), Block
// (paragraphs/images, 80px tall default, radius/050), Avatar (profile
// pictures, 32×32 fixed, full circle), Card (content cards, min 80px tall,
// radius/050). Width is always resizable — stretch to match the layout
// column. Always group multiple instances to mirror the real content
// layout; a single Line skeleton alone is never sufficient (Figma's own
// "Behaviour" note).
//
// One visual state only (no hover/focus/active/disabled/error). Fill:
// color/neutral/200 (verified — same value as --s-color-surface-muted,
// already used for ProgressBar's track for the same reason).
// -----------------------------------------------------------------------------

type SkeletonVariant = "line" | "block" | "avatar" | "card"

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  line: "h-3 w-full rounded-[var(--p-radius-full)]",
  block: "h-20 w-full rounded-[var(--p-radius-050)]",
  avatar: "size-8 shrink-0 rounded-[var(--p-radius-full)]",
  card: "min-h-20 w-full rounded-[var(--p-radius-050)]",
}

type SkeletonProps = {
  variant?: SkeletonVariant
  className?: string
}

function Skeleton({ variant = "line", className }: SkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading…"
      className={cn(
        "animate-pulse bg-[var(--s-color-surface-muted)]",
        VARIANT_CLASSES[variant],
        className,
      )}
    />
  )
}

export { Skeleton }
export type { SkeletonProps, SkeletonVariant }
