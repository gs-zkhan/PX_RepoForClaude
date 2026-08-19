import { DonutChart } from "@/components/ui/donut-chart"

// `size` sets the chart's pixel width/height (default 200). The legend below
// it wraps independently and is always rendered — Figma requires a legend
// on every donut instance.
export default function DonutChartSize() {
  return (
    <DonutChart
      size={120}
      segments={[
        { label: "Healthy", value: 70, status: "healthy" },
        { label: "At risk", value: 30, status: "atrisk" },
      ]}
    />
  )
}
