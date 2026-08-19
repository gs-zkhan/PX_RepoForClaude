import * as React from "react"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// SummaryStat — Prism DS anatomy (verified against prism-ds/src/components/
// SummaryStat). KPI/stat card with two layouts:
//
// - Compact (default): value + label, height 88px, used for dashboard stat
//   grids. Placement (center/left/right) controls text alignment; left/right
//   also enable a border so cards read as separated tiles.
// - Metric: triggered by passing `trend` or `description`. Layout switches to
//   label + larger value + trend row + description, height auto, no card
//   border. Used for KPI strips on list pages.
//
// Type controls interactivity: non-clickable (default) is a div; clickable
// and set-now render as buttons. Only clickable supports a `selected` state
// (selection ring + surface-selected fill). Set-now is meant for the
// "Set now" CTA card pattern.
//
// No dedicated component tokens exist — composes semantic tokens
// (--s-color-surface-*, --s-color-line-*, --s-color-text-*, --s-color-
// status-*). The 26/40 stat font size is verified from the Prism reference,
// which itself sources it from the Figma spec; not covered by a Prism token
// (documented raw constant, matches pattern used in Charts).
// -----------------------------------------------------------------------------

type SummaryStatType = "non-clickable" | "clickable" | "set-now"
type SummaryStatPlacement = "center" | "left" | "right"
type SummaryStatTrendDirection = "up" | "down"

type SummaryStatTrend = {
  direction: SummaryStatTrendDirection
  delta: string
  comparator?: string
}

type SummaryStatProps = {
  value: React.ReactNode
  label: string
  type?: SummaryStatType
  placement?: SummaryStatPlacement
  selected?: boolean
  onClick?: () => void
  trend?: SummaryStatTrend
  description?: string
  className?: string
}

const PLACEMENT_CLASS: Record<SummaryStatPlacement, string> = {
  center: "items-center text-center",
  left: "items-start text-left border-[var(--s-color-line-default)]",
  right: "items-end text-right border-[var(--s-color-line-default)]",
}

function TrendArrow({ direction }: { direction: SummaryStatTrendDirection }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d={direction === "up" ? "M8 12V4M8 4l-3 3M8 4l3 3" : "M8 4v8M8 12l-3-3M8 12l3-3"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SummaryStat({
  value,
  label,
  type = "non-clickable",
  placement = "center",
  selected = false,
  onClick,
  trend,
  description,
  className,
}: SummaryStatProps) {
  const isMetric = Boolean(trend || description)
  const isInteractive = type === "clickable" || type === "set-now"

  const baseClass = cn(
    "flex min-w-0 flex-1 flex-col justify-center rounded-[var(--p-radius-150)]",
    "border border-transparent bg-[var(--s-color-surface-default)]",
    "transition-colors",
    isMetric ? "h-auto items-start text-left px-[var(--p-space-300)] py-[var(--p-space-200)] gap-[var(--p-space-050)]"
             : "h-[88px] p-[var(--p-space-200)] gap-[var(--p-space-050)]",
    !isMetric && PLACEMENT_CLASS[placement],
    type === "non-clickable" && !isMetric && "hover:bg-[var(--s-color-surface-muted)]",
    isInteractive && "cursor-pointer",
    isInteractive && !selected && "hover:bg-[var(--s-color-surface-muted)]",
    type === "clickable" && selected && "bg-[var(--s-color-surface-selected)] border-[var(--s-color-action-primary-default)]",
    className,
  )

  const content = isMetric ? (
    <>
      <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] font-bold uppercase tracking-wide text-[var(--s-color-text-subtle)]">
        {label}
      </span>
      <span className="text-[length:var(--t-font-heading-large-size)] leading-[var(--t-font-heading-large-line-height)] font-[number:var(--t-font-heading-large-weight)] text-[var(--s-color-text-default)]">
        {value}
      </span>
      {trend ? (
        <span
          className={cn(
            "inline-flex items-center gap-[var(--p-space-025)] text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)]",
            trend.direction === "up"
              ? "text-[var(--s-color-status-success-default)]"
              : "text-[var(--s-color-status-danger-default)]",
          )}
        >
          <TrendArrow direction={trend.direction} />
          <span>{trend.delta}</span>
          {trend.comparator ? (
            <span className="ml-[var(--p-space-050)] text-[var(--s-color-text-subtle)]">
              {trend.comparator}
            </span>
          ) : null}
        </span>
      ) : null}
      {description ? (
        <span className="text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
          {description}
        </span>
      ) : null}
    </>
  ) : (
    <>
      <span
        className="truncate max-w-full font-[number:var(--t-font-heading-large-weight)] text-[var(--s-color-text-default)]"
        style={{ fontSize: 26, lineHeight: "40px" }}
      >
        {value}
      </span>
      <span className="truncate max-w-full text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
        {label}
      </span>
    </>
  )

  if (isInteractive) {
    return (
      <button
        type="button"
        className={baseClass}
        onClick={onClick}
        aria-pressed={type === "clickable" ? selected : undefined}
      >
        {content}
      </button>
    )
  }

  return <div className={baseClass}>{content}</div>
}

type StatsRowProps = {
  children: React.ReactNode
  className?: string
}

function StatsRow({ children, className }: StatsRowProps) {
  return <div className={cn("flex gap-[var(--p-space-300)]", className)}>{children}</div>
}

export { SummaryStat, StatsRow }
export type {
  SummaryStatProps,
  SummaryStatType,
  SummaryStatPlacement,
  SummaryStatTrend,
  SummaryStatTrendDirection,
  StatsRowProps,
}
