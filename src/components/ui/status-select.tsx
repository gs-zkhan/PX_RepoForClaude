import { cn } from "@/lib/utils"
import { StatusLabel } from "@/components/ui/status-label"
import type { StatusLabelSize, StatusLabelVariant } from "@/components/ui/status-label"
import { PrismIcon } from "@/components/ui/prism-icon"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

// -----------------------------------------------------------------------------
// StatusSelect — Figma "Status Chip" (node 767:222) with chevron, plus its
// dropdown (node 4084:37903), Prism V1 - ShadCN.
//
// Composition, not a new visual component:
//   trigger = <StatusLabel> + a 16px chevron  (icon/size/016, gap statuslabel/gap)
//   menu    = <DropdownMenuContent> whose items each hold a <StatusLabel>
//
// Verified via get_variable_defs on both nodes: every chip value the chip set
// binds (statuslabel/color/bg|text/*, height 24/16, radius 8/4, padding, gap 4)
// already exists as --c-statuslabel-*, and the menu binds the same
// dropdown/menu/* set our DropdownMenu already consumes — including
// dropdown/menu/item hover = color/surface/muted (#F5F7F9), which matches
// --c-dropdown-menu-item-background-hover exactly. So nothing new was needed.
//
// StatusLabel is deliberately left untouched. It is a non-interactive <span>
// used inside table cells; making it interactive would give one component two
// jobs. The chevron-less, read-only chip stays <StatusLabel>; this component is
// the interactive variant.
// -----------------------------------------------------------------------------

type StatusSelectOption = {
  value: string
  variant: StatusLabelVariant
  /** Visible text. Figma's menu uses full wording, e.g. "Work in progress". */
  label: string
}

type StatusSelectProps = {
  value: string
  options: StatusSelectOption[]
  onValueChange?: (value: string) => void
  size?: StatusLabelSize
  disabled?: boolean
  /** Menu alignment against the trigger. Defaults to "start". */
  align?: "start" | "center" | "end"
  className?: string
}

// The trigger mirrors its child's radius so the focus ring traces the pill
// rather than a rectangle around it. Both read the same statuslabel token, so
// the two cannot drift apart.
const TRIGGER_RADIUS: Record<StatusLabelSize, string> = {
  regular: "rounded-[var(--c-statuslabel-radius-regular)]",
  small: "rounded-[var(--c-statuslabel-radius-small)]",
}

function StatusSelect({
  value,
  options,
  onValueChange,
  size = "regular",
  disabled = false,
  align = "start",
  className,
}: StatusSelectProps) {
  const selected = options.find((option) => option.value === value)

  if (!selected) {
    // A value with no matching option is a wiring bug, not a display state —
    // say so rather than rendering an empty pill.
    if (import.meta.env.DEV) {
      console.warn(
        `StatusSelect: value "${value}" matches no option. Options: ${options
          .map((o) => o.value)
          .join(", ")}`,
      )
    }
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "inline-flex outline-none",
            TRIGGER_RADIUS[size],
            "focus-visible:shadow-[var(--e-shadow-focus)]",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <StatusLabel variant={selected.variant} size={size}>
            {selected.label}
            <PrismIcon name="chevron-down" size={16} decorative />
          </StatusLabel>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            // Figma's menu screenshot shows no persistent selected-row fill —
            // only a hover fill. The current value is marked anyway: without it
            // there is no way to tell which status is active once the menu is
            // open, which is both a usability and an accessibility gap. Uses
            // DropdownMenuItem's existing approved `selected` prop, so it is a
            // deliberate, documented deviation rather than a local style.
            selected={option.value === value}
            onSelect={() => onValueChange?.(option.value)}
          >
            <StatusLabel variant={option.variant} size={size}>
              {option.label}
            </StatusLabel>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { StatusSelect }
export type { StatusSelectProps, StatusSelectOption }
