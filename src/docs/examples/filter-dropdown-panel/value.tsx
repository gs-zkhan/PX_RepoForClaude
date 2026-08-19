import * as React from "react"

import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"

export default function FilterDropdownPanelValue() {
  const [value, setValue] = React.useState("")

  return (
    <div className="w-[280px] rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]">
      <FilterDropdownPanel type="value" label="Account name" value={value} onValueChange={setValue} />
    </div>
  )
}
