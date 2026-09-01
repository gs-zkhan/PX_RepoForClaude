// -----------------------------------------------------------------------------
// Regression test for DropdownField's controlled-value guidance
// (see src/docs/docs/dropdown-field.doc.ts, the `value` prop and Dos/Don'ts).
//
// Cold Generation Test #2 showed that switching a DropdownField's `value`
// between `undefined` and a string across renders (e.g. `value={x || undefined}`)
// triggers React's uncontrolled-to-controlled warning. This test statically
// asserts the doc keeps the stable-controlled-value rule present so it can't
// silently regress out of the guidance an AI consumer reads.
//
//   node --experimental-strip-types --test "tests/dropdown-field/*.test.mjs"
// -----------------------------------------------------------------------------

import assert from "node:assert/strict"
import { test } from "node:test"

import { dropdownFieldDoc } from "../../src/docs/docs/dropdown-field.doc.ts"

test("value prop description warns against switching between undefined and a string", () => {
  const valueProp = dropdownFieldDoc.props.find((prop) => prop.name === "value")
  assert.ok(valueProp, "expected a documented `value` prop")
  assert.match(valueProp.description, /undefined/)
  assert.match(valueProp.description, /defaultValue/)
})

test("Don'ts explicitly call out the undefined/string switch as a mistake", () => {
  const hasRule = dropdownFieldDoc.guidelines.donts.some(
    (item) => item.includes("undefined") && item.includes("defaultValue")
  )
  assert.ok(hasRule, "expected a Don't warning against switching value between undefined and a string")
})
