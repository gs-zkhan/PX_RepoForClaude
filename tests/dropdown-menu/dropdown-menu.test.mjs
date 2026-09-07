// -----------------------------------------------------------------------------
// Regression test for DropdownMenuItem's icon size/source-asset resolution.
//
// Cold Generation Test #5 found (and this repo's own user-explorer.tsx
// independently reproduces) that DropdownMenuItem renders its optional icon
// at a hardcoded size={16} with no sourceSize, so any icon that only ships a
// 24px asset (e.g. email, export-document, id-card) silently fails to
// resolve ("Prism icon not found") instead of falling back to the
// already-established sourceSize={24} pattern used everywhere else in this
// repo for the same problem (see filter-dropdown-panel.tsx's operator icons).
//
// This is a static source-text assertion, not a rendered-DOM test — this
// repo has no React component-interaction test runner (see
// px-analytics-secondary-nav/README.md's "Manual regression verification
// log" section for why one wasn't introduced solely for this).
//
//   node --test "tests/dropdown-menu/*.test.mjs"
// -----------------------------------------------------------------------------

import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const source = readFileSync(
  new URL("../../src/components/ui/dropdown-menu.tsx", import.meta.url),
  "utf8"
)

test("DropdownMenuItem's icon slot renders from the 24px source asset", () => {
  const iconLine = source.match(/\{icon && <PrismIcon[\s\S]*?\/>\}/)
  assert.ok(iconLine, "expected to find DropdownMenuItem's conditional icon render")
  assert.match(
    iconLine[0],
    /sourceSize=\{24\}/,
    "DropdownMenuItem's icon must set sourceSize={24} — otherwise any icon name without a dedicated " +
      "16px export (e.g. email, export-document, id-card) silently fails to resolve"
  )
})

test("DropdownMenuItem's icon still renders at the documented 16px size", () => {
  const iconLine = source.match(/\{icon && <PrismIcon[\s\S]*?\/>\}/)
  assert.match(iconLine[0], /size=\{16\}/)
})
