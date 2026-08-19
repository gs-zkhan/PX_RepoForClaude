import { LineChart } from "@/components/ui/line-chart"

const DATA = [
  { week: "W1", usage: 210 },
  { week: "W2", usage: 260 },
  { week: "W3", usage: 245 },
  { week: "W4", usage: 300 },
]

// `area` layers a 25%-opacity, stroke-less fill under the same series colour
// as the line — Recharts' Area (fill, no stroke) and Line (2px stroke) drawn
// together achieve this.
export default function LineChartArea() {
  return (
    <LineChart
      data={DATA}
      categoryKey="week"
      series={[{ key: "usage", label: "Usage", series: 3 }]}
      area
    />
  )
}
