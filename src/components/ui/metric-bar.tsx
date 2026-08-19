import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// MetricBar — Figma "Metric Bar" (Charts page, node 4978:300), Prism V1 - ShadCN.
//
// Horizontal progress-style bar for quantified health/weighting metrics
// (Health KPI weightage sliders, Product Score distribution). Not for
// binary on/off states — use a Switch (Figma's own rule).
//
// Track: resizable width x 16px tall, radius/100 (8px), fill =
// --s-chart-metric-track. Fill bar: same height/radius, width = value%.
// Knob: 20px white circle, centered on the fill's trailing edge, overhangs
// the 16px track by 2px top/bottom (expressed as `calc(${value}% - 10px)`
// rather than a JS-measured pixel offset — equivalent per Figma's own
// formula, but reactive to container resize without a ResizeObserver).
//
// Color: chart series (1-5, chart/series/n) or status (healthy/warning/
// atrisk) — never a UI action/status token, per Figma's own "Token rule".
// Figma's own Dos/Don'ts require pairing with a visible numeric label —
// this component takes `label` only for the accessible name; the caller
// renders the visible value text alongside it.
// -----------------------------------------------------------------------------

type MetricBarSeries = 1 | 2 | 3 | 4 | 5
type MetricBarStatus = "healthy" | "warning" | "atrisk"

type MetricBarColor = { series: MetricBarSeries } | { status: MetricBarStatus }

const SERIES_FILL: Record<MetricBarSeries, string> = {
  1: "bg-[var(--s-chart-series-1-regular)]",
  2: "bg-[var(--s-chart-series-2-regular)]",
  3: "bg-[var(--s-chart-series-3-regular)]",
  4: "bg-[var(--s-chart-series-4-regular)]",
  5: "bg-[var(--s-chart-series-5-regular)]",
}

const STATUS_FILL: Record<MetricBarStatus, string> = {
  healthy: "bg-[var(--s-chart-status-healthy)]",
  warning: "bg-[var(--s-chart-status-warning)]",
  atrisk: "bg-[var(--s-chart-status-atrisk)]",
}

type MetricBarProps = {
  /** 0-100. Values outside this range are clamped. */
  value: number
  color: MetricBarColor
  /** Accessible label describing what's being measured, e.g. "Product Score". */
  label: string
  className?: string
}

function MetricBar({ value, color, label, className }: MetricBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  const fillClass = "series" in color ? SERIES_FILL[color.series] : STATUS_FILL[color.status]

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("relative h-5 w-full", className)}
    >
      <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 overflow-hidden rounded-[var(--p-radius-100)] bg-[var(--s-chart-metric-track)]">
        <div
          className={cn("h-full rounded-[var(--p-radius-100)] transition-[width]", fillClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div
        className="absolute top-0 size-5 rounded-full bg-white shadow-[var(--e-shadow-100)]"
        style={{ left: `calc(${clamped}% - 10px)` }}
      />
    </div>
  )
}

export { MetricBar }
export type { MetricBarProps, MetricBarSeries, MetricBarStatus, MetricBarColor }
