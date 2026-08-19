import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// ProgressBar — Figma "Progress Bar 🟢" (node 20:23, Prism V1 - ShadCN).
//
// Quantified horizontal loading indicator for deterministic tasks where the
// completion percentage is known (upload progress, onboarding completion,
// form step progress). Use Spinner instead when duration is indeterminate.
//
// Structure: Track — resizable width × 8px tall, radius/full (pill),
// color/neutral/200 fill. Fill bar — overlaid rect, width = track width ×
// (value/100), same height/radius, status-specific color. Always renders
// left-to-right.
//
// Width is resizable — size it to your layout column, this component does
// not fix a width itself. Height is always 8px — never change it.
//
// Per Figma's own rule, this component alone is not accessible — always
// pair it with a visible percentage label or step count (rendered by the
// caller, to the right or above the bar).
// -----------------------------------------------------------------------------

type ProgressBarStatus = "default" | "success" | "warning" | "danger"

const STATUS_FILL: Record<ProgressBarStatus, string> = {
  default: "bg-[var(--s-color-line-brand)]",
  success: "bg-[var(--s-color-status-success-default)]",
  warning: "bg-[var(--s-color-status-warning-default)]",
  danger: "bg-[var(--s-color-status-danger-default)]",
}

type ProgressBarProps = {
  /** 0–100. Values outside this range are clamped. */
  value: number
  status?: ProgressBarStatus
  /** Accessible label describing what's being measured, e.g. "Profile completion". */
  label: string
  className?: string
}

function ProgressBar({ value, status = "default", label, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "h-2 w-full overflow-hidden rounded-[var(--p-radius-full)]",
        "bg-[var(--s-color-surface-muted)]",
        className,
      )}
    >
      <div
        className={cn("h-full rounded-[var(--p-radius-full)] transition-[width]", STATUS_FILL[status])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export { ProgressBar }
export type { ProgressBarProps, ProgressBarStatus }
