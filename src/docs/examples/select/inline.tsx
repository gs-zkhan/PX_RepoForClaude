import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// inline removes the border/background until hover/type/open/error — the
// same boolean property Text Field and Date Picker expose in Figma.
export default function SelectInline() {
  return (
    <Select defaultValue="week">
      <SelectTrigger inline className="w-32">
        <SelectValue placeholder="Period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">This week</SelectItem>
        <SelectItem value="month">This month</SelectItem>
      </SelectContent>
    </Select>
  )
}
