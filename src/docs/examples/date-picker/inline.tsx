import { DatePicker } from "@/components/ui/date-picker"

// `inline` (the Figma boolean property) removes the trigger's border and
// background until hover, focus or error — for compact/inline contexts only.
export default function DatePickerInline() {
  return <DatePicker inline placeholder="Select a date" />
}
