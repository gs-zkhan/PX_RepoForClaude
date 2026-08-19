import { MetricBar } from "@/components/ui/metric-bar"

// Chart series colors (1-5) — for weighting/distribution metrics with no
// inherent healthy/warning/at-risk meaning, e.g. Health KPI weightage sliders.
export default function MetricBarSeries() {
  return (
    <div className="flex w-64 flex-col gap-[var(--p-space-200)]">
      <MetricBar value={30} color={{ series: 1 }} label="Usage weight" />
      <MetricBar value={55} color={{ series: 2 }} label="Adoption weight" />
      <MetricBar value={80} color={{ series: 3 }} label="Engagement weight" />
    </div>
  )
}
