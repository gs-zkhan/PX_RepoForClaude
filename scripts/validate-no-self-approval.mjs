import { spawnSync } from "node:child_process"
import { pathToFileURL } from "node:url"

// -----------------------------------------------------------------------------
// CI guard: an automated Figma sync branch (figma-sync/*) must never be the
// thing that changes tokens/protected-tokens.json. Editing that file is a
// human, design-owner action that happens in its own commit, on its own
// branch, separately from any automated sync — never bundled into the same
// branch that also proposes the token-source change it would be approving.
//
// This is deliberately a CI-time check (branch name + file diff), not
// something scripts/figma-sync.mjs can enforce on itself: the whole point
// is that an automated process cannot be trusted to police its own
// self-approval, so the check has to run somewhere the sync branch doesn't
// control — the CI workflow, against the PR's actual diff.
// -----------------------------------------------------------------------------

const POLICY_FILE = "tokens/protected-tokens.json"
const SYNC_BRANCH_PATTERN = /^figma-sync\//

// Pure: given a branch name and the list of files changed in its diff
// against the base branch, decides whether this is a disallowed
// self-approval attempt. No I/O — trivially testable.
function isSelfApprovalViolation(branchName, changedFiles) {
  const isSyncBranch = SYNC_BRANCH_PATTERN.test(branchName)
  const policyChanged = changedFiles.includes(POLICY_FILE)
  return isSyncBranch && policyChanged
}

function getChangedFiles(rootDir, baseRef) {
  const result = spawnSync("git", ["diff", "--name-only", `${baseRef}...HEAD`], { cwd: rootDir, encoding: "utf8" })
  if (result.status !== 0) {
    throw new Error(`git diff against "${baseRef}" failed (exit ${result.status}): ${result.stderr}`)
  }
  return result.stdout.split("\n").map((l) => l.trim()).filter(Boolean)
}

function getCurrentBranch(rootDir) {
  const result = spawnSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: rootDir, encoding: "utf8" })
  return result.stdout.trim()
}

export { isSelfApprovalViolation, getChangedFiles, getCurrentBranch, POLICY_FILE, SYNC_BRANCH_PATTERN }

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rootDir = process.cwd()
  const branchArg = process.argv.find((a) => a.startsWith("--branch="))
  const baseArg = process.argv.find((a) => a.startsWith("--base="))

  // GITHUB_HEAD_REF / GITHUB_BASE_REF are set by GitHub Actions on
  // pull_request events; --branch=/--base= let this be run and tested
  // locally without that environment.
  const branchName = branchArg ? branchArg.slice("--branch=".length) : process.env.GITHUB_HEAD_REF || getCurrentBranch(rootDir)
  const baseRef = baseArg ? baseArg.slice("--base=".length) : process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "origin/main"

  console.log(`Checking whether branch "${branchName}" self-approves protected tokens (base: ${baseRef})...`)

  let changedFiles
  try {
    changedFiles = getChangedFiles(rootDir, baseRef)
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }

  if (isSelfApprovalViolation(branchName, changedFiles)) {
    console.error(
      `\nBLOCKED: branch "${branchName}" matches the automated Figma sync pattern (figma-sync/*) AND modifies ` +
        `${POLICY_FILE}.\n\n` +
        `Automated sync branches cannot approve their own protected-token changes. ${POLICY_FILE} may only be ` +
        `changed by a human, design-owner-authored commit made separately from any sync branch — never bundled ` +
        `into the same branch/PR as the token-source change it approves.\n\n` +
        `If this token change is genuinely approved, the design owner must make that approval on its own branch/PR, ` +
        `targeting the base branch directly, before this sync branch is re-run.`,
    )
    process.exit(1)
  }

  console.log(`  OK — ${branchName} does not modify ${POLICY_FILE} (or is not a figma-sync/* branch).`)
  process.exit(0)
}
