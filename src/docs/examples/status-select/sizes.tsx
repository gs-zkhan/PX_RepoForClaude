import * as React from "react"

import { StatusSelect } from "@/components/ui/status-select"
import type { StatusSelectOption } from "@/components/ui/status-select"

const options: StatusSelectOption[] = [
  { value: "active", variant: "active", label: "Active" },
  { value: "inactive", variant: "inactive", label: "Inactive" },
]

export default function StatusSelectSizes() {
  const [regular, setRegular] = React.useState("active")
  const [small, setSmall] = React.useState("active")

  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-300)]">
      <StatusSelect value={regular} options={options} onValueChange={setRegular} size="regular" />
      <StatusSelect value={small} options={options} onValueChange={setSmall} size="small" />
    </div>
  )
}
