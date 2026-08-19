import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// `side` and `sideOffset` are Radix Content props, forwarded through.
export default function TooltipSides() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="secondary">{side}</Button>
          </TooltipTrigger>
          <TooltipContent side={side}>Positioned on the {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
