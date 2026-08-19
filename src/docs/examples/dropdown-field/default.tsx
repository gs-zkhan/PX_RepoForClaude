import { DropdownField } from "@/components/ui/dropdown-field"
import { SelectItem } from "@/components/ui/select"

export default function DropdownFieldDefault() {
  return (
    <DropdownField label="Status" placeholder="Select an option" className="w-[240px]">
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
      <SelectItem value="draft">Draft</SelectItem>
    </DropdownField>
  )
}
