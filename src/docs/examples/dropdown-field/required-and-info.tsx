import { DropdownField } from "@/components/ui/dropdown-field"
import { SelectItem } from "@/components/ui/select"

export default function DropdownFieldRequiredAndInfo() {
  return (
    <DropdownField
      label="Segment"
      required
      infoIcon
      infoTooltip="The audience segment this rule applies to."
      placeholder="Select a segment"
      className="w-[240px]"
    >
      <SelectItem value="web">Web</SelectItem>
      <SelectItem value="mobile">Mobile</SelectItem>
    </DropdownField>
  )
}
