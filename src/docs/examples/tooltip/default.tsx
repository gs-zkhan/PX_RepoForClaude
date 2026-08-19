import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// TooltipProvider is required and lives once at the app root (see App.tsx) —
// individual Tooltip instances do not each need their own provider.
export default function TooltipDefault() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="secondary">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Export the current view as a CSV file</TooltipContent>
    </Tooltip>
  )
}
