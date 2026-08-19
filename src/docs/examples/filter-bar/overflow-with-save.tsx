import { FilterBar } from "@/components/ui/filter-bar"

// Overflow is measured against real chip widths via a hidden measurer row +
// ResizeObserver, not a hardcoded chip count — narrow the preview panel to
// see the "+N" badge and "Show full filter" appear. `onSaveAsNew` adds the
// "Save as new" action for the "Save as New View" variant.
export default function FilterBarOverflowWithSave() {
  return (
    <div className="max-w-[420px]">
      <FilterBar
        chips={[
          { id: "status", label: "Status", value: "Active" },
          { id: "plan", label: "Plan", value: "Enterprise" },
          { id: "region", label: "Region", value: "North America" },
          { id: "owner", label: "Owner", value: "Jamie Chen" },
          { id: "risk", label: "Risk score", value: "High" },
        ]}
        onModifyFilter={() => {}}
        onSaveAsNew={() => {}}
      />
    </div>
  )
}
