import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// EmptyState — Figma "empty-state" (node 3323:14896, Prism V1 - ShadCN).
//
// Only the layout/typography/button anatomy is built from verified Figma
// metadata. The illustration itself is a caller-supplied slot: the Figma file
// defines 17 illustration types x 5 sizes, but this repo's asset library has
// no illustration SVGs yet (only line/filled icon sets exist) — per explicit
// direction, only "No Data Found" (src/assets/illustrations/no-data-found.svg,
// exported at the Medium/80px reference size) has been extracted so far. The
// remaining 16 types are intentionally deferred — see
// project_pending_exceptions.md. Pass any illustration via the `illustration`
// prop; it is rendered at a fixed size box matching the Figma spec for the
// chosen `size`.
//
// Sizes control illustration box (64/80/120/144) and CTA Button `size`
// (small/medium/large/large) — verified 1:1 against Button's own height
// tokens (24/28/32/32px) matching each Figma instance's button height exactly.
// Orientation: "portrait" centers everything in a vertical stack (DEFAULT);
// "landscape" places the illustration to the left of a left-aligned text
// column — verified via metadata x/y coordinates, not assumed.
// -----------------------------------------------------------------------------

type EmptyStateSize = "small" | "medium" | "large" | "xlarge"
type EmptyStateOrientation = "portrait" | "landscape"

const ILLUSTRATION_SIZE: Record<EmptyStateSize, number> = {
  small: 64,
  medium: 80,
  large: 120,
  xlarge: 144,
}

const BUTTON_SIZE: Record<EmptyStateSize, "small" | "medium" | "large"> = {
  small: "small",
  medium: "medium",
  large: "large",
  xlarge: "large",
}

// Verified per-size via get_variable_defs (Small 3323:14917, Medium 3323:14907,
// Large 3323:14897, XLarge 7603:296). Title/body typography differs per size —
// this is NOT uniform, previously mistakenly hardcoded across all sizes.
const TITLE_FONT: Record<EmptyStateSize, string> = {
  small:
    "text-[length:var(--t-font-heading-xsmall-size)] font-[number:var(--t-font-heading-xsmall-weight)] leading-[var(--t-font-heading-xsmall-line-height)]",
  medium:
    "text-[length:var(--t-font-heading-small-size)] font-[number:var(--t-font-heading-small-weight)] leading-[var(--t-font-heading-small-line-height)]",
  large:
    "text-[length:var(--t-font-heading-medium-size)] font-[number:var(--t-font-heading-medium-weight)] leading-[var(--t-font-heading-medium-line-height)]",
  xlarge:
    "text-[length:var(--t-font-heading-medium-size)] font-[number:var(--t-font-heading-medium-weight)] leading-[var(--t-font-heading-medium-line-height)]",
}

const BODY_FONT: Record<EmptyStateSize, string> = {
  small:
    "text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)]",
  medium:
    "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
  large:
    "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
  xlarge:
    "text-[length:var(--t-font-body-medium-size)] leading-[var(--t-font-body-medium-line-height)]",
}

const TEXT_TO_ACTIONS_GAP: Record<EmptyStateSize, string> = {
  small: "var(--p-space-200)",
  medium: "var(--p-space-300)",
  large: "var(--p-space-300)",
  xlarge: "var(--p-space-300)",
}

type EmptyStateAction = {
  label: string
  onClick: () => void
}

type EmptyStateProps = {
  size?: EmptyStateSize
  orientation?: EmptyStateOrientation
  illustration?: React.ReactNode
  title: string
  description: string
  primaryAction?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  className?: string
}

function EmptyState({
  size = "medium",
  orientation = "portrait",
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const illustrationPx = ILLUSTRATION_SIZE[size]
  const buttonSize = BUTTON_SIZE[size]
  const isPortrait = orientation === "portrait"

  return (
    <div
      className={cn(
        "flex items-center gap-[var(--p-space-300)]",
        isPortrait ? "flex-col text-center" : "flex-row items-start text-left",
        className
      )}
    >
      {illustration ? (
        <div
          className="flex shrink-0 items-center justify-center"
          style={{ width: illustrationPx, height: illustrationPx }}
        >
          {illustration}
        </div>
      ) : null}

      <div
        className={cn(
          "flex min-w-0 flex-col",
          isPortrait ? "items-center" : "items-start"
        )}
        style={{ gap: TEXT_TO_ACTIONS_GAP[size] }}
      >
        <div className="flex flex-col">
          <p className={cn(TITLE_FONT[size], "text-[var(--s-color-text-default)]")}>
            {title}
          </p>
          <p className={cn(BODY_FONT[size], "text-[var(--s-color-text-subtlest)]")}>
            {description}
          </p>
        </div>

        {primaryAction || secondaryAction ? (
          <div className="flex items-center gap-[var(--p-space-200)]">
            {secondaryAction ? (
              <Button variant="secondary" size={buttonSize} onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ) : null}
            {primaryAction ? (
              <Button variant="primary" size={buttonSize} onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps, EmptyStateSize, EmptyStateOrientation, EmptyStateAction }
