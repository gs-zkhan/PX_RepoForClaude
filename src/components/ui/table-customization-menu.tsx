import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnSelector, type ColumnSelectorColumn } from "@/components/ui/column-selector"
import type { TableDensity } from "@/components/ui/table"

// -----------------------------------------------------------------------------
// TableCustomizationMenu — reusable table-toolbar subcomponent.
//
// Figma source: Shell/Table Customisation (node 3187:9, "Prism V1 - ShadCN"),
// specifically the "Row Density - Menu" frame (node 3761:18844): the table
// toolbar's More (⋮) action opens one menu containing "Arrange Columns",
// a divider, and a "Row Density:" radio group (Compact / Default /
// Comfortable, current density shown selected). Selecting "Arrange Columns"
// swaps the same menu's content for the Column Selector panel (node
// 3761:18932/18942/18952) — a single disclosure, not two stacked overlays.
//
// This composes only approved components:
//   - IconButton (trigger)
//   - DropdownMenu (the More menu itself — content swaps in place between
//     the density/arrange menu and the ColumnSelector panel, so this stays
//     one Radix overlay instance rather than closing one and racing to open
//     a second)
//   - ColumnSelector (Select/Order/search/count/Reset/Cancel/Save — reused
//     as-is, not reimplemented)
//
// Feature-owned responsibilities deliberately kept OUT of this component:
//   - actual column definitions/labels
//   - sort logic
//   - persistence of density/column state across sessions
//   - data loading
//   - bulk actions
// The consuming screen supplies column + density state and callbacks; this
// component only renders the disclosure UI and forwards user intent.
// -----------------------------------------------------------------------------

type TableCustomizationMenuProps = {
  /** All available columns, in default order. */
  columns: ColumnSelectorColumn[]
  /** Currently committed selected column ids. */
  selectedColumns: string[]
  onSelectedColumnsChange: (selected: string[]) => void
  /** Currently committed column order. */
  columnOrder?: string[]
  onColumnOrderChange?: (order: string[]) => void
  onResetColumns?: () => void
  /** Currently active row density — drives the shared `Table` `density` prop. */
  density: TableDensity
  onDensityChange: (density: TableDensity) => void
  /** aria-label for the trigger icon button. Defaults to "More options". */
  triggerLabel?: string
}

const DENSITY_OPTIONS: { value: TableDensity; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
]

function TableCustomizationMenu({
  columns,
  selectedColumns,
  onSelectedColumnsChange,
  columnOrder,
  onColumnOrderChange,
  onResetColumns,
  density,
  onDensityChange,
  triggerLabel = "More options",
}: TableCustomizationMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [view, setView] = React.useState<"menu" | "columns">("menu")

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setView("menu")
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <IconButton icon="more-vertical" label={triggerLabel} />
      </DropdownMenuTrigger>

      {view === "menu" ? (
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setView("columns")
            }}
          >
            Arrange Columns
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Row Density:</DropdownMenuLabel>
          {DENSITY_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              selected={density === option.value}
              onSelect={() => onDensityChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent
          align="end"
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          <ColumnSelector
            columns={columns}
            selected={selectedColumns}
            order={columnOrder}
            onSelectedChange={onSelectedColumnsChange}
            onReorder={onColumnOrderChange}
            onReset={onResetColumns}
            onCancel={() => setOpen(false)}
            onSave={() => setOpen(false)}
          />
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}

export { TableCustomizationMenu }
export type { TableCustomizationMenuProps }
