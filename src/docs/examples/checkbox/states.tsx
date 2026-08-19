import { Checkbox } from "@/components/ui/checkbox"

// `checked` accepts Radix's CheckedState: true, false, or "indeterminate".
// Indeterminate renders the same icon-swap treatment as checked, using a
// dash glyph instead of a tick.
export default function CheckboxStates() {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <Checkbox checked={false} />
      <Checkbox checked />
      <Checkbox checked="indeterminate" />
    </div>
  )
}
