import type { ComponentDoc } from "@/docs/types"

// STATUS: implemented against Figma evidence (page 1273:11), design-owner
// reviewed and APPROVED. Visual Review: Approved. Approved for AI use: Yes.
// Approval date: 2026-08-31. See ai/figma-coverage.json (id
// component-color-picker: status Approved, designOwnerApproval.approved:
// true) and src/components/ui/color-picker*.tsx for the full evidence
// trail, including the frame-geometry-over-prose reconciliations (8px
// column gap, slider track size) and the HSV-behind-"HSL canvas" naming —
// both preserved as the governing rationale, unchanged by approval.
export const colorPickerDoc: ComponentDoc = {
  slug: "color-picker",
  name: "Color Picker",
  status: "stable",
  description:
    "APPROVED. The recommended, anchored ColorPicker (Basic 42-swatch palette or Advanced HSV canvas + hue/opacity + HEX/RGBA) — never a standalone panel.",
  figmaNodeId: "1273:11",
  sourcePath: "src/components/ui/color-picker.tsx",

  sections: [
    {
      id: "status",
      title: "Review status (read first)",
      body:
        "Visual Review: Approved. Approved for AI use: Yes. Approval date: 2026-08-31. Implemented against Figma page 1273:11, AI Instructions (4901:24640) and Dos/Don'ts (4901:24363), then visually verified by the design owner: the 42-swatch Basic palette (7x6 order, 24px hit-targets, 16px dots, the `--p-border-width-200` + `--c-colorpicker-swatch-selected` selection ring, boundary-aware keyboard navigation, close-on-select), the Advanced HSV canvas/hue/opacity/HEX-RGBA panel (single-surface rounded popover, controlled hue sync, accessible validation, robust pointer lifecycle, open-until-dismissed), and the anchored trigger (full-circle colour fill, alpha checkerboard, outside-and-visible focus ring). No exceptions recorded.",
    },
    {
      id: "anchoring",
      title: "ColorPicker is the recommended component — always anchored",
      body:
        "CORRECTED (2026-08-31): use `ColorPicker` (mode=\"basic\"|\"advanced\") for all production usage — it is the only recommended, consumer-facing entry point. `ColorPickerBasic`/`ColorPickerAdvanced` are internal/compositional implementation modules, exported only for building `ColorPicker` itself and for clearly-labelled review/anatomy inspection (as shown separately in the Validation Gallery) — they are not a supported way to ship this component standalone. Figma's Dos/Don'ts are explicit and treated as a hard rule: \"Don't show the picker without a trigger element... Always attach Color Picker to a swatch trigger or input... The trigger swatch must update immediately on selection.\" `ColorPicker` composes the existing, unmodified `Popover` with either panel as its content — there is no standalone/always-open mode in the public API.",
      exampleId: "color-picker/anchored-trigger",
    },
    {
      id: "modes-are-alternatives",
      title: "Basic vs Advanced — two alternative modes, not a pair",
      body:
        "CORRECTED (2026-08-31, design-owner visual pass): the two anchored-trigger examples in this doc and the Validation Gallery previously read like two controls meant to sit together. They are two alternative CONFIGURATIONS of the same `ColorPicker` API, selected by the `mode` prop — `mode=\"basic\"` opens the constrained, approved 42-colour PX palette; `mode=\"advanced\"` opens arbitrary colour and opacity controls (HSV canvas, hue/opacity sliders, HEX/RGBA fields). A real product screen picks whichever ONE mode fits that specific field — for example, a status-label colour is usually Basic-only (a constrained brand palette is the whole point); a free-form theme-colour picker is usually Advanced-only. Do not render both triggers next to each other in a product screen unless that screen genuinely needs both a constrained AND an arbitrary colour input side by side — that is the exception, not the pattern to copy from this review page, where both are shown together purely so reviewers can compare them.",
    },
    {
      id: "close-on-select",
      title: "Close-on-select — design-owner-approved interaction decision",
      body:
        "Figma's AI Instructions describe what each mode's interactions DO (swatch click fires onColorSelect; canvas drag updates fields live) but do not state whether selecting a Basic swatch closes the popover — checked directly in the Behaviour and Dos/Don'ts rows and genuinely absent, not overlooked. With no Figma evidence either way, Basic mode closes the popover on selection (matching this repo's own `DashboardWidgetChartTypeSwitcher` precedent for an equivalent single-discrete-choice popover control); Advanced mode never auto-closes, since it is continuous adjustment (canvas drag, sliders) that would be unusable if it closed on the first interaction — the user dismisses it via outside-click, Escape, or the trigger. DESIGN-OWNER APPROVED (2026-08-31): the design owner reviewed and approved this behaviour as part of the full Color Picker approval — it is no longer an open evidence gap, though the reasoning above (Figma is silent; resolved via this repo's own precedent) remains the record of how it was decided.",
    },
    {
      id: "basic",
      title: "Basic — 42-swatch brand palette (internal module)",
      body:
        "7 families (tartRed, honeyAmber, freshGreen, royalBlue, pacificBlue, purple, neutral) × 6 shades (300–800) = 42 swatches, each a 16px dot (--c-colorpicker-swatch-size) in a 24px hit-target (--p-icon-size-024), rendered as a role=\"listbox\" of role=\"option\" swatches with 8px gaps (--p-space-100). Fill values use this repo's existing --p-color-<family>-<shade> primitive tokens directly. CORRECTED evidence: Figma's AI Instructions prose says \"Column gap = 0px\", but the actual frame coordinates show an 8px gap — the direct measurement is trusted here. \"Basic-Hover\" is Figma's variant name for what its own instructions call the SELECTED state (a persistent 2px ring) — not a transient mouse-hover preview, and NOT a scale/transform animation either (a prior draft invented a `hover:scale-110` effect with no Figma backing; removed). Keyboard: Right/Left move to the next/previous family in the SAME shade row (holding position at the first/last family, no wrapping); Up/Down move to the next/previous shade in the SAME family column (holding position at the first/last shade); Home/End move to the absolute first/last swatch in the whole 42-item list (this is a role=\"listbox\", not a role=\"grid\" — per WAI-ARIA listbox semantics, Home/End address the whole list, not a row).",
      exampleId: "color-picker/basic",
    },
    {
      id: "advanced",
      title: "Advanced — HSV canvas, hue/opacity, HEX/RGBA (internal module)",
      body:
        "Fixed 240×353 panel: a 240×165 saturation/brightness canvas (Figma calls it an \"HSL canvas\" in prose, but the actual 2D drag behaviour is the standard HSV saturation/value square), a hue slider and an opacity slider (both built directly on @radix-ui/react-slider, not the approved `Slider` component), a live current-colour preview (role=\"img\" with an aria-label — a plain div with aria-label and no role is not reliably exposed by assistive tech, corrected 2026-08-31), and HEX/R/G/B/A fields using the already-generated colorpicker/input/* tokens. Controlled hue-sync: the hue slider/canvas hue re-derives from `value.hex` whenever it changes — externally OR internally, through one single render-time rule — except when the resulting colour is achromatic (s=0 or v=0), where hue is mathematically undefined and the previous hue is kept to avoid the slider jumping. Alpha-only changes never move hue. Field IDs are generated per-instance via React.useId(), so multiple Advanced pickers on one page never collide.",
      exampleId: "color-picker/advanced",
    },
    {
      id: "validation",
      title: "R/G/B/A validation — invalid input is never silently zeroed",
      body:
        "CORRECTED (2026-08-31): a prior draft converted any non-numeric R/G/B/A input to 0 via `Number(raw) || 0`, indistinguishable from a genuinely-typed zero. Commit now explicitly distinguishes \"not a number\" from \"a valid zero\": an invalid commit sets `aria-invalid` on the field, shows a shared accessible error (role=\"alert\"), and reverts the field's draft to the last valid value — matching this repo's InputNumber revert-on-invalid convention, plus the accessible error InputNumber itself doesn't have (justified here since free-typed RGBA digits are more error-prone than a stepper-only control). Valid out-of-range values still clamp (RGB 0–255, alpha 0–100). R/G/B/A use inputMode=\"numeric\"; HEX keeps the default text mode (it contains letters a–f and \"#\") and continues to clear its own error on a valid commit. CORRECTED (2026-08-31, engineering gate): decimal input (e.g. \"12.5\") is now rejected as invalid rather than silently rounded — the parsing lives in the independently unit-tested `parseWholeNumberChannel` helper (src/lib/color.ts), not duplicated inline.",
      exampleId: "color-picker/alpha-and-error",
    },
    {
      id: "stale-error-clearing",
      title: "Stale validation errors clear when the colour changes from elsewhere",
      body:
        "CORRECTED (2026-08-31, engineering gate): a prior draft only cleared a field's own error when THAT field committed a valid value — so an invalid R commit followed by, say, dragging the canvas (which changes hex without touching the R field) left the stale \"R must be a whole number...\" message on screen describing a draft that no longer existed. HEX/R/G/B errors now clear together whenever the applied hex actually changes, from ANY path (canvas, hue slider, preset, an external controlled-value update, or another field's own commit); the \"A\" error clears independently whenever alpha changes. Neither clears while the user is still mid-edit on an uncommitted, still-invalid draft in the same field, since an uncommitted draft never changes `value.hex`/`value.alpha`.",
    },
    {
      id: "popover-rounded-corners",
      title: "Popover top corners — single-surface, clipped correctly",
      body:
        "CORRECTED (2026-08-31, design-owner visual pass): the Advanced popover previously rendered TWO nested rounded boxes — the shared `PopoverContent` (with its own padding/background/radius/border, borrowed from `--c-datepicker-panel-*` tokens) and `ColorPickerAdvanced`'s own container (its own border/background/radius one padding-step further in). Because the inner box had no `overflow-hidden`, its own edge-to-edge canvas rendered square top corners straight through its rounded top-left/top-right corners. Both modes now use the Color Picker's own tokens for `PopoverContent`'s radius/border/background (fixing the cross-component token borrow). For Advanced, `PopoverContent` carries zero padding and is the SOLE visual surface — `ColorPickerAdvanced`'s own border/background/radius/padding are fully stripped when embedded (`rounded-none border-0 bg-transparent p-0`), so the canvas sits flush against `PopoverContent`'s own rounded top corners and is clipped by ITS `overflow-hidden`. Basic was never doubled (`ColorPickerBasic` has no chrome of its own) and needed no structural change beyond the token fix. `ColorPickerAdvanced`'s own container also gained `overflow-hidden` directly (see its header comment) so its STANDALONE review-anatomy rendering — with no popover wrapper at all — clips its own canvas correctly too. Neither box carries a shadow of its own that `overflow-hidden` could clip; `PopoverContent`'s existing shadow token is unaffected.",
    },
    {
      id: "trigger-full-circle",
      title: "Anchored trigger — full-circle colour, not a radio-button look",
      body:
        "CORRECTED (2026-08-31, design-owner visual pass): the trigger previously drew the current colour as a small 16px dot (`--c-colorpicker-swatch-size`) centred inside the 24px button, with the button's own neutral border+background forming a visible grey ring all the way around it — reading as a radio input rather than a colour swatch. The colour now fills the entire 24×24 circle via an absolutely-positioned layer clipped to a circle by its own `rounded-full` (not by `overflow-hidden` on the button, which would risk clipping the focus-visible shadow). The 1px neutral border remains only as a thin edge-definition ring sitting at the circle's true outer edge, and doubles as the empty-state indicator: when Basic mode has no value yet, no colour layer renders at all, so \"nothing selected\" reads as a bare bordered circle, distinct from \"a real grey/neutral colour is selected\" (a filled circle in that shade). Advanced mode always has a concrete hex+alpha, so it always shows a filled circle. For alpha, a checkerboard layer (the exact same recipe as the Advanced panel's own alpha indicators, imported as `checkerBackground` rather than duplicated) sits behind the colour layer; opacity is scoped to the colour layer alone, never to the button, its border, or its focus ring. Basic and Advanced triggers share this same treatment. This correction is scoped to the anchored trigger only — the 42-swatch palette's own Figma-defined 16px-dot-plus-selected-ring anatomy (color-picker-basic.tsx) is untouched.",
    },
  ],

  props: [
    { name: "mode (ColorPicker)", type: '"basic" | "advanced"', required: true, description: "Selects which panel the anchored trigger opens." },
    { name: "value (basic)", type: "BasicColorValue | null", required: true, description: "Controlled. { family, shade, token, cssVar }. Pass null for no selection." },
    { name: "value (advanced)", type: "{ hex: string; alpha: number }", required: true, description: "Controlled. hex is always 6-digit #RRGGBB; alpha is 0–100, never folded into hex." },
    { name: "onValueChange", type: "(value) => void", required: true, description: "Controlled only — no internal uncontrolled fallback." },
    { name: "presets", type: "{ hex: string; label: string }[]", description: "Advanced only. Optional preset swatch row — omit to hide it entirely; never render an empty row." },
    { name: "triggerLabel", type: "string", description: "ColorPicker only. Accessible-name prefix for the trigger, e.g. \"Label colour\"." },
    { name: "className", type: "string", description: "Placement only." },
  ],

  tokens: [
    "--c-colorpicker-background",
    "--c-colorpicker-border",
    "--c-colorpicker-divider",
    "--c-colorpicker-input-background",
    "--c-colorpicker-input-border",
    "--c-colorpicker-input-label",
    "--c-colorpicker-input-radius",
    "--c-colorpicker-input-value",
    "--c-colorpicker-padding",
    "--c-colorpicker-radius",
    "--c-colorpicker-swatch-selected",
    "--c-colorpicker-swatch-size",
    "--p-color-tart-red-300 … 800 (and the other 6 families)",
    "--p-icon-size-024",
    "--p-space-025",
    "--p-space-100",
    "--p-border-width-100",
    "--p-border-width-200",
    "--t-font-heading-xxxsmall-*",
    "--t-font-label-small-*",
    "--s-color-status-danger-default",
  ],

  guidelines: {
    dos: [
      "Use `ColorPicker` (mode=\"basic\" for a constrained brand palette, mode=\"advanced\" for arbitrary colour) for all production usage.",
      "Always show the HEX field in Advanced mode.",
      "Always anchor Color Picker to a trigger that updates immediately on selection — never render it as a standalone floating panel.",
    ],
    donts: [
      "Don't compose `ColorPickerBasic`/`ColorPickerAdvanced` directly into a product screen without an anchoring trigger — they are internal modules, not the recommended API.",
      "Don't use Basic when users need an arbitrary colour — restricting them to the 42-swatch grid creates frustration (Figma's own Dos/Don'ts).",
      "Don't rely on colour alone to communicate selection — the Basic selection ring is a border, not just a colour change, and it is never animated.",
      "Don't fold alpha into the hex string — it is always a separate value.",
      "Don't reuse the approved Slider component for hue/opacity — their gradient tracks need a visual recipe Slider doesn't expose a prop for.",
      "Don't silently coerce invalid R/G/B/A input to 0 — report it as an error and revert to the last valid value.",
      "Don't silently round decimal R/G/B/A input — a whole-number field must reject a decimal as invalid, not truncate or round it.",
      "Don't leave a field's error visible after the colour has genuinely changed from a different interaction path — clear HEX/R/G/B errors together on any real hex change, and the A error on any real alpha change.",
    ],
  },
}
