import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// SegmentedBar — Figma "Segmented Bar" (Charts page, node 4979:159),
// Prism V1 - ShadCN.
//
// Full-width bar divided into abutting colored segments showing a
// distribution (Product Score at-risk/neutral/healthy split, Weightage
// Distribution across up to 5 metrics). Never for progress/loading — use
// MetricBar for a single-value progress indicator.
//
// 24px tall fixed. Segments abut with zero gap; only the first segment's
// left corners and the last segment's right corners are rounded (radius/100,
// 8px) — middle segments have no radius. Status segments use the "-light"
// chart status tone; weighted/equal segments use the "-regular" chart series
// tone (consistent with MetricBar's series color convention).
//
// A dot-legend below the bar is required per Figma's own rule ("colour
// alone does not communicate which segment is which") — this component
// always renders one, not an optional caller-provided add-on.
// -----------------------------------------------------------------------------

type SegmentedBarSeries = 1 | 2 | 3 | 4 | 5
type SegmentedBarStatus = "atrisk" | "warning" | "healthy"

type SegmentedBarColor = { series: SegmentedBarSeries } | { status: SegmentedBarStatus }

const SERIES_FILL: Record<SegmentedBarSeries, string> = {
  1: "bg-[var(--s-chart-series-1-regular)]",
  2: "bg-[var(--s-chart-series-2-regular)]",
  3: "bg-[var(--s-chart-series-3-regular)]",
  4: "bg-[var(--s-chart-series-4-regular)]",
  5: "bg-[var(--s-chart-series-5-regular)]",
}

const STATUS_FILL: Record<SegmentedBarStatus, string> = {
  atrisk: "bg-[var(--s-chart-status-atrisk-light)]",
  warning: "bg-[var(--s-chart-status-warning-light)]",
  healthy: "bg-[var(--s-chart-status-healthy-light)]",
}

function colorClass(color: SegmentedBarColor) {
  return "series" in color ? SERIES_FILL[color.series] : STATUS_FILL[color.status]
}

type SegmentedBarSegment = {
  label: string
  value: number
  color: SegmentedBarColor
}

type SegmentedBarProps = {
  segments: SegmentedBarSegment[]
  className?: string
}

function SegmentedBar({ segments, className }: SegmentedBarProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex h-6 w-full overflow-hidden rounded-[var(--p-radius-100)]">
        {segments.map((segment) => (
          <div
            key={segment.label}
            role="img"
            aria-label={`${segment.label}: ${segment.value}`}
            className={cn("h-full", colorClass(segment.color))}
            style={{ width: total > 0 ? `${(segment.value / total) * 100}%` : 0 }}
          />
        ))}
      </div>
      <div className="mt-[var(--p-space-100)] flex flex-wrap items-center gap-[var(--p-space-200)]">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-[var(--p-space-050)]">
            <span className={cn("size-2 shrink-0 rounded-full", colorClass(segment.color))} />
            <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { SegmentedBar }
export type { SegmentedBarProps, SegmentedBarSegment, SegmentedBarColor, SegmentedBarSeries, SegmentedBarStatus }
