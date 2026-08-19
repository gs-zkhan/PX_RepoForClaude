import * as React from "react"

import { Calendar } from "@/components/ui/calendar"

// Calendar is react-day-picker underneath. It's most often consumed via
// DatePicker or DateFilter, which supply the trigger and popover shell —
// this is the panel rendered standalone.
export default function CalendarDefault() {
  const [selected, setSelected] = React.useState<Date | undefined>(new Date())

  return <Calendar mode="single" selected={selected} onSelect={setSelected} />
}
