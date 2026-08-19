import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// FilterChip — Figma "Filter Chip" component set (node 4077:7991, alias
// 3421:8727, "Filter Chip, Bar, Dropdown Panel 🟢" page, Prism V1 - ShadCN).
// Pill representing one active filter criterion — always used inside a
// Filter Bar, never standalone (per the component's own Figma "When NOT to
// use" note).
//
// Anatomy: Category label · (if a value is set) operator icon (default
// "equal") + Value label · trailing chevron (down when closed, up when the
// Filter Dropdown Panel is open for this chip). No value set renders a
// narrower chip with only the Category label + chevron, dashed border.
//
// States: Default, Hover, Open (chevron-up, brand border + open background),
// Disabled. No dedicated "Pressed" token exists yet in filter/chip/* — :active
// falls back to the Hover token rather than inventing an unverified color.
//
// Tokens: filter/chip/* (component-owned — background/border per state,
// content/icon colors, radius, gap, padding, font) + the pre-existing
// filterchip/height (28px, not redefined in the new token set, so reused as-is).
// -----------------------------------------------------------------------------

type FilterChipProps = {
  /** Category label — always visible, never empty. */
  label: string
  /** Selected value. Omit to render the narrower "no value" chip variant. */
  value?: string
  /** Operator icon shown between label and value. Defaults to "equal". */
  operatorIcon?: PrismIconName
  /** Whether this chip's Filter Dropdown Panel is open (chevron flips up). */
  open?: boolean
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
} & Omit<React.ComponentProps<"button">, "children" | "value" | "onClick">

const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  {
    label,
    value,
    operatorIcon = "equal",
    open = false,
    disabled = false,
    onClick,
    className,
    ...props
  },
  ref,
) {
  const hasValue = value !== undefined
  const contentColor = disabled
    ? "text-[var(--c-filter-chip-content-disabled)]"
    : "text-[var(--c-filter-chip-content-default)]"
  const iconColor = disabled
    ? "text-[var(--c-filter-chip-icon-disabled)]"
    : "text-[var(--c-filter-chip-icon-default)]"

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-expanded={open}
      aria-pressed={hasValue}
      aria-label={hasValue ? `${label} = ${value}, edit filter` : `${label}, edit filter`}
      onClick={onClick}
      className={cn(
        "inline-flex h-[var(--c-filterchip-height)] shrink-0 items-center justify-center outline-none transition-colors",
        "gap-[var(--c-filter-chip-gap)]",
        "rounded-[var(--c-filter-chip-radius)]",
        "border px-[var(--c-filter-chip-padding-horizontal)]",
        "text-[length:var(--c-filter-chip-font-size)] leading-[var(--c-filter-chip-font-line-height)]",
        open
          ? "border-[var(--c-filter-chip-border-open)] bg-[var(--c-filter-chip-background-open)]"
          : "border-[var(--c-filter-chip-border-default)] bg-[var(--c-filter-chip-background-default)]",
        !hasValue && !open && "border-dashed",
        !disabled &&
          !open &&
          "hover:bg-[var(--c-filter-chip-background-hover)] active:bg-[var(--c-filter-chip-background-hover)]",
        "focus-visible:shadow-[var(--e-shadow-focus)]",
        disabled &&
          "pointer-events-none border-[var(--c-filter-chip-border-disabled)] bg-[var(--c-filter-chip-background-disabled)]",
        className,
      )}
      {...props}
    >
      <span className={contentColor}>{label}</span>

      {hasValue && (
        <>
          {/* sourceSize=24: the comparison-operator icons ("greater-than",
              "less-than-or-equal-to", etc.) only exist in the 24px icon
              folder — "equal" is the sole operator that happens to also have
              a 16px asset, which is why this only broke once a doc example
              exercised a non-default operatorIcon. */}
          <PrismIcon name={operatorIcon} size={16} sourceSize={24} className={iconColor} />
          <span className={contentColor}>{value}</span>
        </>
      )}

      <PrismIcon name={open ? "chevron-up" : "chevron-down"} size={16} className={iconColor} />
    </button>
  )
})

export { FilterChip }
export type { FilterChipProps }
