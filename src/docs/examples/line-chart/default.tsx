import { LineChart } from "@/components/ui/line-chart"

const DATA = [
  { month: "Jan", adoption: 32 },
  { month: "Feb", adoption: 41 },
  { month: "Mar", adoption: 38 },
  { month: "Apr", adoption: 55 },
  { month: "May", adoption: 62 },
]

export default function LineChartDefault() {
  return (
    <LineChart
      data={DATA}
      categoryKey="month"
      series={[{ key: "adoption", label: "Feature adoption", series: 1 }]}
    />
  )
}
