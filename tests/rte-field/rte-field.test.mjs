// -----------------------------------------------------------------------------
// Regression tests for RteField's pure logic (src/lib/rte-field.ts).
//
//   node --experimental-strip-types --test "tests/rte-field/*.test.mjs"
// -----------------------------------------------------------------------------

import assert from "node:assert/strict"
import { test, describe } from "node:test"

import { exceedsMaxLength, hasRealContent, getAlignCommand, ALIGN_VALUES } from "../../src/lib/rte-field.ts"

describe("exceedsMaxLength", () => {
  test("never exceeds when maxLength is undefined (no limit set)", () => {
    assert.equal(exceedsMaxLength(0, undefined), false)
    assert.equal(exceedsMaxLength(100000, undefined), false)
  })

  test("false when text length is at or below the limit", () => {
    assert.equal(exceedsMaxLength(0, 280), false)
    assert.equal(exceedsMaxLength(280, 280), false)
  })

  test("true only once text length exceeds the limit", () => {
    assert.equal(exceedsMaxLength(281, 280), true)
  })
})

describe("hasRealContent", () => {
  test("false for an empty string", () => {
    assert.equal(hasRealContent(""), false)
  })

  test("false for whitespace-only content", () => {
    assert.equal(hasRealContent("   "), false)
    assert.equal(hasRealContent("\n\t"), false)
  })

  test("true for any real, non-whitespace text", () => {
    assert.equal(hasRealContent("hello"), true)
    assert.equal(hasRealContent("  hello  "), true)
  })
})

// CORRECTED (design-owner review): alignment moved from a permanently
// disabled, visual-only control to a real, implemented one.
describe("ALIGN_VALUES / getAlignCommand", () => {
  test("only Left/Center/Right are supported — no Justify (no matching Prism icon exists)", () => {
    assert.deepEqual(ALIGN_VALUES, ["left", "center", "right"])
  })

  test("maps each alignment to its real execCommand name", () => {
    assert.equal(getAlignCommand("left"), "justifyLeft")
    assert.equal(getAlignCommand("center"), "justifyCenter")
    assert.equal(getAlignCommand("right"), "justifyRight")
  })
})
