// PX code-system extension — not a Prism Figma component
//
// Token ownership fix (2026-08-04): this component previously referenced
// `--c-icon-button-*` tokens that were fully documented in ICON_BUTTON.md but
// never actually added to tokens/C_Default.tokens.json or generated into
// prism-generated.css. Since `color` is an inherited CSS property, every one
// of those undefined var() calls silently fell through to the ambient
// inherited text color (usually --s-color-text-default, neutral/900) instead
// of erroring — so every IconButton instance rendered in the wrong,
// always-neutral/900 color regardless of state.
//
// Fixed by using existing, verified-correct tokens instead of resurrecting
// the phantom component-token set: the real (Figma-sourced) --c-icon-color-*
// set for content colors where it has a matching state, falling back to the
// semantic --s-icon-color-*/--s-color-surface-* tier per the token-ownership
// priority order (component -> semantic -> primitive) where no component
// token exists (disabled content color; all background states; radius).
import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"

type IconButtonProps = {
  icon: PrismIconName
  label: string
  disabled?: boolean
  /**
   * Rendered glyph size. Defaults to 24 (the standard PX icon-button glyph).
   * Pass 16 where Figma binds icon/size/016 on a compact nav/stepper control
   * (e.g. the Date Filter fiscal-year nav and rolling-window stepper). The
   * 24px button box is unchanged — only the glyph scales.
   */
  iconSize?: 16 | 24
} & Omit<React.ComponentProps<"button">, "children" | "aria-label">

function IconButton({ icon, label, disabled, iconSize = 24, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center outline-none",
        "size-6 rounded-[var(--p-radius-100)]",
        "bg-[var(--s-color-surface-empty)]",
        "text-[var(--c-icon-color-default)]",
        "transition-colors",
        "hover:bg-[var(--s-color-surface-muted)]",
        "hover:text-[var(--c-icon-color-hover)]",
        "active:bg-[var(--s-color-surface-sunken)]",
        "active:text-[var(--c-icon-color-hover)]",
        "focus-visible:shadow-[var(--e-shadow-focus)]",
        "disabled:pointer-events-none",
        "disabled:bg-[var(--s-color-surface-empty)]",
        "disabled:text-[var(--s-icon-color-disabled)]",
        className
      )}
      {...props}
    >
      <PrismIcon name={icon} size={iconSize} sourceSize={24} decorative />
    </button>
  )
}

export { IconButton }
export type { IconButtonProps }
