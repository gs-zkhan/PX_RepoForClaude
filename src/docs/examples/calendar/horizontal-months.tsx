import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

// `monthsOrientation="horizontal"` places the two months side by side with a
// divider — the arrangement used by the Custom Range Start/End pair.
export default function CalendarHorizontalMonths() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      monthsOrientation="horizontal"
      selected={range}
      onSelect={setRange}
    />
  )
}
