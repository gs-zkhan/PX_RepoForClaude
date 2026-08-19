import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// DonutChart — Figma "Donut Chart" (Charts page, node 4983:160), Prism V1 -
// ShadCN. Built on Recharts (installed this session, user confirmed).
//
// Part-to-whole composition, max 4 segments (Figma's own hard limit — group
// remainder into an "Other" segment using color/neutral/300, mapped to
// --s-color-surface-sunken, the verified semantic equivalent). Not for time
// series — use LineChart.
//
// Inner radius is 55% of outer (verified), rotation starts at 270°/top,
// segments render clockwise — Recharts convention: startAngle=90 (top),
// sweeping to endAngle=-270 covers a full clockwise revolution from the top.
// 2px white stroke between segments (verified).
//
// Two color modes: "status" (fixed healthy -> warning -> atrisk order,
// largest to smallest, never reversed) or "series" (chart/series/1-4 in
// largest-to-smallest order). A legend is required per Figma's own rule —
// this component always renders one (same precedent as SegmentedBar).
// -----------------------------------------------------------------------------

type DonutChartStatus = "healthy" | "warning" | "atrisk"
type DonutChartSeriesNumber = 1 | 2 | 3 | 4

const STATUS_COLOR: Record<DonutChartStatus, string> = {
  healthy: "var(--s-chart-status-healthy)",
  warning: "var(--s-chart-status-warning)",
  atrisk: "var(--s-chart-status-atrisk)",
}

const SERIES_COLOR: Record<DonutChartSeriesNumber, string> = {
  1: "var(--s-chart-series-1-regular)",
  2: "var(--s-chart-series-2-regular)",
  3: "var(--s-chart-series-3-regular)",
  4: "var(--s-chart-series-4-regular)",
}

type DonutChartSegment =
  | { label: string; value: number; status: DonutChartStatus }
  | { label: string; value: number; series: DonutChartSeriesNumber }

function segmentColor(segment: DonutChartSegment) {
  return "status" in segment ? STATUS_COLOR[segment.status] : SERIES_COLOR[segment.series]
}

type DonutChartProps = {
  segments: DonutChartSegment[]
  centerLabel?: string
  centerSubLabel?: string
  size?: number
  className?: string
}

function DonutChart({ segments, centerLabel, centerSubLabel, size = 200, className }: DonutChartProps) {
  if (segments.length > 4 && import.meta.env.DEV) {
    console.warn(
      `DonutChart: ${segments.length} segments passed — Figma's own spec caps donut segments at 4; group the remainder into "Other".`
    )
  }

  return (
    <div className={cn("inline-flex flex-col items-center gap-[var(--p-space-200)]", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              stroke="#FFFFFF"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {segments.map((segment) => (
                <Cell key={segment.label} fill={segmentColor(segment)} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {centerLabel ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-[var(--s-color-text-default)]">{centerLabel}</span>
            {centerSubLabel ? (
              <span className="text-[length:var(--t-font-label-small-size)] text-[var(--s-color-text-subtlest)]">
                {centerSubLabel}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-[var(--p-space-200)]">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-[var(--p-space-050)]">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: segmentColor(segment) }} />
            <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { DonutChart }
export type { DonutChartProps, DonutChartSegment, DonutChartStatus, DonutChartSeriesNumber }
