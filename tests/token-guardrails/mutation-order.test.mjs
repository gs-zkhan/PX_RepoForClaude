import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

import { sh, buildMinimalSyncRepo, buildMismatchedSnapshot } from "./git-fixture-helpers.mjs"

// -----------------------------------------------------------------------------
// Real, end-to-end integration test: runs the ACTUAL scripts/figma-sync.mjs
// (copied verbatim, not re-implemented) against a real, throwaway git
// repository, proposing a change to a protected token that does NOT match
// its approved value. Proves the ordering requirement directly, rather than
// asserting it from reading the source: the protected-token gate must stop
// the sync before ANY branch is created, ANY file is written, ANY commit
// happens, ANY push happens, and ANY PR is created — and
// tokens/protected-tokens.json must be untouched throughout.
//
// See ./git-fixture-helpers.mjs for the fixture repo shape and why it's
// intentionally minimal.
// -----------------------------------------------------------------------------

describe("figma-sync.mjs: mutation ordering", () => {
  test("a protected-token mismatch stops the sync before any branch, file, commit, push, or PR mutation", () => {
    const repoRoot = buildMinimalSyncRepo()
    try {
      const snapshotPath = buildMismatchedSnapshot()

      const beforeBranches = sh(repoRoot, "git", ["branch", "--format=%(refname:short)"]).stdout.trim().split("\n").sort()
      const beforeHead = sh(repoRoot, "git", ["rev-parse", "HEAD"]).stdout.trim()
      const policyPathAbs = path.join(repoRoot, "tokens/protected-tokens.json")
      const policyBefore = fs.readFileSync(policyPathAbs, "utf8")

      const run = spawnSync(process.execPath, [path.join(repoRoot, "scripts/figma-sync.mjs"), `--snapshot=${snapshotPath}`], {
        cwd: repoRoot,
        encoding: "utf8",
      })

      // 1. The sync must actually fail (not silently succeed or crash for
      // an unrelated reason) — and for the right reason: the printed
      // report (stdout) names the specific protected token and shows the
      // overall BLOCKED status, and the terminal fail() message (stderr)
      // confirms nothing was mutated.
      assert.equal(run.status, 1, `expected exit code 1, got ${run.status}. stdout:\n${run.stdout}\nstderr:\n${run.stderr}`)
      assert.match(run.stdout, /color\.royalBlue\.700/)
      assert.match(run.stdout, /Status: 🚫 BLOCKED/)
      assert.match(run.stderr, /Sync blocked/)
      assert.match(run.stderr, /Nothing has been branched, applied, committed, or pushed/)

      // 2. No new branch was created.
      const afterBranches = sh(repoRoot, "git", ["branch", "--format=%(refname:short)"]).stdout.trim().split("\n").sort()
      assert.deepEqual(afterBranches, beforeBranches, "no branch should have been created")

      // 3. HEAD did not move — no commit was created.
      const afterHead = sh(repoRoot, "git", ["rev-parse", "HEAD"]).stdout.trim()
      assert.equal(afterHead, beforeHead, "HEAD must not move — no commit should have been created")

      // 4. The working tree is exactly as it was — no file was mutated,
      // staged, or left dirty.
      const status = sh(repoRoot, "git", ["status", "--porcelain"]).stdout
      assert.equal(status, "", `working tree must be clean after a blocked sync, got:\n${status}`)

      // 5. tokens/protected-tokens.json specifically was never written.
      const policyAfter = fs.readFileSync(policyPathAbs, "utf8")
      assert.equal(policyAfter, policyBefore, "tokens/protected-tokens.json must be byte-identical after a blocked sync")

      // 6. No push happened (no remote configured at all in this fixture,
      // so any push attempt would itself have failed loudly — absence of
      // that failure in stderr, combined with HEAD/branches being
      // untouched, confirms push was never attempted).
      assert.doesNotMatch(run.stdout + run.stderr, /Pushing|git push/i)

      // 7. No PR-creation step was reached.
      assert.doesNotMatch(run.stdout + run.stderr, /gh pr create|Opening pull request/i)
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true })
    }
  })

  test("a pre-approved protected value (already recorded in protected-tokens.json before the sync) is allowed through the gate", () => {
    const repoRoot = buildMinimalSyncRepo()
    try {
      // Simulate a deliberate, prior, human approval: the design owner
      // already updated the policy to accept #E90303 for this token,
      // BEFORE this sync run — not something the sync did for itself.
      const policyPathAbs = path.join(repoRoot, "tokens/protected-tokens.json")
      const policy = JSON.parse(fs.readFileSync(policyPathAbs, "utf8"))
      policy.protected[0].approvedValue.hex = "#E90303"
      fs.writeFileSync(policyPathAbs, JSON.stringify(policy, null, 2))
      sh(repoRoot, "git", ["add", "-A"])
      sh(repoRoot, "git", ["commit", "-q", "-m", "design owner: approve royalBlue.700 -> #E90303"])

      const snapshotPath = buildMismatchedSnapshot()
      const run = spawnSync(process.execPath, [path.join(repoRoot, "scripts/figma-sync.mjs"), `--snapshot=${snapshotPath}`], {
        cwd: repoRoot,
        encoding: "utf8",
      })

      // This fixture's Semantic/Component files are empty (see the comment
      // on buildMinimalSyncRepo), so the report's standing smoke checks
      // legitimately fail here and the overall run still stops — what
      // this test isolates is that the protected-token part specifically
      // is NOT what blocks it this time, and that the pre-approval is
      // logged regardless of the overall outcome.
      assert.doesNotMatch(run.stdout, /do not match their approved value/)
      assert.match(run.stdout, /protected token change\(s\) are pre-approved — proceeding/)
      assert.match(run.stdout, /Status: ✅ PASS|Status: 🚫 BLOCKED/) // report was generated either way
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true })
    }
  })
})
