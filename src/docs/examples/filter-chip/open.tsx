import { FilterChip } from "@/components/ui/filter-chip"

// `open` flips the trailing chevron and switches to the brand-bordered open
// treatment while this chip's Filter Dropdown Panel is showing.
export default function FilterChipOpen() {
  return <FilterChip label="Status" value="Active" open />
}
