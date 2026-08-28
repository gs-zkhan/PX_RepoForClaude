import { test, describe } from "node:test"
import assert from "node:assert/strict"
import path from "node:path"

import { makeFixtureRoot, cleanup } from "./helpers.mjs"
import { checkSemanticPrimitiveDrift, checkEmittedButUnusedPrimitives, diffAgainstBaseline, runAliasDebtChecks } from "../../scripts/validate-alias-debt.mjs"

describe("validate-alias-debt", () => {
  test("diffAgainstBaseline: clean unchanged sync — no candidates, no baseline, no debt", () => {
    const result = diffAgainstBaseline([], [])
    assert.deepEqual(result, { newDebt: [], resolvedDebt: [], existingDebt: [] })
  })

  test("diffAgainstBaseline: existing baselined debt is not reported as new", () => {
    const baseline = ["known-issue-a", "known-issue-b"]
    const candidates = ["known-issue-a", "known-issue-b"]
    const result = diffAgainstBaseline(candidates, baseline)
    assert.deepEqual(result.newDebt, [])
    assert.deepEqual(result.existingDebt.sort(), ["known-issue-a", "known-issue-b"])
    assert.deepEqual(result.resolvedDebt, [])
  })

  test("diffAgainstBaseline: a new broken alias not present in the baseline is reported as new debt", () => {
    const baseline = ["known-issue-a"]
    const candidates = ["known-issue-a", "brand-new-broken-alias"]
    const result = diffAgainstBaseline(candidates, baseline)
    assert.deepEqual(result.newDebt, ["brand-new-broken-alias"])
    assert.deepEqual(result.existingDebt, ["known-issue-a"])
  })

  test("diffAgainstBaseline: a baselined fingerprint that no longer reproduces is reported as resolved, not a failure", () => {
    const baseline = ["fixed-issue", "still-here"]
    const candidates = ["still-here"]
    const result = diffAgainstBaseline(candidates, baseline)
    assert.deepEqual(result.newDebt, [])
    assert.deepEqual(result.resolvedDebt, ["fixed-issue"])
    assert.deepEqual(result.existingDebt, ["still-here"])
  })

  test("checkSemanticPrimitiveDrift: passes when the semantic literal matches the primitive its description claims to alias", () => {
    const root = makeFixtureRoot() // action.primary.default = royalBlue.700 = #0369E9 by default
    try {
      const findings = checkSemanticPrimitiveDrift(root)
      assert.equal(findings.filter((f) => f.status === "fail").length, 0)
    } finally {
      cleanup(root)
    }
  })

  test("checkSemanticPrimitiveDrift: fails when the semantic literal has drifted from its described primitive alias", () => {
    const root = makeFixtureRoot({ actionPrimaryHex: "#999999" }) // primitive stays #0369E9, semantic literal doesn't
    try {
      const findings = checkSemanticPrimitiveDrift(root)
      const drift = findings.find((f) => f.fingerprint.includes("color.action.primary.default"))
      assert.ok(drift, "expected a drift finding for color.action.primary.default")
      assert.equal(drift.status, "fail")
    } finally {
      cleanup(root)
    }
  })

  test("checkEmittedButUnusedPrimitives: a primitive with a live var() consumer is not reported as unused", () => {
    const root = makeFixtureRoot() // C_Default's nav.background references {p.color.neutral.800}
    try {
      const unused = checkEmittedButUnusedPrimitives(root)
      assert.equal(unused.includes("--p-color-neutral-800"), false, "neutral.800 has a real var() consumer (nav.background) and should not be flagged unused")
      assert.equal(unused.includes("--p-color-royal-blue-700"), true, "royalBlue.700 has no var() consumer in this fixture and should be flagged unused — same as the real repo")
    } finally {
      cleanup(root)
    }
  })

  test("runAliasDebtChecks: integration — the real repository's current token set passes cleanly", () => {
    // This exercises the actual scripts/validate-prism-tokens.mjs subprocess
    // against the real repo (not a synthetic fixture), which needs the
    // real, floor-satisfying token corpus — that's the one thing this
    // suite doesn't fabricate. Run from the repo root two directories up
    // from tests/token-guardrails/.
    const repoRoot = path.resolve(import.meta.dirname, "../..")
    const result = runAliasDebtChecks(repoRoot)
    assert.equal(result.ok, true, JSON.stringify({ hardErrors: result.hardErrors, newDebt: result.newDebt }, null, 2))
  })
})
