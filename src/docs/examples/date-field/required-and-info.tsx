import { DateField } from "@/components/ui/date-field"

export default function DateFieldRequiredAndInfo() {
  return (
    <DateField
      label="Renewal date"
      required
      infoIcon
      infoTooltip="The date the contract renews automatically."
      placeholder="Select a date"
    />
  )
}
