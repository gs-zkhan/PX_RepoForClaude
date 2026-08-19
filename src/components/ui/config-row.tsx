import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// ConfigRow — Prism DS anatomy (verified against prism-ds/src/components/
// ConfigRow). 48px labeled row for editor config panes:
//
//   [ icon puck ] [ title (subtitle) ]  [ trailing slot ] [ chevron ]
//
// Icon puck (28px, --s-color-surface-muted background) and chevron are
// owned by the component. `trailing` is a freeform slot — drop in
// StatusLabel/Chip/plain text. When `onClick` is provided the root renders
// as a button with hover/focus states; otherwise it's a non-interactive
// div. Set `hideChevron` for cases where the row is purely displaying info.
//
// Prism's hover uses --color-line-strong which isn't in this repo's token
// catalog; --s-color-line-bold (also #3C4A57 in Prism's own primitives) is
// the verified semantic equivalent.
// -----------------------------------------------------------------------------

type ConfigRowProps = {
  icon?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  trailing?: React.ReactNode
  onClick?: () => void
  hideChevron?: boolean
  disabled?: boolean
  className?: string
}

function ConfigRow({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  hideChevron = false,
  disabled = false,
  className,
}: ConfigRowProps) {
  const isInteractive = Boolean(onClick)

  const rootClass = cn(
    "flex w-full items-center gap-[var(--p-space-100)] min-h-12 px-[var(--p-space-150)]",
    "rounded-[var(--p-radius-075)] border border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]",
    "text-left transition-colors",
    isInteractive && !disabled && "cursor-pointer hover:bg-[var(--s-color-surface-muted)] hover:border-[var(--s-color-line-bold)]",
    isInteractive && "focus-visible:outline-none focus-visible:border-[var(--s-color-line-bold)] focus-visible:shadow-[var(--e-shadow-focus)]",
    disabled && "cursor-not-allowed opacity-60",
    className,
  )

  const body = (
    <>
      {icon ? (
        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-[var(--p-radius-075)] bg-[var(--s-color-surface-muted)] text-[var(--s-color-text-subtle)]">
          {icon}
        </span>
      ) : null}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)] font-medium text-[var(--s-color-text-default)]">
          {title}
        </span>
        {subtitle ? (
          <span className="truncate text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)] text-[var(--s-color-text-subtle)]">
            {subtitle}
          </span>
        ) : null}
      </span>
      {trailing ? <span className="shrink-0">{trailing}</span> : null}
      {!hideChevron ? (
        <span aria-hidden="true" className="shrink-0 text-[var(--s-icon-color-subtle)]">
          <PrismIcon name="chevron-right" size={16} decorative />
        </span>
      ) : null}
    </>
  )

  if (isInteractive) {
    return (
      <button
        type="button"
        className={rootClass}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        {body}
      </button>
    )
  }

  return <div className={rootClass}>{body}</div>
}

export { ConfigRow }
export type { ConfigRowProps }
