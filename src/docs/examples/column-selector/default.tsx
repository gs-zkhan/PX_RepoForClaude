import * as React from "react"

import { ColumnSelector } from "@/components/ui/column-selector"

const columns = [
  { id: "name", label: "Account name" },
  { id: "health", label: "Health score" },
  { id: "mrr", label: "MRR" },
  { id: "renewal", label: "Renewal date", disabled: true },
]

// Content-only — meant to be rendered inside a PopoverContent, which
// supplies the outer border/radius/shadow. Shown bare here for the docs page.
export default function ColumnSelectorDefault() {
  const [selected, setSelected] = React.useState(["name", "health", "mrr"])

  return (
    <ColumnSelector
      columns={columns}
      selected={selected}
      onSelectedChange={setSelected}
      onReset={() => setSelected(["name", "health", "mrr"])}
    />
  )
}
