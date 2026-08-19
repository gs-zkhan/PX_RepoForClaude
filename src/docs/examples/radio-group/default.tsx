import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// No approved Label component exists in this repo yet, so the option text is
// a plain native <label> wired to each item via htmlFor/id — RadioGroupItem
// itself renders only the control, not its text.
export default function RadioGroupDefault() {
  return (
    <RadioGroup defaultValue="weekly">
      <div className="flex items-center gap-[var(--p-space-100)]">
        <RadioGroupItem value="daily" id="cadence-daily" />
        <label htmlFor="cadence-daily" className="text-sm text-[var(--s-color-text-default)]">
          Daily
        </label>
      </div>
      <div className="flex items-center gap-[var(--p-space-100)]">
        <RadioGroupItem value="weekly" id="cadence-weekly" />
        <label htmlFor="cadence-weekly" className="text-sm text-[var(--s-color-text-default)]">
          Weekly
        </label>
      </div>
      <div className="flex items-center gap-[var(--p-space-100)]">
        <RadioGroupItem value="monthly" id="cadence-monthly" />
        <label htmlFor="cadence-monthly" className="text-sm text-[var(--s-color-text-default)]">
          Monthly
        </label>
      </div>
    </RadioGroup>
  )
}
