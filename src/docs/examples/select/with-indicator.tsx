import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// showIndicator renders a tick next to the selected item inside the panel —
// off by default, since most PX dropdowns rely on the trigger's own value
// text rather than an in-list checkmark.
export default function SelectWithIndicator() {
  return (
    <Select defaultValue="usage">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="usage" showIndicator>Usage</SelectItem>
        <SelectItem value="name" showIndicator>Name</SelectItem>
        <SelectItem value="created" showIndicator>Date created</SelectItem>
      </SelectContent>
    </Select>
  )
}
