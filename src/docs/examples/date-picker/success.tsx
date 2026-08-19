import { DatePicker } from "@/components/ui/date-picker"

// `success` is the only state boolean DatePicker owns directly — error state
// is driven by the standard `aria-invalid` prop instead.
export default function DatePickerSuccess() {
  return <DatePicker success value={new Date()} />
}
