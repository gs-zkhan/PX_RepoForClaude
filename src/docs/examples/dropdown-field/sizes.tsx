import { DropdownField } from "@/components/ui/dropdown-field"
import { SelectItem } from "@/components/ui/select"

export default function DropdownFieldSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <DropdownField label="Large (default)" size="large" placeholder="Select an option" className="w-[240px]">
        <SelectItem value="one">Option one</SelectItem>
      </DropdownField>
      <DropdownField label="Small" size="small" placeholder="Select an option" className="w-[240px]">
        <SelectItem value="one">Option one</SelectItem>
      </DropdownField>
    </div>
  )
}
