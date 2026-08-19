import { DropdownField } from "@/components/ui/dropdown-field"
import { SelectItem } from "@/components/ui/select"

export default function DropdownFieldDisabled() {
  return (
    <DropdownField label="Status" placeholder="Select an option" disabled className="w-[240px]">
      <SelectItem value="one">Option one</SelectItem>
    </DropdownField>
  )
}
