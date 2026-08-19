import { FilterBar } from "@/components/ui/filter-bar"

export default function FilterBarOneLine() {
  return (
    <FilterBar
      chips={[
        { id: "status", label: "Status", value: "Active" },
        { id: "plan", label: "Plan", value: "Enterprise" },
      ]}
      onModifyFilter={() => {}}
    />
  )
}
