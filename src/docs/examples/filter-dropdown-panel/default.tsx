import * as React from "react"

import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"

// type="search" is the simplest content type: a SearchBar in the body above
// the shared Clear / Cancel / Apply footer. FilterDropdownPanel is
// content-only — render it inside a PopoverContent, or reach for
// FilterDropdownPopover which already wires that shell up.
export default function FilterDropdownPanelDefault() {
  const [value, setValue] = React.useState("")

  return (
    <div className="w-[280px] rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]">
      <FilterDropdownPanel type="search" value={value} onValueChange={setValue} />
    </div>
  )
}
