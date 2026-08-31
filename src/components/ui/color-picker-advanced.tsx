import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"
import {
  clamp,
  isValidHex,
  hexToHsv,
  hsvToHex,
  hexToRgb,
  rgbToHex,
  parseWholeNumberChannel,
  checkerBackground,
  type HSV,
} from "@/lib/color"

// -----------------------------------------------------------------------------
// ColorPickerAdvanced — Figma "Color Picker" page (1273:11), Variant=Advanced
// (symbol 2588:2).
//
// INTERNAL/COMPOSITIONAL MODULE (CORRECTED 2026-08-31, per direct
// instruction): Figma's Dos/Don'ts explicitly require the picker to be
// anchored to a trigger. This component is NOT a recommended standalone
// consumer-facing component — the anchored `ColorPicker`
// (src/components/ui/color-picker.tsx) is the public API. Exported
// separately only for composition inside `ColorPicker` and for
// review/anatomy inspection.
//
// Geometry (get_metadata-verified, not assumed): fixed 240×353 panel.
// Canvas 240×165. Hue/opacity slider tracks measure 172×8 in the actual
// frame (the AI Instructions prose says "Sliders 208×10px", which is the
// outer Color Selector row including the 24×24 preview swatch + gap, not
// the track itself — direct frame measurement is trusted for the track
// size). Preview swatch 24×24 (--p-icon-size-024). HEX field 64px wide;
// R/G/B/A fields 28px wide each; all input boxes 20px tall. Divider 1px
// (--p-border-width-100), then a 2-row preset swatch grid (16×16 each,
// --c-colorpicker-swatch-size) — Figma's own example preset list mixes
// families/shades with no evident system (including a `royalBlue/900`
// preset, confirmed via get_variable_defs to be a real, if less common,
// primitive token) — treated as illustrative example data, not a required
// fixed set; `presets` is caller-supplied and optional here.
//
// "HSL canvas" naming (RESOLVED via evidence — see src/lib/color.ts's own
// header comment for the full reasoning): the 2D drag surface is the
// standard HSV saturation/value square, not literal HSL.
//
// Corner-clipping fix (CORRECTED, design-owner visual pass): the outer
// container carries `rounded-[var(--c-colorpicker-radius)]` but previously
// had no `overflow-hidden`, so the canvas — a full-width, edge-to-edge
// rectangular gradient box sitting flush against the container's own top
// edge — rendered its own square top corners straight through the
// container's rounded top-left/top-right corners. `overflow-hidden` is
// added to this SAME element (the one that owns the border/bg/radius),
// not a separate wrapper — this container carries no box-shadow of its
// own, so there's no risk of `overflow-hidden` clipping a shadow the way
// it would if applied to an element that also had one. The bottom corners
// were never affected: nothing below the canvas is a full-bleed rectangle
// touching the container's edges, so there was nothing to poke through.
// `checkerBackground` (the alpha-transparency backdrop used below by the
// opacity slider and the live preview swatch) lives in src/lib/color.ts,
// not here — it's a plain function, and co-locating it in this component
// file alongside `ColorPickerAdvanced` trips `react-refresh/only-export-
// components` once `color-picker.tsx`'s anchored trigger also needs to
// import it for its own alpha checkerboard. Living in the component-free
// utility module sidesteps that and gives both call sites one shared
// recipe instead of a second, potentially-drifting copy.
//
// Controlled hue-sync rule (CORRECTED 2026-08-31 — a prior draft only read
// the incoming hex into `hue` on mount, so external controlled-value
// changes after that never updated the hue slider/canvas hue background):
// `hue` re-syncs from `value.hex` whenever the hex actually changes
// (compared by value, not identity, adjusted during render rather than in
// a useEffect to avoid an extra commit), EXCEPT when the new colour is
// achromatic (s=0 or v=0 — pure black/white/grey), where hue is
// mathematically undefined from RGB alone and re-deriving it would reset
// the hue slider to an arbitrary position. In that one case the previous
// hue is kept. This single rule covers both external prop changes (a
// parent sets `value` directly) and this component's own internal
// mutations (canvas drag, hue slider, presets, HEX/RGB commits) — there is
// only one hue-sync code path, not a separate "internal" vs "external"
// branch, which is what avoids render loops/stale state: every mutation
// goes through `onValueChange` -> new `value` prop -> the same render-time
// check. Alpha-only changes never touch this path (hex is unchanged, so
// the sync condition is false) and therefore never move the hue slider.
//
// Reuse decisions: the hue/opacity sliders are built directly on
// @radix-ui/react-slider — NOT the existing, approved `Slider`
// (src/components/ui/slider.tsx) — because that component's track/range
// fill is fixed to specific semantic tokens with no prop for a custom
// background, and these two sliders need dynamic CSS gradients that would
// require overriding the approved component's visual recipe. This mirrors
// the same reasoning already applied to `DashboardWidgetChartTypeSwitcher`.
// The existing `Slider` itself is unmodified and not reused here.
//
// The compact HEX/R/G/B/A fields are a new small field, not a reuse of
// `InputNumber` or `TextField` — neither matches this component's 20px-tall,
// label-below anatomy. The `colorpicker/input/*` tokens already generated
// in this repo exist for exactly this anatomy.
//
// Validation (CORRECTED 2026-08-31, per direct instruction — a prior draft
// silently converted any non-numeric R/G/B/A input to 0 via `Number(raw)
// || 0`, which is indistinguishable from a genuinely-typed "0"): commit
// now explicitly distinguishes "not a valid number" from "a valid zero".
// An invalid commit sets `aria-invalid` on the field, shows a shared,
// accessible error message (role="alert"), and reverts the field's local
// draft back to the last valid value — matching this repo's InputNumber
// convention (revert on invalid) while adding the accessible error
// InputNumber itself doesn't have, since free-typed RGBA digits are more
// error-prone than a stepper-driven numeric input. Valid out-of-range
// values still clamp (RGB to [0,255], alpha to [0,100]). R/G/B/A fields
// use `inputMode="numeric"` for on-device numeric keyboards; HEX keeps the
// default text input mode (it contains letters a–f and "#").
//
// Whole-number enforcement (CORRECTED — a prior draft silently rounded
// decimal input via `Math.round`, e.g. "12.5" committed as 13 with no
// indication anything was rejected, contradicting the error copy's own
// "must be a whole number" wording): parsing now lives in
// `parseWholeNumberChannel` (src/lib/color.ts), a pure, independently
// tested helper — decimal input is rejected as invalid (same as
// non-numeric input), not rounded. Integers outside [0, max] still clamp
// into range.
//
// Stale-error clearing (CORRECTED — see the render-time checks in the
// component body): committing a channel used to only clear THAT channel's
// own error. If, e.g., R had a stale error from an earlier invalid commit
// and the user then dragged the canvas (which changes hex but never
// touches the R field directly), the R error stayed on screen describing a
// draft that no longer existed. HEX/R/G/B errors now clear together
// whenever the applied hex actually changes, regardless of which
// interaction path changed it (canvas, hue slider, preset, an external
// controlled-value update, or another field's own commit); the "A" error
// clears independently whenever alpha changes. Neither check fires while
// the user is mid-edit on an uncommitted, still-invalid draft, since an
// uncommitted draft never changes `value.hex`/`value.alpha`.
//
// Preview semantics (CORRECTED 2026-08-31): the current-colour preview was
// a plain `<div aria-label="...">` — `aria-label` on an element with no
// ARIA role is not reliably exposed by assistive tech. Now `role="img"`
// with the same `aria-label`, giving it real semantics as a labelled
// graphic rather than an inert div with an ineffective attribute.
//
// Accessibility: canvas is `role="slider"` with
// `aria-label="Color saturation and brightness"` and `aria-valuetext`
// describing the current S/V; arrow keys nudge by 1% (Shift+Arrow by 10%).
// Hue/opacity slider thumbs carry their own `aria-label` directly (Radix
// does not forward Root's aria-label to the Thumb, the actual
// role="slider" element).
//
// Canvas pointer lifecycle (CORRECTED — a bug in THIS uncommitted
// implementation, not a pre-existing/out-of-scope issue: a prior draft
// called `setPointerCapture` unconditionally on every pointerdown, with no
// guard and no tracked pointer state. This threw an uncaught `NotFoundError`
// whenever the id didn't correspond to a real active pointer session — most
// visibly under automated/CDP-driven testing, but the same failure mode is
// reachable in real browsers for a stale/synthetic pointer id — and, because
// there was no tracked "which pointer is dragging" state at all, a second,
// unrelated pointer landing on the canvas mid-drag could also feed into the
// same drag.) The fix tracks the active pointer explicitly:
//   - `activePointerIdRef` (a ref, not state — this is drag bookkeeping, not
//     something a re-render should ever depend on) holds the id of the
//     pointer currently owning the drag, or null.
//   - pointerdown: applies the colour immediately (so a plain click/tap
//     always picks a colour even if capture below fails), records the
//     pointer id, then attempts `setPointerCapture` in a try/catch that
//     swallows ONLY `DOMException("NotFoundError")` — a missing capture
//     degrades gracefully to "the drag only continues while the pointer
//     stays over the canvas" rather than crashing; any other error rethrows,
//     since that would be a genuine, unexpected failure this component has
//     no business hiding.
//   - pointermove: gated on `activePointerIdRef.current === e.pointerId`
//     first (so an unrelated second pointer is ignored outright), then on
//     `(e.buttons & 1) !== 0` (the primary-button/contact bit) rather than
//     `e.buttons === 1` — an exact-equality check breaks for touch/pen
//     stacks that report additional bits alongside the primary contact.
//   - pointerup: gated the same way, applies the final position, releases
//     capture only if the element actually still owns it
//     (`hasPointerCapture` check — calling release unconditionally can
//     itself throw), then clears the tracked pointer id.
//   - pointercancel / lostpointercapture: clear the tracked pointer id
//     (gated on matching id) so a cancelled or externally-lost drag can
//     never leave the canvas stuck in a "still dragging" state.
// No document-level pointer listeners were added — pointer capture (when it
// succeeds) already routes pointermove/up to this element even outside its
// bounds, and the ungated fallback behaviour (events simply stop targeting
// this element if the pointer leaves it and capture wasn't established) is
// an acceptable, graceful degradation, not a functional gap worth a global
// listener.
//
// STATUS: implemented against Figma evidence, design-owner reviewed and
// APPROVED (as part of the anchored `ColorPicker`'s full approval — this
// module itself remains internal/compositional and anatomy-only, not a
// standalone-approved component; see color-picker.tsx). Visual Review:
// Approved. Approved for AI use: Yes. Approval date: 2026-08-31.
// -----------------------------------------------------------------------------

type ColorPickerAdvancedValue = {
  /** 6-digit "#RRGGBB" — never includes alpha. */
  hex: string
  /** 0–100, matching Figma's "A" field. */
  alpha: number
}

type ColorPreset = {
  hex: string
  label: string
}

type ColorPickerAdvancedProps = {
  value: ColorPickerAdvancedValue
  onValueChange: (value: ColorPickerAdvancedValue) => void
  /** Optional preset swatch row — omit entirely to hide it (never render an empty row). Caller-supplied; this component invents no default palette. */
  presets?: ColorPreset[]
  className?: string
}

function ColorField({
  id,
  label,
  value,
  onCommit,
  width,
  invalid,
  errorId,
  inputMode,
}: {
  id: string
  label: string
  value: string
  /** Returns whether the committed value was valid — the field reverts its draft to `value` when false. */
  onCommit: (raw: string) => boolean
  width: number
  invalid?: boolean
  errorId?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}) {
  const [draft, setDraft] = React.useState(value)
  const [prevValue, setPrevValue] = React.useState(value)

  // Adjusting state during render (React's documented pattern for syncing
  // local draft state to an external prop) instead of a useEffect — avoids
  // the extra render/commit cycle a `useEffect` + `setState` pair causes.
  if (value !== prevValue) {
    setPrevValue(value)
    setDraft(value)
  }

  const commit = () => {
    const ok = onCommit(draft)
    if (!ok) setDraft(value)
  }

  return (
    <div className="flex flex-col items-center gap-[var(--p-space-025)]" style={{ width }}>
      <input
        id={id}
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        inputMode={inputMode}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit()
        }}
        className={cn(
          "h-5 w-full rounded-[var(--c-colorpicker-input-radius)] border text-center outline-none",
          invalid
            ? "border-[var(--s-color-status-danger-default)]"
            : "border-[var(--c-colorpicker-input-border)]",
          "bg-[var(--c-colorpicker-input-background)]",
          "text-[length:var(--t-font-label-small-size)] leading-[var(--t-font-label-small-line-height)]",
          "text-[var(--c-colorpicker-input-value)]",
          "focus-visible:shadow-[var(--e-shadow-focus)]",
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "text-[length:var(--t-font-heading-xxxsmall-size)] font-[number:var(--t-font-heading-xxxsmall-weight)]",
          "leading-[var(--t-font-heading-xxxsmall-line-height)] tracking-[var(--t-font-heading-xxxsmall-letter-spacing)]",
          "text-[var(--c-colorpicker-input-label)]",
        )}
      >
        {label}
      </label>
    </div>
  )
}

type ChannelKey = "r" | "g" | "b" | "a"

function ColorPickerAdvanced({ value, onValueChange, presets, className }: ColorPickerAdvancedProps) {
  const errorId = React.useId()
  const fieldUid = React.useId()
  const safeHex = isValidHex(value.hex) ? value.hex : "#000000"
  const rgb = hexToRgb(safeHex)
  const derivedHsv = hexToHsv(safeHex)

  const [hue, setHue] = React.useState(derivedHsv.h)
  const [lastAppliedHex, setLastAppliedHex] = React.useState(safeHex)
  const [lastAppliedAlpha, setLastAppliedAlpha] = React.useState(value.alpha)
  const [hexError, setHexError] = React.useState<string | null>(null)
  const [channelErrors, setChannelErrors] = React.useState<Record<ChannelKey, string | null>>({
    r: null,
    g: null,
    b: null,
    a: null,
  })
  const canvasRef = React.useRef<HTMLDivElement>(null)
  const activePointerIdRef = React.useRef<number | null>(null)

  // Controlled hue-sync rule — see header comment for the full reasoning.
  // Stale-error-clearing rule (CORRECTED — see header comment): whenever the
  // committed hex actually changes, by ANY path (canvas, hue slider, preset,
  // an external controlled-value update, or another field's own valid
  // commit), the HEX/R/G/B errors are cleared together — those fields are
  // all views onto the same underlying colour, so a stale "your typed draft
  // didn't parse" flag on one of them no longer describes anything once a
  // new colour has actually been applied from elsewhere. This never fires
  // while the user is still editing an uncommitted draft in the SAME field
  // that produced the error, because an uncommitted draft never changes
  // `value.hex` — the error only clears once a real commit (from any
  // source) changes the colour.
  if (safeHex !== lastAppliedHex) {
    setLastAppliedHex(safeHex)
    if (derivedHsv.s > 0 && derivedHsv.v > 0) {
      setHue(derivedHsv.h)
    }
    setHexError(null)
    setChannelErrors((prev) =>
      prev.r || prev.g || prev.b ? { ...prev, r: null, g: null, b: null } : prev,
    )
  }

  // Same rule, alpha side: alpha is independent of hex, so it gets its own
  // change-detection and only ever clears the "A" error.
  if (value.alpha !== lastAppliedAlpha) {
    setLastAppliedAlpha(value.alpha)
    setChannelErrors((prev) => (prev.a ? { ...prev, a: null } : prev))
  }

  const applyHsv = (next: HSV) => {
    onValueChange({ hex: hsvToHex(next), alpha: value.alpha })
  }

  const handleCanvasPointer = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const s = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100)
    const v = clamp(100 - ((clientY - rect.top) / rect.height) * 100, 0, 100)
    applyHsv({ h: hue, s, v })
  }

  // Canvas pointer lifecycle (CORRECTED — see header comment for the full
  // reasoning). `activePointerIdRef` is the single source of truth for
  // "which pointer, if any, is currently dragging the canvas" — every
  // handler below gates on it instead of trusting capture state or
  // `buttons` alone.
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Update immediately so a plain click/tap (no drag) still picks a
    // colour even if capture below can't be established.
    handleCanvasPointer(e.clientX, e.clientY)
    activePointerIdRef.current = e.pointerId
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch (err) {
      // A synthetic/invalid pointer id (no real active pointer session —
      // this is exactly what broke in automated/CDP-driven testing, and
      // can also happen for a stale id in real browsers) throws
      // `NotFoundError`. Capture is an optimization that keeps the drag
      // going if the pointer leaves the canvas bounds — losing it degrades
      // gracefully to "drag only tracks while over the canvas", it doesn't
      // break dragging. Continue without capture; re-throw anything else,
      // since that would be a genuine, unexpected failure.
      if (!(err instanceof DOMException && err.name === "NotFoundError")) {
        throw err
      }
    }
  }

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return
    // `buttons === 1` alone is unreliable across input types (some touch/
    // pen stacks report combinations other than exactly 1 while the
    // primary contact is active) — check the primary-button/contact bit
    // instead of requiring an exact match.
    if ((e.buttons & 1) === 0) return
    handleCanvasPointer(e.clientX, e.clientY)
  }

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return
    handleCanvasPointer(e.clientX, e.clientY)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    activePointerIdRef.current = null
  }

  const handleCanvasPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return
    activePointerIdRef.current = null
  }

  const handleCanvasLostPointerCapture = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return
    activePointerIdRef.current = null
  }

  const handleCanvasKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1
    let { s, v } = derivedHsv
    switch (e.key) {
      case "ArrowRight":
        s = clamp(s + step, 0, 100)
        break
      case "ArrowLeft":
        s = clamp(s - step, 0, 100)
        break
      case "ArrowUp":
        v = clamp(v + step, 0, 100)
        break
      case "ArrowDown":
        v = clamp(v - step, 0, 100)
        break
      default:
        return
    }
    e.preventDefault()
    applyHsv({ h: hue, s, v })
  }

  const commitHex = (raw: string): boolean => {
    const withHash = raw.startsWith("#") ? raw : `#${raw}`
    if (isValidHex(withHash)) {
      setHexError(null)
      onValueChange({ hex: withHash.toUpperCase(), alpha: value.alpha })
      return true
    }
    setHexError("Enter a valid 6-digit hex value, e.g. #DC3626")
    return false
  }

  const commitChannel = (channel: "r" | "g" | "b", raw: string): boolean => {
    const parsed = parseWholeNumberChannel(raw, 255)
    if (parsed === null) {
      setChannelErrors((prev) => ({ ...prev, [channel]: `${channel.toUpperCase()} must be a whole number from 0 to 255.` }))
      return false
    }
    setChannelErrors((prev) => ({ ...prev, [channel]: null }))
    onValueChange({ hex: rgbToHex({ ...rgb, [channel]: parsed }), alpha: value.alpha })
    return true
  }

  const commitAlpha = (raw: string): boolean => {
    const parsed = parseWholeNumberChannel(raw, 100)
    if (parsed === null) {
      setChannelErrors((prev) => ({ ...prev, a: "A must be a whole number from 0 to 100." }))
      return false
    }
    setChannelErrors((prev) => ({ ...prev, a: null }))
    onValueChange({ hex: value.hex, alpha: parsed })
    return true
  }

  const activeChannelErrors = (["r", "g", "b", "a"] as ChannelKey[])
    .map((k) => channelErrors[k])
    .filter((m): m is string => Boolean(m))

  return (
    <div
      className={cn(
        "flex w-[240px] flex-col overflow-hidden",
        "rounded-[var(--c-colorpicker-radius)] border border-[var(--c-colorpicker-border)]",
        "bg-[var(--c-colorpicker-background)]",
        className,
      )}
    >
      {/* Saturation/Value canvas (Figma calls it "HSL canvas" — see header comment) */}
      <div
        ref={canvasRef}
        role="slider"
        tabIndex={0}
        aria-label="Color saturation and brightness"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(derivedHsv.v)}
        aria-valuetext={`Saturation ${Math.round(derivedHsv.s)}%, brightness ${Math.round(derivedHsv.v)}%`}
        onKeyDown={handleCanvasKeyDown}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        onPointerCancel={handleCanvasPointerCancel}
        onLostPointerCapture={handleCanvasLostPointerCapture}
        className="relative h-[165px] w-full cursor-crosshair touch-none outline-none"
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), hsl(${hue}, 100%, 50%)`,
        }}
      >
        <span
          aria-hidden="true"
          className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[var(--e-shadow-100)]"
          style={{
            left: `${derivedHsv.s}%`,
            top: `${100 - derivedHsv.v}%`,
            backgroundColor: safeHex,
          }}
        />
      </div>

      <div className="flex flex-col gap-[var(--p-space-150)] p-[var(--p-space-200)]">
        {/* Hue + opacity sliders, with a live preview swatch */}
        <div className="flex items-center gap-[var(--p-space-100)]">
          <div className="flex flex-1 flex-col gap-[var(--p-space-100)]">
            <SliderPrimitive.Root
              value={[hue]}
              min={0}
              max={359}
              step={1}
              onValueChange={([h]) => {
                setHue(h)
                applyHsv({ h, s: derivedHsv.s, v: derivedHsv.v })
              }}
              className="relative flex h-4 w-full touch-none items-center outline-none"
            >
              <SliderPrimitive.Track
                className="relative h-2 w-full grow rounded-[var(--p-radius-full)]"
                style={{
                  background:
                    "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
                }}
              >
                <SliderPrimitive.Range className="absolute h-full" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb
                aria-label="Hue"
                className="block size-4 rounded-full border-2 border-white bg-[var(--s-color-surface-default)] shadow-[var(--e-shadow-100)] outline-none focus-visible:shadow-[var(--e-shadow-focus)]"
              />
            </SliderPrimitive.Root>

            <SliderPrimitive.Root
              value={[value.alpha]}
              min={0}
              max={100}
              step={1}
              onValueChange={([a]) => onValueChange({ hex: value.hex, alpha: a })}
              className="relative flex h-4 w-full touch-none items-center outline-none"
            >
              <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-[var(--p-radius-full)]" style={checkerBackground()}>
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(to right, transparent, ${safeHex})` }}
                />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb
                aria-label="Opacity"
                aria-valuetext={`${value.alpha}%`}
                className="block size-4 rounded-full border-2 border-white bg-[var(--s-color-surface-default)] shadow-[var(--e-shadow-100)] outline-none focus-visible:shadow-[var(--e-shadow-focus)]"
              />
            </SliderPrimitive.Root>
          </div>

          <div
            role="img"
            aria-label={`Current colour ${safeHex}, ${value.alpha}% opacity`}
            className="size-[var(--p-icon-size-024)] shrink-0 overflow-hidden rounded-[var(--p-radius-100)] border border-[var(--c-colorpicker-border)]"
            style={checkerBackground()}
          >
            <div aria-hidden="true" className="size-full" style={{ backgroundColor: safeHex, opacity: value.alpha / 100 }} />
          </div>
        </div>

        {/* HEX / R / G / B / A fields */}
        <div className="flex flex-col gap-[var(--p-space-025)]">
          <div className="flex items-start gap-[var(--p-space-100)]">
            <ColorField
              id={`${fieldUid}-hex`}
              label="HEX"
              value={value.hex}
              onCommit={commitHex}
              width={64}
              invalid={Boolean(hexError)}
              errorId={errorId}
            />
            <ColorField
              id={`${fieldUid}-r`}
              label="R"
              value={String(rgb.r)}
              onCommit={(v) => commitChannel("r", v)}
              width={28}
              inputMode="numeric"
              invalid={Boolean(channelErrors.r)}
              errorId={errorId}
            />
            <ColorField
              id={`${fieldUid}-g`}
              label="G"
              value={String(rgb.g)}
              onCommit={(v) => commitChannel("g", v)}
              width={28}
              inputMode="numeric"
              invalid={Boolean(channelErrors.g)}
              errorId={errorId}
            />
            <ColorField
              id={`${fieldUid}-b`}
              label="B"
              value={String(rgb.b)}
              onCommit={(v) => commitChannel("b", v)}
              width={28}
              inputMode="numeric"
              invalid={Boolean(channelErrors.b)}
              errorId={errorId}
            />
            <ColorField
              id={`${fieldUid}-a`}
              label="A"
              value={String(value.alpha)}
              onCommit={commitAlpha}
              width={28}
              inputMode="numeric"
              invalid={Boolean(channelErrors.a)}
              errorId={errorId}
            />
          </div>
          {(hexError || activeChannelErrors.length > 0) && (
            <p id={errorId} role="alert" className="text-[length:var(--t-font-label-small-size)] text-[var(--s-color-status-danger-default)]">
              {hexError ?? activeChannelErrors.join(" ")}
            </p>
          )}
        </div>

        {presets && presets.length > 0 && (
          <>
            <div className="h-[var(--p-border-width-100)] w-full bg-[var(--c-colorpicker-divider)]" />
            <div role="group" aria-label="Preset colours" className="flex flex-wrap gap-[var(--p-space-100)]">
              {presets.map((preset) => (
                <button
                  key={preset.hex + preset.label}
                  type="button"
                  aria-label={preset.label}
                  onClick={() => onValueChange({ hex: preset.hex, alpha: value.alpha })}
                  className="size-[var(--c-colorpicker-swatch-size)] shrink-0 rounded-[var(--p-radius-050)] outline-none focus-visible:shadow-[var(--e-shadow-focus)]"
                  style={{ backgroundColor: preset.hex }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export { ColorPickerAdvanced }
export type { ColorPickerAdvancedProps, ColorPickerAdvancedValue, ColorPreset }
