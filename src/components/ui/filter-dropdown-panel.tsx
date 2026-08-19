import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SearchBar } from "@/components/ui/search-bar"
import { TextField } from "@/components/ui/text-field"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// FilterDropdownPanel — Figma "Filter Dropdown Panel" (node 4077:8037,
// "Filter Chip, Bar, Dropdown Panel 🟢" page, Prism V1 - ShadCN).
//
// Six content types (Figma variants), each rendering a distinct body slot
// above the shared 48px footer (Clear / Cancel / Apply):
//
//   search        SearchBar in body — freeform search input
//   value         TextField in body — single-value text filter
//   date          DatePicker in body — single-date filter (use DateFilter
//                 for range + presets)
//   number        Row of 6 operator chips (equal/not-equal/gt/gte/lt/lte)
//                 + numeric input
//   picklist      SearchBar + scrollable single-select option list
//   multi-picklist SearchBar + "Select all" + selected count + scrollable
//                  multi-select checkbox list
//
// Content-only — no outer shell (border/bg/radius/shadow). Meant to be
// rendered inside a <PopoverContent> which supplies the shell. Same
// composition pattern as PECDropdown.
//
// Footer: 48px tall, shadow/inverse (top hairline), Clear (tertiary) on
// the left, Cancel (secondary) + Apply (primary) on the right, gap/actions
// (16px) between them. Footer buttons are 28px (Button "medium").
//
// Operator icons at 16px only exist for `equal`; the other 5 (`not-equal`,
// `greater-than`, `greater-than-or-equal-to`, `less-than`,
// `less-than-or-equal-to`) are 24px source assets rendered at 16px via
// sourceSize — same pattern used elsewhere for missing intermediate icon
// sizes.
// -----------------------------------------------------------------------------

type FilterDropdownFooterProps = {
  onClear?: () => void
  onCancel?: () => void
  onApply?: () => void
}

// ---- Type=Number ------------------------------------------------------------

type NumberOperator = "equal" | "not-equal" | "greater-than" | "greater-than-or-equal-to" | "less-than" | "less-than-or-equal-to"

const NUMBER_OPERATORS: Array<{ value: NumberOperator; icon: PrismIconName; label: string }> = [
  { value: "equal", icon: "equal", label: "Equal to" },
  { value: "not-equal", icon: "not-equal", label: "Not equal to" },
  { value: "greater-than", icon: "greater-than", label: "Greater than" },
  { value: "greater-than-or-equal-to", icon: "greater-than-or-equal-to", label: "Greater than or equal to" },
  { value: "less-than", icon: "less-than", label: "Less than" },
  { value: "less-than-or-equal-to", icon: "less-than-or-equal-to", label: "Less than or equal to" },
]

// ---- Picklist option shape --------------------------------------------------

type PicklistOption = {
  value: string
  label: string
  disabled?: boolean
}

// ---- Discriminated content props --------------------------------------------

type FilterDropdownPanelProps =
  | ({
      type: "search"
      value: string
      onValueChange: (value: string) => void
      placeholder?: string
      className?: string
    } & FilterDropdownFooterProps)
  | ({
      type: "value"
      label: string
      value: string
      onValueChange: (value: string) => void
      placeholder?: string
      className?: string
    } & FilterDropdownFooterProps)
  | ({
      type: "date"
      value?: Date
      onValueChange: (date: Date | undefined) => void
      placeholder?: string
      className?: string
    } & FilterDropdownFooterProps)
  | ({
      type: "number"
      operator: NumberOperator
      onOperatorChange: (op: NumberOperator) => void
      value: string
      onValueChange: (value: string) => void
      className?: string
    } & FilterDropdownFooterProps)
  | ({
      type: "picklist"
      options: PicklistOption[]
      value?: string
      onValueChange: (value: string) => void
      searchValue: string
      onSearchChange: (value: string) => void
      className?: string
    } & FilterDropdownFooterProps)
  | ({
      type: "multi-picklist"
      options: PicklistOption[]
      selected: string[]
      onSelectedChange: (selected: string[]) => void
      searchValue: string
      onSearchChange: (value: string) => void
      totalCount?: number
      className?: string
    } & FilterDropdownFooterProps)

// ---- Component -------------------------------------------------------------

function FilterDropdownPanel(props: FilterDropdownPanelProps) {
  return (
    <div className={cn("flex flex-col", props.className)}>
      <PanelBody props={props} />
      <PanelFooter onClear={props.onClear} onCancel={props.onCancel} onApply={props.onApply} />
    </div>
  )
}

function PanelBody({ props }: { props: FilterDropdownPanelProps }) {
  const outerPadding = "px-[var(--c-filter-dropdown-padding-inner)] py-[var(--c-filter-dropdown-padding-outer)]"

  switch (props.type) {
    case "search":
      return (
        <div className={cn("flex flex-col", outerPadding)}>
          <SearchBar
            size="large"
            placeholder={props.placeholder ?? "Search"}
            value={props.value}
            onChange={(e) => props.onValueChange(e.target.value)}
          />
        </div>
      )

    case "value":
      return (
        <div className={cn("flex flex-col", outerPadding)}>
          <TextField
            label={props.label}
            size="large"
            placeholder={props.placeholder ?? "Enter value"}
            value={props.value}
            onChange={(e) => props.onValueChange(e.target.value)}
          />
        </div>
      )

    case "date":
      return (
        <div className={cn("flex flex-col", outerPadding)}>
          <DatePicker
            value={props.value}
            onChange={props.onValueChange}
            placeholder={props.placeholder ?? "Date range"}
          />
        </div>
      )

    case "number":
      return (
        <div className="flex flex-col">
          <div className={cn("flex items-center gap-[var(--p-space-050)]", outerPadding, "pb-0")}>
            {NUMBER_OPERATORS.map((op) => {
              const active = op.value === props.operator
              return (
                <button
                  key={op.value}
                  type="button"
                  onClick={() => props.onOperatorChange(op.value)}
                  aria-label={op.label}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex h-6 w-7 items-center justify-center rounded-[var(--p-radius-050)]",
                    "border transition-colors",
                    active
                      ? "border-[var(--s-color-action-primary-default)] bg-[var(--s-color-surface-selected)] text-[var(--s-color-action-primary-default)]"
                      : "border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)] text-[var(--s-icon-color-default)] hover:bg-[var(--s-color-surface-muted)]",
                  )}
                >
                  <PrismIcon name={op.icon} size={16} sourceSize={24} decorative />
                </button>
              )
            })}
          </div>
          <div className={outerPadding}>
            {/* Composed from the approved TextField rather than a raw
                <input>: the previous version hand-rolled a native input with
                --c-textfield-input-* classes that were never generated (a
                phantom-token bug — undefined CSS custom properties, same
                class of defect IconButton had). TextField/Input already own
                this exact visual recipe correctly. */}
            <TextField
              label="Value"
              labelVisible={false}
              type="number"
              size="large"
              value={props.value}
              onChange={(e) => props.onValueChange(e.target.value)}
            />
          </div>
        </div>
      )

    case "picklist":
      return (
        <div className="flex min-h-0 flex-col">
          <div className={outerPadding}>
            <SearchBar
              size="large"
              placeholder="Search"
              value={props.searchValue}
              onChange={(e) => props.onSearchChange(e.target.value)}
            />
          </div>
          <ul className="max-h-[280px] overflow-y-auto">
            {props.options.map((opt) => {
              const selected = props.value === opt.value
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => props.onValueChange(opt.value)}
                    aria-pressed={selected}
                    className={cn(
                      "flex w-full items-center gap-[var(--p-space-100)] px-[var(--p-space-200)] py-[var(--p-space-050)]",
                      "text-left text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
                      "text-[var(--s-color-text-default)]",
                      selected
                        ? "bg-[var(--s-color-surface-selected)]"
                        : "hover:bg-[var(--s-color-surface-muted)]",
                      opt.disabled && "cursor-not-allowed text-[var(--s-color-text-disabled)]",
                    )}
                  >
                    {opt.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )

    case "multi-picklist": {
      const totalCount = props.totalCount ?? props.options.length
      const allSelected = props.selected.length > 0 && props.selected.length === props.options.length
      const someSelected = props.selected.length > 0 && !allSelected
      return (
        <div className="flex min-h-0 flex-col">
          <div className={outerPadding}>
            <SearchBar
              size="large"
              placeholder="Search"
              value={props.searchValue}
              onChange={(e) => props.onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between px-[var(--p-space-200)] py-[var(--p-space-050)]">
            <label className="inline-flex cursor-pointer items-center gap-[var(--p-space-100)]">
              <Checkbox
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={(checked) => {
                  if (checked) props.onSelectedChange(props.options.map((o) => o.value))
                  else props.onSelectedChange([])
                }}
              />
              <span className="text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-default)]">
                Select all
              </span>
            </label>
            <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
              {props.selected.length}/{totalCount} Selected
            </span>
          </div>
          <ul className="max-h-[280px] overflow-y-auto">
            {props.options.map((opt) => {
              const checked = props.selected.includes(opt.value)
              return (
                <li key={opt.value}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-[var(--p-space-100)] px-[var(--p-space-200)] py-[var(--p-space-050)]",
                      checked
                        ? "bg-[var(--s-color-surface-selected)]"
                        : "hover:bg-[var(--s-color-surface-muted)]",
                      opt.disabled && "cursor-not-allowed opacity-60",
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={opt.disabled}
                      onCheckedChange={(value) => {
                        if (value) props.onSelectedChange([...props.selected, opt.value])
                        else props.onSelectedChange(props.selected.filter((v) => v !== opt.value))
                      }}
                    />
                    <span className="text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] text-[var(--s-color-text-default)]">
                      {opt.label}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )
    }
  }
}

function PanelFooter({ onClear, onCancel, onApply }: FilterDropdownFooterProps) {
  return (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center",
        "gap-[var(--c-filter-dropdown-gap-actions)]",
        "px-[var(--c-filter-dropdown-padding-outer)]",
        "shadow-[var(--e-shadow-inverse)]",
      )}
    >
      <Button variant="tertiary" size="medium" onClick={onClear}>
        Clear
      </Button>
      <div className="ml-auto flex flex-1 items-center justify-end gap-[var(--c-filter-dropdown-gap-actions)]">
        <Button variant="secondary" size="medium" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" size="medium" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// FilterDropdownPopover — the panel WITH its shell and anchoring.
//
// Why this exists: FilterDropdownPanel is deliberately content-only, so every
// caller had to wire its own Popover. Prompt-generated screens got the
// anchoring wrong — a reported symptom was the menu opening with a large gap
// below the trigger, reading as a detached element. Anchoring is not a
// per-screen decision, so it now lives here.
//
// sideOffset is 4px, matching every other floating surface in the repo
// (PopoverContent's own default, DateFilter, PECDropdown, DropdownMenu,
// Tooltip) and the datepicker panel spec's explicit "trigger.y +
// trigger.height + 4". align="start" keeps the panel's left edge on the
// trigger's, which is what the filter chips expect.
//
// Prefer this over hand-wiring Popover + FilterDropdownPanel.
// -----------------------------------------------------------------------------

type FilterDropdownPopoverProps = FilterDropdownPanelProps & {
  /** The chip or button that opens the panel. */
  trigger: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: "start" | "center" | "end"
}

function FilterDropdownPopover({
  trigger,
  open,
  onOpenChange,
  align = "start",
  ...panelProps
}: FilterDropdownPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      {/* p-0: the panel supplies its own internal padding, so the shell must
          not add another layer of it. */}
      <PopoverContent align={align} sideOffset={4} className="p-0">
        <FilterDropdownPanel {...panelProps} />
      </PopoverContent>
    </Popover>
  )
}

export { FilterDropdownPanel, FilterDropdownPopover }
export type {
  FilterDropdownPanelProps,
  FilterDropdownPopoverProps,
  NumberOperator,
  PicklistOption,
}
