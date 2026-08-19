import { LineChart } from "@/components/ui/line-chart"

const DATA = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 70 },
  { month: "Mar", score: 68 },
]

export default function LineChartHeight() {
  return (
    <LineChart
      data={DATA}
      categoryKey="month"
      series={[{ key: "score", label: "Score", series: 4 }]}
      height={160}
    />
  )
}
