import * as React from "react"

import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"

const OPTIONS = [
  { value: "active", label: "Active" },
  { value: "at-risk", label: "At risk" },
  { value: "churned", label: "Churned" },
]

// multi-picklist adds a "Select all" checkbox row and a "n/total Selected"
// count above the checkbox list.
export default function FilterDropdownPanelMultiPicklist() {
  const [selected, setSelected] = React.useState<string[]>(["active"])
  const [search, setSearch] = React.useState("")

  return (
    <div className="w-[280px] rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]">
      <FilterDropdownPanel
        type="multi-picklist"
        options={OPTIONS}
        selected={selected}
        onSelectedChange={setSelected}
        searchValue={search}
        onSearchChange={setSearch}
      />
    </div>
  )
}
