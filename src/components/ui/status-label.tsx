import * as React from "react"

import { cn } from "@/lib/utils"
import { useTableDensity } from "@/components/ui/table"
import { PrismIcon } from "@/components/ui/prism-icon"

type StatusLabelVariant =
  | "open"
  | "in-progress"
  | "waiting"
  | "active"
  | "completed"
  | "failed"
  | "inactive"

type StatusLabelSize = "small" | "regular"

type StatusLabelProps = React.HTMLAttributes<HTMLElement> & {
  variant: StatusLabelVariant
  size?: StatusLabelSize
  /** When true renders as a button with chevron-down; pair with DropdownMenu for status change. */
  editable?: boolean
}

const variantClasses: Record<StatusLabelVariant, string> = {
  open:
    "bg-[var(--c-statuslabel-color-bg-open)] text-[var(--c-statuslabel-color-text-open)]",
  "in-progress":
    "bg-[var(--c-statuslabel-color-bg-in-progress)] text-[var(--c-statuslabel-color-text-in-progress)]",
  waiting:
    "bg-[var(--c-statuslabel-color-bg-waiting)] text-[var(--c-statuslabel-color-text-waiting)]",
  active:
    "bg-[var(--c-statuslabel-color-bg-active)] text-[var(--c-statuslabel-color-text-active)]",
  completed:
    "bg-[var(--c-statuslabel-color-bg-completed)] text-[var(--c-statuslabel-color-text-completed)]",
  failed:
    "bg-[var(--c-statuslabel-color-bg-failed)] text-[var(--c-statuslabel-color-text-failed)]",
  inactive:
    "bg-[var(--c-statuslabel-color-bg-inactive)] text-[var(--c-statuslabel-color-text-inactive)]",
}

const sizeClasses: Record<StatusLabelSize, string> = {
  small:
    "h-[var(--c-statuslabel-height-small)] rounded-[var(--c-statuslabel-radius-small)] px-[var(--c-statuslabel-padding-horizontal-small)]",
  regular:
    "h-[var(--c-statuslabel-height-regular)] rounded-[var(--c-statuslabel-radius-regular)] px-[var(--c-statuslabel-padding-horizontal-regular)]",
}

function StatusLabel({
  variant,
  size,
  editable = false,
  className,
  children,
  ...props
}: StatusLabelProps) {
  const tableDensity = useTableDensity()
  const resolvedSize =
    size ?? (tableDensity === "compact" ? "small" : "regular")

  const sharedClasses = cn(
    "inline-flex shrink-0 items-center justify-center",
    "gap-[var(--c-statuslabel-gap)]",
    "text-[length:var(--c-statuslabel-font-size)]",
    "font-[var(--c-statuslabel-font-weight)]",
    "leading-[var(--c-statuslabel-font-line-height)]",
    variantClasses[variant],
    sizeClasses[resolvedSize],
    className
  )

  if (editable) {
    return (
      <button
        type="button"
        data-slot="status-label"
        data-variant={variant}
        data-size={resolvedSize}
        data-editable="true"
        aria-haspopup="listbox"
        className={cn(sharedClasses, "cursor-pointer")}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
        <PrismIcon name="chevron-down" size={16} />
      </button>
    )
  }

  return (
    <span
      data-slot="status-label"
      data-variant={variant}
      data-size={resolvedSize}
      className={sharedClasses}
      {...props}
    >
      {children}
    </span>
  )
}

export { StatusLabel }
export type { StatusLabelProps, StatusLabelSize, StatusLabelVariant }

