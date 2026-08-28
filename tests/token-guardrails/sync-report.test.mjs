import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

import { makeFixtureRoot, writeJson, cleanup } from "./helpers.mjs"
import { buildGeneratedCss } from "../../scripts/generate-prism-css.mjs"
import { buildSyncReport } from "../../scripts/generate-sync-report.mjs"

function writeFreshGeneratedCss(root) {
  const { css } = buildGeneratedCss(root)
  fs.mkdirSync(path.join(root, "src/styles"), { recursive: true })
  fs.writeFileSync(path.join(root, "src/styles/prism-generated.css"), css, "utf8")
}

// buildSyncReport composes protected-token/description/generated-output/
// smoke checks (all fixture-friendly) with runAliasDebtChecks, which shells
// out to validate-prism-tokens.mjs and enforces its own, much larger,
// floor-count requirements that this suite's lightweight fixtures don't
// (and shouldn't have to) satisfy. Alias-debt behavior itself is already
// covered thoroughly in alias-debt.test.mjs — these tests inject a
// synthetic, clean alias-debt result so they isolate report *composition*
// (this file's actual subject) from that unrelated dependency.
const CLEAN_ALIAS_DEBT = { ok: true, existingDebt: [], newDebt: [], resolvedDebt: [], unusedPrimitives: [] }

describe("generate-sync-report: buildSyncReport", () => {
  test("an ordinary, non-protected change is not blocked and needs no reviewer action", () => {
    const root = makeFixtureRoot()
    writeFreshGeneratedCss(root)
    try {
      const report = buildSyncReport({
        rootDir: root,
        changedTokenDetails: [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.600", oldValue: "#AAAAAA", newValue: "#BBBBBB" }],
        aliasDebtResult: CLEAN_ALIAS_DEBT,
      })
      assert.equal(report.blocked, false)
      assert.match(report.markdown, /### Required reviewer action\nNone/)
      assert.match(report.markdown, /color\.royalBlue\.600/)
      assert.match(report.markdown, /\| no \|/) // not protected
    } finally {
      cleanup(root)
    }
  })

  test("a protected-token change without approval blocks the report and names the required action", () => {
    const root = makeFixtureRoot({ royalBlue700Hex: "#E90303" })
    writeFreshGeneratedCss(root)
    try {
      const report = buildSyncReport({
        rootDir: root,
        changedTokenDetails: [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#E90303" }],
        aliasDebtResult: CLEAN_ALIAS_DEBT,
      })
      assert.equal(report.blocked, true)
      assert.match(report.markdown, /🚫 \*\*Blocked\*\*/)
      assert.match(report.markdown, /update `tokens\/protected-tokens\.json`/)
      assert.match(report.markdown, /color\.royalBlue\.700.*blocked/)
    } finally {
      cleanup(root)
    }
  })

  test("report lists visible surfaces for a protected token from the policy, not a hardcoded string", () => {
    const root = makeFixtureRoot()
    writeFreshGeneratedCss(root)
    try {
      const report = buildSyncReport({
        rootDir: root,
        changedTokenDetails: [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.neutral.800", oldValue: "#25313B", newValue: "#25313B" }],
        aliasDebtResult: CLEAN_ALIAS_DEBT,
      })
      assert.match(report.markdown, /Nav/) // from this fixture's policy visibleSurfaces for neutral.800
    } finally {
      cleanup(root)
    }
  })

  test("stale generated CSS is surfaced as a blocking required action", () => {
    const root = makeFixtureRoot()
    fs.mkdirSync(path.join(root, "src/styles"), { recursive: true })
    fs.writeFileSync(path.join(root, "src/styles/prism-generated.css"), "/* stale */\n", "utf8")
    try {
      const report = buildSyncReport({ rootDir: root, changedTokenDetails: [], aliasDebtResult: CLEAN_ALIAS_DEBT })
      assert.equal(report.blocked, true)
      assert.match(report.markdown, /npm run tokens:generate/)
    } finally {
      cleanup(root)
    }
  })
})
