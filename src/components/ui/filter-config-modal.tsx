import * as React from "react"

import { Modal, ModalFooter } from "@/components/ui/modal"
import { DropdownField } from "@/components/ui/dropdown-field"
import { SelectItem } from "@/components/ui/select"
import { TextField } from "@/components/ui/text-field"
import { IconButton } from "@/components/ui/icon-button"
import { Letter } from "@/components/ui/letter"
import { EmptyState } from "@/components/ui/empty-state"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// FilterConfigModal — "Configure Filters".
//
// Opened from the **filter-as-a-bar**'s "Modify filter" action (FilterBar
// already exposes `onModifyFilter` with aria-haspopup="dialog"). It does NOT
// replace the RHS PxFilterSlider — the two filter surfaces are separate and
// both stay.
//
// ⚠️ NO FIGMA NODE EXISTS for this modal in U3D8WMBVFl9LvAZyLHhm24. The design
// system owner authorised building it from a Gainsight CS Cockpit screenshot
// using the Large modal (2026-08-06). Consequences:
//   - Every COMPONENT here is approved and token-driven, so colours, heights,
//     radii and typography are all correct by construction.
//   - The only invented values are LAYOUT PROPORTIONS — the Field / Operator /
//     Value column widths below. Those are read off the screenshot and are NOT
//     Figma-verified. They are the first thing to correct if a node appears.
//
// Each criterion is labelled by a <Letter> so it can be referenced in the
// advanced-logic expression, e.g. "(A and B) or (C and D)" — that is what the
// Letter component is for.
// -----------------------------------------------------------------------------

/** Screenshot-derived, NOT Figma-verified. See the header note. */
const COLUMN_WIDTH = {
  field: "w-[200px]",
  operator: "w-[140px]",
  // Value takes the remaining width — it is by far the widest column in the
  // reference screenshot.
  value: "flex-1",
} as const

type FilterCriterion = {
  id: string
  field: string
  operator: string
  value: string
}

type FilterOption = { value: string; label: string }

type FilterConfigModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Header text. The same modal serves both entry points: "Add filter" from
   * the bar's empty state and "Modify filter" from its populated state.
   */
  title?: string
  criteria: FilterCriterion[]
  onCriteriaChange: (criteria: FilterCriterion[]) => void
  /** Boolean expression over the row letters, e.g. "(A and B) or C". */
  advancedLogic: string
  onAdvancedLogicChange: (value: string) => void
  fieldOptions: FilterOption[]
  operatorOptions: FilterOption[]
  /**
   * Options for the Value column. Currently one shared list. Per-field value
   * editors (date / number / picklist / multi-picklist) are already modelled by
   * FilterDropdownPanel's six content types — wire those in here when the
   * product needs them rather than duplicating the logic.
   */
  valueOptions: FilterOption[]
  onSave: () => void
}

/** A -> Z by position. Beyond 26 rows it wraps to AA, AB… */
function letterFor(index: number) {
  let label = ""
  let n = index
  do {
    label = String.fromCharCode(65 + (n % 26)) + label
    n = Math.floor(n / 26) - 1
  } while (n >= 0)
  return label
}

function FilterConfigModal({
  open,
  onOpenChange,
  title = "Modify filter",
  criteria,
  onCriteriaChange,
  advancedLogic,
  onAdvancedLogicChange,
  fieldOptions,
  operatorOptions,
  valueOptions,
  onSave,
}: FilterConfigModalProps) {
  const updateCriterion = (id: string, patch: Partial<FilterCriterion>) => {
    onCriteriaChange(
      criteria.map((criterion) =>
        criterion.id === id ? { ...criterion, ...patch } : criterion,
      ),
    )
  }

  const addCriterion = () => {
    onCriteriaChange([
      ...criteria,
      {
        // Date.now() alone collides when two rows are added in the same tick.
        id: `criterion-${Date.now()}-${criteria.length}`,
        field: fieldOptions[0]?.value ?? "",
        operator: operatorOptions[0]?.value ?? "",
        value: valueOptions[0]?.value ?? "",
      },
    ])
  }

  const removeCriterion = (id: string) => {
    onCriteriaChange(criteria.filter((criterion) => criterion.id !== id))
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="large" title={title}>
      <div className="flex flex-col gap-[var(--p-space-300)] px-[var(--p-space-300)] py-[var(--p-space-300)]">
        {/* Every criterion can be deleted, including the last one. Saving with
            none clears the filter, which is a legitimate action — the bar then
            returns to its "Add filter" state. */}
        {criteria.length === 0 ? (
          <EmptyState
            size="small"
            illustration={
              <PrismIcon
                name="filter"
                size={32}
                sourceSize={24}
                decorative
                className="text-[var(--s-icon-color-subtle)]"
              />
            }
            title="No filters applied"
            description="Add a filter to narrow down the records shown in this list."
            primaryAction={{ label: "Add filter", onClick: addCriterion }}
          />
        ) : (
          <>
            {/* Column headers — shown once, so each row's fields hide their own
                labels rather than repeating them per row. */}
            <div className="flex items-center gap-[var(--p-space-200)]">
              {/* Spacer matching the Letter tile so headers align to their columns. */}
              <span aria-hidden="true" className="w-8 shrink-0" />
              <ColumnHeader className={COLUMN_WIDTH.field}>Field</ColumnHeader>
              <ColumnHeader className={COLUMN_WIDTH.operator}>Operator</ColumnHeader>
              <ColumnHeader className={COLUMN_WIDTH.value}>Value</ColumnHeader>
              {/* Spacer for the two row actions. */}
              <span aria-hidden="true" className="w-[64px] shrink-0" />
            </div>

            {criteria.map((criterion, index) => (
          <div key={criterion.id} className="flex items-center gap-[var(--p-space-200)]">
            <Letter letter={letterFor(index)} />

            <div className={COLUMN_WIDTH.field}>
              <DropdownField
                label="Field"
                labelVisible={false}
                value={criterion.field}
                onValueChange={(field) => updateCriterion(criterion.id, { field })}
              >
                {fieldOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </DropdownField>
            </div>

            <div className={COLUMN_WIDTH.operator}>
              <DropdownField
                label="Operator"
                labelVisible={false}
                value={criterion.operator}
                onValueChange={(operator) => updateCriterion(criterion.id, { operator })}
              >
                {operatorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </DropdownField>
            </div>

            <div className={COLUMN_WIDTH.value}>
              <DropdownField
                label="Value"
                labelVisible={false}
                value={criterion.value}
                onValueChange={(value) => updateCriterion(criterion.id, { value })}
              >
                {valueOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </DropdownField>
            </div>

            <div className="flex w-[64px] shrink-0 items-center gap-[var(--p-space-100)]">
              <IconButton icon="add" label="Add filter criterion" onClick={addCriterion} />
              <IconButton
                icon="delete"
                label={`Remove criterion ${letterFor(index)}`}
                onClick={() => removeCriterion(criterion.id)}
              />
            </div>
          </div>
            ))}

            <TextField
              label="Advanced logic"
              labelVisible={false}
              value={advancedLogic}
              onChange={(event) => onAdvancedLogicChange(event.target.value)}
              helperText="Advanced logic. Group filters for advanced use cases. Example: (A and B) or (C and D)"
              helperVisible
            />
          </>
        )}
      </div>

      <ModalFooter
        size="large"
        secondaryAction={{ label: "Cancel", onClick: () => onOpenChange(false) }}
        primaryAction={{ label: "Save", onClick: onSave }}
      />
    </Modal>
  )
}

function ColumnHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`${className} text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-label-small-weight)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]`}
    >
      {children}
    </span>
  )
}

export { FilterConfigModal }
export type { FilterConfigModalProps, FilterCriterion, FilterOption }
