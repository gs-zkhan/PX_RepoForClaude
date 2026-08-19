import * as React from "react"

import { FilterDropdownPanel } from "@/components/ui/filter-dropdown-panel"

const OPTIONS = [
  { value: "active", label: "Active" },
  { value: "at-risk", label: "At risk" },
  { value: "churned", label: "Churned" },
]

export default function FilterDropdownPanelPicklist() {
  const [value, setValue] = React.useState<string | undefined>(undefined)
  const [search, setSearch] = React.useState("")

  return (
    <div className="w-[280px] rounded-[var(--p-radius-100)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]">
      <FilterDropdownPanel
        type="picklist"
        options={OPTIONS}
        value={value}
        onValueChange={setValue}
        searchValue={search}
        onSearchChange={setSearch}
      />
    </div>
  )
}
