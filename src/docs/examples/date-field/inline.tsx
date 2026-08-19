import { DateField } from "@/components/ui/date-field"

// `inline` removes the trigger's border/background until hover, focus or
// error. Reserve it for compact/inline contexts — never in a standalone form.
export default function DateFieldInline() {
  return <DateField label="Due date" labelVisible={false} inline placeholder="Select a date" />
}
