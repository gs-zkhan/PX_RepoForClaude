import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Views — Figma "Views" (node 1273:22), Prism V1 - ShadCN.
//
// Inline dropdown trigger combining a label cell (filter name) and a value
// cell (selected value + chevron). Non-Inline renders both cells bordered;
// Inline renders only the value + chevron with no border chrome. Trigger
// only — always pair with a Dropdown List/Menu for the open state (per
// Figma's own rule); this component does not render the options list.
//
// Design team added dedicated `views/*` component tokens (2026-08-06) to
// resolve the earlier label-cell-background discrepancy — the component now
// uses `--c-views-surface-sunken` throughout instead of the semantic
// `--s-color-surface-sunken` fallback. Also newly tokenized: hover/click
// border states, value-cell hover background, icon color, and granular
// padding/gap values (value-cell left padding is 12px, distinct from the
// 8px used everywhere else — verified via the `views/padding/value/left`
// vs `views/padding/horizontal` token split).
//
// Sizes: Large (32px, font.body.medium 14/24 Regular), Small (28px,
// font.label.small 12/16 Regular), Extrasmall (24px, font.label.small,
// 16px icon instead of 24px) — all verified via get_variable_defs per size,
// not assumed uniform. (The new flat `views/label/fontSize|lineHeight`
// tokens (14/24) only describe the Large size — kept the existing per-size
// SIZE_FONT map rather than replacing it, since collapsing to the flat
// token would incorrectly apply Large's type scale to Small/Extrasmall.)
// -----------------------------------------------------------------------------

type ViewsSize = "large" | "small" | "extrasmall"

const SIZE_HEIGHT: Record<ViewsSize, string> = {
  large: "h-8",
  small: "h-7",
  extrasmall: "h-6",
}

const SIZE_FONT: Record<ViewsSize, string> = {
  large: "text-[length:var(--t-font-body-medium-size)] font-[number:var(--t-font-body-medium-weight)] leading-[var(--t-font-body-medium-line-height)]",
  small: "text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-label-small-weight)] leading-[var(--t-font-label-small-line-height)]",
  extrasmall: "text-[length:var(--t-font-label-small-size)] font-[number:var(--t-font-label-small-weight)] leading-[var(--t-font-label-small-line-height)]",
}

// Matches --c-views-icon-size-large (24) / --c-views-icon-size-small (16) —
// kept as numeric JS constants since PrismIcon's `size` prop needs a number,
// not a CSS var, but the values are the same ones now tokenized.
const SIZE_ICON = { large: 24, small: 24, extrasmall: 16 } as const
const SIZE_RADIUS: Record<ViewsSize, string> = {
  large: "rounded-[var(--c-views-radius)]",
  small: "rounded-[var(--c-views-radius)]",
  extrasmall: "rounded-[var(--c-views-radius-extrasmall)]",
}

type ViewsProps = {
  size?: ViewsSize
  inline?: boolean
  label: string
  value: string
  icon?: PrismIconName
  open?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

function Views({
  size = "large",
  inline = false,
  label,
  value,
  icon,
  open = false,
  disabled = false,
  onClick,
  className,
}: ViewsProps) {
  const iconSize = SIZE_ICON[size]
  const textColor = disabled ? "text-[var(--c-views-label-disabled)]" : "text-[var(--c-views-label-default)]"

  if (inline) {
    return (
      <div className={cn("inline-flex items-center gap-[var(--c-views-gap-inline)]", SIZE_FONT[size], className)}>
        <span className={cn(disabled ? "text-[var(--c-views-label-disabled)]" : "text-[var(--c-views-label-subtle)]")}>
          {label}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "inline-flex items-center gap-[var(--c-views-padding-chevron)] rounded-[var(--c-views-radius-inline)]",
            "px-[var(--p-space-050)]",
            !disabled && "hover:bg-[var(--c-views-inline-hover-bg)]",
            textColor,
            disabled && "cursor-not-allowed"
          )}
        >
          <span>{value}</span>
          <PrismIcon name={open ? "chevron-up" : "chevron-down"} size={iconSize} decorative />
        </button>
      </div>
    )
  }

  // Hover-border state: Figma binds views/border/hover on the wrapper when the
  // value cell is hovered, and views/border/click when open. `has-[button:
  // hover]` fires only when the interactive right cell is hovered, not the
  // label cell (which is non-interactive per Figma's spec). `data-open`
  // covers the Click/open state via the dedicated click token.
  return (
    <div
      data-open={open || undefined}
      className={cn(
        "inline-flex items-stretch overflow-hidden border transition-colors",
        disabled
          ? "border-[var(--c-views-border-disabled)]"
          : "border-[var(--c-views-border-default)] has-[button:hover]:border-[var(--c-views-border-hover)] data-[open]:border-[var(--c-views-border-click)]",
        SIZE_HEIGHT[size],
        SIZE_RADIUS[size],
        SIZE_FONT[size],
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-[var(--c-views-gap-icon)] px-[var(--c-views-padding-horizontal)]",
          "bg-[var(--c-views-surface-sunken)]",
          disabled ? "text-[var(--c-views-label-disabled)]" : "text-[var(--c-views-label-subtle)]"
        )}
      >
        {icon ? <PrismIcon name={icon} size={iconSize} decorative className="text-[var(--c-views-icon-color)]" /> : null}
        <span>{label}</span>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-[var(--c-views-padding-chevron)] pl-[var(--c-views-padding-value-left)] pr-[var(--c-views-padding-horizontal)]",
          "bg-[var(--c-views-background-default)]",
          !disabled && "hover:bg-[var(--c-views-background-hover)]",
          textColor,
          disabled && "cursor-not-allowed"
        )}
      >
        <span className="min-w-0 flex-1 truncate text-left">{value}</span>
        <PrismIcon
          name={open ? "chevron-up" : "chevron-down"}
          size={iconSize}
          decorative
          className={disabled ? undefined : "text-[var(--c-views-icon-color)]"}
        />
      </button>
    </div>
  )
}

export { Views }
export type { ViewsProps, ViewsSize }
