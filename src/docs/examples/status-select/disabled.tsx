import { StatusSelect } from "@/components/ui/status-select"
import type { StatusSelectOption } from "@/components/ui/status-select"

const options: StatusSelectOption[] = [
  { value: "failed", variant: "failed", label: "Failed" },
  { value: "completed", variant: "completed", label: "Completed" },
]

export default function StatusSelectDisabled() {
  return <StatusSelect value="failed" options={options} disabled />
}
