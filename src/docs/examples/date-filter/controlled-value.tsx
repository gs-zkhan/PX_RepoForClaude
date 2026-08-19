import * as React from "react"

import { DateFilter, type DateFilterValue } from "@/components/ui/date-filter"

// The trigger label always mirrors whichever mode produced `value` — here a
// resolved preset — rather than a caller-formatted string.
export default function DateFilterControlledValue() {
  const [value, setValue] = React.useState<DateFilterValue | null>({
    mode: "presets",
    preset: "last-30",
    label: "Last 30 days",
    range: { from: new Date(2026, 6, 8), to: new Date(2026, 7, 7) },
  })

  return <DateFilter value={value} onChange={setValue} />
}
