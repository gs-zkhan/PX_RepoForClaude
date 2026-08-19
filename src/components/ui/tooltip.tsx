import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

// Token reference (all in prism-generated.css):
// Shape:  --c-tooltip-radius (6px)
// Bg:     --s-color-surface-inverse (#181F26)
// Text:   --s-color-text-inverse (#FFFFFF)
// Font:   --c-tooltip-font-size (12px), --c-tooltip-font-weight (400),
//         --c-tooltip-font-line-height (16px)
// Pad:    px-2 py-1 (8px / 4px — Tailwind fixed, no token)
// Shadow: NONE (confirmed from Figma audit)
// Arrow:  fill-[var(--s-color-surface-inverse)]

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden outline-none",
          "rounded-[var(--c-tooltip-radius)]",
          "bg-[var(--s-color-surface-inverse)]",
          "px-2 py-1",
          "text-[length:var(--c-tooltip-font-size)]",
          "font-[number:var(--c-tooltip-font-weight)]",
          "leading-[var(--c-tooltip-font-line-height)]",
          "text-[var(--s-color-text-inverse)]",
          // NO shadow — confirmed Figma audit
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-[var(--s-color-surface-inverse)]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }
