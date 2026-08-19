import * as React from "react"

import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"
import type { NumberOperator } from "@/components/ui/filter-dropdown-panel"

// type="number" renders a row of 6 operator chips above the numeric input.
// Only the "equal" operator has a dedicated 16px icon asset — the other five
// render their 24px source at 16px via sourceSize.
export default function FilterDropdownPanelNumber() {
  const [operator, setOperator] = React.useState<NumberOperator>("equal")
  const [value, setValue] = React.useState("")

  return (
    <div className="w-[280px] rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]">
      <FilterDropdownPanel
        type="number"
        operator={operator}
        onOperatorChange={setOperator}
        value={value}
        onValueChange={setValue}
      />
    </div>
  )
}
