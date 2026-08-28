import { test, describe } from "node:test"
import assert from "node:assert/strict"

import { isSelfApprovalViolation } from "../../scripts/validate-no-self-approval.mjs"

describe("validate-no-self-approval: isSelfApprovalViolation", () => {
  test("a figma-sync/* branch modifying the policy file is a violation", () => {
    const violation = isSelfApprovalViolation("figma-sync/2026-08-28-1200", ["tokens/protected-tokens.json", "tokens/P_Light_Default.tokens.json"])
    assert.equal(violation, true)
  })

  test("a figma-sync/* branch NOT touching the policy file is not a violation", () => {
    const violation = isSelfApprovalViolation("figma-sync/2026-08-28-1200", ["tokens/P_Light_Default.tokens.json", "src/styles/prism-generated.css"])
    assert.equal(violation, false)
  })

  test("a human feature branch modifying the policy file is not a violation", () => {
    const violation = isSelfApprovalViolation("feature/figma-token-guardrails", ["tokens/protected-tokens.json"])
    assert.equal(violation, false)
  })

  test("an unrelated branch touching unrelated files is not a violation", () => {
    const violation = isSelfApprovalViolation("fix/nav-labels", ["src/components/px-shell-rail.tsx"])
    assert.equal(violation, false)
  })
})
