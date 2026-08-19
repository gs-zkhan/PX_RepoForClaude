import * as React from "react"

import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"
import type { DatePickerSize } from "@/components/ui/date-picker"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// -----------------------------------------------------------------------------
// DateField — Figma "Date Picker 🟢" (Prism V1 - ShadCN), same composition
// pattern as TextField and DropdownField (see those files). Form Field no
// longer exists in Figma, so Label, Required, Info icon, and Helper text are
// boolean properties owned directly by this component.
//
// Figma defaults: Label=On, Required=Off, Info icon=Off, Helper text=Off.
//
// Label row tokens (matches the corrected TextField/DropdownField spec):
// - font: --t-font-label-small-* (12px/16px/400) — NOT
//   --c-datepicker-input-font-*, which is the trigger's own value/placeholder
//   text size (14px).
// - color: --c-datepicker-input-content-label
// - gap to field: --c-datepicker-input-gap-label (space/050, 4px)
// -----------------------------------------------------------------------------

type DateFieldState = "default" | "error" | "success"

type DateFieldProps = {
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
  state?: DateFieldState
  size?: DatePickerSize
  disabled?: boolean
  /** Inline=True/False. Compact/inline contexts only — never in a standalone form. */
  inline?: boolean
  placeholder?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  id?: string
  className?: string
}

function DateField({
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
  onChange,
  id,
  className,
}: DateFieldProps) {
  const generatedId = React.useId()
  const triggerId = id ?? generatedId
  const helperId = `${triggerId}-helper`

  const showHelper = Boolean(helperText) && (helperVisible || state !== "default")

  return (
    <div
      className={cn("flex flex-col gap-[var(--c-datepicker-input-gap-label)]", className)}
    >
      {labelVisible && (
        <div
          className={cn(
            "flex items-center gap-[var(--c-datepicker-input-gap-required)]",
            "text-[length:var(--t-font-label-small-size)]",
            "leading-[var(--t-font-label-small-line-height)]",
            "font-[number:var(--t-font-label-small-weight)]",
            "text-[var(--c-datepicker-input-content-label)]",
          )}
        >
          <label htmlFor={triggerId}>{label}</label>

          {required && (
            <span aria-hidden="true" className="text-[var(--c-datepicker-input-content-error)]">
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

      <DatePicker
        id={triggerId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        inline={inline}
        success={state === "success"}
        aria-invalid={state === "error" || undefined}
        aria-required={required || undefined}
        aria-describedby={showHelper ? helperId : undefined}
        aria-label={labelVisible ? undefined : label}
      />

      {showHelper && (
        <p
          id={helperId}
          className={cn(
            "text-[length:var(--c-datepicker-input-helper-font-size)]",
            "leading-[var(--c-datepicker-input-helper-font-line-height)]",
            "font-[number:var(--c-datepicker-input-helper-font-weight)]",
            state === "error"
              ? "text-[var(--c-datepicker-input-content-error)]"
              : state === "success"
                ? "text-[var(--c-datepicker-input-content-success)]"
                : "text-[var(--c-datepicker-input-content-helper)]",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export { DateField }
export type { DateFieldProps, DateFieldState }
