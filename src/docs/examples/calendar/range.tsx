import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

export default function CalendarRange() {
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  return <Calendar mode="range" selected={range} onSelect={setRange} />
}
