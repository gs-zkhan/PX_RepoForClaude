import { DonutChart } from "@/components/ui/donut-chart"

export default function DonutChartCenterLabel() {
  return (
    <DonutChart
      centerLabel="1,204"
      centerSubLabel="Accounts"
      segments={[
        { label: "Healthy", value: 900, status: "healthy" },
        { label: "Warning", value: 220, status: "warning" },
        { label: "At risk", value: 84, status: "atrisk" },
      ]}
    />
  )
}
