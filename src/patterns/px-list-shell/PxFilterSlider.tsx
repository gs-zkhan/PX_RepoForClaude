import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// -----------------------------------------------------------------------------
// PxFilterSlider — filter panel, 336px wide, sits beside the table body (not
// the full card — the card's own title bar always spans full width above
// this and the table).
//
// Figma source: node 4077:8134 ("Filter as slider", component library page
// "Filter Chip, Bar, Dropdown Panel"), cross-checked against the assembled
// example at node 3721:22905 ("Filter as a Slider").
//
// Anatomy (verified against the real component export, not prose spec):
// - Tabs row: "Filter" / "Global Context".
// - ONE row containing: "My Filter" chip (leading filter icon) + delete icon
//   on the left, Apply button on the right. There is NO separate footer.
// - Body: empty state ("Add your first filter" / "Add filter or select one
//   from My Filter" / Add Filter button) when there are no children.
// - Only the bottom-right corner is rounded (flush against the card's own
//   title bar above and the table to its left).
//
// This is a composition-only slot — filter row content is passed as children.
// -----------------------------------------------------------------------------

type PxFilterSliderTab = "filter" | "global-context"

type PxFilterSliderProps = {
  /** Which tab is active. Default: "filter". */
  activeTab?: PxFilterSliderTab
  onTabChange?: (tab: PxFilterSliderTab) => void
  savedFilterName?: string
  /**
   * Enables the "My Filter" chip and delete icon. When false both are shown
   * disabled, matching the DS empty-state.
   */
  hasSavedFilter?: boolean
  onDeleteSavedFilter?: () => void
  /** Enables the Apply button. Set true once any filter value has changed. */
  canApply?: boolean
  onApply?: () => void
  /** Called from the empty-state CTA when no filter rows are present. */
  onAddFilter?: () => void
  /** Filter row content. When undefined, renders the "Add filter" empty state. */
  children?: React.ReactNode
}

function PxFilterSlider({
  activeTab = "filter",
  onTabChange,
  savedFilterName = "My Filter",
  hasSavedFilter = false,
  onDeleteSavedFilter,
  canApply = false,
  onApply,
  onAddFilter,
  children,
}: PxFilterSliderProps) {
  const hasChildren = React.Children.count(children) > 0

  return (
    <aside
      aria-label="Filters"
      className={cn(
        "flex h-[772px] w-[336px] shrink-0 flex-col",
        "rounded-br-[var(--p-radius-150)]",
        "border-l border-[var(--s-color-line-default)]",
        "bg-[var(--s-color-surface-default)]",
      )}
    >
      {/* Tabs row ------------------------------------------------------- */}
      {/* Shared Tabs at size="medium". Verified against Figma 4077:8134:
          font.heading.xxsmall (12px/600/16lh) + tabs/padding/vertical 8 =
          8 + 16 + 8 = 32px, which is exactly the Medium preset — so the h-8
          row below is correct and the trigger fits it without being crushed.
          (An earlier note in this repo claimed the row needed 14px text and
          therefore matched no preset; that was an unverified assumption and
          was wrong.) */}
      {/* No fixed height: the Medium trigger is itself 32px, so an `h-8` box
          with 8px of top padding left only 24px of content and the trigger
          overflowed into the row below. The block sizes to its content
          (8 + 32) and owns the 24px gap beneath the tabs, so the row below
          carries no top padding of its own — otherwise the two would stack to
          48px. */}
      <div
        className={cn(
          "shrink-0",
          "px-[var(--p-space-200)] pt-[var(--p-space-200)] pb-[var(--p-space-300)]",
        )}
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => onTabChange?.(value as PxFilterSliderTab)}
        >
          <TabsList variant="primary" size="medium">
            <TabsTrigger value="filter">Filter</TabsTrigger>
            <TabsTrigger value="global-context">Global Context</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Saved-filter + Apply row — same row, no separate footer --------- */}
      <div className="flex h-6 shrink-0 items-center justify-between px-[var(--p-space-200)]">
        <div className="flex items-center gap-[var(--p-space-100)]">
          <Button
            variant="secondary"
            size="small"
            disabled={!hasSavedFilter}
          >
            <PrismIcon name="filter" size={16} />
            {savedFilterName}
          </Button>
          <IconButton
            icon="delete"
            label="Delete saved filter"
            disabled={!hasSavedFilter}
            onClick={onDeleteSavedFilter}
          />
        </div>
        <Button
          variant="secondary"
          size="small"
          disabled={!canApply}
          onClick={onApply}
        >
          Apply
        </Button>
      </div>

      {/* Body ------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-[var(--p-space-200)]">
        {hasChildren ? (
          <div className="flex flex-col gap-[var(--p-space-200)] p-[var(--p-space-300)]">
            {children}
          </div>
        ) : (
          <PxFilterSliderEmpty onAddFilter={onAddFilter} />
        )}
      </div>
    </aside>
  )
}

function PxFilterSliderEmpty({ onAddFilter }: { onAddFilter?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-[var(--p-space-300)] p-[var(--p-space-300)] text-center">
      <div
        aria-hidden="true"
        className={cn(
          "flex h-20 w-20 items-center justify-center",
          "rounded-[var(--p-radius-150)]",
          "border border-[var(--s-color-line-subtle)]",
          "bg-[var(--s-color-surface-muted)]",
        )}
      >
        <PrismIcon
          name="filter"
          size={32}
          sourceSize={24}
          className="text-[var(--s-icon-color-subtle)]"
        />
      </div>

      <div className="flex flex-col gap-[var(--p-space-100)]">
        <p
          className={cn(
            "text-[length:var(--p-font-size-h6)]",
            "font-[var(--p-font-weight-semi-bold)]",
            "leading-[var(--p-font-line-height-h6)]",
            "text-[var(--s-color-text-default)]",
          )}
        >
          Add your first filter
        </p>
        <p
          className={cn(
            "text-[length:var(--p-font-size-small)]",
            "leading-[var(--p-font-line-height-small)]",
            "text-[var(--s-color-text-subtlest)]",
          )}
        >
          Add filter or select one from My Filter
        </p>
      </div>

      <Button variant="secondary" size="small" onClick={onAddFilter}>
        Add filter
      </Button>
    </div>
  )
}

export { PxFilterSlider }
export type { PxFilterSliderProps, PxFilterSliderTab }
