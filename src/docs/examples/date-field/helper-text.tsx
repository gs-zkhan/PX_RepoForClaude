import { DateField } from "@/components/ui/date-field"

// Helper text always shows once `state` is "error" or "success", regardless
// of `helperVisible` — only the neutral "default" state needs it turned on
// explicitly.
export default function DateFieldHelperText() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <DateField label="Close date" state="error" helperText="A close date is required." />
      <DateField label="Close date" state="success" helperText="Looks good." value={new Date()} />
    </div>
  )
}
