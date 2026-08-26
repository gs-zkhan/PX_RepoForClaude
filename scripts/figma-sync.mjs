import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

// Step 5A: orchestrates the ALREADY-PROVEN manual workflow end to end —
//
//   snapshot -> importer dry-run -> safety check -> importer --apply ->
//   validate -> generate -> verify changed files -> validate again ->
//   build -> convergence check -> branch -> commit -> push -> PR
//
// This script does not reimplement any comparison/validation/generation
// logic. It calls scripts/figma-snapshot-import.mjs,
// scripts/validate-prism-tokens.mjs, scripts/generate-prism-css.mjs, and
// `npm run build` exactly as a human would from the command line, and
// parses their output/exit codes to decide what to do next.
//
// Usage:
//   node scripts/figma-sync.mjs --snapshot=<path> [--no-push]
//
// --no-push stops after committing locally (used for scratch-environment
// testing) — it never touches origin and never creates a PR.

const root = process.cwd()
const args = process.argv.slice(2)
const snapshotArg = args.find((a) => a.startsWith("--snapshot="))
const noPush = args.includes("--no-push")

const EXPECTED_FIGMA_FILE_NAME = "Prism V1 - ShadCN"
const SUPPORTED_SCHEMA_VERSION = "1.0.0"

// Every file the rest of this pipeline is allowed to touch. Anything else
// appearing in `git diff --name-only` after apply/generate is treated as a
// structural surprise and blocks the run before any commit.
const ALLOWED_CHANGED_FILES = new Set([
  "tokens/P_Light_Default.tokens.json",
  "tokens/P_Dark.tokens.json",
  "tokens/S_Light.tokens.json",
  "tokens/S_Dark.tokens.json",
  "tokens/C_Default.tokens.json",
  "src/styles/prism-generated.css",
])

let stageIndex = 0
const TOTAL_STAGES = 11

function stage(label) {
  stageIndex++
  console.log(`\n[${stageIndex}/${TOTAL_STAGES}] ${label}`)
}

function fail(message) {
  console.error(`\nFIGMA SYNC STOPPED: ${message}`)
  process.exit(1)
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    ...options,
  })
  return result
}

function runNodeScript(scriptPath, scriptArgs = []) {
  return run(process.execPath, [scriptPath, ...scriptArgs])
}

function gitOutput(gitArgs) {
  const result = run("git", gitArgs)
  return (result.stdout ?? "").trim()
}

// --- [1] Preconditions -------------------------------------------------------

stage("Checking repository preconditions")

if (!snapshotArg) {
  fail(`Missing --snapshot=<path>. Usage: node scripts/figma-sync.mjs --snapshot=/path/to/prism-figma-snapshot.json`)
}
const snapshotPath = snapshotArg.slice("--snapshot=".length)

const porcelain = gitOutput(["status", "--porcelain"])
if (porcelain.length > 0) {
  fail(
    "Working tree is not clean. Refusing to proceed — nothing has been stashed, reset, or discarded.\n" +
      "Commit, stash, or clean up your changes yourself, then re-run.\n\n" +
      porcelain,
  )
}
console.log("  Working tree is clean.")

if (!fs.existsSync(snapshotPath)) {
  fail(`Snapshot file not found: ${snapshotPath}`)
}

let snapshot
try {
  snapshot = JSON.parse(fs.readFileSync(snapshotPath, "utf8"))
} catch (error) {
  fail(`Snapshot is not valid JSON: ${error.message}`)
}

if (snapshot.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
  fail(
    `Snapshot schemaVersion "${snapshot.schemaVersion}" is not supported (expected "${SUPPORTED_SCHEMA_VERSION}"). ` +
      `Refusing to guess how to interpret an unknown schema.`,
  )
}
console.log(`  Snapshot schema version ${snapshot.schemaVersion} is supported.`)

if (snapshot.figmaFileName !== EXPECTED_FIGMA_FILE_NAME) {
  fail(
    `Snapshot's figmaFileName is "${snapshot.figmaFileName}", expected "${EXPECTED_FIGMA_FILE_NAME}". ` +
      `Refusing to sync tokens from an unexpected Figma file.`,
  )
}
console.log(`  Snapshot is from the expected Figma file: "${snapshot.figmaFileName}".`)
console.log(`  Snapshot exported at: ${snapshot.exportedAt}`)

// --- [2] Import dry-run -------------------------------------------------------

stage("Comparing Figma snapshot against repo tokens (dry run)")

const importerScript = path.join(root, "scripts", "figma-snapshot-import.mjs")
const dryRun = runNodeScript(importerScript, [`--snapshot=${snapshotPath}`])

if (dryRun.status !== 0) {
  fail(`Importer dry run exited with a genuine error (exit ${dryRun.status}):\n\n${dryRun.stdout}\n${dryRun.stderr}`)
}

function parseSummary(output) {
  const patterns = {
    matched: /Matched \(no change\):\s*(\d+)/,
    changedLiteral: /Changed literal values:\s*(\d+)/,
    changedAliasTarget: /Changed alias targets:\s*(\d+)/,
    changedAliasStructure: /Changed literal<->alias:\s*(\d+)/,
    unmatchedRepo: /Unmatched repo tokens:\s*(\d+)/,
    unmatchedFigma: /Unmatched Figma variables:\s*(\d+)/,
    ambiguous: /Ambiguous:\s*(\d+)/,
    modeMismatch: /Mode mismatches:\s*(\d+)/,
    repoNoIdentity: /Repo tokens with no id:\s*(\d+)/,
    repoAliasUnresolvedLocally: /Repo alias unresolvable:\s*(\d+)/,
  }
  const summary = {}
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = output.match(pattern)
    if (!match) fail(`Could not parse "${key}" from importer output — importer output format may have changed.\n\n${output}`)
    summary[key] = Number(match[1])
  }
  return summary
}

const before = parseSummary(dryRun.stdout)
console.log(`  Matched: ${before.matched}, changedLiteral: ${before.changedLiteral}, changedAliasTarget: ${before.changedAliasTarget}`)
console.log(`  changedAliasStructure (known deferred debt): ${before.changedAliasStructure}`)
console.log(`  unmatchedRepo: ${before.unmatchedRepo}, unmatchedFigma: ${before.unmatchedFigma}, ambiguous: ${before.ambiguous}, modeMismatch: ${before.modeMismatch}`)

// --- [3] Structural safety gate -----------------------------------------------

stage("Checking for structural problems")

const structuralProblems = []
if (before.ambiguous > 0) structuralProblems.push(`${before.ambiguous} ambiguous mapping(s)`)
if (before.unmatchedFigma > 0) structuralProblems.push(`${before.unmatchedFigma} unmatched Figma variable(s)`)
if (before.unmatchedRepo > 0) structuralProblems.push(`${before.unmatchedRepo} unmatched repo token(s)`)
if (before.modeMismatch > 0) structuralProblems.push(`${before.modeMismatch} mode mismatch(es)`)
if (before.repoNoIdentity > 0) structuralProblems.push(`${before.repoNoIdentity} repo token(s) with no Figma identity`)

if (structuralProblems.length > 0) {
  fail(
    `Structural problems found, refusing to proceed:\n  - ${structuralProblems.join("\n  - ")}\n\n` +
      `Full importer output:\n${dryRun.stdout}`,
  )
}
console.log("  No ambiguous mappings, unmatched variables, or mode mismatches.")

// changedAliasTarget: Step 4B never exercised a real alias-retarget with a
// real Figma change, so this path is unproven. Default to requiring manual
// review rather than trusting the importer's --apply to retarget aliases
// automatically — and since --apply has no flag to apply changedLiteral
// while skipping changedAliasTarget, ANY changedAliasTarget blocks the
// whole automated run rather than silently letting an unproven retarget
// through alongside safe literal changes.
if (before.changedAliasTarget > 0) {
  fail(
    `${before.changedAliasTarget} changed alias target(s) detected. This category is not auto-applied by ` +
      `design (real alias-retarget behavior was never exercised against a live Figma change as of Step 4B) ` +
      `— it requires manual review. Re-run the importer manually with --apply only after reviewing these ` +
      `specific changes, or extend this policy deliberately once retargeting has been proven safe.\n\n` +
      `Full importer output:\n${dryRun.stdout}`,
  )
}
console.log("  No unproven alias-retarget changes present.")

if (before.changedAliasStructure > 0) {
  console.log(
    `  Note: ${before.changedAliasStructure} known deferred changedAliasStructure difference(s) present. ` +
      `These are pre-existing baseline debt (see Step 4B/4C) and do NOT block this sync.`,
  )
}

// --- [4] Determine whether there is anything safe to sync -------------------

if (before.changedLiteral === 0) {
  console.log("\nNo new safe Figma changes detected. Nothing to sync.")
  process.exit(0)
}
console.log(`  ${before.changedLiteral} safe deterministic literal change(s) will be applied.`)

// --- [5] Apply -----------------------------------------------------------------

stage("Applying safe changes")

const applyRun = runNodeScript(importerScript, [`--snapshot=${snapshotPath}`, "--apply"])
if (applyRun.status !== 0) {
  fail(`Importer --apply exited with an error (exit ${applyRun.status}):\n\n${applyRun.stdout}\n${applyRun.stderr}`)
}
console.log(applyRun.stdout.split("\n").filter((l) => l.startsWith("Applied") || l.startsWith("Skipped")).join("\n"))

function checkChangedFilesAreAllowed(stageName) {
  const changed = gitOutput(["diff", "--name-only"]).split("\n").filter(Boolean)
  const unexpected = changed.filter((f) => !ALLOWED_CHANGED_FILES.has(f))
  if (unexpected.length > 0) {
    fail(
      `After ${stageName}, unexpected file(s) changed: ${unexpected.join(", ")}\n` +
        `These files were modified and are left as-is for inspection — nothing has been committed or reverted.\n` +
        `Only these files are ever expected to change: ${[...ALLOWED_CHANGED_FILES].join(", ")}`,
    )
  }
  return changed
}

checkChangedFilesAreAllowed("apply")
console.log("  Only expected token source files were modified.")

// --- [6] Validate --------------------------------------------------------------

stage("Validating tokens")

const validateAfterApply = runNodeScript(path.join(root, "scripts", "validate-prism-tokens.mjs"))
console.log(validateAfterApply.stdout.trim())
if (validateAfterApply.status !== 0) {
  fail(
    "Token validation failed after applying Figma changes. The applied token file changes are left in place " +
      "for inspection — nothing has been committed or reverted.",
  )
}

// --- [7] Generate ---------------------------------------------------------------

stage("Regenerating Prism CSS")

const generateRun = runNodeScript(path.join(root, "scripts", "generate-prism-css.mjs"))
console.log(generateRun.stdout.trim())
if (generateRun.status !== 0) {
  fail(
    `CSS generation failed (exit ${generateRun.status}). Applied token changes are left in place for inspection.\n\n${generateRun.stderr}`,
  )
}

const changedAfterGenerate = checkChangedFilesAreAllowed("generation")
console.log(`  Changed files: ${changedAfterGenerate.join(", ")}`)

// --- [8] Re-validate -------------------------------------------------------------

stage("Re-validating tokens after generation")

const validateAfterGenerate = runNodeScript(path.join(root, "scripts", "validate-prism-tokens.mjs"))
if (validateAfterGenerate.status !== 0) {
  fail(
    "Token validation failed after regenerating CSS. Applied changes are left in place for inspection.\n\n" +
      validateAfterGenerate.stdout,
  )
}
console.log("  PASS")

// --- [9] Build -------------------------------------------------------------------

stage("Building")

const buildRun = run("npm", ["run", "build"], { shell: true })
if (buildRun.status !== 0) {
  fail(
    `Build failed after applying Figma changes. Applied changes are left in place for inspection.\n\n` +
      `${buildRun.stdout}\n${buildRun.stderr}`,
  )
}
console.log("  Build succeeded.")

// --- [10] Convergence check -------------------------------------------------------

stage("Confirming repo now matches Figma (convergence check)")

const convergenceRun = runNodeScript(importerScript, [`--snapshot=${snapshotPath}`])
if (convergenceRun.status !== 0) {
  fail(`Convergence dry run exited with an error (exit ${convergenceRun.status}).`)
}
const after = parseSummary(convergenceRun.stdout)
if (after.changedLiteral !== 0) {
  fail(
    `Convergence check failed: ${after.changedLiteral} literal difference(s) still remain after applying. ` +
      `Applied changes are left in place for inspection — do not assume the sync completed correctly.\n\n` +
      convergenceRun.stdout,
  )
}
console.log(`  Converged: 0 changedLiteral remaining. (changedAliasStructure: ${after.changedAliasStructure}, unchanged deferred debt.)`)

// --- [11] Branch, commit, push, PR -------------------------------------------------

stage("Creating sync branch, committing, and pushing")

function branchExists(branchName) {
  const local = run("git", ["rev-parse", "--verify", "--quiet", branchName])
  if (local.status === 0) return true
  const remote = gitOutput(["ls-remote", "--heads", "origin", branchName])
  return remote.length > 0
}

function timestampSlug() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, "0")
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
}

let branchName = `figma-sync/${timestampSlug()}`
let suffix = 2
while (branchExists(branchName)) {
  branchName = `figma-sync/${timestampSlug()}-${suffix}`
  suffix++
}

const checkoutResult = run("git", ["checkout", "-b", branchName])
if (checkoutResult.status !== 0) {
  fail(`Failed to create branch "${branchName}":\n${checkoutResult.stderr}`)
}
console.log(`  Created branch: ${branchName}`)

const addResult = run("git", ["add", ...changedAfterGenerate])
if (addResult.status !== 0) {
  fail(`Failed to stage changed files: ${addResult.stderr}`)
}

const commitBody =
  `Source: ${snapshot.figmaFileName}\n` +
  `Snapshot exported: ${snapshot.exportedAt}\n` +
  `Safe literal changes applied: ${before.changedLiteral}\n` +
  `Changed files:\n${changedAfterGenerate.map((f) => `  - ${f}`).join("\n")}\n` +
  `Deferred (not applied): ${before.changedAliasStructure} known changedAliasStructure difference(s)\n\n` +
  `Verification: tokens:validate (pass), tokens:generate, convergence check (pass), build (pass).`

const commitMessage = "chore: sync Prism tokens from Figma"
const commitResult = run("git", ["commit", "-m", commitMessage, "-m", commitBody])
if (commitResult.status !== 0) {
  fail(`Failed to commit: ${commitResult.stderr}`)
}
console.log(`  Committed: "${commitMessage}"`)

if (noPush) {
  console.log("\n--no-push specified — stopping before push. Branch and commit were created locally only.")
  process.exit(0)
}

const pushResult = run("git", ["push", "-u", "origin", branchName])
if (pushResult.status !== 0) {
  fail(
    `Failed to push branch "${branchName}": ${pushResult.stderr}\n` +
      `The branch and commit exist locally — nothing was force-pushed, and main was never touched.`,
  )
}
console.log(`  Pushed branch: ${branchName}`)

// --- PR ---------------------------------------------------------------------------

const remoteUrl = gitOutput(["remote", "get-url", "origin"])
const repoMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/)
const owner = repoMatch ? repoMatch[1] : null
const repoName = repoMatch ? repoMatch[2] : null

const prTitle = "chore: sync Prism tokens from Figma"
const prBody =
  `Prism Figma Sync\n\n` +
  `Source:\n${snapshot.figmaFileName}\n\n` +
  `Applied:\n${before.changedLiteral} safe literal token change(s)\n\n` +
  `Deferred:\n${before.changedAliasStructure} alias-structure difference(s) requiring separate cleanup\n\n` +
  `Verification:\n✓ token validation\n✓ token generation\n✓ convergence check\n✓ build\n\n` +
  `No auto-merge — this PR requires human review.`

const ghAuthCheck = run("gh", ["auth", "status"])
const ghAvailable = ghAuthCheck.error === undefined
const ghAuthenticated = ghAvailable && ghAuthCheck.status === 0

if (ghAuthenticated) {
  const prResult = run("gh", [
    "pr",
    "create",
    "--title",
    prTitle,
    "--body",
    prBody,
    "--base",
    "main",
    "--head",
    branchName,
  ])
  if (prResult.status === 0) {
    console.log(`\n  Pull request created:\n${prResult.stdout.trim()}`)
  } else {
    console.log(`\n  "gh pr create" failed (exit ${prResult.status}): ${prResult.stderr.trim()}`)
    console.log(`  Branch was pushed successfully. Create the PR manually — see below.`)
  }
} else {
  console.log(
    `\n  GitHub CLI ("gh") is not available/authenticated in this environment, so the PR was not created automatically.`,
  )
}

if (!ghAuthenticated || owner === null) {
  console.log(`\nNext step — create the PR manually:`)
  if (owner && repoName) {
    console.log(`  Compare/PR URL: https://github.com/${owner}/${repoName}/compare/main...${branchName}?expand=1`)
  }
  console.log(`  Or, once "gh" is installed and authenticated, run:`)
  console.log(
    `    gh pr create --title "${prTitle}" --base main --head ${branchName} --body "<see script output above>"`,
  )
}

console.log(
  `\nDone. Branch "${branchName}" is pushed. This PR still requires human review — nothing was auto-merged.`,
)
process.exit(0)
