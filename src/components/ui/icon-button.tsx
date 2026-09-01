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
//
// forwardRef added (2026-08-29) so PxAnalyticsSecondaryNav's collapse/expand
// control can move DOM focus to the counterpart button on toggle — purely
// additive, no existing consumer passes a ref today.
//
// Toolbar appearance added (2026-08-31, design-owner approved reconciliation
// of Figma AI draft "AI Draft — Shared Primitive Improvements — 2026-08-31",
// component set 9638:50289 — the appearance/states/badge-API-shape items
// only, per the design owner's explicit approval; the draft itself remains
// unpublished/unapproved as a whole):
//
//   appearance="default" (omitted = this) — UNCHANGED. Still the original
//   24x24 box, radius/100, `iconSize` 16|24. Every existing consumer above
//   (Dismiss/Close buttons, PxAnalyticsSecondaryNav's collapse/expand, etc.)
//   defaults here and is byte-for-byte unaffected.
//
//   appearance="toolbar" — NEW, additive only. 32x32 box, radius/075 (6px),
//   fixed 24x24 glyph (no `iconSize` choice — Figma's draft evidences
//   exactly one size for this appearance, not a configurable one). Adds
//   `pressed` (real `aria-pressed`, Figma's Pressed/Selected state) and
//   `badge` (a generic `React.ReactNode` overlay, positioned at the
//   evidenced `right-0 top-[-2px]` anchor — get_design_context on
//   9638:50325/9638:50353/9638:50519, all identical). These two props are a
//   discriminated union with appearance="default", not optional fields on a
//   single flat type: Figma's own draft scopes Pressed/Badge to the Toolbar
//   appearance only (its generated conditionals explicitly gate on
//   `appearance === "Toolbar"` even though "Toolbar" is the only value that
//   exists today), so `pressed`/`badge` are a compile-time error on
//   appearance="default" rather than a silently-accepted, semantically
//   meaningless prop on a Dismiss/Close button.
//
//   Badge API shape is deliberately `badge?: React.ReactNode` (undefined =
//   no badge), NOT Figma's own two-property `Show badge` (boolean) + `Badge`
//   (instance swap) pair — that pair permits an invalid runtime combination
//   (showBadge=true with no badge instance; Figma's own codegen has to
//   invent a fallback dot to cover exactly this case) that a single prop
//   makes structurally impossible.
//
//   No badge geometry exists on appearance="default": Figma's draft only
//   ever renders a badge on the 32x32 Toolbar box, so `badge` is not part of
//   IconButtonDefaultProps at all — this repo does not invent an offset for
//   the 24x24 box that no Figma evidence supports (see NotificationBell,
//   which is intentionally unchanged for the same reason).
//
//   Focus state: the Toolbar appearance uses the SAME `--e-shadow-focus`
//   token every other interactive component in this repo already uses
//   (Button, this component's own Default appearance, AlignmentPicker's
//   trigger, etc.), not a new hardcoded 2px solid border — the Figma draft's
//   raw codegen shows a literal `border-2 border-[#0369e9]`, but inventing a
//   new local visual treatment solely to match a still-unapproved draft's
//   exact pixels would be a real regression of RTE Field's own
//   already-approved focus behaviour, not a required part of what was
//   approved (Default/Hover/Pressed/Disabled visuals, which already matched
//   RTE's prior private ToolbarButton exactly). `--e-shadow-focus` already
//   satisfies the same semantic requirement (a visible, primary-coloured
//   focus indicator) without a raw, undocumented value.
import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName, PrismIconStyle } from "@/components/ui/prism-icon"

type IconButtonSharedProps = {
  icon: PrismIconName
  label: string
  disabled?: boolean
  /**
   * "line" (default, unchanged) or "filled" — passed straight through to
   * PrismIcon. Needed for icons that are only published in the filled set,
   * e.g. PxAnalyticsSecondaryNav's collapse/expand chevrons
   * (icons/filled/chevron-leftmenu-collapse-filled / -expand-filled, Figma
   * node 491:83), which bake in their own fixed colour (matching this
   * repo's existing filled-icon precedent — success/warning/danger/
   * information-filled all do the same). Every existing consumer omits
   * this and is unaffected.
   */
  iconStyle?: PrismIconStyle
} & Omit<React.ComponentProps<"button">, "children" | "aria-label">

type IconButtonDefaultProps = IconButtonSharedProps & {
  appearance?: "default"
  /**
   * Rendered glyph size. Defaults to 24 (the standard PX icon-button glyph).
   * Pass 16 where Figma binds icon/size/016 on a compact nav/stepper control
   * (e.g. the Date Filter fiscal-year nav and rolling-window stepper). The
   * 24px button box is unchanged — only the glyph scales. Toolbar-appearance
   * only, N/A on appearance="toolbar" (fixed 24px there).
   */
  iconSize?: 16 | 24
}

type IconButtonToolbarProps = IconButtonSharedProps & {
  appearance: "toolbar"
  /**
   * Toggle/selected state for toolbar controls that have one (Bold, Italic,
   * Underline, Alignment...). Sets real `aria-pressed`. Non-toggle toolbar
   * controls (Link, Attachment, Clear formatting) simply omit this — per
   * Figma's own draft instructions: "For non-toggle toolbar buttons... use
   * Default -> Hover -> Focus only."
   */
  pressed?: boolean
  /**
   * Generic badge overlay — see the file header for why this is a single
   * `ReactNode` rather than Figma's own boolean+instance-swap pair.
   * Positioned at the evidenced `right-0 top-[-2px]` anchor for this
   * appearance's 32x32 box. Omit for no badge.
   */
  badge?: React.ReactNode
}

type IconButtonProps = IconButtonDefaultProps | IconButtonToolbarProps

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(props, ref) {
  if (props.appearance === "toolbar") {
    const { icon, label, disabled, iconStyle = "line", pressed, badge, className, appearance, ...buttonProps } = props
    void appearance // discriminant only — not a valid DOM attribute, must not spread onto <button>
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        disabled={disabled}
        className={cn(
          "relative inline-flex size-8 items-center justify-center rounded-[var(--p-radius-075)] outline-none",
          "focus-visible:shadow-[var(--e-shadow-focus)]",
          "disabled:pointer-events-none disabled:opacity-40",
          pressed ? "bg-[var(--s-color-surface-muted)]" : "hover:bg-[var(--s-color-surface-muted)]",
          className,
        )}
        {...buttonProps}
      >
        <PrismIcon name={icon} size={24} sourceSize={24} iconStyle={iconStyle} decorative />
        {badge && <span className="absolute right-0 top-[-2px]">{badge}</span>}
      </button>
    )
  }

  const { icon, label, disabled, iconSize = 24, iconStyle = "line", className, appearance, ...buttonProps } = props
  void appearance // discriminant only — not a valid DOM attribute, must not spread onto <button>
  return (
    <button
      ref={ref}
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
      {...buttonProps}
    >
      <PrismIcon name={icon} size={iconSize} sourceSize={24} iconStyle={iconStyle} decorative />
    </button>
  )
})

export { IconButton }
export type { IconButtonProps, IconButtonDefaultProps, IconButtonToolbarProps }
