import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { PrismIcon } from "@/components/ui/prism-icon"

// Popover is the shared shell behind several higher components — DateFilter,
// PECDropdown and FilterBar's per-chip panels all render their own content
// inside this same PopoverContent surface rather than a bespoke panel.
export default function PopoverAsShell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          Last 30 days
          <PrismIcon name="chevron-down" size={16} decorative />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-[var(--p-space-200)]">
        <p className="text-sm text-[var(--s-color-text-subtle)]">
          A real consumer (DateFilter) renders its own range picker here.
        </p>
      </PopoverContent>
    </Popover>
  )
}
