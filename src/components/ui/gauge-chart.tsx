import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// GaugeChart — Figma "Gauge Chart" (Charts page, node 4983:185), Prism V1 -
// ShadCN. Built on Recharts (installed this session, user confirmed).
//
// Single-value score indicator, semicircular arc (NPS, CES, Rating, Boolean
// performance). Not for distributions — use DonutChart/SegmentedBar for
// those.
//
// Fixed geometry (Figma's own "don't change" rule): 180° track, 16px stroke
// width, round cap. Track color is always color/neutral/300 (mapped to
// --s-color-surface-sunken, the verified semantic equivalent — no dedicated
// chart-track token exists). Fill uses chart/status/* only — never
// chart/series/* on a gauge (Figma's own rule).
//
// Value-mapping formulas (NPS/CES/Rating/Boolean → fillPct, and fillPct →
// status) are range-specific and caller-owned — this component only renders
// a pre-computed `value` (0-1) and `status`, it does not know which range the
// caller is scoring against.
// -----------------------------------------------------------------------------

type GaugeChartStatus = "healthy" | "warning" | "atrisk"

const STATUS_COLOR: Record<GaugeChartStatus, string> = {
  healthy: "var(--s-chart-status-healthy)",
  warning: "var(--s-chart-status-warning)",
  atrisk: "var(--s-chart-status-atrisk)",
}

type GaugeChartProps = {
  /** 0-1, the fraction of the 180° arc to fill. Caller computes this from its own value-mapping formula (e.g. NPS: (score + 100) / 200). */
  value: number
  status: GaugeChartStatus
  /** Numeric score shown centered below the arc (Figma's own "always show the value" rule). */
  label: string
  size?: number
  className?: string
}

function GaugeChart({ value, status, label, size = 200, className }: GaugeChartProps) {
  const clamped = Math.min(1, Math.max(0, value))
  const trackData = [{ value: 1 }]
  const fillData = [{ value: clamped }, { value: 1 - clamped }]

  return (
    <div className={cn("inline-flex flex-col items-center", className)} style={{ width: size }}>
      <div className="relative" style={{ width: size, height: size * 0.65 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={trackData}
              dataKey="value"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="72%"
              outerRadius="100%"
              isAnimationActive={false}
              stroke="none"
            >
              <Cell fill="var(--s-color-surface-sunken)" />
            </Pie>
            <Pie
              data={fillData}
              dataKey="value"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="72%"
              outerRadius="100%"
              cornerRadius={99}
              isAnimationActive={false}
              stroke="none"
            >
              <Cell fill={STATUS_COLOR[status]} />
              <Cell fill="transparent" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <span className="text-xl font-bold text-[var(--s-color-text-default)]">{label}</span>
    </div>
  )
}

export { GaugeChart }
export type { GaugeChartProps, GaugeChartStatus }
