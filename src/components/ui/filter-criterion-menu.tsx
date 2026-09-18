import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// -----------------------------------------------------------------------------
// FilterCriterionMenu — the "Add criterion" affordance that lets a user pick
// which not-yet-added filter attribute to add to a Filter Bar.
//
// Figma source: Shell/Filter Panel page (20:36). "Add Filter" is a named,
// distinct entry point (alongside "Modify filter") into filter configuration
// per that page's own AI Instructions ("Filter as a Popup: a floating panel
// that opens from 'Add Filter' or 'Modify filter'... for complex filter
// configurations with many attributes or nested conditions"); its Dos/Don'ts
// frame documents the tertiary-button trigger convention this component's
// trigger matches ("This tertiary button is the primary affordance for
// adding new filters... positioned after the separator on the right of the
// chip row"). Which fields are actually offered is feature-owned content
// (this screen's own not-yet-added filter fields) — this component owns only
// the trigger + menu shell, never the option set.
//
// Extracted from src/pages/user-explorer.tsx, which previously hand-rolled
// an identical DropdownMenu/DropdownMenuTrigger/DropdownMenuContent
// composition directly at screen level (used exactly once) — a real,
// undeclared dependency on component-dropdown-menu (Implemented-unmapped).
// This component is the sanctioned internal composition (see decision-
// dropdown-menu-scoped-composition's 2026-09-18 amendment): options are
// passed as plain data, so the screen no longer needs any DropdownMenu-
// family import for this use-site at all.
// -----------------------------------------------------------------------------

type FilterCriterionOption = {
  key: string
  label: string
}

type FilterCriterionMenuProps = {
  /** The trigger Button's own label, e.g. "Add criterion". */
  triggerLabel: string
  /** Optional heading shown above the option list, e.g. "Filter by". */
  menuLabel?: string
  options: FilterCriterionOption[]
  onSelect: (key: string) => void
  /** Menu alignment against the trigger. Defaults to "start", matching the existing call site. */
  align?: "start" | "center" | "end"
}

function FilterCriterionMenu({
  triggerLabel,
  menuLabel,
  options,
  onSelect,
  align = "start",
}: FilterCriterionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="tertiary" size="small">
          {triggerLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {menuLabel && <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>}
        {options.map((option) => (
          <DropdownMenuItem key={option.key} onSelect={() => onSelect(option.key)}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { FilterCriterionMenu }
export type { FilterCriterionMenuProps, FilterCriterionOption }
