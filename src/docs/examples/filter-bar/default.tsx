import { FilterBar } from "@/components/ui/filter-bar"

// chips=[] renders the "No filters applied" + Add filter invitation — the
// page decides when to show that state, e.g. right after the user clicks
// "Filter" in the Table Title Bar.
export default function FilterBarDefault() {
  return <FilterBar chips={[]} onAddFilter={() => {}} />
}
