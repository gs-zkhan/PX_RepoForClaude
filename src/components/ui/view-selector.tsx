import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// ViewSelector — Figma "View Selector" (node 1273:21), Prism V1 - ShadCN.
//
// Trigger for named/user-saved views (e.g. "My CTAs due this week") — shows
// the current view name + chevron, opens a Dropdown List below on click.
// Distinct from `Views` (a labeled filter control) and `ViewSwitcher` (fixed
// 2-3 layout-mode pill toggle) — do not conflate the three, per Figma's own
// "When NOT to use" rules on each.
//
// Sizes: Large 32px (16px SemiBold), Medium 28px (14px SemiBold), Small 24px
// (12px SemiBold) — all verified via get_variable_defs, reusing the same
// heading tokens already verified for Tabs (font.heading.small/xsmall/xxsmall).
// No disabled state exists per Figma's own spec.
// -----------------------------------------------------------------------------

type ViewSelectorSize = "large" | "medium" | "small"

const SIZE_HEIGHT: Record<ViewSelectorSize, string> = {
  large: "h-8",
  medium: "h-7",
  small: "h-6",
}

const SIZE_FONT: Record<ViewSelectorSize, string> = {
  large: "text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)]",
  medium: "text-[length:var(--t-font-heading-xsmall-size)] font-[number:var(--t-font-heading-xsmall-weight)] leading-[var(--t-font-heading-xsmall-line-height)]",
  small: "text-[length:var(--t-font-heading-xxsmall-size)] font-[number:var(--t-font-heading-xxsmall-weight)] leading-[var(--t-font-heading-xxsmall-line-height)]",
}

// Figma binds icon/size/024 at Large, icon/size/016 at Medium and Small — the
// chevron is NOT a fixed 24px across sizes.
const SIZE_ICON: Record<ViewSelectorSize, 16 | 24> = {
  large: 24,
  medium: 16,
  small: 16,
}

type ViewSelectorProps = {
  size?: ViewSelectorSize
  label: string
  open?: boolean
  onClick?: () => void
  className?: string
}

function ViewSelector({ size = "large", label, open = false, onClick, className }: ViewSelectorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-label={`${label}, press to change view`}
      className={cn(
        "inline-flex items-center gap-[var(--p-space-100)]",
        "rounded-[var(--c-view-selector-radius)] pl-[var(--c-view-selector-padding-left)] pr-[var(--c-view-selector-padding-right)]",
        "text-[var(--c-view-selector-label)]",
        "hover:bg-[var(--c-view-selector-background-hover)]",
        open && "bg-[var(--c-view-selector-background-click)]",
        SIZE_HEIGHT[size],
        SIZE_FONT[size],
        className
      )}
    >
      <span className="max-w-[240px] truncate">{label}</span>
      <PrismIcon
        name={open ? "chevron-up" : "chevron-down"}
        size={SIZE_ICON[size]}
        decorative
        className="text-[var(--s-icon-color-default)]"
      />
    </button>
  )
}

export { ViewSelector }
export type { ViewSelectorProps, ViewSelectorSize }
