import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"

import { makeFixtureRoot, writeJson, cleanup } from "./helpers.mjs"
import { runProtectedTokenChecks, checkProposedProtectedChanges, validatePolicySchema } from "../../scripts/validate-protected-tokens.mjs"
import { buildGeneratedCss } from "../../scripts/generate-prism-css.mjs"

function writeFreshGeneratedCss(root) {
  const { css } = buildGeneratedCss(root)
  fs.mkdirSync(path.join(root, "src/styles"), { recursive: true })
  fs.writeFileSync(path.join(root, "src/styles/prism-generated.css"), css, "utf8")
}

describe("validate-protected-tokens", () => {
  test("clean, unchanged sync: everything matches the approved baseline", () => {
    const root = makeFixtureRoot()
    writeFreshGeneratedCss(root)
    try {
      const result = runProtectedTokenChecks(root)
      assert.equal(result.ok, true, JSON.stringify(result.failures, null, 2))
      assert.equal(result.sections.protectedTokens.every((f) => f.status === "pass"), true)
      assert.equal(result.sections.renderedSmoke.every((f) => f.status === "pass"), true)
    } finally {
      cleanup(root)
    }
  })

  test("ordinary permitted token change: a non-protected token changing does not block protected-token checks", () => {
    // Add a brand-new, unprotected primitive and confirm the protected-token
    // section is unaffected by its presence.
    const root = makeFixtureRoot()
    const pLightPath = path.join(root, "tokens/P_Light_Default.tokens.json")
    const pLight = JSON.parse(fs.readFileSync(pLightPath, "utf8"))
    pLight.color.royalBlue["600"] = { $type: "color", $value: { colorSpace: "srgb", components: [0, 0, 0], alpha: 1, hex: "#ABCDEF" }, $description: "Not protected." }
    writeJson(root, "tokens/P_Light_Default.tokens.json", pLight)
    writeFreshGeneratedCss(root)
    try {
      const result = runProtectedTokenChecks(root)
      assert.equal(result.sections.protectedTokens.every((f) => f.status === "pass"), true)
    } finally {
      cleanup(root)
    }
  })

  test("protected-token change without approval: fails with a clear report", () => {
    // The primitive itself is corrupted (like the real royalBlue.700
    // incident), but the policy's approvedValue stays at the canonical
    // baseline (#0369E9) — this is "changed without approval".
    const root = makeFixtureRoot({ royalBlue700Hex: "#E90303" })
    writeFreshGeneratedCss(root)
    try {
      const result = runProtectedTokenChecks(root)
      assert.equal(result.ok, false)
      const failure = result.sections.protectedTokens.find((f) => f.path === "color.royalBlue.700" && f.status === "fail")
      assert.ok(failure, "expected a protected-token failure for color.royalBlue.700")
      assert.equal(failure.proposedValue, "#E90303")
      assert.equal(failure.previousApprovedValue, "#0369E9")
      assert.match(failure.message, /requires an explicit, reviewable design-owner approval/)
    } finally {
      cleanup(root)
    }
  })

  test("exact protected-token approval: updating approvedValue to match the new value unblocks the check", () => {
    const root = makeFixtureRoot({ royalBlue700Hex: "#0AB1CD" })
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"))
    const entry = policy.protected.find((p) => p.path === "color.royalBlue.700")
    entry.approvedValue.hex = "#0AB1CD" // explicit, reviewable approval of the exact new value
    writeJson(root, "tokens/protected-tokens.json", policy)
    writeFreshGeneratedCss(root)
    try {
      const result = runProtectedTokenChecks(root)
      const finding = result.sections.protectedTokens.find((f) => f.path === "color.royalBlue.700")
      assert.equal(finding.status, "pass")
    } finally {
      cleanup(root)
    }
  })

  test("mismatched approval: an approvedValue that matches neither the old nor the actual value still fails (no time-based staleness — this is a value-equality rule)", () => {
    const root = makeFixtureRoot({ royalBlue700Hex: "#E90303" })
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"))
    const entry = policy.protected.find((p) => p.path === "color.royalBlue.700")
    entry.approvedValue.hex = "#123456" // approves neither the old nor the actual new value
    writeJson(root, "tokens/protected-tokens.json", policy)
    writeFreshGeneratedCss(root)
    try {
      const result = runProtectedTokenChecks(root)
      const failure = result.sections.protectedTokens.find((f) => f.path === "color.royalBlue.700")
      assert.equal(failure.status, "fail")
      assert.equal(failure.proposedValue, "#E90303")
      assert.equal(failure.previousApprovedValue, "#123456")
    } finally {
      cleanup(root)
    }
  })

  test("description/value mismatch: fails even when the token isn't protected", () => {
    const root = makeFixtureRoot({ neutral800Desc: "Grey 800 — #25313B. Primary dark surface." })
    // Now silently change the value without touching the description —
    // exactly what happened to the real neutral.800 in commit 4e82f66.
    const pLightPath = path.join(root, "tokens/P_Light_Default.tokens.json")
    const pLight = JSON.parse(fs.readFileSync(pLightPath, "utf8"))
    pLight.color.neutral["800"].$value.hex = "#34A73A"
    writeJson(root, "tokens/P_Light_Default.tokens.json", pLight)
    // Also approve it as a protected-token change so ONLY the
    // description/value check should fail, isolating what this test covers.
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"))
    policy.protected.find((p) => p.path === "color.neutral.800").approvedValue.hex = "#34A73A"
    writeJson(root, "tokens/protected-tokens.json", policy)
    writeFreshGeneratedCss(root)
    try {
      const result = runProtectedTokenChecks(root)
      assert.equal(result.ok, false)
      const mismatch = result.sections.descriptionValueConsistency.find((f) => f.path === "color.neutral.800")
      assert.ok(mismatch, "expected a description/value mismatch for color.neutral.800")
      assert.equal(mismatch.status, "fail")
      assert.equal(mismatch.describedHex, "#25313B")
      assert.equal(mismatch.actualHex, "#34A73A")
    } finally {
      cleanup(root)
    }
  })

  test("stale generated CSS: fails when src/styles/prism-generated.css doesn't match the token sources", () => {
    const root = makeFixtureRoot()
    fs.mkdirSync(path.join(root, "src/styles"), { recursive: true })
    fs.writeFileSync(path.join(root, "src/styles/prism-generated.css"), "/* deliberately wrong */\n:root {\n  --p-color-royal-blue-700: #000000;\n}\n", "utf8")
    try {
      const result = runProtectedTokenChecks(root)
      const finding = result.sections.generatedOutput[0]
      assert.equal(finding.status, "fail")
      assert.match(finding.message, /stale/)
    } finally {
      cleanup(root)
    }
  })

  test("rendered-token smoke checks fail when a semantic token drifts from the approved primitive it's supposed to reflect", () => {
    const root = makeFixtureRoot({ actionPrimaryHex: "#999999" }) // semantic literal no longer matches royalBlue.700
    writeFreshGeneratedCss(root)
    try {
      const result = runProtectedTokenChecks(root)
      const smoke = result.sections.renderedSmoke.find((f) => f.label === "Primary action colour")
      assert.equal(smoke.status, "fail")
      assert.equal(smoke.actual, "#999999")
      assert.equal(smoke.expected, "#0369E9")
    } finally {
      cleanup(root)
    }
  })
})

// checkProposedProtectedChanges is the pre-apply gate figma-sync.mjs uses:
// it compares what a Figma snapshot PROPOSES (already-parsed
// changedTokenDetails, never read from disk here) against the policy, and
// never touches any file itself (no fs.writeFileSync anywhere in it —
// verified end-to-end, against the real script, in mutation-order.test.mjs).
describe("validate-protected-tokens: checkProposedProtectedChanges", () => {
  test("a proposed value matching the current approval passes and is not treated as a new change needing review", () => {
    const root = makeFixtureRoot()
    try {
      const result = checkProposedProtectedChanges(root, [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#0369E9" }])
      assert.equal(result.ok, true)
      assert.deepEqual(result.blocked, [])
    } finally {
      cleanup(root)
    }
  })

  test("a proposed value that does not match the approved baseline blocks — the real incident value", () => {
    const root = makeFixtureRoot()
    try {
      const result = checkProposedProtectedChanges(root, [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#E90303" }])
      assert.equal(result.ok, false)
      assert.equal(result.blocked.length, 1)
      assert.match(result.blocked[0].message, /design owner must deliberately edit tokens\/protected-tokens\.json/)
      assert.match(result.blocked[0].message, /never make that edit/)
    } finally {
      cleanup(root)
    }
  })

  test("a proposed value matching a policy that was deliberately updated beforehand is pre-approved and allowed", () => {
    const root = makeFixtureRoot()
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"))
    policy.protected.find((p) => p.path === "color.royalBlue.700").approvedValue.hex = "#E90303" // deliberate, prior, separate approval
    writeJson(root, "tokens/protected-tokens.json", policy)
    try {
      const result = checkProposedProtectedChanges(root, [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#E90303" }])
      assert.equal(result.ok, true)
      assert.equal(result.preApproved.length, 1)
      assert.equal(result.preApproved[0].approvedBy, "design-owner")
    } finally {
      cleanup(root)
    }
  })

  test("mismatched approval metadata (approved value doesn't match either the old or the proposed value) still blocks — a value-equality rule, not a time-based one", () => {
    const root = makeFixtureRoot()
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"))
    policy.protected.find((p) => p.path === "color.royalBlue.700").approvedValue.hex = "#123456" // stale/wrong on both counts
    writeJson(root, "tokens/protected-tokens.json", policy)
    try {
      const result = checkProposedProtectedChanges(root, [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#E90303" }])
      assert.equal(result.ok, false)
      assert.equal(result.blocked[0].approvedHex, "#123456")
    } finally {
      cleanup(root)
    }
  })

  test("a non-protected token's proposed change is ignored by this gate entirely", () => {
    const root = makeFixtureRoot()
    try {
      const result = checkProposedProtectedChanges(root, [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.600", oldValue: "#AAAAAA", newValue: "#BBBBBB" }])
      assert.equal(result.ok, true)
      assert.deepEqual(result.blocked, [])
      assert.deepEqual(result.preApproved, [])
    } finally {
      cleanup(root)
    }
  })

  test("never writes to tokens/protected-tokens.json", () => {
    const root = makeFixtureRoot()
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const before = fs.statSync(policyPath).mtimeMs
    const beforeContent = fs.readFileSync(policyPath, "utf8")
    try {
      checkProposedProtectedChanges(root, [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#E90303" }])
      assert.equal(fs.statSync(policyPath).mtimeMs, before)
      assert.equal(fs.readFileSync(policyPath, "utf8"), beforeContent)
    } finally {
      cleanup(root)
    }
  })
})

// Approval-metadata completeness. There is no time-based "staleness" for
// tokens/protected-tokens.json — it's a persistent baseline with no expiry,
// so an old approvedAt date is never itself a failure. What IS validated is
// completeness/well-formedness of the approval record, and — separately —
// that a value that doesn't match the record is rejected regardless of how
// old or new the record is (see "protected-token change without approval"
// and "mismatched approval" above, which cover THAT rule).
describe("validate-protected-tokens: validatePolicySchema (approval-metadata completeness)", () => {
  function baseEntry(overrides = {}) {
    return {
      path: "color.royalBlue.700",
      files: ["tokens/P_Light_Default.tokens.json"],
      reason: "test",
      approvedValue: { hex: "#0369E9" },
      approvedBy: "design-owner",
      approvedAt: "2026-08-28",
      ...overrides,
    }
  }

  test("a fully-populated entry passes", () => {
    const findings = validatePolicySchema({ protected: [baseEntry()] })
    assert.deepEqual(findings, [])
  })

  test("missing approvedBy (approver) fails", () => {
    const entry = baseEntry()
    delete entry.approvedBy
    const findings = validatePolicySchema({ protected: [entry] })
    assert.equal(findings.length, 1)
    assert.match(findings[0].message, /approvedBy/)
  })

  test("missing approvedAt (approval date) fails", () => {
    const entry = baseEntry()
    delete entry.approvedAt
    const findings = validatePolicySchema({ protected: [entry] })
    assert.equal(findings.length, 1)
    assert.match(findings[0].message, /approvedAt/)
  })

  test("missing reason fails", () => {
    const entry = baseEntry({ reason: "" })
    const findings = validatePolicySchema({ protected: [entry] })
    assert.equal(findings.length, 1)
    assert.match(findings[0].message, /reason/)
  })

  test("invalid approvedBy (empty/whitespace-only) fails", () => {
    const entry = baseEntry({ approvedBy: "   " })
    const findings = validatePolicySchema({ protected: [entry] })
    assert.equal(findings.length, 1)
    assert.match(findings[0].message, /approvedBy/)
  })

  test("invalid approvedAt (not an ISO date) fails", () => {
    const entry = baseEntry({ approvedAt: "August 28th, 2026" })
    const findings = validatePolicySchema({ protected: [entry] })
    assert.equal(findings.length, 1)
    assert.match(findings[0].message, /approvedAt/)
  })

  test("invalid approvedValue.hex (not a well-formed hex colour) fails", () => {
    const entry = baseEntry({ approvedValue: { hex: "blue" } })
    const findings = validatePolicySchema({ protected: [entry] })
    assert.equal(findings.length, 1)
    assert.match(findings[0].message, /approvedValue\.hex/)
  })

  test("a malformed entry blocks checkProposedProtectedChanges even when the proposed value would otherwise match", () => {
    // The record itself can't be trusted as a real approval if it's
    // incomplete — even though "#0369E9" is the correct value, an
    // approval record with no approver name isn't a verifiable approval.
    const root = makeFixtureRoot()
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"))
    delete policy.protected.find((p) => p.path === "color.royalBlue.700").approvedBy
    writeJson(root, "tokens/protected-tokens.json", policy)
    try {
      const result = checkProposedProtectedChanges(root, [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#0369E9" }])
      assert.equal(result.ok, false)
      assert.match(result.blocked[0].message, /incomplete or malformed approval record/)
    } finally {
      cleanup(root)
    }
  })

  test("a malformed entry (unrelated to any current change) fails the standing check too", () => {
    const root = makeFixtureRoot()
    writeFreshGeneratedCss(root)
    const policyPath = path.join(root, "tokens/protected-tokens.json")
    const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"))
    policy.protected.find((p) => p.path === "color.neutral.900").approvedAt = "not-a-date"
    writeJson(root, "tokens/protected-tokens.json", policy)
    try {
      const result = runProtectedTokenChecks(root)
      assert.equal(result.ok, false)
      assert.equal(result.sections.policySchema.length, 1)
      assert.match(result.sections.policySchema[0].message, /approvedAt/)
    } finally {
      cleanup(root)
    }
  })
})
