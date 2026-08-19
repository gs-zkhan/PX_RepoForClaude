import { Input } from "@/components/ui/input"

// `success` mirrors aria-invalid for the error state. Error styling is driven
// entirely by the native aria-invalid attribute, not a boolean prop.
export default function InputStates() {
  return (
    <div className="flex flex-col gap-[var(--p-space-200)]">
      <Input placeholder="Default" />
      <Input success placeholder="Success" />
      <Input aria-invalid placeholder="Error" />
      <Input disabled placeholder="Disabled" />
    </div>
  )
}
