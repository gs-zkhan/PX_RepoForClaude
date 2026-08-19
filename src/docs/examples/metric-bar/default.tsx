import { MetricBar } from "@/components/ui/metric-bar"

export default function MetricBarDefault() {
  return (
    <div className="flex w-64 items-center gap-[var(--p-space-200)]">
      <MetricBar value={64} color={{ series: 1 }} label="Product Score" className="flex-1" />
      <span className="text-sm text-[var(--s-color-text-subtle)]">64%</span>
    </div>
  )
}
