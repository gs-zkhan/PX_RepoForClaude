import { StatsRow, SummaryStat } from "@/components/ui/summary-stat"

// StatsRow lays multiple compact stats out in a strip. left/right placement
// enables a border so each card reads as separated within the row.
export default function SummaryStatStatsRow() {
  return (
    <StatsRow>
      <SummaryStat value="1,204" label="Active accounts" placement="left" />
      <SummaryStat value="86%" label="Adoption rate" placement="left" />
      <SummaryStat value="42" label="At risk" placement="left" />
    </StatsRow>
  )
}
