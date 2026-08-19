import { GaugeChart } from "@/components/ui/gauge-chart"

export default function GaugeChartSize() {
  return (
    <div className="flex flex-wrap items-end gap-[var(--p-space-300)]">
      <GaugeChart value={0.6} status="warning" label="60" size={100} />
      <GaugeChart value={0.6} status="warning" label="60" size={160} />
      <GaugeChart value={0.6} status="warning" label="60" size={220} />
    </div>
  )
}
