import { MetricBar } from "@/components/ui/metric-bar"

// Status colors — for metrics with a healthy/warning/at-risk meaning, e.g.
// Product Score. Never mix status and series color on the same metric set.
export default function MetricBarStatus() {
  return (
    <div className="flex w-64 flex-col gap-[var(--p-space-200)]">
      <MetricBar value={82} color={{ status: "healthy" }} label="Account A score" />
      <MetricBar value={48} color={{ status: "warning" }} label="Account B score" />
      <MetricBar value={12} color={{ status: "atrisk" }} label="Account C score" />
    </div>
  )
}
