import {
  Area,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// LineChart — Figma "Line Chart" (Charts page, node 4980:249), Prism V1 -
// ShadCN. Built on Recharts (installed this session, user confirmed).
//
// Time-series trend chart, up to 6 series (Figma's own cap — beyond 6,
// lines become indistinguishable). Not for categorical comparisons with no
// temporal relationship — use BarChart instead.
//
// Grid: 4 horizontal lines, color/neutral/300 @ 80% opacity (mapped to
// --s-color-line-default, the closest verified semantic token — no
// dedicated chart-grid token exists). Lines: 2px stroke, round cap, 8px dot
// with a 5px white inner circle at each data point. Area variant: same
// series color at 25% fill opacity, no stroke on the fill path — Recharts'
// `Area` + `Line` layered together achieves this (Area has no stroke, Line
// draws the visible 2px edge on top).
//
// Series colors always assigned in order (chart/series/1, /2, /3...) — never
// skipped. Multi-series always needs a legend per Figma's own rule; this
// component does not render one itself (composition-level concern, left to
// the caller, consistent with SegmentedBar being the exception that always
// renders its own legend because Figma mandates it inline).
// -----------------------------------------------------------------------------

type LineChartSeriesNumber = 1 | 2 | 3 | 4 | 5 | 6

const SERIES_COLOR: Record<LineChartSeriesNumber, string> = {
  1: "var(--s-chart-series-1-regular)",
  2: "var(--s-chart-series-2-regular)",
  3: "var(--s-chart-series-3-regular)",
  4: "var(--s-chart-series-4-regular)",
  5: "var(--s-chart-series-5-regular)",
  6: "var(--s-chart-series-6-regular)",
}

type LineChartSeriesDef = {
  key: string
  label: string
  series: LineChartSeriesNumber
}

type LineChartProps = {
  data: Array<Record<string, string | number>>
  categoryKey: string
  series: LineChartSeriesDef[]
  /** Area fill under the line at 25% opacity. Default false (plain line). */
  area?: boolean
  height?: number
  className?: string
}

function LineChart({ data, categoryKey, series, area = false, height = 240, className }: LineChartProps) {
  if (series.length > 6 && import.meta.env.DEV) {
    console.warn(
      `LineChart: ${series.length} series passed — Figma's own spec caps lines at 6 for readability.`
    )
  }

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
          <CartesianGrid horizontal vertical={false} stroke="var(--s-color-line-default)" strokeOpacity={0.8} />
          <XAxis
            dataKey={categoryKey}
            tick={{ fontSize: 11, fill: "var(--s-color-text-subtlest)" }}
            axisLine={{ stroke: "var(--s-color-line-default)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--s-color-text-subtlest)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--s-color-surface-default)",
              border: "1px solid var(--s-color-line-default)",
              borderRadius: "var(--p-radius-100)",
              fontSize: 12,
            }}
          />
          {area
            ? series.map((s) => (
                <Area
                  key={`${s.key}-area`}
                  dataKey={s.key}
                  stroke="none"
                  fill={SERIES_COLOR[s.series]}
                  fillOpacity={0.25}
                  isAnimationActive={false}
                />
              ))
            : null}
          {series.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stroke={SERIES_COLOR[s.series]}
              strokeWidth={2}
              strokeLinecap="round"
              dot={{ r: 4, fill: SERIES_COLOR[s.series], stroke: "#FFFFFF", strokeWidth: 2.5 }}
              activeDot={{ r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export { LineChart }
export type { LineChartProps, LineChartSeriesDef, LineChartSeriesNumber }
