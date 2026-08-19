import { FilterChip } from "@/components/ui/filter-chip"

// Omitting `value` renders the narrower, dashed-border variant used before a
// criterion has been configured — no operator icon or value label yet.
export default function FilterChipNoValue() {
  return <FilterChip label="Owner" />
}
