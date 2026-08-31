import * as React from "react"

import { cn } from "@/lib/utils"
import { checkerBackground } from "@/lib/color"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { ColorPickerBasic, COLOR_FAMILIES, type BasicColorValue } from "@/components/ui/color-picker-basic"
import {
  ColorPickerAdvanced,
  type ColorPickerAdvancedValue,
  type ColorPreset,
} from "@/components/ui/color-picker-advanced"

// -----------------------------------------------------------------------------
// ColorPicker — Figma "Color Picker" page (1273:11). THIS is the recommended
// public component (CORRECTED 2026-08-31, per direct instruction — prior
// docs implied Basic/Advanced were usable standalone production components;
// they are not). Figma's own Dos/Don'ts are explicit and treated as a hard
// rule, not a suggestion: "Don't show the picker without a trigger
// element... Always attach Color Picker to a swatch trigger or input... The
// trigger swatch must update immediately on selection." `ColorPicker`
// composes the existing, unmodified `Popover` with either `ColorPickerBasic`
// or `ColorPickerAdvanced` as the panel content, and is the only
// consumer-facing way this component ships.
//
// `ColorPickerBasic`/`ColorPickerAdvanced` remain separately exported, but
// ONLY as internal/compositional implementation modules — for (a) building
// `ColorPicker` itself, and (b) clearly-labelled review/anatomy inspection
// in the Validation Gallery (not as an example of recommended production
// usage). Do not compose them directly into product screens without an
// anchoring trigger.
//
// Close-on-select (RESOLVED 2026-08-31, per direct instruction — "confirm
// from Figma... do not guess"): Figma's AI Instructions describe the
// Basic/Advanced behaviours ("clicking a swatch fires onColorSelect...",
// "canvas drag updates HEX/RGB fields in real time...") but do NOT state
// whether selecting a Basic swatch closes the popover — this was checked
// directly in the AI Instructions' Behaviour and Dos/Don'ts rows and is
// genuinely absent, not overlooked. Since there is no Figma evidence either
// way, the implemented default follows this repo's own established
// precedent for an equivalent single-discrete-choice popover control
// (`DashboardWidgetChartTypeSwitcher`, which closes on selection): Basic
// mode closes the popover on swatch selection, because a swatch pick is one
// complete, discrete action, matching Select/Dropdown-style patterns.
// Advanced mode never auto-closes, because it is continuous adjustment
// (canvas drag, sliders) where closing on the first interaction would make
// the panel unusable — the user closes it themselves (click outside,
// Escape, or the trigger). This is a documented decision under
// design-owner-visible evidence gaps, not a silent guess.
// DESIGN-OWNER APPROVED (2026-08-31): the design owner reviewed and
// approved this Basic-closes/Advanced-stays-open behaviour as part of the
// full Color Picker approval — it is no longer an open evidence gap
// awaiting confirmation, though the reasoning above (Figma is silent;
// resolved via this repo's own precedent) remains the record of how the
// decision was reached.
//
// `mode="basic" | "advanced"` selects which panel renders, per the AI
// Instructions' own guidance (Basic for a constrained brand palette,
// Advanced for arbitrary colour).
//
// Controlled value only — no internal fallback/uncontrolled state, matching
// this repo's Select/RadioGroup precedent. Basic mode's value is a
// `BasicColorValue` (family+shade+token); Advanced mode's value is a
// `ColorPickerAdvancedValue` (hex+alpha) — deliberately different shapes,
// since a family/shade selection and an arbitrary hex+alpha are not the
// same kind of data.
//
// Accessibility: trigger is a real <button> with an accessible name
// (`aria-label` composed from the current value, or a caller-supplied
// fallback) and `aria-haspopup`/`aria-expanded` (via Popover's own,
// unmodified Radix wiring). Escape closes and returns focus to the trigger
// (Radix Popover's built-in behaviour, not custom-wired here).
//
// Trigger visual (CORRECTED, design-owner visual pass): a prior draft drew
// the current-colour preview as a small 16×16 dot (--c-colorpicker-swatch-
// size) centred inside the 24×24 button, with the button's own neutral
// border+background visible as a ring all the way around it — this reads as
// a radio input, not a colour swatch. The colour now fills the ENTIRE
// 24×24 circle via an absolutely-positioned `inset-0` layer (clipped to a
// circle by its own `rounded-full`, not by an ancestor's `overflow-hidden`
// — which would risk clipping the focus-visible shadow if applied to the
// button itself). The 1px neutral border on the button remains only as a
// thin edge-definition ring sitting AT the circle's true outer edge (so the
// colour still reaches the edge cleanly) and as the empty-state indicator:
// when Basic mode has no value yet, no colour layer is rendered at all and
// the bare bordered circle is shown, so "nothing selected" is visually
// distinct from "a real grey/neutral colour is selected" rather than one
// grey fill standing in for both. Advanced mode always has a concrete
// hex+alpha, so it always renders a colour layer. For alpha, a checkerboard
// layer (the exact same recipe as the Advanced panel's own alpha
// indicators, imported from src/lib/color.ts's `checkerBackground` rather
// than a second copy) sits BEHIND the colour layer; `swatchStyle`'s opacity
// is applied only to the colour layer itself, never to the button, its
// border, or its focus-visible shadow.
//
// Popover surface ownership (CORRECTED, design-owner visual pass): the
// shared `PopoverContent` defaults to a DIFFERENT component's tokens
// (`--c-datepicker-panel-*`) as a generic fallback — a real, if minor,
// cross-component token borrow for this consumer. Both modes now override
// `PopoverContent`'s radius/border/background to the Color Picker's own
// tokens (`--c-colorpicker-radius`/`-border`/`-background`), per this
// repo's token-ownership rule (never permanently borrow another
// component's token). For Basic, `PopoverContent` remains the sole visual
// surface exactly as before (`ColorPickerBasic` has no chrome of its own,
// so there was never a doubling risk there) — only its token source
// changed. For Advanced, `PopoverContent` previously kept its own
// padding/background/radius/border WHILE `ColorPickerAdvanced` also drew
// its own competing border/background/radius one padding-step further in —
// a double, nested "card" look, and the reason the canvas's square top
// corners could poke through: the INNER box's own rounded corners were
// never being respected because it wasn't the element `overflow-hidden`
// was needed on (see color-picker-advanced.tsx's own header comment for
// that half of the fix). `PopoverContent` now carries zero padding for
// Advanced (so the canvas sits flush against ITS rounded top corners,
// clipped by `PopoverContent`'s own `overflow-hidden`), and
// `ColorPickerAdvanced`'s own border/background/radius/padding are fully
// stripped when embedded this way (`rounded-none border-0 bg-transparent
// p-0`) — so exactly ONE visible rounded surface exists per popover, never
// two.
//
// STATUS: implemented against Figma evidence, design-owner reviewed and
// APPROVED. Visual Review: Approved. Approved for AI use: Yes. Approval
// date: 2026-08-31. See ai/figma-coverage.json (id component-color-picker:
// status Approved, designOwnerApproval.approved: true) for the full
// evidence trail, including the frame-geometry-over-prose reconciliations
// (8px column gap, slider track size) and the HSV-behind-"HSL canvas"
// naming — both preserved as the governing rationale, unchanged by
// approval.
// -----------------------------------------------------------------------------

type ColorPickerBasicMode = {
  mode: "basic"
  value: BasicColorValue | null
  onValueChange: (value: BasicColorValue) => void
}

type ColorPickerAdvancedMode = {
  mode: "advanced"
  value: ColorPickerAdvancedValue
  onValueChange: (value: ColorPickerAdvancedValue) => void
  presets?: ColorPreset[]
}

type ColorPickerProps = (ColorPickerBasicMode | ColorPickerAdvancedMode) & {
  /** Accessible name for the trigger when no value is selected yet. */
  triggerLabel?: string
  className?: string
}

// CORRECTED 2026-08-31: the trigger's accessible name previously interpolated
// `value.family` directly — the internal camelCase implementation key (e.g.
// "royalBlue"), not a human-readable name. Screen-reader users would have
// heard "Label colour: royalBlue 700" instead of "Label colour: Royal Blue
// 700". This lookup reuses `COLOR_FAMILIES`' existing `label` field (already
// used for the swatch grid's own aria-labels in color-picker-basic.tsx) so
// there is a single source of truth for the human-readable family name — no
// second, divergent copy of the family list. The serialized `family`/`token`
// identity on `BasicColorValue` itself is untouched; only the trigger's
// spoken name is humanized.
const FAMILY_LABELS: Record<BasicColorValue["family"], string> = Object.fromEntries(
  COLOR_FAMILIES.map((f) => [f.key, f.label]),
) as Record<BasicColorValue["family"], string>

function swatchStyle(props: ColorPickerProps): React.CSSProperties {
  if (props.mode === "basic") {
    return props.value ? { backgroundColor: props.value.cssVar } : {}
  }
  return { backgroundColor: props.value.hex, opacity: props.value.alpha / 100 }
}

// CORRECTED (design-owner visual pass): whether the trigger currently has a
// colour to show at all. Basic mode can be genuinely unset (`value === null`
// — nothing chosen yet); Advanced mode always carries a concrete hex+alpha,
// so it always has a colour to render. Used to decide whether to render the
// colour-fill layer at all, versus leaving the trigger in its neutral/empty
// chrome (a bare bordered circle) — this is what keeps "nothing selected
// yet" visually distinct from "a real grey/neutral colour is selected",
// rather than a filled grey circle silently standing in for "no colour".
function hasSelectedColour(props: ColorPickerProps): boolean {
  return props.mode === "advanced" || props.value !== null
}

function triggerAccessibleName(props: ColorPickerProps): string {
  if (props.mode === "basic") {
    return props.value
      ? `${props.triggerLabel ?? "Colour"}: ${FAMILY_LABELS[props.value.family]} ${props.value.shade}`
      : `${props.triggerLabel ?? "Colour"}: none selected`
  }
  return `${props.triggerLabel ?? "Colour"}: ${props.value.hex}, ${props.value.alpha}% opacity`
}

function ColorPicker(props: ColorPickerProps) {
  const [open, setOpen] = React.useState(false)
  const hasColour = hasSelectedColour(props)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={triggerAccessibleName(props)}
          className={cn(
            "relative inline-flex size-[var(--p-icon-size-024)] shrink-0 items-center justify-center rounded-full border outline-none",
            "border-[var(--c-colorpicker-border)] bg-[var(--s-color-surface-default)]",
            "focus-visible:shadow-[var(--e-shadow-focus)]",
            props.className,
          )}
        >
          {hasColour && (
            <>
              {/* Checkerboard shows through wherever the colour layer above it is
                  translucent (Advanced only — Basic swatches never carry alpha). */}
              {props.mode === "advanced" && (
                <span aria-hidden="true" className="absolute inset-0 rounded-full" style={checkerBackground()} />
              )}
              {/* The full circle IS the colour — inset-0 fills the trigger's
                  entire content box (inside the 1px border), no smaller inner
                  dot. Opacity is scoped to this layer alone (via swatchStyle),
                  never to the button/focus ring/accessible control. */}
              <span aria-hidden="true" className="absolute inset-0 rounded-full" style={swatchStyle(props)} />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          "rounded-[var(--c-colorpicker-radius)] border-[var(--c-colorpicker-border)] bg-[var(--c-colorpicker-background)]",
          props.mode === "basic" ? "p-[var(--c-colorpicker-padding)]" : "p-0",
        )}
      >
        {props.mode === "basic" ? (
          <ColorPickerBasic
            value={props.value}
            onValueChange={(next) => {
              props.onValueChange(next)
              setOpen(false)
            }}
          />
        ) : (
          <ColorPickerAdvanced
            value={props.value}
            onValueChange={props.onValueChange}
            presets={props.presets}
            className="w-auto rounded-none border-0 bg-transparent p-0"
          />
        )}
      </PopoverContent>
    </Popover>
  )
}

export { ColorPicker }
export type { ColorPickerProps }
