import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// BarChart — Figma "Bar Chart" (Charts page, node 4981:196), Prism V1 - ShadCN.
// Built on Recharts (installed this session, user confirmed) as the
// axis/scale/tick rendering foundation — styled entirely with Prism chart
// tokens so it doesn't look like a generic charting-library default.
//
// Categorical comparison chart. Vertical for time/ordered categories;
// Horizontal for ranked lists with long labels (never rotate vertical bars
// to fake horizontal — use this orientation prop instead, per Figma's own
// rule). Value axis always starts at 0 (Figma's own "Do" rule — Recharts
// domain is fixed to [0, 'auto'], never allowed to auto-truncate).
//
// Bar radius: 4px on the leading corners only — top corners for vertical,
// right corners for horizontal (verified). Max 3 series in a grouped bar
// per Figma's own rule — enforced as a runtime warning, not a hard block,
// since the caller may still need to render an out-of-spec chart during
// development.
//
// Color: single/grouped series use chart/series/1-5 tokens in order. The
// "Status-Health" Figma variant (verified: Vertical orientation only, node
// 4981:195) colors EACH BAR independently from that row's own health value —
// not one fixed color for the whole series. `{ statusKey: "..." }` reads a
// per-datum field for this; `{ status: "..." }` remains for a single fixed
// status color applied to every bar in the series (e.g. one uniform-danger
// series), which is a distinct, valid use the two must not be conflated.
// -----------------------------------------------------------------------------

type BarChartOrientation = "vertical" | "horizontal"
type BarChartSeriesNumber = 1 | 2 | 3 | 4 | 5
type BarChartStatus = "healthy" | "warning" | "atrisk"
type BarChartSeriesColor =
  | { series: BarChartSeriesNumber }
  | { status: BarChartStatus }
  | { statusKey: string }

const SERIES_COLOR: Record<BarChartSeriesNumber, string> = {
  1: "var(--s-chart-series-1-regular)",
  2: "var(--s-chart-series-2-regular)",
  3: "var(--s-chart-series-3-regular)",
  4: "var(--s-chart-series-4-regular)",
  5: "var(--s-chart-series-5-regular)",
}

const STATUS_COLOR: Record<BarChartStatus, string> = {
  healthy: "var(--s-chart-status-healthy)",
  warning: "var(--s-chart-status-warning)",
  atrisk: "var(--s-chart-status-atrisk)",
}

function resolveColor(color: BarChartSeriesColor, datum?: Record<string, string | number>) {
  if ("series" in color) return SERIES_COLOR[color.series]
  if ("status" in color) return STATUS_COLOR[color.status]
  const status = datum?.[color.statusKey] as BarChartStatus | undefined
  return status ? STATUS_COLOR[status] : STATUS_COLOR.healthy
}

type BarChartSeriesDef = {
  key: string
  label: string
  color: BarChartSeriesColor
}

type BarChartProps = {
  orientation?: BarChartOrientation
  data: Array<Record<string, string | number>>
  categoryKey: string
  series: BarChartSeriesDef[]
  height?: number
  className?: string
}

function BarChart({ orientation = "vertical", data, categoryKey, series, height = 240, className }: BarChartProps) {
  if (series.length > 3 && import.meta.env.DEV) {
    console.warn(
      `BarChart: ${series.length} series passed — Figma's own spec caps grouped bars at 3 for readability; consider a Line Chart instead.`
    )
  }

  const isHorizontal = orientation === "horizontal"
  const barRadius: [number, number, number, number] = isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 4, right: 8, bottom: 4, left: 8 }}
        >
          <CartesianGrid
            horizontal={!isHorizontal}
            vertical={isHorizontal}
            stroke="var(--s-color-line-default)"
          />
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                domain={[0, "auto"]}
                tick={{ fontSize: 11, fill: "var(--s-color-text-subtlest)" }}
                axisLine={{ stroke: "var(--s-color-line-default)" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={categoryKey}
                tick={{ fontSize: 11, fill: "var(--s-color-text-subtlest)" }}
                axisLine={{ stroke: "var(--s-color-line-default)" }}
                tickLine={false}
                width={96}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={categoryKey}
                tick={{ fontSize: 11, fill: "var(--s-color-text-subtlest)" }}
                axisLine={{ stroke: "var(--s-color-line-default)" }}
                tickLine={false}
              />
              <YAxis
                type="number"
                domain={[0, "auto"]}
                tick={{ fontSize: 11, fill: "var(--s-color-text-subtlest)" }}
                axisLine={false}
                tickLine={false}
              />
            </>
          )}
          <Tooltip
            cursor={{ fill: "var(--s-color-surface-muted)" }}
            contentStyle={{
              background: "var(--s-color-surface-default)",
              border: "1px solid var(--s-color-line-default)",
              borderRadius: "var(--p-radius-100)",
              fontSize: 12,
            }}
          />
          {series.map((s) => {
            const perBar = "statusKey" in s.color
            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                fill={perBar ? undefined : resolveColor(s.color)}
                radius={barRadius}
                maxBarSize={32}
              >
                {perBar
                  ? data.map((datum, index) => (
                      <Cell key={index} fill={resolveColor(s.color, datum)} />
                    ))
                  : null}
              </Bar>
            )
          })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export { BarChart }
export type { BarChartProps, BarChartOrientation, BarChartSeriesDef, BarChartSeriesColor, BarChartSeriesNumber, BarChartStatus }
