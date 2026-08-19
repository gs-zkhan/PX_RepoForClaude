import * as React from "react"

import { cn } from "@/lib/utils"
import { DragHandle } from "@/components/ui/drag-handle"

// -----------------------------------------------------------------------------
// CanvasCard — Prism DS anatomy (verified against prism-ds/src/components/
// CanvasCard). Page-level two-pane shell for editor-style patterns
// (preview + config side-by-side). Not a general-purpose dashboard widget
// wrapper — that role is filled by CanvasCard's caller composing multiple
// SummaryStat/Chart instances inside a pane.
//
// Modes: 'split' (both panes flex, default), 'fixed-left', 'fixed-right'
// (one pane fixed at `fixedSize`px, other flexes to fill).
//
// Resizable divider between panes: opt-in via `resizable` prop. When true,
// a DragHandle is rendered between panes and resizes whichever pane is
// natural for the mode (left pane for split/fixed-left, right pane for
// fixed-right). Bounds come from `minSize`/`maxSize` on the resized pane.
// -----------------------------------------------------------------------------

type CanvasCardMode = "split" | "fixed-left" | "fixed-right"

type CanvasCardProps = {
  mode?: CanvasCardMode
  left: React.ReactNode
  right: React.ReactNode
  /** Width in px for the fixed pane. Ignored in 'split' mode. Default 440. */
  fixedSize?: number
  /** Show a draggable divider between panes. Default false. */
  resizable?: boolean
  /** Min width (px) of the resized pane. Default 200. */
  minSize?: number
  /** Max width (px) of the resized pane. Default 800. */
  maxSize?: number
  className?: string
}

function CanvasCard({
  mode = "split",
  left,
  right,
  fixedSize = 440,
  resizable = false,
  minSize = 200,
  maxSize = 800,
  className,
}: CanvasCardProps) {
  const isFixedLeft = mode === "fixed-left"
  const isFixedRight = mode === "fixed-right"
  const leftRef = React.useRef<HTMLDivElement | null>(null)
  const rightRef = React.useRef<HTMLDivElement | null>(null)
  // In fixed-right mode we resize the right (fixed) pane; otherwise resize
  // the left, matching the Prism spec.
  const handleTarget = isFixedRight ? rightRef : leftRef

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 overflow-hidden",
        "rounded-[var(--p-radius-100)] bg-[var(--s-color-surface-default)] shadow-[var(--e-shadow-100)]",
        className,
      )}
    >
      <div
        ref={leftRef}
        className={cn(
          "flex min-w-0 flex-col overflow-hidden bg-[var(--s-color-surface-default)]",
          isFixedLeft ? "shrink-0" : "flex-1",
        )}
        style={isFixedLeft ? { width: fixedSize } : undefined}
      >
        {left}
      </div>
      {resizable ? (
        <DragHandle
          orientation="vertical"
          targetRef={handleTarget}
          minSize={minSize}
          maxSize={maxSize}
        />
      ) : null}
      <div
        ref={rightRef}
        className={cn(
          "flex min-w-0 flex-col overflow-hidden bg-[var(--s-color-surface-default)]",
          isFixedRight ? "shrink-0" : "flex-1",
        )}
        style={isFixedRight ? { width: fixedSize } : undefined}
      >
        {right}
      </div>
    </div>
  )
}

export { CanvasCard }
export type { CanvasCardProps, CanvasCardMode }
