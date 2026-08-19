import { SummaryStat } from "@/components/ui/summary-stat"

// Passing `trend` or `description` switches SummaryStat into the Metric
// layout — label + larger value + trend row + description, no card border.
export default function SummaryStatMetricWithTrend() {
  return (
    <SummaryStat
      value="4.2k"
      label="Weekly active users"
      trend={{ direction: "up", delta: "+12%", comparator: "vs last week" }}
      description="Highest since product launch"
    />
  )
}
