import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// -----------------------------------------------------------------------------
// DropdownField — Figma "Dropdown · Select 🟢" (node 20:13, Prism V1 - ShadCN).
//
// Same composition pattern as TextField (see src/components/ui/text-field.tsx):
// Form Field no longer exists in Figma, so Label, Required, Info icon, and
// Helper text are boolean properties owned directly by this component.
//
// Figma defaults: Label=On, Required=Off, Info icon=Off, Helper text=Off.
//
// Label row tokens deliberately mirror TextField's corrected spec:
// - font: --t-font-label-small-* (12px/16px/400) — NOT --c-dropdown-font-*,
//   which is the trigger's own value/placeholder text size (14px).
// - color: --c-dropdown-content-label
// - gap to field: --c-dropdown-gap-label (space/050, 4px)
// -----------------------------------------------------------------------------

type DropdownFieldState = "default" | "error" | "success"
type DropdownFieldSize = "large" | "small"

type DropdownFieldProps = {
  label: string
  /** Label=On/Off. Default: on. When off, `label` is still used as aria-label. */
  labelVisible?: boolean
  /** Required=On/Off. Renders a danger-coloured asterisk after the label. Default: off. */
  required?: boolean
  /** Info icon=On/Off. Shows a 16px info icon + tooltip after the label. Default: off. */
  infoIcon?: boolean
  infoTooltip?: React.ReactNode
  helperText?: string
  /** Helper text=On/Off. Default: off. Always shown when state is "error" or "success". */
  helperVisible?: boolean
  state?: DropdownFieldState
  size?: DropdownFieldSize
  disabled?: boolean
  /** Inline=True/False. Compact toolbar filters, side-panel rows — never in a standalone form. */
  inline?: boolean
  placeholder?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  id?: string
  className?: string
  /** SelectContent children — SelectGroup/SelectItem/SelectSeparator etc. */
  children: React.ReactNode
}

function DropdownField({
  label,
  labelVisible = true,
  required = false,
  infoIcon = false,
  infoTooltip,
  helperText,
  helperVisible = false,
  state = "default",
  size = "large",
  disabled = false,
  inline = false,
  placeholder,
  value,
  defaultValue,
  onValueChange,
  id,
  className,
  children,
}: DropdownFieldProps) {
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const helperId = `${triggerId}-helper`

  const showHelper = Boolean(helperText) && (helperVisible || state !== "default")

  return (
    <div className={cn("flex flex-col gap-[var(--c-dropdown-gap-label)]", className)}>
      {labelVisible && (
        <div
          className={cn(
            "flex items-center gap-[var(--c-dropdown-gap-required)]",
            "text-[length:var(--t-font-label-small-size)]",
            "leading-[var(--t-font-label-small-line-height)]",
            "font-[number:var(--t-font-label-small-weight)]",
            "text-[var(--c-dropdown-content-label)]",
          )}
        >
          <label htmlFor={triggerId}>{label}</label>

          {required && (
            <span aria-hidden="true" className="text-[var(--c-dropdown-content-error)]">
              *
            </span>
          )}

          {infoIcon && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-flex cursor-help outline-none">
                  <PrismIcon
                    name="info"
                    size={16}
                    decorative={false}
                    label={`More information about ${label}`}
                    className="text-[var(--s-icon-color-subtle)]"
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>{infoTooltip}</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={triggerId}
          size={size}
          inline={inline}
          success={state === "success"}
          aria-invalid={state === "error" || undefined}
          aria-required={required || undefined}
          aria-describedby={showHelper ? helperId : undefined}
          aria-label={labelVisible ? undefined : label}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>

      {showHelper && (
        <p
          id={helperId}
          className={cn(
            "text-[length:var(--c-dropdown-helper-font-size)]",
            "leading-[var(--c-dropdown-helper-font-line-height)]",
            "font-[number:var(--c-dropdown-helper-font-weight)]",
            state === "error"
              ? "text-[var(--c-dropdown-content-error)]"
              : state === "success"
                ? "text-[var(--c-dropdown-content-success)]"
                : "text-[var(--c-dropdown-content-helper)]",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export { DropdownField }
export type { DropdownFieldProps, DropdownFieldSize, DropdownFieldState }
