import { GaugeChart } from "@/components/ui/gauge-chart"

// `status` selects the fill colour from chart/status/* — never chart/series/*
// on a gauge, per Figma's own rule (a gauge is a single-value score, not a
// series comparison).
export default function GaugeChartStatus() {
  return (
    <div className="flex flex-wrap items-center gap-[var(--p-space-300)]">
      <GaugeChart value={0.85} status="healthy" label="85" size={140} />
      <GaugeChart value={0.5} status="warning" label="50" size={140} />
      <GaugeChart value={0.18} status="atrisk" label="18" size={140} />
    </div>
  )
}
