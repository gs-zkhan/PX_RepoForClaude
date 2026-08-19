import { DonutChart } from "@/components/ui/donut-chart"

// "series" mode uses the neutral chart/series/1-4 palette instead of the
// status colors — for part-to-whole breakdowns that aren't healthy/at-risk.
export default function DonutChartSeriesColors() {
  return (
    <DonutChart
      segments={[
        { label: "Enterprise", value: 40, series: 1 },
        { label: "Mid-market", value: 30, series: 2 },
        { label: "SMB", value: 20, series: 3 },
        { label: "Other", value: 10, series: 4 },
      ]}
    />
  )
}
