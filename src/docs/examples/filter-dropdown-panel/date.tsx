import * as React from "react"

import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"

// type="date" is for a single-date filter. For a range with presets, use
// DateFilter instead — this content type intentionally stays single-value.
export default function FilterDropdownPanelDate() {
  const [value, setValue] = React.useState<Date | undefined>(undefined)

  return (
    <div className="w-[280px] rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]">
      <FilterDropdownPanel type="date" value={value} onValueChange={setValue} />
    </div>
  )
}
