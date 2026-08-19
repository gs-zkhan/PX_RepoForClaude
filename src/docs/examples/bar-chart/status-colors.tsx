import { BarChart } from "@/components/ui/bar-chart"

// `statusKey` colors each bar independently from that row's own health
// value — distinct from `status`, which is one fixed color for every bar in
// the series.
const data = [
  { account: "Acme", score: 82, health: "healthy" },
  { account: "Globex", score: 54, health: "warning" },
  { account: "Initech", score: 21, health: "atrisk" },
  { account: "Umbrella", score: 90, health: "healthy" },
]

export default function BarChartStatusColors() {
  return (
    <BarChart
      data={data}
      categoryKey="account"
      series={[{ key: "score", label: "Health score", color: { statusKey: "health" } }]}
    />
  )
}
