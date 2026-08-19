import { IconButton } from "@/components/ui/icon-button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Tooltip is the standard companion for an icon-only trigger, since an
// IconButton has no visible label of its own.
export default function TooltipIconTrigger() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton icon="info" label="About this metric" />
      </TooltipTrigger>
      <TooltipContent>Calculated over the trailing 30 days</TooltipContent>
    </Tooltip>
  )
}
