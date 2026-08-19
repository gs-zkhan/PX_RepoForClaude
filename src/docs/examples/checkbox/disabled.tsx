import { Checkbox } from "@/components/ui/checkbox"

export default function CheckboxDisabled() {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <Checkbox disabled />
      <Checkbox checked disabled />
    </div>
  )
}
