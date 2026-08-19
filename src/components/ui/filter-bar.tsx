import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FilterChip } from "@/components/ui/filter-chip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// FilterBar — Figma "Filter Bar" component (node 4077:8079, "Filter Chip, Bar,
// Dropdown Panel 🟢" page, Prism V1 - ShadCN). Conditional slot below the
// Table Title Bar holding all active Filter Chips.
//
// 5 Figma variants collapse into this single component:
// - Empty            → chips=[] renders "No filters applied" + Add filter
// - One Line         → all chips fit; Modify filter button, no overflow badge
// - Overflow         → chips exceed width; "+N" badge + Show full filter + Modify filter
// - Show Full        → user toggled; all chips wrap across rows, Show less filter
// - Save as New View → any of the above + onSaveAsNew renders a "Save as new" button
//
// Overflow is measured against real chip + button widths (not a hardcoded
// chip count) via a hidden, off-screen measurer row + ResizeObserver, per the
// Figma note "chips exceed available width" (not a fixed count). The trailing
// controls' reserved width always assumes the worst case (Show full filter
// button included) so the overflow calculation never depends on its own
// result.
//
// Per Figma's own rule ("hide the Filter Bar completely when no filters are
// active"), whether to render this component at all is the *page's* decision
// — pass chips=[] only when deliberately showing the "Add filter" invitation
// (e.g. right after the user clicks "Filter" in the Table Title Bar).
//
// Tokens: filter/bar/* (background, gap, padding, divider, overflow badge
// accent) + filter/chip/* (delegated to <FilterChip>, no local overrides).
// -----------------------------------------------------------------------------

type FilterBarChip = {
  id: string
  label: string
  value?: string
  operatorIcon?: PrismIconName
  disabled?: boolean
}

type FilterBarProps = {
  chips: FilterBarChip[]
  /** id of the chip whose Filter Dropdown Panel is currently open. */
  openChipId?: string
  onChipClick?: (id: string) => void
  onModifyFilter?: () => void
  onAddFilter?: () => void
  /** When provided, renders the "Save as new" action (Figma's "Save as New View" variant). */
  onSaveAsNew?: () => void
  /**
   * Content for a chip's own Filter Dropdown Panel, keyed by chip id. When
   * omitted, chips are inert buttons that only report clicks via
   * `onChipClick` — the caller is then responsible for opening something
   * itself. Provide this to get a real dropdown: FilterBar owns the Popover
   * (open state = `chip.id === openChipId`, sideOffset 4 / align "start",
   * matching every other floating surface in the repo) so anchoring can't be
   * wired wrong per-screen — see FilterDropdownPopover for the same reasoning
   * applied to a standalone trigger.
   */
  renderChipPanel?: (chipId: string) => React.ReactNode
  className?: string
}

const BAR_GAP = 8 // --c-filter-bar-gap

function FilterBar({
  chips,
  openChipId,
  onChipClick,
  onModifyFilter,
  onAddFilter,
  onSaveAsNew,
  renderChipPanel,
  className,
}: FilterBarProps) {
  const [showFull, setShowFull] = React.useState(false)
  const [visibleCount, setVisibleCount] = React.useState(chips.length)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const chipMeasureRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const modifyMeasureRef = React.useRef<HTMLButtonElement>(null)
  const showFullMeasureRef = React.useRef<HTMLButtonElement>(null)
  const saveAsNewMeasureRef = React.useRef<HTMLButtonElement>(null)
  const dividerMeasureRef = React.useRef<HTMLSpanElement>(null)

  const recalculate = React.useCallback(() => {
    const container = containerRef.current
    if (!container || chips.length === 0) return

    // Reserve the worst-case trailing width (divider + Modify filter + Show
    // full filter + Save as new, if present) so this never depends on
    // whether Show full filter ends up rendered — which is itself decided
    // by this calculation.
    const reserved =
      (dividerMeasureRef.current?.offsetWidth ?? 0) +
      (modifyMeasureRef.current?.offsetWidth ?? 0) +
      (chips.length > 1 ? (showFullMeasureRef.current?.offsetWidth ?? 0) + BAR_GAP : 0) +
      (onSaveAsNew ? (saveAsNewMeasureRef.current?.offsetWidth ?? 0) + BAR_GAP : 0) +
      BAR_GAP

    const available = container.clientWidth - reserved
    let used = 0
    let count = 0

    for (const chip of chips) {
      const el = chipMeasureRefs.current.get(chip.id)
      if (!el) break
      const width = el.offsetWidth + (count > 0 ? BAR_GAP : 0)
      if (used + width > available && count > 0) break
      used += width
      count += 1
    }

    setVisibleCount(Math.max(1, count))
  }, [chips, onSaveAsNew])

  React.useLayoutEffect(() => {
    recalculate()
  }, [recalculate])

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => recalculate())
    observer.observe(container)
    return () => observer.disconnect()
  }, [recalculate])

  const isEmpty = chips.length === 0
  const isOverflowing = !showFull && visibleCount < chips.length
  const visibleChips = showFull ? chips : chips.slice(0, visibleCount)
  const hiddenCount = chips.length - visibleChips.length

  return (
    <div
      ref={containerRef}
      role="toolbar"
      aria-label="Active filters"
      className={cn(
        "relative flex w-full items-center",
        showFull && "flex-wrap items-start",
        "gap-[var(--c-filter-bar-gap)]",
        "bg-[var(--c-filter-bar-background)]",
        "px-[var(--c-filter-bar-padding-horizontal)] py-[var(--c-filter-bar-padding-vertical)]",
        className,
      )}
    >
      {/* Off-screen measurer — mirrors real content so we can read widths
          before deciding what to actually show. */}
      {!isEmpty && (
        <div
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-[-9999px] top-[-9999px] flex items-center gap-[var(--c-filter-bar-gap)]"
        >
          {chips.map((chip) => (
            <FilterChip
              key={chip.id}
              ref={(el) => {
                if (el) chipMeasureRefs.current.set(chip.id, el)
                else chipMeasureRefs.current.delete(chip.id)
              }}
              label={chip.label}
              value={chip.value}
              operatorIcon={chip.operatorIcon}
              disabled={chip.disabled}
              tabIndex={-1}
            />
          ))}
          <span ref={dividerMeasureRef} className="h-5 w-px shrink-0" />
          <Button ref={modifyMeasureRef} variant="tertiary" size="small" tabIndex={-1}>
            Modify filter
          </Button>
          <Button ref={showFullMeasureRef} variant="tertiary" size="small" tabIndex={-1}>
            Show full filter
          </Button>
          {onSaveAsNew && (
            <Button ref={saveAsNewMeasureRef} variant="tertiary" size="small" tabIndex={-1}>
              Save as new
            </Button>
          )}
        </div>
      )}

      {isEmpty ? (
        <>
          <span
            className={cn(
              "text-[length:var(--c-filter-chip-font-size)]",
              "leading-[var(--c-filter-chip-font-line-height)]",
              "text-[var(--c-filter-chip-content-default)]",
            )}
          >
            No filters applied
          </span>
          <FilterBarDivider />
          <Button variant="tertiary" size="small" onClick={onAddFilter}>
            Add filter
          </Button>
        </>
      ) : (
        <>
          <div
            className={cn(
              "flex shrink-0 items-center gap-[var(--c-filter-bar-gap)]",
              showFull && "flex-wrap",
            )}
          >
            {visibleChips.map((chip) => {
              if (!renderChipPanel) {
                return (
                  <FilterChip
                    key={chip.id}
                    label={chip.label}
                    value={chip.value}
                    operatorIcon={chip.operatorIcon}
                    disabled={chip.disabled}
                    open={chip.id === openChipId}
                    onClick={() => onChipClick?.(chip.id)}
                  />
                )
              }

              // Radix's Trigger click ALSO fires the child's own onClick (via
              // asChild), so if both that onClick and onOpenChange called
              // onChipClick, one user click would toggle openChipId twice and
              // immediately re-open a chip that was just closed. onOpenChange
              // alone already reports every open AND every close with the
              // correct next state, so it is the only wire here — the chip
              // itself carries no onClick in this branch.
              return (
                <Popover
                  key={chip.id}
                  open={chip.id === openChipId}
                  onOpenChange={() => onChipClick?.(chip.id)}
                >
                  <PopoverTrigger asChild>
                    <FilterChip
                      label={chip.label}
                      value={chip.value}
                      operatorIcon={chip.operatorIcon}
                      disabled={chip.disabled}
                      open={chip.id === openChipId}
                    />
                  </PopoverTrigger>
                  <PopoverContent align="start" sideOffset={4} className="p-0">
                    {renderChipPanel(chip.id)}
                  </PopoverContent>
                </Popover>
              )
            })}

            {isOverflowing && hiddenCount > 0 && (
              <span
                className={cn(
                  "inline-flex h-[var(--c-filterchip-height)] shrink-0 items-center justify-center",
                  "rounded-[var(--c-filter-chip-radius)] border border-[var(--c-filter-chip-border-default)]",
                  "bg-[var(--c-filter-chip-background-default)] px-[var(--c-filter-bar-overflow-padding)]",
                  "text-[length:var(--p-font-size-xsmall)] font-[var(--p-font-weight-semi-bold)]",
                  "text-[var(--c-filter-bar-content-accent)]",
                )}
              >
                +{hiddenCount}
              </span>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-[var(--c-filter-bar-gap)]">
            {chips.length > 1 && (isOverflowing || showFull) && (
              <Button variant="tertiary" size="small" onClick={() => setShowFull((v) => !v)}>
                {showFull ? "Show less filter" : "Show full filter"}
              </Button>
            )}
            {onSaveAsNew && (
              <Button variant="tertiary" size="small" onClick={onSaveAsNew}>
                Save as new
              </Button>
            )}
            <FilterBarDivider />
            <Button variant="tertiary" size="small" aria-haspopup="dialog" onClick={onModifyFilter}>
              Modify filter
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function FilterBarDivider() {
  return <span aria-hidden="true" className="h-5 w-px shrink-0 bg-[var(--c-filter-bar-divider)]" />
}

export { FilterBar }
export type { FilterBarProps, FilterBarChip }
