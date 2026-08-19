import * as React from "react"

import { StatsRow, SummaryStat } from "@/components/ui/summary-stat"

// type="clickable" renders a <button> and supports a `selected` state — use
// for filter-like stat tiles that toggle a related list below them.
export default function SummaryStatClickableSelected() {
  const [selected, setSelected] = React.useState("open")

  return (
    <StatsRow>
      <SummaryStat
        value="18"
        label="Open"
        type="clickable"
        selected={selected === "open"}
        onClick={() => setSelected("open")}
      />
      <SummaryStat
        value="42"
        label="Completed"
        type="clickable"
        selected={selected === "completed"}
        onClick={() => setSelected("completed")}
      />
    </StatsRow>
  )
}
