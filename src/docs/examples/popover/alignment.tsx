import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

// `align` (default "start") and `sideOffset` (default 4) are passed straight
// through to Radix's Popover.Content — set them per placement, same as any
// other Radix positioning prop.
export default function PopoverAlignment() {
  return (
    <div className="flex gap-[var(--p-space-300)]">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="small">Align start</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-[var(--p-space-200)]">
          <p className="text-sm">Aligned to the trigger's start edge.</p>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="secondary" size="small">Align end</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="p-[var(--p-space-200)]">
          <p className="text-sm">Aligned to the trigger's end edge.</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
