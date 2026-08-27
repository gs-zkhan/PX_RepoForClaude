import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// -----------------------------------------------------------------------------
// Textarea — Figma "Messagebox" (node 3137:126, Prism V1 - ShadCN), seen in
// Shell/Create · Edit Form (node 3187:10) as the Description/URL fields in
// the popup Create/Edit example (node 3791:1498). "Multi-line text input for
// longer content — notes, comments, descriptions. Use when the expected
// input is a sentence or more. For single-line inputs use Text Field
// instead." (Figma component description.)
//
// Same label/required/info-icon/helper-text/state/a11y shape as TextField —
// this is the multi-line sibling of that component, not a competing pattern.
//
// Explicitly approved as a new component (no prior textarea/multiline-input
// existed anywhere in src/components/ui): user selected "Build it now as a
// new approved component (Recommended)" when asked how PxCreateEditShell
// should handle the Figma Messagebox gap.
//
// Token gap (reported, not silently worked around): Figma's own Messagebox
// spec borrows Text Field's placeholder token
// (--textfield/content/placeholder) rather than defining its own, and no
// --c-textarea-* / --c-messagebox-* component tokens exist yet in this
// repo's generated token set. Per this repo's token-ownership priority
// (component token > semantic > primitive > raw constant), this component
// uses semantic/primitive tokens directly instead of borrowing another
// component's token: label text uses --s-color-text-subtle (Figma's actual
// "color/text/subtle" value for Messagebox's label — not
// --c-textfield-content-label, which resolves to a different semantic
// value, --s-color-text-subtlest), and the placeholder uses
// --s-color-text-subtlest (the closest existing muted semantic tone) as an
// interim stand-in. Recommended follow-up: add --c-textarea-content-label,
// --c-textarea-content-placeholder, --c-textarea-content-value,
// --c-textarea-content-helper, --c-textarea-content-error,
// --c-textarea-content-success to the Figma component-token export so this
// no longer depends on a semantic-layer fallback.
// -----------------------------------------------------------------------------

type TextareaState = "default" | "error" | "success"

type TextareaProps = {
  label: string
  /** Label=On/Off. Default: on. When off, `label` is still used as aria-label. */
  labelVisible?: boolean
  /** Renders a danger-coloured asterisk after the label. Default: off. */
  required?: boolean
  /** Shows a 16px info icon + tooltip after the label. Default: off. */
  infoIcon?: boolean
  /** Tooltip content shown when infoIcon is true. */
  infoTooltip?: React.ReactNode
  helperText?: string
  /** Default: off. Always shown when state is "error" or "success". */
  helperVisible?: boolean
  state?: TextareaState
  disabled?: boolean
  /** Fixed content-box height in px. Figma's Messagebox default is 80. */
  height?: number
  id?: string
  className?: string
} & Omit<
  React.ComponentProps<"textarea">,
  "id" | "className" | "aria-invalid" | "aria-describedby" | "aria-required"
>

function Textarea({
  label,
  labelVisible = true,
  required = false,
  infoIcon = false,
  infoTooltip,
  helperText,
  helperVisible = false,
  state = "default",
  disabled = false,
  height = 80,
  id,
  className,
  ...textareaProps
}: TextareaProps) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const helperId = `${textareaId}-helper`

  const showHelper = Boolean(helperText) && (helperVisible || state !== "default")

  return (
    <div className={cn("flex flex-col gap-[var(--p-space-050)]", className)}>
      {labelVisible && (
        <div
          className={cn(
            "flex items-center gap-[var(--p-space-025)]",
            "text-[length:var(--t-font-label-small-size)]",
            "leading-[var(--t-font-label-small-line-height)]",
            "font-[number:var(--t-font-label-small-weight)]",
            "text-[var(--s-color-text-subtle)]",
          )}
        >
          <label htmlFor={textareaId}>{label}</label>

          {required && (
            <span aria-hidden="true" className="text-[var(--s-color-status-danger-default)]">
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

      <textarea
        id={textareaId}
        disabled={disabled}
        aria-invalid={state === "error" || undefined}
        aria-required={required || undefined}
        aria-describedby={showHelper ? helperId : undefined}
        aria-label={labelVisible ? undefined : label}
        style={{ height }}
        className={cn(
          "w-full resize-none rounded-[var(--p-radius-100)]",
          "border border-[var(--s-color-line-default)]",
          "bg-[var(--s-color-surface-default)]",
          "px-[var(--p-space-200)] pt-[var(--p-space-150)] pb-0.5",
          "text-[length:var(--p-font-size-medium)] leading-[var(--p-font-line-height-medium)]",
          "text-[var(--s-color-text-default)]",
          "placeholder:text-[var(--s-color-text-subtlest)]",
          "outline-none",
          "focus-visible:border-[var(--s-color-line-brand)]",
          state === "error" && "border-[var(--s-color-status-danger-default)]",
          state === "success" && "border-[var(--s-color-status-success-default)]",
          disabled && "cursor-not-allowed bg-[var(--s-color-surface-sunken)] text-[var(--s-color-text-disabled)]",
        )}
        {...textareaProps}
      />

      {showHelper && (
        <p
          id={helperId}
          className={cn(
            "text-[length:var(--p-font-size-small)]",
            "leading-[var(--p-font-line-height-small)]",
            "font-[number:var(--p-font-weight-regular)]",
            state === "error"
              ? "text-[var(--s-color-status-danger-default)]"
              : state === "success"
                ? "text-[var(--s-color-status-success-default)]"
                : "text-[var(--s-color-text-subtle)]",
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Textarea }
export type { TextareaProps, TextareaState }
