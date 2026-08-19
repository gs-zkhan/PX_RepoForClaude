import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// ViewSwitcher — Figma "View Switcher" (node 2799:31827), Prism V1 - ShadCN.
//
// Pill-style toggle group for switching between 2-3 fixed layout modes
// (e.g. Chart / Table / List) within the same page context. Not for
// named/user-saved views (use ViewSelector) and not for more than 3 tabs
// (use a dropdown). No hover state — selection is immediate on click, per
// Figma's own spec.
//
// Always 32px tall, pill container (radius/full) with 2px padding, active
// tab gets a white background + shadow/100 elevation. Verified via
// get_variable_defs: tab label font is font.heading.xxsmall (12px SemiBold),
// not a size the prose implies is larger.
// -----------------------------------------------------------------------------

type ViewSwitcherOption = {
  value: string
  label: string
  icon?: PrismIconName
}

type ViewSwitcherProps = {
  options: ViewSwitcherOption[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

function ViewSwitcher({ options, value, onValueChange, className }: ViewSwitcherProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-8 items-stretch rounded-[var(--c-view-switcher-radius)] p-[var(--c-view-switcher-padding)]",
        "bg-[var(--c-view-switcher-background)]",
        className
      )}
    >
      {options.map((option) => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "inline-flex items-center justify-center gap-[var(--p-space-050)] rounded-[var(--c-view-switcher-radius)]",
              "px-[var(--c-view-switcher-tab-padding-h)]",
              "text-[length:var(--t-font-heading-xxsmall-size)] font-[number:var(--t-font-heading-xxsmall-weight)] leading-[var(--t-font-heading-xxsmall-line-height)]",
              active
                ? "bg-[var(--c-view-switcher-tab-active-bg)] text-[var(--c-view-switcher-tab-active-label)] shadow-[var(--e-shadow-100)]"
                : "bg-transparent text-[var(--c-view-switcher-tab-inactive-label)]"
            )}
          >
            {option.icon ? (
              <PrismIcon
                name={option.icon}
                size={16}
                decorative
                className="text-[var(--s-icon-color-default)]"
              />
            ) : null}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export { ViewSwitcher }
export type { ViewSwitcherProps, ViewSwitcherOption }
