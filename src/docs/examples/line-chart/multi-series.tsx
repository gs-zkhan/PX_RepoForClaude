import { LineChart } from "@/components/ui/line-chart"

const DATA = [
  { month: "Jan", healthy: 120, atRisk: 30 },
  { month: "Feb", healthy: 128, atRisk: 34 },
  { month: "Mar", healthy: 119, atRisk: 41 },
  { month: "Apr", healthy: 135, atRisk: 28 },
]

// Series colours are always assigned in order (chart/series/1, /2, /3…) —
// never skipped. Multi-series charts need a legend per Figma's own rule; the
// component does not render one itself, so the caller composes it.
export default function LineChartMultiSeries() {
  return (
    <div className="flex flex-col gap-[var(--p-space-100)]">
      <div className="flex items-center gap-[var(--p-space-200)] text-sm text-[var(--s-color-text-subtle)]">
        <span className="flex items-center gap-[var(--p-space-050)]">
          <span className="size-2 rounded-full bg-[var(--s-chart-series-1-regular)]" />
          Healthy
        </span>
        <span className="flex items-center gap-[var(--p-space-050)]">
          <span className="size-2 rounded-full bg-[var(--s-chart-series-2-regular)]" />
          At risk
        </span>
      </div>
      <LineChart
        data={DATA}
        categoryKey="month"
        series={[
          { key: "healthy", label: "Healthy", series: 1 },
          { key: "atRisk", label: "At risk", series: 2 },
        ]}
      />
    </div>
  )
}
