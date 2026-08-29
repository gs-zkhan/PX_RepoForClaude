import * as React from "react"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Link — Figma "Link" page (20:15), defining symbol frame 4023:1437 (32
// variants: Size={Default,Small} × State={Default,Hover,Visited,Disabled} ×
// Icon={None,Right} × External={false,true}).
//
// Anatomy (per Link AI Instructions, node 9139:6328): a single inline text
// element, no container/background/border, hug-content width. Always
// renders as a real <a> — an intentionally disabled Link (see below) is the
// one case that renders an <a> without an href, since removing the element
// entirely would drop its text from the reading flow. Link is navigation
// only, never an action substitute (see "When NOT to use": don't use Link to
// submit forms, delete records, open modals, or as a standalone block-level
// CTA — use Button instead for all of those).
//
// States:
//   - Default: text → --c-link-color-default, no underline.
//   - Hover: text → --c-link-color-hover, underline (both together).
//   - Visited: browser-managed, text → --c-link-color-visited. Implemented
//     via the native CSS :visited pseudo-class (Tailwind `visited:`) rather
//     than a prop — Figma's own AI Instructions say this is "browser-
//     managed" and warn against manually setting it ("don't rely on colour
//     alone... shouldn't manually set visited colour unless the destination
//     is known to have been viewed"). No prop exists to fake it.
//   - Disabled: explicit `disabled` prop (not CSS-only) — text →
//     --c-link-color-disabled, aria-disabled="true", tabIndex={-1}, and the
//     href is stripped so an assistive-tech user or stray click cannot
//     navigate through a visually-muted link (Figma explicitly warns: "do
//     not use cursor:not-allowed alone — the colour change must also be
//     present").
//
// Icon=Right (optional): icons/24/link, 0px gap after the label, fill is
// state-invariant (--s-icon-color-default). Per Dos/Don'ts, intended for
// Default size only — Small size links should omit it or use the external
// indicator instead; this is documented guidance, not a hard-coded
// constraint, since Figma does not describe a technical reason to block it.
//
// External (optional, independent of Icon): icons/16/arrow-right rotated
// 180°, fill tracks the link's own text colour per state. When true, also
// applies target="_blank" + rel="noopener noreferrer" and, since the link
// text alone rarely conveys "opens in a new tab" to screen-reader users,
// requires the caller to supply an aria-label that says so (see
// Accessibility below) — this component does not silently inject one,
// since only the caller knows the destination.
//
// Accessibility (node 9139:6363): always <a href>, never <span>/<div> with
// onClick. Focus ring 2px using --e-shadow-focus (this repo's existing
// focus-ring token, equivalent to Figma's "color/action/primary/default"
// outline). Use `aria-label` when the link text alone isn't descriptive.
//
// STATUS: Visual Review: Approved. Approved for AI use: Yes. Approval date:
// 2026-08-29 — design-owner visually verified as part of a 4-item review
// batch (Link, Divider, Button Bulk Action, Button Primary-Split). See
// ai/figma-coverage.json (id component-link).
// -----------------------------------------------------------------------------

type LinkSize = "default" | "small"

// `target`/`rel`/`tabIndex`/`aria-disabled` are excluded at the type level —
// they are invariants this component owns (disabled state, external-link
// security relationship), not caller-configurable passthrough. This is
// enforced again at render time below, since a non-TS caller could still
// spread an object containing these keys.
type LinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "target" | "rel" | "tabIndex" | "aria-disabled"
> & {
  size?: LinkSize
  /** Appends icons/24/link after the label. Intended for `size="default"` only. */
  icon?: boolean
  /**
   * Appends a rotated icons/16/arrow-right after the label and applies
   * target="_blank" rel="noopener noreferrer". Caller must ensure the
   * accessible name communicates that the link opens in a new tab (e.g.
   * via `aria-label`) — see the component header comment.
   */
  external?: boolean
  /**
   * Explicit disabled state — distinct from simply omitting `href`. Strips
   * the href, sets aria-disabled and tabIndex=-1, and applies the disabled
   * colour token. Always pair with a visible explanation (tooltip or
   * adjacent text) per Figma's Dos/Don'ts ("don't disable a link without
   * explanation").
   */
  disabled?: boolean
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { size = "default", icon = false, external = false, disabled = false, className, children, href, ...props },
  ref,
) {
  const iconSize = size === "default" ? 24 : 16

  return (
    <a
      {...props}
      ref={ref}
      data-slot="link"
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      target={external && !disabled ? "_blank" : undefined}
      rel={external && !disabled ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex items-center gap-[var(--p-space-050)] outline-none",
        size === "default"
          ? "text-[length:var(--p-font-size-medium)] leading-[var(--p-font-line-height-medium)]"
          : "text-[length:var(--p-font-size-small)] leading-[var(--p-font-line-height-small)]",
        "font-[number:var(--p-font-weight-regular)]",
        disabled
          ? "pointer-events-none text-[var(--c-link-color-disabled)]"
          : [
              "text-[var(--c-link-color-default)]",
              "visited:text-[var(--c-link-color-visited)]",
              "hover:text-[var(--c-link-color-hover)] hover:underline",
            ].join(" "),
        "focus-visible:shadow-[var(--e-shadow-focus)]",
        className,
      )}
    >
      {children}
      {icon && <PrismIcon name="link" size={iconSize} decorative />}
      {external && <PrismIcon name="arrow-right" size={16} className="rotate-180" decorative />}
    </a>
  )
})

export { Link }
export type { LinkProps }
