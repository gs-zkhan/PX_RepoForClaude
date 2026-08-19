import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// InputNumber — Figma "Input Number" (node 1047:6, Prism V1 - ShadCN).
//
// Fixed 88x32 numeric input with stacked up/down chevron steppers. Three
// zones inside a single rounded frame (radius/050): 60px value zone +
// 1px vertical divider + 26px stepper zone. Chevrons render at 12x12
// inside 26x15 button zones (rendered from 16px source with sourceSize).
//
// Not a form field on its own — has no visible label. Wrap in FormField
// when used inside a form (Figma's own rule; FormField itself isn't built
// in this repo yet, so callers currently pair with a plain <label>).
//
// Bounds are caller-owned: always pass min/max/step. Component clamps to
// [min, max] on stepper click and on blur — never on every keystroke, so
// typing intermediate invalid values (e.g. "1" while heading to "10") is
// still possible.
// -----------------------------------------------------------------------------

type InputNumberProps = {
  value: number
  onValueChange: (value: number) => void
  min: number
  max: number
  step?: number
  disabled?: boolean
  ariaLabel?: string
  id?: string
  className?: string
}

function InputNumber({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  disabled = false,
  ariaLabel,
  id,
  className,
}: InputNumberProps) {
  const [draft, setDraft] = React.useState(String(value))

  // Sync draft when the controlled value changes from outside
  React.useEffect(() => {
    setDraft(String(value))
  }, [value])

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const commit = () => {
    const parsed = Number(draft)
    if (Number.isFinite(parsed)) {
      const next = clamp(parsed)
      onValueChange(next)
      setDraft(String(next))
    } else {
      setDraft(String(value))
    }
  }

  const increment = () => onValueChange(clamp(value + step))
  const decrement = () => onValueChange(clamp(value - step))

  return (
    <div
      className={cn(
        "group inline-flex h-8 min-w-[88px] items-stretch overflow-hidden rounded-[var(--p-radius-050)] border",
        "border-[var(--s-color-line-default)] bg-[var(--s-color-surface-default)]",
        !disabled &&
          "hover:border-[var(--s-color-action-primary-default)] focus-within:border-[var(--s-color-action-primary-default)]",
        disabled && "bg-[var(--s-color-surface-muted)]",
        className,
      )}
    >
      <input
        id={id}
        type="number"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") commit()
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "min-w-0 flex-1 bg-transparent px-[var(--p-space-100)] outline-none",
          "text-[length:var(--t-inputnumber-font-size)] leading-[var(--t-inputnumber-font-line-height)]",
          disabled
            ? "text-[var(--s-color-text-disabled)]"
            : "text-[var(--s-color-text-default)]",
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        )}
      />
      <div
        aria-hidden="true"
        className="w-px shrink-0 self-stretch bg-[var(--s-color-line-default)]"
      />
      <div className="flex w-[26px] shrink-0 flex-col">
        <StepButton
          direction="up"
          disabled={disabled || value >= max}
          onClick={increment}
        />
        <div aria-hidden="true" className="h-px w-full bg-[var(--s-color-line-default)]" />
        <StepButton
          direction="down"
          disabled={disabled || value <= min}
          onClick={decrement}
        />
      </div>
    </div>
  )
}

function StepButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "up" | "down"
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={direction === "up" ? "Increase value" : "Decrease value"}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex flex-1 items-center justify-center outline-none",
        "text-[var(--s-icon-color-default)]",
        !disabled && "hover:bg-[var(--s-color-surface-muted)] hover:text-[var(--s-color-text-default)]",
        disabled && "cursor-not-allowed text-[var(--s-icon-color-disabled)]",
      )}
    >
      <PrismIcon
        name={direction === "up" ? "chevron-up" : "chevron-down"}
        size={12}
        sourceSize={16}
        decorative
      />
    </button>
  )
}

export { InputNumber }
export type { InputNumberProps }
