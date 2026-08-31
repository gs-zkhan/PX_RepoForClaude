// -----------------------------------------------------------------------------
// Color conversion utilities for the Color Picker Advanced panel — pure
// functions only, no external dependency (repo has no chroma-js/tinycolor/
// colord dependency, and this repo's own convention favours small internal
// utilities over new dependencies for well-defined math).
//
// Figma's Advanced panel (node 2588:2) is labelled an "HSL canvas" in the AI
// Instructions prose, but its actual 2D behaviour (x-axis = saturation,
// y-axis = value/lightness with a fixed hue) is the standard HSV
// saturation/value square used by virtually every colour-picker
// implementation — HSL does not map cleanly onto a 2D square the way HSV
// does. This is a well-known naming conflation in design specs, not a
// design ambiguity requiring input: implemented with HSV math internally,
// converting to/from RGB/hex/alpha at the public boundary so callers never
// see HSV.
//
// Alpha is kept separate from hex, matching Figma's own anatomy exactly —
// the HEX field is always a plain 6-digit `#RRGGBB` value, and alpha is a
// separate 0–100 field (the "A" input, matching the AI Instructions'
// "A: 100" example). Nothing here ever encodes alpha into an 8-digit hex.
// -----------------------------------------------------------------------------

import type { CSSProperties } from "react"

type RGB = { r: number; g: number; b: number }
type HSV = { h: number; s: number; v: number }

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex)
}

// Parses a single RGB/alpha channel's free-typed field value. Whole numbers
// only — "12.5" is rejected as invalid rather than silently rounded, since
// this repo's Color Picker Advanced error copy explicitly says "must be a
// whole number" and rounding a decimal would contradict that message. Empty
// or non-numeric input is invalid (returns null, distinct from a valid 0).
// Valid integers outside [0, max] clamp into range rather than being
// rejected (e.g. "300" for an RGB channel clamps to 255).
function parseWholeNumberChannel(raw: string, max: number): number | null {
  const trimmed = raw.trim()
  if (trimmed === "") return null
  const parsed = Number(trimmed)
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) return null
  return clamp(parsed, 0, max)
}

function hexToRgb(hex: string): RGB {
  const normalized = isValidHex(hex) ? hex : "#000000"
  const r = parseInt(normalized.slice(1, 3), 16)
  const g = parseInt(normalized.slice(3, 5), 16)
  const b = parseInt(normalized.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min

  let h = 0
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6
    else if (max === gn) h = (bn - rn) / delta + 2
    else h = (rn - gn) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : delta / max
  const v = max

  return { h, s: s * 100, v: v * 100 }
}

function hsvToRgb({ h, s, v }: HSV): RGB {
  const sn = clamp(s, 0, 100) / 100
  const vn = clamp(v, 0, 100) / 100
  const c = vn * sn
  const hp = ((h % 360) + 360) % 360 / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  const m = vn - c

  let rp: number
  let gp: number
  let bp: number
  if (hp >= 0 && hp < 1) [rp, gp, bp] = [c, x, 0]
  else if (hp < 2) [rp, gp, bp] = [x, c, 0]
  else if (hp < 3) [rp, gp, bp] = [0, c, x]
  else if (hp < 4) [rp, gp, bp] = [0, x, c]
  else if (hp < 5) [rp, gp, bp] = [x, 0, c]
  else [rp, gp, bp] = [c, 0, x]

  return { r: (rp + m) * 255, g: (gp + m) * 255, b: (bp + m) * 255 }
}

function hexToHsv(hex: string): HSV {
  return rgbToHsv(hexToRgb(hex))
}

function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv))
}

// Shared alpha-transparency checkerboard backdrop. Lives here (a
// component-free utility module) rather than in color-picker-advanced.tsx
// so it can also be imported by color-picker.tsx's anchored trigger without
// tripping `react-refresh/only-export-components` (that rule flags a
// component file that also exports a plain function) — moving it here
// avoids a second, drifting copy of the exact gradient recipe.
function checkerBackground(): CSSProperties {
  return {
    backgroundImage:
      "linear-gradient(45deg, var(--s-color-line-default) 25%, transparent 25%), " +
      "linear-gradient(-45deg, var(--s-color-line-default) 25%, transparent 25%), " +
      "linear-gradient(45deg, transparent 75%, var(--s-color-line-default) 75%), " +
      "linear-gradient(-45deg, transparent 75%, var(--s-color-line-default) 75%)",
    backgroundSize: "8px 8px",
    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
  }
}

export {
  clamp,
  isValidHex,
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  hexToHsv,
  hsvToHex,
  parseWholeNumberChannel,
  checkerBackground,
}
export type { RGB, HSV }
