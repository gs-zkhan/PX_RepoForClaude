import * as React from "react"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Toggle — Prism switch anatomy (verified against prism-ds/src/components/
// Toggle: 36×20 track, 16px handle, pill radius, on/off/hover/disabled
// states, focus ring). Component tokens (--c-switch-*) already exist in
// prism-generated.css.
//
// Uses native <input type="checkbox" role="switch"> so form submission,
// keyboard toggling (Space), and screen-reader ARIA all work with zero
// custom wiring — no Radix primitive needed. `label` is the visible text
// beside the track; caller passes any other input props via `...rest`
// (checked/defaultChecked/onChange/name/etc.).
//
// Track/handle state selectors use `group-has-[:checked]` on the outer
// label, so the handle (nested inside the track) can react to the input's
// checked state even though it's not a direct sibling — Tailwind's
// `peer-checked:` only works on siblings.
// -----------------------------------------------------------------------------

type ToggleProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "role" | "size"
> & {
  label?: React.ReactNode
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(function Toggle(
  { label, disabled, className, ...rest },
  ref,
) {
  return (
    <label
      className={cn(
        "group inline-flex items-center gap-[var(--p-space-100)]",
        "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
        disabled
          ? "cursor-not-allowed text-[var(--s-color-text-disabled)]"
          : "cursor-pointer text-[var(--s-color-text-default)]",
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-block h-5 w-9 shrink-0 rounded-[var(--p-radius-full)] transition-colors",
          // OFF (default) — resting track color
          "bg-[var(--c-switch-track-off-default)]",
          // OFF hover
          !disabled && "group-hover:bg-[var(--c-switch-track-off-hover)]",
          // ON (checked) — group-has works because <input> is a descendant of the label group
          "group-has-[:checked]:bg-[var(--c-switch-track-on-default)]",
          !disabled &&
            "group-hover:group-has-[:checked]:bg-[var(--c-switch-track-on-hover)]",
          // Disabled overrides everything
          disabled && "!bg-[var(--c-switch-track-disabled)]",
          // Focus ring via peer-focus (input is a direct sibling of the track)
          "peer-focus-visible:shadow-[var(--e-shadow-focus)]",
        )}
      >
        <span
          className={cn(
            "absolute left-0.5 top-0.5 size-4 rounded-[var(--p-radius-full)] transition-transform",
            "bg-[var(--c-switch-handle-active)] shadow-[var(--e-shadow-100)]",
            // Handle slides right when the input is checked
            "group-has-[:checked]:translate-x-4",
            disabled && "!bg-[var(--c-switch-handle-disabled)] !shadow-none",
          )}
        />
      </span>
      {label != null ? <span>{label}</span> : null}
    </label>
  )
})

export { Toggle }
export type { ToggleProps }
