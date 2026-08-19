import { BarChart } from "@/components/ui/bar-chart"

// Horizontal is for ranked lists with long labels — never rotate a vertical
// chart to fake this; use the orientation prop instead.
const data = [
  { feature: "In-app surveys", usage: 88 },
  { feature: "Guided onboarding", usage: 74 },
  { feature: "Resource center", usage: 61 },
  { feature: "Mobile SDK", usage: 33 },
]

export default function BarChartHorizontal() {
  return (
    <BarChart
      orientation="horizontal"
      data={data}
      categoryKey="feature"
      series={[{ key: "usage", label: "Usage %", color: { series: 2 } }]}
    />
  )
}
