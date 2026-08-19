import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// `selected` applies the selected background independently of Radix's own
// highlight state — use it for a current-value indicator inside a menu that
// also acts as a picker.
export default function DropdownMenuSelected() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="medium">
          Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem selected>Active</DropdownMenuItem>
        <DropdownMenuItem>Inactive</DropdownMenuItem>
        <DropdownMenuItem>Draft</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
