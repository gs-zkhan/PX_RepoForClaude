import { DonutChart } from "@/components/ui/donut-chart"

// "status" mode renders segments in the fixed healthy -> warning -> atrisk
// order, largest to smallest — never reversed.
export default function DonutChartDefault() {
  return (
    <DonutChart
      segments={[
        { label: "Healthy", value: 62, status: "healthy" },
        { label: "Warning", value: 25, status: "warning" },
        { label: "At risk", value: 13, status: "atrisk" },
      ]}
    />
  )
}
