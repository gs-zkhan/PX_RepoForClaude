import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

function Popover(
  props: React.ComponentProps<typeof PopoverPrimitive.Root>
) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>
) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

// Positions the panel against an element other than the trigger. Needed when
// the control that opens the popover isn't the element it should align to —
// e.g. the Filter Bar, where any chip can open the panel but the panel stays
// anchored to the bar itself. Carries no visual recipe of its own.
function PopoverAnchor(
  props: React.ComponentProps<typeof PopoverPrimitive.Anchor>
) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverContent({
  className,
  align = "start",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden outline-none",
          "rounded-[var(--c-datepicker-panel-radius,12px)]",
          "border border-[var(--c-datepicker-panel-border)]",
          "bg-[var(--c-datepicker-panel-background)]",
          "shadow-[var(--e-shadow-300)]",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
}
