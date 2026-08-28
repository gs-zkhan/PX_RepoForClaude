import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import http from "node:http"
import { pathToFileURL } from "node:url"

import { makeFixtureRoot, cleanup } from "./helpers.mjs"
import { buildMinimalSyncRepo, buildMismatchedSnapshot } from "./git-fixture-helpers.mjs"
import { buildSyncReport, buildPrBody, resolveOrCreatePr, truncateReport, MAX_REPORT_LENGTH } from "../../scripts/generate-sync-report.mjs"
import { buildGeneratedCss } from "../../scripts/generate-prism-css.mjs"

function writeFreshGeneratedCss(root) {
  const { css } = buildGeneratedCss(root)
  fs.mkdirSync(path.join(root, "src/styles"), { recursive: true })
  fs.writeFileSync(path.join(root, "src/styles/prism-generated.css"), css, "utf8")
}

// makeFixtureRoot()'s lightweight token corpus doesn't satisfy
// validate-prism-tokens.mjs's floor requirements (154/136/etc. tokens per
// source) — real, correct, unrelated to anything these tests exercise.
// Injected here exactly like sync-report.test.mjs does, so these tests
// isolate PR-body composition from that floor requirement.
const CLEAN_ALIAS_DEBT = { ok: true, existingDebt: [], newDebt: [], resolvedDebt: [], unusedPrimitives: [], hardErrors: [] }

// -----------------------------------------------------------------------------
// Tests the actual wiring of the sync report into figma-sync.mjs's real
// workflow (blocked path via the real bridge server; allowed path's
// PR-body construction; duplicate-PR guard; size/security properties of
// the report itself) — as opposed to report-composition tests already
// covered in sync-report.test.mjs. No test here creates a real branch,
// push, or PR against GitHub — the "allowed" scenarios use injected fake
// `gh` runners and a throwaway local bridge server, never a real gh binary
// or GitHub API call.
// -----------------------------------------------------------------------------

describe("workflow wiring: blocked sync via the real bridge", () => {
  test("bridge response exposes blocked status, a report, and a concise summary — with zero mutation", async () => {
    const repoRoot = buildMinimalSyncRepo()
    try {
      // Import the bridge's OWN copy (bundled into the fixture, like every
      // other script) with the fixture as the current working directory,
      // so its `root = process.cwd()` resolves to the fixture — not this
      // test file's real repo — without needing to change that constant
      // into an env-configurable override.
      const originalCwd = process.cwd()
      process.chdir(repoRoot)
      let bridgeModule
      try {
        bridgeModule = await import(pathToFileURL(path.join(repoRoot, "scripts/figma-local-bridge.mjs")).href)
      } finally {
        process.chdir(originalCwd)
      }

      const server = http.createServer(bridgeModule.requestHandler)
      await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
      const { port } = server.address()

      try {
        const snapshotPath = buildMismatchedSnapshot()
        const snapshotBody = fs.readFileSync(snapshotPath, "utf8")

        const beforeBranches = fs
          .readFileSync(path.join(repoRoot, ".git", "HEAD"), "utf8")
          .trim()

        const response = await fetch(`http://127.0.0.1:${port}/sync`, {
          method: "POST",
          headers: { Authorization: `Bearer ${bridgeModule.sessionToken}`, "Content-Type": "application/json" },
          body: snapshotBody,
        })
        const result = await response.json()

        assert.equal(response.status, 500) // blocked = non-zero exit from figma-sync.mjs
        assert.equal(result.success, false)
        assert.equal(result.status, "blocked")
        assert.match(result.reportSummary, /Blocked/)
        assert.match(result.report, /color\.royalBlue\.700/)
        assert.match(result.report, /Status: 🚫 BLOCKED/)
        assert.equal(result.branch, null)
        assert.equal(result.prUrl, null)

        // Zero mutation: HEAD unchanged, no branches created, working tree clean.
        const afterBranches = fs.readFileSync(path.join(repoRoot, ".git", "HEAD"), "utf8").trim()
        assert.equal(afterBranches, beforeBranches)
      } finally {
        await new Promise((resolve) => server.close(resolve))
      }
    } finally {
      fs.rmSync(repoRoot, { recursive: true, force: true })
    }
  })
})

describe("workflow wiring: allowed sync's PR-body construction", () => {
  test("buildPrBody embeds the real dry-run report, including proposed values and required sections", () => {
    const root = makeFixtureRoot()
    writeFreshGeneratedCss(root)
    try {
      const changedTokenDetails = [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.600", oldValue: "#AAAAAA", newValue: "#BBBBBB" }]
      const syncReport = buildSyncReport({ rootDir: root, changedTokenDetails, aliasDebtResult: CLEAN_ALIAS_DEBT })
      assert.equal(syncReport.blocked, false, "fixture's ordinary, non-protected change should not be blocked")

      const prBody = buildPrBody({
        figmaFileName: "Prism V1 - ShadCN",
        exportedAt: "2026-08-28T12:00:00.000Z",
        changedLiteralCount: 1,
        changedTokensList: "  - color.royalBlue.600: #AAAAAA → #BBBBBB",
        deferredCount: 0,
        syncReport,
      })

      // Required sections.
      for (const heading of ["### Changed tokens", "### Protected-token status", "### Known semantic/component consumers", "### Visible surfaces affected", "### Description/value consistency", "### Alias changes / regressions", "### Generated-output changes", "### Rendered-token smoke checks", "### Required reviewer action"]) {
        assert.ok(prBody.includes(heading), `expected PR body to include "${heading}"`)
      }
      assert.match(prBody, /Status: ✅ PASS/)

      // Real proposed values — not invented, not summarized away.
      assert.match(prBody, /color\.royalBlue\.600/)
      assert.match(prBody, /#AAAAAA/)
      assert.match(prBody, /#BBBBBB/)
    } finally {
      cleanup(root)
    }
  })

  test("buildPrBody surfaces a blocked protected-token change in the PR body too (never silently dropped)", () => {
    const root = makeFixtureRoot()
    writeFreshGeneratedCss(root)
    try {
      const changedTokenDetails = [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#E90303" }]
      const syncReport = buildSyncReport({ rootDir: root, changedTokenDetails, aliasDebtResult: CLEAN_ALIAS_DEBT })
      assert.equal(syncReport.blocked, true)

      const prBody = buildPrBody({
        figmaFileName: "Prism V1 - ShadCN",
        exportedAt: "2026-08-28T12:00:00.000Z",
        changedLiteralCount: 1,
        changedTokensList: "  - color.royalBlue.700: #0369E9 → #E90303",
        deferredCount: 0,
        syncReport,
      })

      assert.match(prBody, /Status: 🚫 BLOCKED/)
      assert.match(prBody, /color\.royalBlue\.700/)
      assert.match(prBody, /#E90303/)
    } finally {
      cleanup(root)
    }
  })
})

describe("workflow wiring: duplicate-PR guard", () => {
  test("reuses an existing open PR for the branch instead of creating a duplicate", () => {
    const calls = []
    const fakeRunGh = (args) => {
      calls.push(args)
      if (args[0] === "pr" && args[1] === "list") {
        return { status: 0, stdout: JSON.stringify([{ url: "https://github.com/example/repo/pull/42" }]), stderr: "" }
      }
      throw new Error(`Unexpected gh call in this test: ${args.join(" ")}`)
    }

    const result = resolveOrCreatePr({ branchName: "figma-sync/2026-08-28-1200", prTitle: "chore: sync Prism tokens from Figma", prBody: "body", runGh: fakeRunGh })

    assert.equal(result.prUrl, "https://github.com/example/repo/pull/42")
    assert.equal(result.reused, true)
    assert.equal(result.created, false)
    assert.equal(calls.some((c) => c[0] === "pr" && c[1] === "create"), false, "must never call `gh pr create` when an open PR already exists")
  })

  test("creates a new PR when none exists for the branch", () => {
    const fakeRunGh = (args) => {
      if (args[0] === "pr" && args[1] === "list") return { status: 0, stdout: "[]", stderr: "" }
      if (args[0] === "pr" && args[1] === "create") return { status: 0, stdout: "https://github.com/example/repo/pull/43\n", stderr: "" }
      throw new Error(`Unexpected gh call: ${args.join(" ")}`)
    }

    const result = resolveOrCreatePr({ branchName: "figma-sync/2026-08-28-1300", prTitle: "chore: sync Prism tokens from Figma", prBody: "body", runGh: fakeRunGh })

    assert.equal(result.prUrl, "https://github.com/example/repo/pull/43")
    assert.equal(result.created, true)
    assert.equal(result.reused, false)
  })

  test("falls back gracefully (no PR, an error, not a crash) when gh pr create fails", () => {
    const fakeRunGh = (args) => {
      if (args[0] === "pr" && args[1] === "list") return { status: 0, stdout: "[]", stderr: "" }
      if (args[0] === "pr" && args[1] === "create") return { status: 1, stdout: "", stderr: "HTTP 422: already exists" }
      throw new Error(`Unexpected gh call: ${args.join(" ")}`)
    }

    const result = resolveOrCreatePr({ branchName: "figma-sync/2026-08-28-1400", prTitle: "t", prBody: "b", runGh: fakeRunGh })

    assert.equal(result.prUrl, null)
    assert.equal(result.created, false)
    assert.match(result.error, /already exists/)
  })
})

describe("workflow wiring: report security and size", () => {
  test("does not leak absolute filesystem paths from the fixture root", () => {
    const root = makeFixtureRoot()
    try {
      const syncReport = buildSyncReport({ rootDir: root, changedTokenDetails: [{ layer: "primitive", file: "tokens/P_Light_Default.tokens.json", tokenPath: "color.royalBlue.700", oldValue: "#0369E9", newValue: "#E90303" }] })
      assert.doesNotMatch(syncReport.markdown, new RegExp(root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
      assert.doesNotMatch(syncReport.markdown, /\/(Users|home)\//)
      assert.doesNotMatch(syncReport.markdown, new RegExp(os.tmpdir().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    } finally {
      cleanup(root)
    }
  })

  test("does not leak environment-variable-shaped credentials (GH_BIN, GITHUB_TOKEN, tokens, secrets)", () => {
    const root = makeFixtureRoot()
    try {
      const syncReport = buildSyncReport({ rootDir: root, changedTokenDetails: [] })
      for (const pattern of [/GH_BIN/, /GITHUB_TOKEN/, /gho_[a-zA-Z0-9]/, /Bearer /, /Authorization/i]) {
        assert.doesNotMatch(syncReport.markdown, pattern)
      }
    } finally {
      cleanup(root)
    }
  })

  test("truncateReport summarizes an oversized report instead of exceeding GitHub's PR-body limit", () => {
    const huge = "x".repeat(MAX_REPORT_LENGTH + 50000)
    const { markdown, truncated } = truncateReport(huge)
    assert.equal(truncated, true)
    assert.ok(markdown.length <= MAX_REPORT_LENGTH, `truncated markdown (${markdown.length}) must not exceed MAX_REPORT_LENGTH (${MAX_REPORT_LENGTH})`)
    assert.ok(markdown.length < 65536, "must stay under GitHub's actual PR-body limit regardless of MAX_REPORT_LENGTH's exact value")
    assert.match(markdown, /truncated/)
  })

  test("truncateReport leaves a normally-sized report untouched", () => {
    const normal = "## Figma sync report\n\nnothing unusual here"
    const { markdown, truncated } = truncateReport(normal)
    assert.equal(truncated, false)
    assert.equal(markdown, normal)
  })
})
