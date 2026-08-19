import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"
import { Checkbox } from "@/components/ui/checkbox"
import { IconButton } from "@/components/ui/icon-button"

// -----------------------------------------------------------------------------
// Tree — Figma "Tree" / "_Tree/atomicComponents" (nodes 1273:16, 1640:845),
// Prism V1 - ShadCN. 144 documented variants (4 levels x 4 icon-count types x
// checkbox on/off x 6 states) — all covered by one row component + props,
// per Figma's own instruction: "Compose rows by stacking L1 -> L2 -> L3
// instances in a vertical auto-layout frame... indentation is baked into
// each row — never add extra padding to the container."
//
// Real bound tokens (verified via get_variable_defs) disagree with this
// component's own prose in two places — geometry/bindings trusted over
// prose, consistent with prior discrepancies this phase:
//   - Selected fill is --c-tree-branch-selected (#E9F8FA), not the
//     "#e0ecff" written in the AI-instructions text.
//   - Row default fill is --c-tree-branch-default (#FFFFFF), not
//     "color/surface/page" (#F5F7F9) as the prose states.
//
// Chevron: every state instance (including "Enable") uses the SAME
// chevron-right asset — there is no separate chevron-down asset in this
// component. Figma's own Claude-API-Rules section confirms this explicitly:
// "rotate the existing chevron... do not swap to a different icon." So
// `expanded` here rotates chevron-right 90deg, matching Figma's own
// instruction, rather than swapping icon assets.
//
// Indentation: Level 0/1 -> space/200 (16px). Level 2 -> 48px (verified raw
// constant, no dedicated token). Level 3 -> --c-tree-indent (80px,
// component token). Trailing padding is always space/200 (16px, fixed).
//
// Chevron/checkbox coexistence (re-verified after a reported defect): in
// every Level 0/1/2 symbol checked — Checkbox=True AND Checkbox=False, with
// or without leading icons — the chevron slot is baked into the row FIRST,
// then checkbox (when present) sits directly after it, then icons, then
// label. They are two independent, simultaneously-renderable slots, never
// mutually exclusive — a multiselect tree on a branch node always shows
// BOTH. Level 3 (the hard leaf level) never shows a chevron in any checked
// variant, checkbox or not. A single documented exception, "Level=1 - No
// Nesting", drops the chevron at level 1 for a flat single-level list. Treat
// `expandable` as level-appropriate (level 0-2 branch rows with real
// children should pass it; level-3 leaves and "no nesting" rows should not)
// rather than an independent style toggle.
// -----------------------------------------------------------------------------

type TreeLevel = 0 | 1 | 2 | 3

const LEVEL_PADDING_LEFT: Record<TreeLevel, string> = {
  0: "var(--p-space-200)",
  1: "var(--p-space-200)",
  2: "48px",
  3: "var(--c-tree-indent)",
}

function Tree({ className, ...props }: React.ComponentProps<"div">) {
  return <div role="tree" data-slot="tree" className={cn("flex flex-col", className)} {...props} />
}

type TreeItemProps = {
  level?: TreeLevel
  label: string
  /** 0-3 leading icons rendered after the chevron/checkbox slot, per Figma's Type=No Icon/1 Icon/2 Icons/3 Icons variants. */
  icons?: PrismIconName[]
  /** Shows the expand/collapse chevron — only meaningful for branch nodes (Level 1 in Figma's spec). */
  expandable?: boolean
  expanded?: boolean
  onToggleExpand?: () => void
  checkbox?: boolean
  checked?: boolean | "indeterminate"
  onCheckedChange?: (checked: boolean | "indeterminate") => void
  selected?: boolean
  disabled?: boolean
  onSelect?: () => void
  /** Shows a trailing "more actions" icon button on hover/focus when provided. */
  onMoreActions?: () => void
  className?: string
}

function TreeItem({
  level = 1,
  label,
  icons = [],
  expandable = false,
  expanded = false,
  onToggleExpand,
  checkbox = false,
  checked = false,
  onCheckedChange,
  selected = false,
  disabled = false,
  onSelect,
  onMoreActions,
  className,
}: TreeItemProps) {
  return (
    <div
      role="treeitem"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      aria-expanded={expandable ? expanded : undefined}
      className={cn(
        "group flex h-8 items-center gap-[var(--p-space-100)] py-[var(--p-space-050)] pr-[var(--p-space-200)]",
        "bg-[var(--c-tree-branch-default)]",
        !disabled && !selected && "hover:bg-[var(--c-tree-branch-hover)]",
        selected && "bg-[var(--c-tree-branch-selected)]",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      style={{ paddingLeft: LEVEL_PADDING_LEFT[level] }}
      onClick={disabled ? undefined : onSelect}
    >
      {expandable ? (
        <button
          type="button"
          disabled={disabled}
          aria-label={expanded ? "Collapse" : "Expand"}
          onClick={(event) => {
            event.stopPropagation()
            onToggleExpand?.()
          }}
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center transition-transform",
            expanded && "rotate-90",
            disabled ? "text-[var(--s-color-text-disabled)]" : "text-[var(--s-color-text-default)]"
          )}
        >
          <PrismIcon name="chevron-right" size={24} decorative />
        </button>
      ) : null}

      {checkbox ? (
        <Checkbox
          checked={checked}
          disabled={disabled}
          onCheckedChange={(value) => onCheckedChange?.(value)}
          onClick={(event) => event.stopPropagation()}
        />
      ) : null}

      {icons.map((name) => (
        <PrismIcon
          key={name}
          name={name}
          size={24}
          decorative
          className={disabled ? "shrink-0 text-[var(--s-color-text-disabled)]" : "shrink-0 text-[var(--s-color-text-default)]"}
        />
      ))}

      <span
        className={cn(
          "min-w-0 flex-1 truncate",
          selected
            ? "text-[length:var(--t-tree-font-selected-size)] font-[number:var(--t-tree-font-selected-weight)] leading-[var(--t-tree-font-selected-line-height)]"
            : "text-[length:var(--t-tree-font-default-size)] font-[number:var(--t-tree-font-default-weight)] leading-[var(--t-tree-font-default-line-height)]",
          disabled ? "text-[var(--s-color-text-disabled)]" : "text-[var(--s-color-text-default)]"
        )}
      >
        {label}
      </span>

      {onMoreActions && !disabled ? (
        <IconButton
          icon="more-vertical"
          label="More actions"
          onClick={(event) => {
            event.stopPropagation()
            onMoreActions()
          }}
          className="shrink-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
        />
      ) : null}
    </div>
  )
}

export { Tree, TreeItem }
export type { TreeItemProps, TreeLevel }
