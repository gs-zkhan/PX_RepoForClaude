import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"
import { PrismIcon } from "@/components/ui/prism-icon"
import type { PrismIconName } from "@/components/ui/prism-icon"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

// -----------------------------------------------------------------------------
// DashboardWidgetChartTypeSwitcher — Figma "Dashboard Widget Card" page
// (20:27), AI Instructions frame 4407:49309 (Accessibility row: "Chart-type
// switcher: use role=\"radiogroup\" with aria-label=\"Chart type\"").
//
// CORRECTED (2026-08-30, third time, per direct user correction with
// reference screenshots): a prior draft rendered every chart-type option as
// a separate, always-visible 24px icon button in the header row — that was
// wrong. The user supplied two real screenshots of the actual control:
// collapsed, it is a SINGLE trigger (the current type's icon + a small
// chevron, like a dropdown), and expanded, it opens a small popover panel
// listing 4 icon-only options in a vertical list, with the active one
// visually highlighted (tinted background, primary-blue icon) and the
// others neutral-gray. This is the authoritative visual evidence for this
// control's anatomy — it was not something available anywhere in the
// static Figma frames (see the two prior corrections in this file's own
// history: first a wrong two-icon assumption, then a wrong always-expanded
// multi-button assumption). The 4 example icons shown to us were: a
// scatter/connected-dots glyph, a bar-chart glyph, a line-chart glyph
// (shown as the active/selected one), and a "#"-style glyph. This repo has
// no dedicated "#"/hash icon — `icons/24/formula-number.svg` (a rounded
// square containing an "f" curve and a hash-like grid) is the closest
// existing Prism asset and is used as an approximation in the example
// only; this is flagged, not silently presented as an exact match.
//
// Architecture: a `Popover` (trigger + content, both already-approved,
// unmodified primitives — see src/components/ui/popover.tsx) wraps a
// `role="radiogroup"` (@radix-ui/react-radio-group, same as before) inside
// its content. The trigger itself is a single, ordinary disclosure button
// (not a radio) showing the active option's icon plus a chevron that flips
// between chevron-down (closed) and chevron-up (open) — this satisfies the
// screenshot's collapsed appearance while keeping the AI Instructions'
// role="radiogroup" requirement exactly where it always applied: the list
// of selectable options, once revealed. Selecting an option calls
// `onValueChange` and closes the popover (closing on selection matches the
// screenshot's implied interaction — a picker, not a persistent toggle
// row).
//
// Keyboard: the trigger is the single Tab stop for this control (same
// keyboard-order conclusion as before — trigger -> Filter -> Share ->
// Overflow — except now there is exactly one focusable element here
// instead of N radio items, which is simpler to reason about, not a
// regression). Once open, Arrow keys move roving focus between options
// (Radix RadioGroup, unchanged from the prior implementation) and
// Escape/selecting an option closes the popover, returning focus to the
// trigger (Radix Popover's own built-in behaviour, not custom-wired here).
//
// Tokens: no dedicated component tokens exist for this control anywhere in
// Figma (see the token-ownership note from the prior correction — still
// true, nothing new invented here). Active option: --s-color-action-primary-default
// (glyph colour) + --s-color-surface-selected (row background). Inactive:
// --s-color-text-subtlest (glyph colour only, transparent background).
// PopoverContent's border/background/radius/shadow come from the existing,
// unmodified Popover primitive (which itself composes Date Picker's panel
// tokens — an existing, pre-established cross-component reuse in this
// repo's own Popover implementation, not something introduced here).
//
// STATUS: APPROVED WITH DOCUMENTED EXCEPTION (2026-08-30), as part of
// Dashboard Widget Card's approval. Design owner completed visual review;
// the accepted exception is the 4th option's icon — `icons/24/formula-
// number.svg` is a design-owner-accepted approximation for a "#"/hash
// glyph this repo has no dedicated matching asset for, and must not be
// described as an exact Figma icon match. Everything else (trigger +
// popover anatomy, radiogroup semantics, keyboard behaviour) is approved
// as implemented. Visual Review: Approved. Approved for AI use: Yes.
// -----------------------------------------------------------------------------

type ChartTypeOption = {
  value: string
  /** Accessible name for this option — read by AT, not shown visually (icon-only control). */
  label: string
  icon: PrismIconName
}

type DashboardWidgetChartTypeSwitcherProps = {
  options: ChartTypeOption[]
  value: string
  onValueChange: (value: string) => void
  /** Accessible label for the radiogroup itself, e.g. "Chart type". Also used to build the trigger's own accessible name (combined with the active option's label). */
  "aria-label": string
  className?: string
}

function DashboardWidgetChartTypeSwitcher({
  options,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  className,
}: DashboardWidgetChartTypeSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const active = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={active ? `${ariaLabel}: ${active.label}` : ariaLabel}
          className={cn(
            "inline-flex items-center gap-[var(--p-space-050)] rounded-[var(--p-radius-100)] outline-none",
            "focus-visible:shadow-[var(--e-shadow-focus)]",
            className,
          )}
        >
          {active && (
            <PrismIcon
              name={active.icon}
              size={24}
              decorative
              className="text-[var(--s-color-action-primary-default)]"
            />
          )}
          <PrismIcon
            name={open ? "chevron-up" : "chevron-down"}
            size={16}
            decorative
            className="text-[var(--s-color-text-subtlest)]"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-[var(--p-space-050)]">
        <RadioGroupPrimitive.Root
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue)
            setOpen(false)
          }}
          aria-label={ariaLabel}
          className="flex flex-col gap-[var(--p-space-050)]"
        >
          {options.map((option) => {
            const isActive = option.value === value

            return (
              <RadioGroupPrimitive.Item
                key={option.value}
                value={option.value}
                aria-label={option.label}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-[var(--p-radius-100)] outline-none",
                  "focus-visible:shadow-[var(--e-shadow-focus)]",
                  isActive
                    ? "bg-[var(--s-color-surface-selected)]"
                    : "hover:bg-[var(--s-color-surface-muted)]",
                )}
              >
                <PrismIcon
                  name={option.icon}
                  size={24}
                  decorative
                  className={cn(
                    isActive
                      ? "text-[var(--s-color-action-primary-default)]"
                      : "text-[var(--s-color-text-subtlest)]",
                  )}
                />
              </RadioGroupPrimitive.Item>
            )
          })}
        </RadioGroupPrimitive.Root>
      </PopoverContent>
    </Popover>
  )
}

export { DashboardWidgetChartTypeSwitcher }
export type { DashboardWidgetChartTypeSwitcherProps, ChartTypeOption }
