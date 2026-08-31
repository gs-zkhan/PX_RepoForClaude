import * as React from "react"

import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// ColorPickerBasic — Figma "Color Picker" page (1273:11), Variant=Basic
// (symbol 2587:2) and Variant=Basic-Hover (symbol 2587:95).
//
// INTERNAL/COMPOSITIONAL MODULE (CORRECTED 2026-08-31, per direct
// instruction): Figma's Dos/Don'ts explicitly require the picker to be
// anchored to a trigger ("Don't show the picker without a trigger
// element"). This component is NOT a recommended standalone
// consumer-facing component — the anchored `ColorPicker`
// (src/components/ui/color-picker.tsx) is the public API. This module
// remains separately exported only for (a) composition inside
// `ColorPicker`'s popover content, and (b) review/anatomy inspection in
// the Validation Gallery, clearly labelled as such, not as an example of
// recommended usage.
//
// Evidence-verified anatomy (get_metadata + get_variable_defs, not assumed):
//   7 families × 6 shades = 42 swatches, columns in this exact order —
//   tartRed, honeyAmber, freshGreen, royalBlue, pacificBlue, purple, neutral
//   — rows top-to-bottom 300/400/500/600/700/800. Each swatch hit-target
//   frame is 24×24 (confirmed by frame bounds, matches --p-icon-size-024);
//   the visible dot is a 16×16 circle centred inside it (confirmed by
//   screenshot — dots render round, not the 24×24 square hit-target;
//   16px matches --c-colorpicker-swatch-size). Column x-positions (0, 32,
//   64, 96, 128, 160, 192) show an 8px gap between the 24px hit-targets
//   (--p-space-100) — this CONTRADICTS the AI Instructions prose ("Column
//   gap = 0px, columns are flush"); the direct frame-coordinate evidence
//   is trusted here, per this repo's established practice of preferring
//   direct measurement over summarized prose when the two disagree.
//
// "Basic-Hover" naming (RESOLVED via evidence, not assumed): despite the
// variant name, the AI Instructions' own section title calls this "Selected
// state (Basic-Hover)" and describes a persistent 2px ring
// (colorpicker/swatch/selected = color/line/bold) on ONE swatch — this is
// SELECTION, not a transient mouse-hover preview. Figma defines no separate
// true-hover variant, and — CORRECTED 2026-08-31 — no scale/transform
// interaction of any kind is evidenced anywhere in the file. A prior draft
// added an invented `hover:scale-110` cue; removed. The button retains
// only the normal pointer-affordance and `focus-visible` treatment; the
// persistent selection ring remains the sole selection indicator (a
// border, not colour alone). Ring width uses the existing primitive
// `--p-border-width-200` (2px) — no component-level colorpicker border-width
// token exists for this ring (only `--c-colorpicker-swatch-selected` for its
// colour), so the primitive is the correct layer per this repo's token
// priority order; confirmed present in src/styles/prism-generated.css, not
// invented.
//
// Fill values use the existing generated primitive tokens directly
// (--p-color-<family>-<shade>) — verified via get_variable_defs that every
// one of the 42 Figma hex values matches this repo's already-generated
// tokens exactly (e.g. Figma color/royalBlue/700 #0369e9 ==
// --p-color-royal-blue-700). No new tokens invented; no --c-colorpicker-*
// token exists for swatch fill itself, only for the selection ring
// (--c-colorpicker-swatch-selected).
//
// Accessibility: grid is `role="listbox"` `aria-label="Color palette"` (per
// AI Instructions); each swatch is `role="option"` `aria-label="{Family}
// {shade}"` `aria-selected`. A single roving tabIndex covers the whole grid.
//
// Keyboard matrix (CORRECTED 2026-08-31 — the prior version could jump rows
// at family/shade boundaries, e.g. Right from the last family landing on
// whatever index the +6 arithmetic clamped to, in a different shade row).
// Figma specifies no wrapping behaviour anywhere, so every boundary case
// below holds position rather than moving:
//   Right: next family, SAME shade row. At the last family (neutral), stays
//     on the same cell.
//   Left: previous family, SAME shade row. At the first family (tartRed),
//     stays on the same cell.
//   Down: next shade, SAME family column. At the last shade (800), stays.
//   Up: previous shade, SAME family column. At the first shade (300), stays.
//   Home/End: Figma does not document a boundary-vs-whole-grid distinction.
//     This grid uses `role="listbox"`, not `role="grid"` — per the WAI-ARIA
//     Authoring Practices, a listbox's Home/End move to the first/last
//     OPTION IN THE WHOLE LIST, not a row boundary (there is no "row"
//     concept in listbox semantics, only the visual grid layout). Home ->
//     Tart Red 300 (index 0), End -> Neutral 800 (index 41).
//   Enter/Space: select the focused swatch.
//
// Roving tab-stop sync: the tab-entry point tracks the CONTROLLED `value`
// whenever it changes externally (e.g. a parent resets the colour
// programmatically) — recomputed from `value` on every change without
// calling `.focus()`, so an external update repositions where Tab will
// land without stealing focus from whatever currently has it.
//
// STATUS: implemented against Figma evidence, design-owner reviewed and
// APPROVED (as part of the anchored `ColorPicker`'s full approval — this
// module itself remains internal/compositional and anatomy-only, not a
// standalone-approved component; see color-picker.tsx). Visual Review:
// Approved. Approved for AI use: Yes. Approval date: 2026-08-31.
// -----------------------------------------------------------------------------

const COLOR_FAMILIES = [
  { key: "tartRed", cssName: "tart-red", label: "Tart Red" },
  { key: "honeyAmber", cssName: "honey-amber", label: "Honey Amber" },
  { key: "freshGreen", cssName: "fresh-green", label: "Fresh Green" },
  { key: "royalBlue", cssName: "royal-blue", label: "Royal Blue" },
  { key: "pacificBlue", cssName: "pacific-blue", label: "Pacific Blue" },
  { key: "purple", cssName: "purple", label: "Purple" },
  { key: "neutral", cssName: "neutral", label: "Neutral" },
] as const

const SHADES = [300, 400, 500, 600, 700, 800] as const
const FAMILY_COUNT = COLOR_FAMILIES.length
const SHADE_COUNT = SHADES.length

type ColorFamily = (typeof COLOR_FAMILIES)[number]["key"]
type ColorShade = (typeof SHADES)[number]

type BasicColorValue = {
  family: ColorFamily
  shade: ColorShade
  /** e.g. "color/royalBlue/700" — the semantic token path, for callers that serialize colour choices rather than storing raw hex. */
  token: string
  /** CSS var reference, e.g. "var(--p-color-royal-blue-700)" — resolves per-theme automatically (these primitives are theme-invariant, so this matches the swatch's rendered fill exactly). */
  cssVar: string
}

type ColorPickerBasicProps = {
  value?: BasicColorValue | null
  onValueChange: (value: BasicColorValue) => void
  className?: string
}

// Flattened once, column-major (family outer, shade inner) — matches
// Figma's column-per-family layout when rendered into a `grid-flow-col`
// container with 6 rows.
const SWATCHES = COLOR_FAMILIES.flatMap((family) =>
  SHADES.map((shade) => ({
    family: family.key,
    familyLabel: family.label,
    cssName: family.cssName,
    shade,
  })),
)

function valueKey(value: BasicColorValue | null | undefined): string {
  return value ? `${value.family}-${value.shade}` : "none"
}

function ColorPickerBasic({ value, onValueChange, className }: ColorPickerBasicProps) {
  const refs = React.useRef<(HTMLButtonElement | null)[]>([])
  const selectedIndex = SWATCHES.findIndex(
    (s) => value && s.family === value.family && s.shade === value.shade,
  )
  const [activeIndex, setActiveIndex] = React.useState(Math.max(selectedIndex, 0))
  const [syncedKey, setSyncedKey] = React.useState(valueKey(value))

  // Re-sync the roving tab-stop to the controlled value whenever it changes
  // externally — adjusting state during render (not an effect) so this
  // never steals focus; it only changes which swatch Tab will land on.
  const currentKey = valueKey(value)
  if (currentKey !== syncedKey) {
    setSyncedKey(currentKey)
    setActiveIndex(Math.max(selectedIndex, 0))
  }

  const moveFocus = (nextIndex: number) => {
    setActiveIndex(nextIndex)
    refs.current[nextIndex]?.focus()
  }

  const selectSwatch = (index: number) => {
    const s = SWATCHES[index]
    onValueChange({
      family: s.family,
      shade: s.shade,
      token: `color/${s.family}/${s.shade}`,
      cssVar: `var(--p-color-${s.cssName}-${s.shade})`,
    })
  }

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const family = Math.floor(index / SHADE_COUNT)
    const shade = index % SHADE_COUNT

    switch (event.key) {
      case "ArrowRight": {
        event.preventDefault()
        const nextFamily = Math.min(family + 1, FAMILY_COUNT - 1)
        moveFocus(nextFamily * SHADE_COUNT + shade)
        break
      }
      case "ArrowLeft": {
        event.preventDefault()
        const nextFamily = Math.max(family - 1, 0)
        moveFocus(nextFamily * SHADE_COUNT + shade)
        break
      }
      case "ArrowDown": {
        event.preventDefault()
        const nextShade = Math.min(shade + 1, SHADE_COUNT - 1)
        moveFocus(family * SHADE_COUNT + nextShade)
        break
      }
      case "ArrowUp": {
        event.preventDefault()
        const nextShade = Math.max(shade - 1, 0)
        moveFocus(family * SHADE_COUNT + nextShade)
        break
      }
      case "Home":
        event.preventDefault()
        moveFocus(0)
        break
      case "End":
        event.preventDefault()
        moveFocus(SWATCHES.length - 1)
        break
      case "Enter":
      case " ":
        event.preventDefault()
        selectSwatch(index)
        break
    }
  }

  return (
    <div
      role="listbox"
      aria-label="Color palette"
      className={cn("grid grid-flow-col grid-rows-6 gap-[var(--p-space-100)]", className)}
    >
      {SWATCHES.map((s, index) => {
        const selected = value?.family === s.family && value?.shade === s.shade
        const cssVar = `var(--p-color-${s.cssName}-${s.shade})`
        const label = `${s.familyLabel} ${s.shade}`

        return (
          <button
            key={`${s.family}-${s.shade}`}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="option"
            aria-selected={selected}
            aria-label={label}
            tabIndex={index === activeIndex ? 0 : -1}
            onFocus={() => setActiveIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => selectSwatch(index)}
            className={cn(
              "relative flex size-[var(--p-icon-size-024)] shrink-0 items-center justify-center rounded-full outline-none",
              "focus-visible:shadow-[var(--e-shadow-focus)]",
            )}
          >
            <span
              aria-hidden="true"
              className="size-[var(--c-colorpicker-swatch-size)] rounded-full"
              style={{ backgroundColor: cssVar }}
            />
            {selected && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border-[length:var(--p-border-width-200)] border-[var(--c-colorpicker-swatch-selected)]"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export { ColorPickerBasic, COLOR_FAMILIES, SHADES }
export type { ColorPickerBasicProps, BasicColorValue, ColorFamily, ColorShade }
