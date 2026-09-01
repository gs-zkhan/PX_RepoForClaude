// -----------------------------------------------------------------------------
// Regression test for the horizontal RadioGroup orientation/className parity
// rule (see src/docs/docs/radio-group.doc.ts, "Horizontal layout").
//
// Cold Generation Test #1 showed that documenting a horizontal layout via
// className alone, without requiring orientation="horizontal" alongside it,
// leads AI-generated screens to reproduce a real keyboard-navigation defect
// (later items in the row become unreachable by arrow keys). This test
// statically asserts the canonical example keeps both in sync so the example
// itself can never regress back to the className-only form.
//
//   node --test "tests/radio-group/*.test.mjs"
// -----------------------------------------------------------------------------

import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const source = readFileSync(
  new URL("../../src/docs/examples/radio-group/horizontal.tsx", import.meta.url),
  "utf8"
)

test("canonical horizontal RadioGroup example sets orientation=\"horizontal\"", () => {
  assert.match(source, /orientation="horizontal"/)
})

test("canonical horizontal RadioGroup example still lays out with a horizontal className", () => {
  assert.match(source, /className="[^"]*flex-row[^"]*"/)
})
