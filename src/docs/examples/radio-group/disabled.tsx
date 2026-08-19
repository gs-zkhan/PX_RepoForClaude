import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="weekly" disabled>
      <div className="flex items-center gap-[var(--p-space-100)]">
        <RadioGroupItem value="weekly" id="cadence-disabled-weekly" />
        <label htmlFor="cadence-disabled-weekly" className="text-sm text-[var(--s-color-text-subtle)]">
          Weekly
        </label>
      </div>
      <div className="flex items-center gap-[var(--p-space-100)]">
        <RadioGroupItem value="monthly" id="cadence-disabled-monthly" />
        <label htmlFor="cadence-disabled-monthly" className="text-sm text-[var(--s-color-text-subtle)]">
          Monthly
        </label>
      </div>
    </RadioGroup>
  )
}
