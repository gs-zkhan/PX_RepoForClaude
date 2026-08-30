import * as React from "react"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Card — Figma "Card" page (7611:395), defining frame 7613:57.
//
// CORRECTED (2026-08-30): re-enumerated the frame directly via get_metadata
// rather than assuming a Cartesian product of independent flags. The frame
// contains exactly 8 symbols, and they are NOT `Size × State × WithTags` in
// full (2×4×2=16) — they are two disjoint groups:
//
//   Large (132px): { Default, Selected } × { WithTags: true, false }  = 4
//   Small (80px/48px): { Default, Selected, SelectedMin, Empty }, WithTags
//     always false                                                   = 4
//                                                                    ---
//                                                                     8
//
// i.e. Large never has SelectedMin/Empty, and Small never has a tags row.
// The component below is typed as a discriminated union on `size` so those
// invalid combinations cannot be constructed, instead of the previous
// `selected`/`minimized`/`empty`/`reorderable` independent booleans (which
// allowed nonsensical states like `size="large"` + `minimized`, or
// `minimized && empty` together, that don't exist in Figma).
//
// Screenshot-verified anatomy per symbol (not assumed from naming alone):
//   7623:3891 (Large/Default/WithTags): icon + Title/Description stack +
//     tags row.
//   7623:3906 (Large/Selected/WithTags): same anatomy, 2px brand border.
//   7623:3921 (Large/Default/no tags): same anatomy, tags row omitted.
//   7623:3929 (Large/Selected/no tags): same anatomy, 2px brand border,
//     tags row omitted.
//   7614:231 (Small/Default): reorder-grip + icon + Title/Description +
//     freeform trailing (Chip + destructive IconButton + chevron).
//   7614:284 (Small/Selected): identical anatomy to Default, 2px brand
//     border.
//   7621:3622 (Small/SelectedMin — public API `state="compact"`, see the
//     naming note below): a condensed 48px row — title only (description
//     dropped), same reorder-grip + trailing anatomy as Default.
//   7620:315 (Small/Empty): identical anatomy/border to Default (icon,
//     title, AND description are all still shown) — the only difference is
//     the trailing slot contains a single "Add" Link instead of a status
//     Chip + delete IconButton + chevron.
//
// Public naming vs Figma naming (RENAMED 2026-08-30, per direct request —
// no deprecated alias retained, since nothing has been committed/published
// yet): Figma's internal variant-property value for symbol `7621:3622` is
// literally `State=SelectedMin`. The public Card API calls this
// `state="compact"` instead, because — evidence below — it is not
// semantically a selected state:
//   7614:284 (Selected):    border variable = `color/line/brand` (#0369e9)
//   7621:3622 (SelectedMin/`compact`): border variable = `color/line/default` (#d5d9de)
// `compact` is bound to the same DEFAULT line-color variable as
// Default/Empty, not the brand/selected variable Selected uses, and there
// is no selection indicator anywhere in its layer tree (no checkmark/dot/
// fill change). It is a condensed/minimized row, not a selected row —
// `state="selected"` is the only Card state that means "selected", and it
// is the only one that renders the brand border and `aria-pressed=true`.
//
// Empty state (REFINED 2026-08-30, per direct request): Figma never pairs
// Empty with Selected — there is no "Empty + Selected" symbol among the 8
// audited variants, and Empty's own anatomy (a single "Add" affordance,
// no status Chip/delete/chevron) reads as an invite-to-add prompt rather
// than an existing, selectable row. The type below reflects this: the
// `state: "empty"` branch does not accept `onSelect` (typed as `never`),
// and requires `trailing` (Figma always shows the "Add" action here — this
// component does not hard-code its copy or destination; compose the
// approved `Link`).
//
// The small-size reorder-grip glyph appears in all 4 small symbols in
// Figma, but since no drag-and-drop interaction is specified or testable
// from static frames, it is exposed as an opt-in `reorderHandle` slot
// (caller-supplied node) rather than a built-in decorative icon baked into
// every small Card.
//
// Distinct from:
//   - CanvasCard (src/components/ui/canvas-card.tsx): a two-pane resizable
//     editor shell (split/fixed-left/fixed-right). No icon/title/
//     description/tags/selection anatomy at all — unrelated purpose.
//   - SummaryStat: a KPI value+label display. Its `clickable`+`selected`
//     states are the only surface-level similarity; it has no leading
//     icon, title/description stack, or tags row.
//   - ConfigRow: closest anatomical relative (icon puck + title/subtitle +
//     trailing slot + chevron, ~48px), but Card adds a Selected/blue-border
//     state, a Large size with a tags row, and an optional reorder handle —
//     none of which ConfigRow has. Not extended from ConfigRow; ConfigRow
//     itself is unmodified.
//
// This page carries no AI Instructions or Dos/Don'ts frames in the approved
// file (U3D8WMBVFl9LvAZyLHhm24) — confirmed via get_metadata, not assumed.
// A cross-library `search_design_system` lookup surfaced a same-named
// "Card" component, but only from the explicitly forbidden library "Prism -
// AI Design System of PX" (CLAUDE.md) — discarded, not used as evidence.
//
// Tokens: no dedicated --c-card-* tokens exist in the generated CSS
// (verified via grep) — expected, not a gap requiring Stop-and-Ask (this
// file's own Dashboard Widget Card / Divider precedent already documents
// component-token absence as normal when a component composes directly
// from semantic tokens). Uses: --s-color-surface-default,
// --s-color-line-default, --s-color-action-primary-default (selected
// border — background stays white in Selected, confirmed via screenshot,
// not assumed from the pattern used elsewhere), --t-font-heading-small-*
// (title), --s-color-text-subtle / --p-font-size-medium (description).
//
// Accessibility: a selectable Card (i.e. `onSelect` supplied) renders its
// icon+title+description region as a single real <button> with
// aria-pressed reflecting `state === "selected"` — not the whole row, and
// not a div with onClick. `trailing`/`reorderHandle` content is always a
// sibling of that button, never nested inside it, so there is no nested-
// interactive-control conflict. No Disabled state is defined anywhere in
// the audited Figma evidence, so this component does not invent one —
// disabling the freeform `trailing`/`reorderHandle` content (e.g. an
// individual disabled IconButton) is the caller's own responsibility.
//
// STATUS: APPROVED (2026-08-30). Design owner completed visual review and
// approved this component as implemented — no outstanding exceptions.
// Visual Review: Approved. Approved for AI use: Yes.
// -----------------------------------------------------------------------------

type CardLargeState = "default" | "selected"
type CardSmallInteractiveState = "default" | "selected" | "compact"

type CardBaseProps = {
  /** Leading icon/avatar slot. Compose a PrismIcon or any React node. */
  icon?: React.ReactNode
  title: React.ReactNode
  className?: string
}

type CardLargeProps = CardBaseProps & {
  size: "large"
  /** Default: 1px border. Selected: 2px primary border (background stays white). */
  state?: CardLargeState
  description?: React.ReactNode
  /** Compose approved `Chip` elements. Renders only when supplied — matches Figma's "With Tags" symbols. */
  tags?: React.ReactNode
  /** Supplying this makes the icon/title/description region a real <button> with aria-pressed. */
  onSelect?: () => void
}

type CardSmallSharedProps = CardBaseProps & {
  size: "small"
  /** Hidden automatically when `state="compact"` (Figma drops it at that height). */
  description?: React.ReactNode
  /**
   * Caller-supplied reorder affordance (e.g. a decorative PrismIcon), shown
   * before `icon`. This component does not implement drag-and-drop physics
   * or keyboard reorder instructions — a caller wiring up real reordering
   * supplies their own handle element and behaviour here.
   */
  reorderHandle?: React.ReactNode
}

type CardSmallInteractiveProps = CardSmallSharedProps & {
  /**
   * `state="compact"` maps to Figma's `State=SelectedMin` symbol
   * (`7621:3622`) — despite Figma's internal name, it is NOT a selected
   * state (see the naming note above); it renders the same default border
   * as Default/Empty and `aria-pressed` is always false for it. It is a
   * condensed/minimized 48px row. `state="selected"` is the only state
   * that means "selected".
   */
  state?: CardSmallInteractiveState
  /**
   * Freeform trailing slot — Figma shows a status Chip + destructive
   * IconButton + disclosure chevron for populated rows, but nothing is
   * hard-coded; compose whatever the row needs from already-approved
   * components. Rendered as a sibling of the selection button, never
   * nested inside it.
   */
  trailing?: React.ReactNode
  /** Supplying this makes the icon/title/description region a real <button> with aria-pressed. */
  onSelect?: () => void
}

type CardSmallEmptyProps = CardSmallSharedProps & {
  state: "empty"
  /**
   * Required — Figma's Empty state always shows a single "Add" action here.
   * Compose the approved `Link` component; this component does not
   * hard-code the copy or destination.
   */
  trailing: React.ReactNode
  /**
   * Figma never pairs Empty with Selected (no "Empty + Selected" symbol
   * exists among the 8 audited variants) — Empty is an invite-to-add
   * prompt, not a selectable existing row, so `onSelect` is not accepted.
   */
  onSelect?: never
}

type CardSmallProps = CardSmallInteractiveProps | CardSmallEmptyProps

type CardProps = CardLargeProps | CardSmallProps

const LARGE_BORDER: Record<CardLargeState, string> = {
  default: "border border-[var(--s-color-line-default)]",
  selected: "border-2 border-[var(--s-color-action-primary-default)]",
}

// 48px has an exact token (--p-space-600); 80px does not — verified via
// grep of prism-generated.css, so 80px is a documented raw constant
// matching the Figma-measured Small/Default symbol height (7614:231), not
// a fabricated value.
type CardSmallState = CardSmallInteractiveState | "empty"

const SMALL_LAYOUT: Record<CardSmallState, { height: string; border: string; showDescription: boolean }> = {
  default: {
    height: "h-20",
    border: "border border-[var(--s-color-line-default)]",
    showDescription: true,
  },
  selected: {
    height: "h-20",
    border: "border-2 border-[var(--s-color-action-primary-default)]",
    showDescription: true,
  },
  compact: {
    height: "h-[var(--p-space-600)]",
    border: "border border-[var(--s-color-line-default)]",
    showDescription: false,
  },
  empty: {
    height: "h-20",
    border: "border border-[var(--s-color-line-default)]",
    showDescription: true,
  },
}

function Card(props: CardProps) {
  const { icon, title, className } = props
  const onSelect = props.size === "large" ? props.onSelect : props.state === "empty" ? undefined : props.onSelect
  const isSelectable = Boolean(onSelect)

  const description = "description" in props ? props.description : undefined
  const showDescription =
    props.size === "large" ? Boolean(description) : Boolean(description) && SMALL_LAYOUT[props.state ?? "default"].showDescription

  const titleStack = (
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)] text-[var(--s-color-text-default)]">
        {title}
      </span>
      {showDescription && (
        <span className="truncate text-[length:var(--p-font-size-medium)] text-[var(--s-color-text-subtle)]">
          {description}
        </span>
      )}
    </span>
  )

  const selectionRegion = isSelectable ? (
    <button
      type="button"
      aria-pressed={props.state === "selected"}
      onClick={onSelect}
      className={cn(
        "flex min-w-0 flex-1 items-center gap-[var(--p-space-200)] text-left outline-none",
        "focus-visible:shadow-[var(--e-shadow-focus)]",
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {titleStack}
    </button>
  ) : (
    <div className="flex min-w-0 flex-1 items-center gap-[var(--p-space-200)]">
      {icon && <span className="shrink-0">{icon}</span>}
      {titleStack}
    </div>
  )

  if (props.size === "large") {
    const state = props.state ?? "default"

    return (
      <div
        data-slot="card"
        className={cn(
          "flex w-full flex-col items-stretch gap-[var(--p-space-200)] p-[var(--p-space-200)]",
          "rounded-[var(--p-radius-150)] bg-[var(--s-color-surface-default)]",
          LARGE_BORDER[state],
          className,
        )}
      >
        <div className="flex w-full items-center gap-[var(--p-space-200)]">{selectionRegion}</div>
        {props.tags && (
          <div className="flex flex-wrap items-center gap-[var(--p-space-100)]">{props.tags}</div>
        )}
      </div>
    )
  }

  const state: CardSmallState = props.state ?? "default"
  const layout = SMALL_LAYOUT[state]

  return (
    <div
      data-slot="card"
      className={cn(
        "flex w-full items-center gap-[var(--p-space-200)] px-[var(--p-space-200)]",
        "rounded-[var(--p-radius-150)] bg-[var(--s-color-surface-default)]",
        layout.border,
        layout.height,
        className,
      )}
    >
      {props.reorderHandle && <span className="shrink-0">{props.reorderHandle}</span>}
      {selectionRegion}
      {props.trailing && (
        <div className="flex shrink-0 items-center gap-[var(--p-space-150)]">{props.trailing}</div>
      )}
    </div>
  )
}

export { Card }
export type {
  CardProps,
  CardLargeProps,
  CardSmallProps,
  CardSmallInteractiveProps,
  CardSmallEmptyProps,
  CardLargeState,
  CardSmallState,
}
