import { PrismIcon } from "@/components/ui/prism-icon"

// size controls rendered dimensions; the SVG is loaded from the matching
// on-disk folder (16/24/32/48/64) unless sourceSize overrides that lookup.
export default function PrismIconSizes() {
  return (
    <div className="flex items-center gap-[var(--p-space-300)]">
      <PrismIcon name="filter" size={16} />
      <PrismIcon name="filter" size={24} />
    </div>
  )
}
