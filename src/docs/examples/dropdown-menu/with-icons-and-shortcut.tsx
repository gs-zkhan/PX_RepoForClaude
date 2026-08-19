import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// `icon` renders a leading 16px PrismIcon; `shortcut` renders a trailing
// keyboard-hint string. Both are optional and independent of each other.
export default function DropdownMenuWithIconsAndShortcut() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="medium">
          With icons
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem icon="edit" shortcut="⌘E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem icon="copy" shortcut="⌘D">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon="delete" destructive>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
