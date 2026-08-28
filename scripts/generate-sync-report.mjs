import { pathToFileURL } from "node:url"

import { runProtectedTokenChecks, checkProposedProtectedChanges, findKnownConsumers, loadPolicy } from "./validate-protected-tokens.mjs"
import { runAliasDebtChecks } from "./validate-alias-debt.mjs"

// -----------------------------------------------------------------------------
// Builds the single, reviewable report every Figma sync must produce —
// composed from data other scripts already compute (changed-token details
// from figma-snapshot-import.mjs's dry run, protected-token status from
// validate-protected-tokens.mjs, alias-debt status from
// validate-alias-debt.mjs), not re-derived or duplicated here.
//
// Pure function: given the already-computed inputs, returns a markdown
// report and a machine-readable summary. No filesystem/process side
// effects beyond what the check functions it calls perform (all read-only —
// nothing here writes a file, creates a branch, or touches git). Called by
// scripts/figma-sync.mjs BEFORE branch creation, from the dry run's
// already-computed data, precisely so a blocked sync can surface a full
// report without any mutation having happened yet.
//
// Every message this produces uses only relative token-file paths
// ("tokens/P_Light_Default.tokens.json") and token/branch/value data — never
// `rootDir`, `process.cwd()`, an absolute path, an env var, or anything
// resembling a credential. Verified by tests/token-guardrails/report-security.test.mjs.
// -----------------------------------------------------------------------------

// `aliasDebtResult` / `proposedProtectedCheck` can be injected (tests use
// this to isolate report composition from validate-prism-tokens.mjs's own,
// much heavier, floor-count requirements) — production callers never pass
// them, so the real checks always run there.
function buildSyncReport({ rootDir, changedTokenDetails = [], aliasDebtResult = null, proposedProtectedCheck = null }) {
  const standingCheck = runProtectedTokenChecks(rootDir)
  const resolvedProposedCheck = proposedProtectedCheck ?? checkProposedProtectedChanges(rootDir, changedTokenDetails)
  const resolvedAliasDebtResult = aliasDebtResult ?? runAliasDebtChecks(rootDir)

  const blockedPaths = new Set(resolvedProposedCheck.blocked.map((b) => b.tokenPath))
  const preApprovedPaths = new Set(resolvedProposedCheck.preApproved.map((b) => b.tokenPath))
  const policy = loadPolicy(rootDir)
  const policyEntryByPath = new Map(policy.protected.map((entry) => [entry.path, entry]))

  const changedRows = changedTokenDetails.map((change) => {
    const isProtected = blockedPaths.has(change.tokenPath) || preApprovedPaths.has(change.tokenPath)
    const protectedStatus = blockedPaths.has(change.tokenPath) ? "blocked" : preApprovedPaths.has(change.tokenPath) ? "pre-approved" : null
    const consumers = findKnownConsumers(rootDir, change.tokenPath)
    return { ...change, isProtected, protectedStatus, consumers }
  })

  const descriptionMismatches = standingCheck.sections.descriptionValueConsistency.filter((f) => f.status === "fail")
  const staleGenerated = standingCheck.sections.generatedOutput.filter((f) => f.status === "fail")
  const failedSmoke = standingCheck.sections.renderedSmoke.filter((f) => f.status === "fail")

  const blocked =
    !resolvedProposedCheck.ok ||
    descriptionMismatches.length > 0 ||
    staleGenerated.length > 0 ||
    failedSmoke.length > 0 ||
    !resolvedAliasDebtResult.ok

  const lines = []
  lines.push("## Figma sync report")
  lines.push("")
  lines.push(blocked ? "**Status: 🚫 BLOCKED — do not merge as-is**" : "**Status: ✅ PASS**")
  lines.push("")

  lines.push("### Changed tokens")
  if (changedRows.length === 0) {
    lines.push("_No literal token changes in this sync._")
  } else {
    lines.push("| Token | Old value | New value | Protected? |")
    lines.push("| --- | --- | --- | --- |")
    for (const row of changedRows) {
      const protectedLabel = row.protectedStatus === "blocked" ? "🚫 blocked" : row.protectedStatus === "pre-approved" ? "✅ pre-approved" : "no"
      lines.push(`| ${row.layer}:${row.tokenPath} | ${row.oldValue} | ${row.newValue} | ${protectedLabel} |`)
    }
  }
  lines.push("")

  lines.push("### Protected-token status")
  if (resolvedProposedCheck.blocked.length === 0) {
    lines.push("No protected token's proposed value conflicts with its approved value in `tokens/protected-tokens.json`.")
    if (resolvedProposedCheck.preApproved.length > 0) {
      lines.push("Pre-approved changes proceeding in this sync:")
      for (const p of resolvedProposedCheck.preApproved) {
        lines.push(`- \`${p.tokenPath}\`: ${p.oldValue} → ${p.newValue} (approved by ${p.approvedBy} on ${p.approvedAt})`)
      }
    }
  } else {
    lines.push("🚫 **Blocked** — the following protected token(s) do not match their approved value:")
    for (const b of resolvedProposedCheck.blocked) {
      lines.push(`- \`${b.tokenPath}\`: proposed ${b.newValue}, approved value on record is ${b.approvedHex}`)
    }
  }
  lines.push("")

  lines.push("### Known semantic/component consumers")
  const changedWithConsumers = changedRows.filter((r) => r.consumers.length > 0)
  if (changedWithConsumers.length === 0) {
    lines.push("_No changed token has a known Semantic/Component consumer (see ai/token-guardrails.md — this can mean genuinely none, or a Semantic token whose description doesn't name it)._")
  } else {
    for (const row of changedWithConsumers) {
      lines.push(`- \`${row.tokenPath}\`:`)
      for (const c of row.consumers) lines.push(`  - ${c.layer}:${c.tokenPath} (${c.file})`)
    }
  }
  lines.push("")

  lines.push("### Visible surfaces affected")
  const changedWithSurfaces = changedRows
    .map((row) => ({ row, entry: policyEntryByPath.get(row.tokenPath) }))
    .filter(({ entry }) => entry?.visibleSurfaces?.length)
  if (changedWithSurfaces.length === 0) {
    lines.push("_No changed token has a recorded visible-surfaces list (only protected tokens carry one today)._")
  } else {
    for (const { row, entry } of changedWithSurfaces) {
      lines.push(`- \`${row.tokenPath}\`: ${entry.visibleSurfaces.join(", ")}`)
    }
  }
  lines.push("")

  lines.push("### Description/value consistency")
  lines.push(
    descriptionMismatches.length === 0
      ? "All token descriptions that state an expected hex value agree with their literal `$value`."
      : `⚠️ ${descriptionMismatches.length} mismatch(es):\n` + descriptionMismatches.map((f) => `- ${f.message}`).join("\n"),
  )
  lines.push("")

  lines.push("### Alias changes / regressions")
  lines.push(`Existing (baselined) alias debt: ${resolvedAliasDebtResult.existingDebt.length}. Newly introduced: ${resolvedAliasDebtResult.newDebt.length}.`)
  if (resolvedAliasDebtResult.newDebt.length > 0) {
    lines.push("New debt (blocking):")
    for (const fp of resolvedAliasDebtResult.newDebt) lines.push(`- ${fp}`)
  }
  if (resolvedAliasDebtResult.hardErrors?.length > 0) {
    lines.push(`🚫 **Blocked** — token validation reported ${resolvedAliasDebtResult.hardErrors.length} structural error(s) (unrelated to alias-debt baselining):`)
    for (const e of resolvedAliasDebtResult.hardErrors) lines.push(`- ${e}`)
  }
  lines.push(`Emitted-but-unused primitives: ${resolvedAliasDebtResult.unusedPrimitives.length} (informational, not blocking).`)
  lines.push("")

  lines.push("### Generated-output changes")
  lines.push(
    staleGenerated.length === 0
      ? "`src/styles/prism-generated.css` is up to date with the token sources as of this dry run."
      : `🚫 **Blocked** — ${staleGenerated.map((f) => f.message).join(" ")}`,
  )
  lines.push("")

  lines.push("### Rendered-token smoke checks")
  for (const check of standingCheck.sections.renderedSmoke) {
    lines.push(check.status === "pass" ? `- ✅ ${check.label}: ${check.value}` : `- 🚫 ${check.message}`)
  }
  lines.push("")

  lines.push("### Required reviewer action")
  if (!blocked) {
    lines.push("None — this sync only touches non-protected or pre-approved, unambiguous literal values, all consistency checks pass, and generated output is up to date. Safe to review as a normal token-value PR.")
  } else {
    const actions = []
    if (resolvedProposedCheck.blocked.length > 0) actions.push("Review each blocked protected-token change above. If intentional, the design owner must update `tokens/protected-tokens.json`'s `approvedValue` in its OWN, separate, prior commit — never in this sync's own commit — before re-running the sync.")
    if (descriptionMismatches.length > 0) actions.push("Resolve each description/value mismatch — either the literal value or the description is wrong; confirm which with the design owner.")
    if (staleGenerated.length > 0) actions.push("Run `npm run tokens:generate` and commit the result.")
    if (resolvedAliasDebtResult.newDebt.length > 0) actions.push("Review the newly introduced alias debt above — fix it, or if it's an accepted trade-off, add it to `tokens/alias-debt-baseline.json` explicitly (with a reviewer's sign-off, not silently).")
    if (resolvedAliasDebtResult.hardErrors?.length > 0) actions.push("Fix the structural token-validation error(s) above (run `npm run tokens:validate` for the full report) — these are unrelated to alias-debt baselining and must be resolved before this sync can proceed.")
    lines.push("🚫 **This sync must not be merged as-is.**")
    for (const a of actions) lines.push(`- ${a}`)
  }

  return {
    blocked,
    markdown: lines.join("\n"),
    standingCheck,
    proposedProtectedCheck: resolvedProposedCheck,
    aliasDebtResult: resolvedAliasDebtResult,
    changedRows,
  }
}

// GitHub's PR body limit is 65536 characters. Kept well under that (not
// just barely under it) so the report never contributes to a PR that's
// already large for other reasons. Truncates the markdown body, keeping
// the status line and section headers' presence obvious, and appends an
// explicit note rather than silently cutting content.
const MAX_REPORT_LENGTH = 60000

function truncateReport(markdown, maxLength = MAX_REPORT_LENGTH) {
  if (markdown.length <= maxLength) return { markdown, truncated: false }

  const noticeText = "\n\n... _(report truncated — it exceeded the safe PR-body size limit; see the full sync log for the complete output)_"
  const keep = maxLength - noticeText.length
  return { markdown: markdown.slice(0, Math.max(0, keep)) + noticeText, truncated: true }
}

// A short, single-paragraph version for surfaces with no room for the full
// markdown (the plugin UI / bridge JSON response) — never includes a file
// path or credential, same as the full report.
function summarizeReport(report) {
  const changedCount = report.changedRows.length
  const blockedCount = report.proposedProtectedCheck.blocked.length
  if (report.blocked) {
    const reasons = []
    if (blockedCount > 0) reasons.push(`${blockedCount} protected-token mismatch(es)`)
    if (!report.aliasDebtResult.ok) reasons.push("alias-debt regression")
    return `Blocked: ${reasons.join(", ") || "value-integrity check failed"}.`
  }
  return `Pass: ${changedCount} token change(s) reviewed, no protected-token or consistency issues.`
}

// Pure: composes the GitHub PR body scripts/figma-sync.mjs actually opens
// a PR with. Extracted specifically so it's directly testable with real
// data shapes, without needing to run figma-sync.mjs end-to-end (which
// requires a full `npm run build` mid-flow — impractical to fabricate in a
// test fixture). figma-sync.mjs calls this with its own real
// snapshot/summary data and the same `syncReport` object surfaced on a
// blocked run — the PR body a reviewer sees is the same report a blocked
// run would have printed, not a separate, potentially-divergent summary.
function buildPrBody({ figmaFileName, exportedAt, changedLiteralCount, changedTokensList, deferredCount, syncReport }) {
  const { markdown: reportSection } = truncateReport(syncReport.markdown)

  const body =
    `Prism Figma Sync\n\n` +
    `Source:\n${figmaFileName}\n\n` +
    `Snapshot:\n${exportedAt}\n\n` +
    `Applied:\n${changedLiteralCount} safe literal token change(s)\n\n` +
    (changedTokensList && changedTokensList.length > 0 ? `Changed tokens:\n${changedTokensList}\n\n` : "") +
    `Deferred:\n${deferredCount} known alias-structure difference(s) requiring separate cleanup\n\n` +
    `Verification:\n✓ token validation\n✓ token generation\n✓ convergence check\n✓ build\n\n` +
    `No auto-merge — this PR requires human review.\n\n` +
    `---\n\n${reportSection}`

  return body
}

// Pure decision logic for "reuse an existing PR for this branch, or create
// a new one" — never creates a second PR for the same branch. `runGh` is
// injected (figma-sync.mjs passes its real `(args) => run(ghBinary, args)`;
// tests pass a fake) specifically so this exact decision logic — including
// the duplicate-PR guard — is directly testable without a real `gh`
// binary, a real GitHub API call, or a real repository build.
function resolveOrCreatePr({ branchName, prTitle, prBody, runGh }) {
  const existingPrCheck = runGh(["pr", "list", "--head", branchName, "--state", "open", "--json", "url"])
  let existingPrUrl = null
  if (existingPrCheck.status === 0) {
    try {
      const existing = JSON.parse(existingPrCheck.stdout || "[]")
      if (existing.length > 0) existingPrUrl = existing[0].url
    } catch {
      // Unparseable gh output — fall through and attempt creation as normal.
    }
  }

  if (existingPrUrl) {
    return { prUrl: existingPrUrl, reused: true, created: false, error: null }
  }

  const prResult = runGh(["pr", "create", "--title", prTitle, "--body", prBody, "--base", "main", "--head", branchName])
  if (prResult.status === 0) {
    return { prUrl: prResult.stdout.trim(), reused: false, created: true, error: null }
  }

  return { prUrl: null, reused: false, created: false, error: prResult.stderr?.trim() || `gh pr create exited ${prResult.status}` }
}

export { buildSyncReport, buildPrBody, resolveOrCreatePr, truncateReport, summarizeReport, MAX_REPORT_LENGTH }

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rootDir = process.cwd()
  const report = buildSyncReport({ rootDir, changedTokenDetails: [] })
  console.log(report.markdown)
  console.log("")
  console.log(`(Run standalone with no changed-token details — pass real data via scripts/figma-sync.mjs for a sync-specific report.)`)
  process.exit(report.blocked ? 1 : 0)
}
