import { DatePicker } from "@/components/ui/date-picker"

export default function DatePickerSizes() {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <DatePicker size="large" placeholder="Large (default)" />
      <DatePicker size="small" placeholder="Small" />
    </div>
  )
}
