import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export default function PopoverDefault() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="p-[var(--p-space-300)]">
        <p className="text-sm text-[var(--s-color-text-default)]">
          Popover content is entirely up to the caller — this shell only owns
          the panel surface, radius, border and shadow.
        </p>
      </PopoverContent>
    </Popover>
  )
}
