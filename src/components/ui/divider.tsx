import * as React from "react"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Divider — Figma "Divider" page (20:18), defining symbol frame 848:18 (4
// variants: Orientation={Horizontal,Vertical} × Weight={1,2}px). Solid only
// — PX DS V2 explicitly excludes Dashed/Dotted (per AI Instructions, node
// 9139:6494).
//
// Anatomy: Horizontal — full width of its container, height = weight.
// Vertical — full height of its container, width = weight. No fill, no
// background beyond the stroke itself; StrokeAlign=center (irrelevant at
// 1–2px, but noted for fidelity).
//
// Token: stroke → --s-color-line-default for every orientation/weight
// combination (no new token needed — same value Figma specifies for both).
// stroke-width → --p-border-width-100 (1px, default) or
// --p-border-width-200 (2px, emphasis).
//
// Semantics (node 9139:6519): horizontal renders as a real <hr> (a genuine
// semantic thematic break, picked up by assistive tech automatically).
// Vertical has no native HTML element for this, so it renders as a
// decorative <div role="separator" aria-orientation="vertical"> per the
// Figma spec exactly. Neither requires a visible label. A Divider signals a
// structural content boundary — do not use it as a substitute for spacing
// (use spacing tokens) and do not stack dividers consecutively (both
// explicit Figma Don'ts).
//
// STATUS: Visual Review: Approved. Approved for AI use: Yes. Approval date:
// 2026-08-29 — design-owner visually verified as part of a 4-item review
// batch (Link, Divider, Button Bulk Action, Button Primary-Split). See
// ai/figma-coverage.json (id component-divider).
// -----------------------------------------------------------------------------

type DividerWeight = 1 | 2

type DividerProps = React.HTMLAttributes<HTMLElement> & {
  orientation?: "horizontal" | "vertical"
  weight?: DividerWeight
}

const WEIGHT_TOKEN: Record<DividerWeight, string> = {
  1: "var(--p-border-width-100)",
  2: "var(--p-border-width-200)",
}

const Divider = React.forwardRef<HTMLElement, DividerProps>(function Divider(
  { orientation = "horizontal", weight = 1, className, ...props },
  ref,
) {
  const thickness = WEIGHT_TOKEN[weight]

  if (orientation === "vertical") {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="divider"
        role="separator"
        aria-orientation="vertical"
        className={cn("h-full shrink-0 bg-[var(--s-color-line-default)]", className)}
        style={{ width: thickness }}
        {...props}
      />
    )
  }

  return (
    <hr
      ref={ref as React.Ref<HTMLHRElement>}
      data-slot="divider"
      className={cn("w-full shrink-0 border-none bg-[var(--s-color-line-default)] m-0", className)}
      style={{ height: thickness }}
      {...props}
    />
  )
})

export { Divider }
export type { DividerProps }
