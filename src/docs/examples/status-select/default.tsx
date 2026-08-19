import * as React from "react"

import { StatusSelect } from "@/components/ui/status-select"
import type { StatusSelectOption } from "@/components/ui/status-select"

const options: StatusSelectOption[] = [
  { value: "open", variant: "open", label: "Open" },
  { value: "in-progress", variant: "in-progress", label: "Work in progress" },
  { value: "completed", variant: "completed", label: "Completed" },
]

export default function StatusSelectDefault() {
  const [value, setValue] = React.useState("in-progress")

  return <StatusSelect value={value} options={options} onValueChange={setValue} />
}
