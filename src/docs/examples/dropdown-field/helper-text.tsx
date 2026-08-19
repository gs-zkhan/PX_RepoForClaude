import { DropdownField } from "@/components/ui/dropdown-field"
import { SelectItem } from "@/components/ui/select"

// Helper text always shows once `state` is "error" or "success" — only the
// neutral "default" state needs `helperVisible` turned on explicitly.
export default function DropdownFieldHelperText() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <DropdownField label="Owner" state="error" helperText="Choose an owner." className="w-[240px]">
        <SelectItem value="one">Option one</SelectItem>
      </DropdownField>
      <DropdownField label="Owner" state="success" helperText="Looks good." value="one" className="w-[240px]">
        <SelectItem value="one">Option one</SelectItem>
      </DropdownField>
    </div>
  )
}
