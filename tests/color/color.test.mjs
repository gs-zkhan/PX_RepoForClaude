// -----------------------------------------------------------------------------
// Colour-math regression tests for src/lib/color.ts.
//
// Imports the real TypeScript source directly — no build step, no
// duplicated algorithm inside the test file. This repo's `node --test`
// harness runs plain .test.mjs files with no TS loader configured, and
// this task explicitly asked not to introduce a large new test framework
// for one small utility module. Node 22+ ships an experimental type-strip
// mode (`--experimental-strip-types`) that can import a `.ts` file
// directly as long as it contains only erasable TypeScript syntax (type
// annotations, no enums/namespaces/decorators) — verified true for
// color.ts (type-only annotations throughout). Run with:
//
//   node --experimental-strip-types --test "tests/color/*.test.mjs"
//
// (also wired as the `test:color` package.json script). If a future Node
// LTS ever drops this flag, the smallest maintainable fallback is a single
// `tsc --outDir` pre-build step for this one file (not a new framework) —
// not needed today.
// -----------------------------------------------------------------------------

import assert from "node:assert/strict"
import { test, describe } from "node:test"

import {
  clamp,
  isValidHex,
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  hexToHsv,
  hsvToHex,
  parseWholeNumberChannel,
} from "../../src/lib/color.ts"

describe("clamp", () => {
  test("clamps below min", () => {
    assert.equal(clamp(-10, 0, 255), 0)
  })
  test("clamps above max", () => {
    assert.equal(clamp(300, 0, 255), 255)
  })
  test("passes through in-range values", () => {
    assert.equal(clamp(128, 0, 255), 128)
  })
})

describe("isValidHex", () => {
  test("accepts a well-formed 6-digit hex", () => {
    assert.equal(isValidHex("#DC3626"), true)
  })
  test("accepts lowercase", () => {
    assert.equal(isValidHex("#dc3626"), true)
  })
  test("rejects missing #", () => {
    assert.equal(isValidHex("DC3626"), false)
  })
  test("rejects 3-digit shorthand (not supported by this component)", () => {
    assert.equal(isValidHex("#DC3"), false)
  })
  test("rejects 8-digit hex with alpha (alpha is always a separate field)", () => {
    assert.equal(isValidHex("#DC3626FF"), false)
  })
  test("rejects non-hex characters", () => {
    assert.equal(isValidHex("#GGGGGG"), false)
  })
  test("rejects empty string", () => {
    assert.equal(isValidHex(""), false)
  })
})

describe("hexToRgb / rgbToHex round trips", () => {
  const cases = [
    ["#DC3626", { r: 220, g: 54, b: 38 }], // Figma's own worked example (tartRed/700)
    ["#000000", { r: 0, g: 0, b: 0 }], // black
    ["#FFFFFF", { r: 255, g: 255, b: 255 }], // white
    ["#0369E9", { r: 3, g: 105, b: 233 }], // royalBlue/700
  ]

  for (const [hex, rgb] of cases) {
    test(`${hex} -> rgb`, () => {
      assert.deepEqual(hexToRgb(hex), rgb)
    })
    test(`rgb -> ${hex} (round trip)`, () => {
      assert.equal(rgbToHex(rgb), hex)
    })
  }

  test("uppercase and lowercase hex normalise to the same RGB", () => {
    assert.deepEqual(hexToRgb("#dc3626"), hexToRgb("#DC3626"))
  })

  test("rgbToHex always returns uppercase", () => {
    assert.equal(rgbToHex({ r: 220, g: 54, b: 38 }), "#DC3626")
  })

  test("invalid hex falls back to black rather than throwing", () => {
    assert.deepEqual(hexToRgb("not-a-hex"), { r: 0, g: 0, b: 0 })
  })
})

describe("RGB <-> HSV representative colours", () => {
  test("pure red", () => {
    const hsv = rgbToHsv({ r: 255, g: 0, b: 0 })
    assert.equal(hsv.h, 0)
    assert.equal(hsv.s, 100)
    assert.equal(hsv.v, 100)
  })

  test("pure green", () => {
    const hsv = rgbToHsv({ r: 0, g: 255, b: 0 })
    assert.equal(hsv.h, 120)
    assert.equal(hsv.s, 100)
    assert.equal(hsv.v, 100)
  })

  test("pure blue", () => {
    const hsv = rgbToHsv({ r: 0, g: 0, b: 255 })
    assert.equal(hsv.h, 240)
    assert.equal(hsv.s, 100)
    assert.equal(hsv.v, 100)
  })

  test("black: s=0, v=0, achromatic", () => {
    const hsv = rgbToHsv({ r: 0, g: 0, b: 0 })
    assert.equal(hsv.s, 0)
    assert.equal(hsv.v, 0)
  })

  test("white: s=0, v=100, achromatic", () => {
    const hsv = rgbToHsv({ r: 255, g: 255, b: 255 })
    assert.equal(hsv.s, 0)
    assert.equal(hsv.v, 100)
  })

  test("mid-grey: s=0, v=50-ish, achromatic", () => {
    const hsv = rgbToHsv({ r: 128, g: 128, b: 128 })
    assert.equal(hsv.s, 0)
    assert.ok(Math.abs(hsv.v - 50.2) < 1)
  })

  test("HSV -> RGB round trip for a representative colour (tartRed/700)", () => {
    const original = { r: 220, g: 54, b: 38 }
    const hsv = rgbToHsv(original)
    const back = hsvToRgb(hsv)
    assert.ok(Math.abs(back.r - original.r) <= 1)
    assert.ok(Math.abs(back.g - original.g) <= 1)
    assert.ok(Math.abs(back.b - original.b) <= 1)
  })
})

describe("hue wraparound", () => {
  test("hue > 360 wraps into [0, 360) when converting back to RGB", () => {
    const a = hsvToRgb({ h: 10, s: 100, v: 100 })
    const b = hsvToRgb({ h: 370, s: 100, v: 100 })
    assert.deepEqual(a, b)
  })

  test("negative hue wraps into [0, 360)", () => {
    const a = hsvToRgb({ h: 350, s: 100, v: 100 })
    const b = hsvToRgb({ h: -10, s: 100, v: 100 })
    assert.deepEqual(a, b)
  })

  test("hue exactly 360 behaves the same as hue 0", () => {
    assert.deepEqual(hsvToRgb({ h: 360, s: 100, v: 100 }), hsvToRgb({ h: 0, s: 100, v: 100 }))
  })
})

describe("channel clamping in hsvToRgb / rgbToHex", () => {
  test("hsvToRgb clamps out-of-range saturation/value", () => {
    const over = hsvToRgb({ h: 0, s: 150, v: 150 })
    const clamped = hsvToRgb({ h: 0, s: 100, v: 100 })
    assert.deepEqual(over, clamped)
  })

  test("rgbToHex clamps out-of-range channel values instead of producing invalid hex", () => {
    assert.equal(rgbToHex({ r: 300, g: -10, b: 128 }), "#FF0080")
  })
})

describe("parseWholeNumberChannel", () => {
  test("empty string is invalid", () => {
    assert.equal(parseWholeNumberChannel("", 255), null)
  })

  test("whitespace-only string is invalid", () => {
    assert.equal(parseWholeNumberChannel("   ", 255), null)
  })

  test("non-numeric input is invalid", () => {
    assert.equal(parseWholeNumberChannel("abc", 255), null)
  })

  test("decimal input is invalid, not rounded (RGB max)", () => {
    assert.equal(parseWholeNumberChannel("12.5", 255), null)
  })

  test("decimal input is invalid, not rounded (alpha max)", () => {
    assert.equal(parseWholeNumberChannel("50.5", 100), null)
  })

  test("zero is a valid RGB channel value", () => {
    assert.equal(parseWholeNumberChannel("0", 255), 0)
  })

  test("zero is a valid alpha value", () => {
    assert.equal(parseWholeNumberChannel("0", 100), 0)
  })

  test("in-range RGB integer passes through unchanged", () => {
    assert.equal(parseWholeNumberChannel("128", 255), 128)
  })

  test("in-range alpha integer passes through unchanged", () => {
    assert.equal(parseWholeNumberChannel("42", 100), 42)
  })

  test("below-range integer clamps to the minimum (0) for RGB", () => {
    assert.equal(parseWholeNumberChannel("-10", 255), 0)
  })

  test("below-range integer clamps to the minimum (0) for alpha", () => {
    assert.equal(parseWholeNumberChannel("-5", 100), 0)
  })

  test("above-range integer clamps to the RGB maximum (255)", () => {
    assert.equal(parseWholeNumberChannel("300", 255), 255)
  })

  test("above-range integer clamps to the alpha maximum (100)", () => {
    assert.equal(parseWholeNumberChannel("150", 100), 100)
  })

  test("RGB max boundary (255) is valid and unclamped", () => {
    assert.equal(parseWholeNumberChannel("255", 255), 255)
  })

  test("alpha max boundary (100) is valid and unclamped", () => {
    assert.equal(parseWholeNumberChannel("100", 100), 100)
  })
})

describe("hexToHsv / hsvToHex convenience round trip", () => {
  test("hexToHsv -> hsvToHex returns the same hex for a representative colour", () => {
    assert.equal(hsvToHex(hexToHsv("#0369E9")), "#0369E9")
  })

  test("achromatic hex (black) round-trips correctly regardless of hue", () => {
    assert.equal(hsvToHex(hexToHsv("#000000")), "#000000")
  })
})
