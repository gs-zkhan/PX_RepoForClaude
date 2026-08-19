import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// Most form usage should prefer DropdownField, which composes this Select
// with a label row, required/info-icon/helper-text slots. Reach for Select
// directly only when you need the bare trigger + panel with no label.
export default function SelectDefault() {
  return (
    <Select defaultValue="open">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="in-progress">In progress</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  )
}
