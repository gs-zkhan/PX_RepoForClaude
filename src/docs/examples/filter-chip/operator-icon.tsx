import { FilterChip } from "@/components/ui/filter-chip"

// `operatorIcon` defaults to "equal" but accepts any of the number-filter
// operator icons for numeric or date criteria.
export default function FilterChipOperatorIcon() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      <FilterChip label="MRR" value="10,000" operatorIcon="greater-than" />
      <FilterChip label="Seats" value="50" operatorIcon="less-than-or-equal-to" />
    </div>
  )
}
