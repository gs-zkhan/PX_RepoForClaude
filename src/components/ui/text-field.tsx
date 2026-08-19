import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// -----------------------------------------------------------------------------
// TextField — Figma "Text Field 🟢" (node 20:11, Prism V1 - ShadCN).
//
// The Prism DS no longer has a separate Form Field wrapper component — it was
// removed from Figma. Label, Required, Info icon, and Helper text are now
// boolean properties owned directly by Text Field (and, by the same pattern,
// Dropdown and Date Picker). This component is the full field: label row +
// input slot + helper row.
//
// Figma defaults: Label=On, Required=Off, Info icon=Off, Helper text=Off.
// -----------------------------------------------------------------------------

type TextFieldState = "default" | "error" | "success"
type TextFieldSize = "large" | "small"

type TextFieldProps = {
  label: string
  /** Label=On/Off. Default: on. When off, `label` is still used as aria-label. */
  labelVisible?: boolean
  /** Required=On/Off. Renders a danger-coloured asterisk after the label. Default: off. */
  required?: boolean
  /** Info icon=On/Off. Shows a 16px info icon + tooltip after the label. Default: off. */
  infoIcon?: boolean
  /** Tooltip content shown when infoIcon is true. */
  infoTooltip?: React.ReactNode
  helperText?: string
  /** Helper text=On/Off. Default: off. Always shown when state is "error" or "success". */
  helperVisible?: boolean
  state?: TextFieldState
  size?: TextFieldSize
  disabled?: boolean
  /** Inline=True/False. Table cells, inline editing, dense UI only — never in a standalone form. */
  inline?: boolean
  leadingIcon?: PrismIconName
  trailingIcon?: PrismIconName
  id?: string
  className?: string
} & Omit<
  React.ComponentProps<"input">,
  "size" | "id" | "className" | "aria-invalid" | "aria-describedby" | "aria-required"
>

function TextField({
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
  leadingIcon,
  trailingIcon,
  id,
  className,
  ...inputProps
}: TextFieldProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const helperId = `${inputId}-helper`

  const showHelper = Boolean(helperText) && (helperVisible || state !== "default")

  return (
    <div
      className={cn("flex flex-col gap-[var(--c-textfield-gap-label)]", className)}
    >
      {labelVisible && (
        <div
          className={cn(
            "flex items-center gap-[var(--c-textfield-gap-required)]",
            "text-[length:var(--t-font-label-small-size)]",
            "leading-[var(--t-font-label-small-line-height)]",
            "font-[number:var(--t-font-label-small-weight)]",
            "text-[var(--c-textfield-content-label)]",
          )}
        >
          <label htmlFor={inputId}>{label}</label>

          {required && (
            <span aria-hidden="true" className="text-[var(--c-textfield-content-error)]">
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

      <div className="relative flex items-center">
        {leadingIcon && (
          <PrismIcon
            name={leadingIcon}
            size={16}
            sourceSize={24}
            className="pointer-events-none absolute left-3 text-[var(--c-textfield-content-value)]"
          />
        )}

        <Input
          id={inputId}
          size={size}
          disabled={disabled}
          inline={inline}
          success={state === "success"}
          aria-invalid={state === "error" || undefined}
          aria-required={required || undefined}
          aria-describedby={showHelper ? helperId : undefined}
          aria-label={labelVisible ? undefined : label}
          leadingAdornment={leadingIcon ? 16 : undefined}
          trailingAdornment={trailingIcon ? 16 : undefined}
          {...inputProps}
        />

        {trailingIcon && (
          <PrismIcon
            name={trailingIcon}
            size={16}
            sourceSize={24}
            className="pointer-events-none absolute right-2 text-[var(--c-textfield-content-value)]"
          />
        )}
      </div>

      {showHelper && (
        <p
          id={helperId}
          className={cn(
            "text-[length:var(--c-textfield-helper-font-size)]",
            "leading-[var(--c-textfield-helper-font-line-height)]",
            "font-[number:var(--c-textfield-helper-font-weight)]",
            state === "error"
              ? "text-[var(--c-textfield-content-error)]"
              : state === "success"
                ? "text-[var(--c-textfield-content-success)]"
                : "text-[var(--c-textfield-content-helper)]",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export { TextField }
export type { TextFieldProps, TextFieldSize, TextFieldState }
