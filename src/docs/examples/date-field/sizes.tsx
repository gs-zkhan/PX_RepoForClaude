import { DateField } from "@/components/ui/date-field"

export default function DateFieldSizes() {
  return (
    <div className="flex flex-col gap-[var(--p-space-300)]">
      <DateField label="Large (default)" size="large" placeholder="Select a date" />
      <DateField label="Small" size="small" placeholder="Select a date" />
    </div>
  )
}
