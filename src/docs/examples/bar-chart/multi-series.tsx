import { BarChart } from "@/components/ui/bar-chart"

// Max 3 series in a grouped bar for readability — passing more logs a
// dev-only console warning rather than hard-blocking the render.
const data = [
  { quarter: "Q1", newAccounts: 24, churnedAccounts: 6 },
  { quarter: "Q2", newAccounts: 31, churnedAccounts: 9 },
  { quarter: "Q3", newAccounts: 28, churnedAccounts: 4 },
]

export default function BarChartMultiSeries() {
  return (
    <BarChart
      data={data}
      categoryKey="quarter"
      series={[
        { key: "newAccounts", label: "New accounts", color: { series: 1 } },
        { key: "churnedAccounts", label: "Churned accounts", color: { series: 3 } },
      ]}
    />
  )
}
