# Prism token pipeline — guardrails and root cause

Companion doc to [`tokens/protected-tokens.json`](../tokens/protected-tokens.json) (machine-readable policy + approval ledger) and [`tokens/alias-debt-baseline.json`](../tokens/alias-debt-baseline.json) (machine-readable alias-debt baseline). This file is the readable summary: what went wrong, why the existing pipeline didn't catch it, and what the new guardrail scripts check.

## Incident summary

Two brand-critical primitive colour tokens were silently corrupted by the Figma sync pipeline itself, as real, automatically-applied commits:

| Token | Correct value | Corrupted to | Commit | Where it landed |
| --- | --- | --- | --- | --- |
| `color.royalBlue.700` | `#0369E9` (blue) | `#E90303` (red) | `2dcb46f` | `poc/prism-figma-pipeline` (already pushed; already visible in the open PR #3 diff at the time this was found) |
| `color.neutral.800` | `#25313B` | `#34A73A` (green) | `4e82f66` | `figma-sync/2026-08-27-0904` (PR #4) |

`royalBlue.700` drives no live CSS `var()` reference today (see "emitted but unused" below), so the red value never visibly rendered anywhere. `neutral.800` drives `--c-nav-background` directly — the green value, had it landed on a branch actually deployed, would have turned the entire PX left-navigation rail green.

## Root cause

### 1 — How `royalBlue.700` became red

`scripts/figma-snapshot-import.mjs` has always contained a special debug section (lines ~410–424, still present) that explicitly calls `color.royalBlue.700` a **"controlled test token"** and states in a comment that it is "always surfaced explicitly... and never auto-corrected." That claim was never actually wired into the apply logic: the `--apply` loop (lines ~469–478) applies **every** `changedLiteral` record identically, with no carve-out for this or any other specific token path. The debug print was aspirational, not enforced.

The most plausible reading of the evidence: `royalBlue.700` was deliberately changed in Figma at some point as a controlled experiment to prove the sync pipeline could detect and apply a real literal-value change end-to-end. Commit `ec16221` ("add Prism Figma snapshot export and importer") landed at 10:11 on 2026-08-26; commit `2dcb46f` ("chore: sync Prism token change from Figma"), which contains exactly this change, landed eight minutes later at 10:19 — consistent with someone exercising the brand-new importer immediately after building it. Nothing in the code distinguished "a deliberate test of the sync mechanism" from "a real design change to sync."

### 2 — How `neutral.800` became green

Commit `4e82f66` landed six minutes after `7df3bf1` ("automate PR creation for Figma sync") — i.e. immediately after the fully automated, one-click "Figma plugin → local bridge → sync script → PR" path was completed. Its own commit message is fully self-describing: `"Safe literal changes applied: 1" ... "Verification: tokens:validate (pass), tokens:generate, convergence check (pass), build (pass)."` Every one of the pipeline's own self-checks passed. This is the clearest evidence that the pipeline's notion of "safe" was purely structural (deterministic, unambiguous, converges, builds) and had no concept of "is this the value anyone actually approved."

### 3 — Why the existing validation workflow still passed

`scripts/validate-prism-tokens.mjs` and `.github/workflows/prism-token-ci.yml` are both real and both thorough — but at a different layer than the one that broke. They check: token counts against floors, required top-level groups, single-letter-prefix collisions, reference resolvability, cycles, Component-token alias metadata agreement (`$extensions["com.figma.aliasData"]`), light/dark parity, and (in CI) that `src/styles/prism-generated.css` regenerates identically to what's committed. None of this asks "is `#E90303` the right value for `royalBlue.700`" — a literal primitive has no alias metadata to check *against*; it *is* the source of truth by definition, structurally. There was no mechanism anywhere that compared a literal's value to any external notion of "approved."

### 4 — Why generated CSS remained structurally valid despite semantically wrong values

`scripts/generate-prism-css.mjs` has exactly one job: resolve references and emit literals faithfully. A literal primitive is emitted as-is, whatever it is. There is no semantic-correctness check in the generator, by design (its own comment says it isn't the place for that) — `validate-prism-tokens.mjs` was supposed to be that place, but only for structural/alias-metadata concerns (see #3).

### 5 — How Semantic aliases became disconnected from Primitive tokens

This is a pre-existing, repo-wide structural fact, not a regression: **every** Semantic colour token in `tokens/S_Light.tokens.json` / `tokens/S_Dark.tokens.json` is exported as a **baked literal** with a *prose* provenance note in its `$description` ("Aliases color/royalBlue/700 (Light), color/royalBlue/600 (Dark).") rather than a live `{p.color.royalBlue.700}` reference. Verified directly — there is no exception. This means fixing a primitive's value never automatically propagates to the semantic tokens that are conceptually "aliasing" it; they are only linked by a sentence a human wrote, which nothing previously checked against the actual primitive. `scripts/validate-alias-debt.mjs`'s semantic-to-primitive drift check (new, see below) is the first thing that verifies this link.

### 6 — Why the automation created PRs without an effective protected-token approval gate

Because no such gate existed anywhere in the code, under any name. `figma-sync.mjs` treats "deterministic and unambiguous" (`changedLiteral`) as synonymous with "safe to auto-apply, no review needed" (its own log line literally said `"N safe deterministic literal change(s) will be applied"`). The word "protected" does not appear anywhere in `figma-sync.mjs` or `figma-snapshot-import.mjs` prior to this guardrail work.

## Approval mechanism (strengthened)

An earlier draft of this policy said a protected-token approval could be "an edit to `approvedValue` in the same reviewable PR as the token change." **That is insufficient**: if an automated process can propose a token change, it can just as easily be extended to also update the file that claims to approve it, in the same commit — the sync would be approving itself.

The rule actually enforced now:

- `tokens/protected-tokens.json` is the **human/design-owner-approved baseline** — full stop. It records, per protected token: path, approved value, approver, approval date, reason, and (optionally) a Figma node/variable reference. See the file itself for the current three entries, each with all of these fields populated.
- `scripts/figma-sync.mjs`, `scripts/figma-snapshot-import.mjs`, and everything under `figma-plugin/` (the plugin and its local bridge) **never create or modify this file** — enforced three separate ways, not just by convention:
  1. **Structurally**: neither script's writable-file list includes it (`REPO_SOURCES` in the importer, `ALLOWED_CHANGED_FILES` in the sync script — see the comment directly above that constant).
  2. **At sync runtime**: `checkChangedFilesAreAllowed()` runs after every mutation the sync script performs and calls `fail()` on any file outside that list — this file included, if it were ever touched by a future code change.
  3. **In CI**: `scripts/validate-no-self-approval.mjs` fails the build if a `figma-sync/*` branch's diff touches `tokens/protected-tokens.json` at all, regardless of what else changed in the same PR.
- A protected-token mismatch (the *proposed* Figma value doesn't match the recorded `approvedValue`) stops the sync **before branch creation, before any file is written, before commit, before push, before PR creation** — see "Mutation-order guarantee" below.
- The blocked report explicitly states that the design owner must make a **separate, prior, human-authored commit** updating `tokens/protected-tokens.json` before the sync is re-run — never in the same run that proposes the value.
- If the proposed value already matches a value the design owner separately, deliberately pre-approved (i.e. `tokens/protected-tokens.json` was already updated by a human commit *before* this sync ran), the sync proceeds for that token — this is what makes legitimate rebrands possible without ever weakening the gate.
- No environment variable, CLI flag, or automatically generated approval record can substitute for a human edit to this file. There is deliberately no such flag anywhere in this codebase.
- **Repository configuration recommendation** (not code — a GitHub setting): where the repository's plan/account structure supports path-scoped required reviews (a `CODEOWNERS` entry for `tokens/protected-tokens.json` plus a branch-protection rule requiring review from that owner), it should be turned on. This CI guard catches the specific "sync branch self-approves" pattern; branch protection is the general backstop for *any* change to this file, made by anyone, on any branch.

## Mutation-order guarantee

`scripts/figma-sync.mjs` runs its stages in this fixed order (see the `stage(...)` calls in the file, top to bottom):

1. Repository preconditions (clean working tree, base branch exists, snapshot is valid JSON/schema/file).
2. Import dry run (`figma-snapshot-import.mjs`, **without** `--apply` — read-only comparison, writes nothing).
3. Structural safety gate (ambiguous/unmatched/mode-mismatch counts).
4. Determine whether there's anything to sync at all.
5. **Protected-token gate** — `checkProposedProtectedChanges()` reads only `tokens/protected-tokens.json` and compares it against the dry run's already-computed `changedTokenDetails`; it performs no filesystem writes and touches no token-source file. A mismatch calls `fail()` here, which `process.exit(1)`s immediately.
6. Sync branch created (`git checkout -b`).
7. `figma-snapshot-import.mjs --apply` — the only step that ever writes a token-source file.
8. Token validation, CSS regeneration, re-validation, build, convergence check.
9. Commit.
10. Push.
11. PR creation.

Step 5 is strictly before steps 6–11. Because the gate only ever reads `changedTokenDetails` (data already computed in step 2) and `tokens/protected-tokens.json`, there is no temporary file mutation to undo on a blocked run — nothing was ever written in the first place, so there is nothing to restore. This is proven directly, not just asserted from reading the source, by `tests/token-guardrails/mutation-order.test.mjs`: it runs the real script against a real, throwaway git repository and asserts, after a blocked run, that no branch was created, `HEAD` did not move, the working tree is clean, and `tokens/protected-tokens.json` is byte-identical to before the run.

## What changed

| File | Role |
| --- | --- |
| `tokens/protected-tokens.json` | The human/design-owner-approved baseline. Each entry: path, approved value, approver, approval date, reason, optional Figma reference. Never written by any script. |
| `scripts/validate-no-self-approval.mjs` | CI-only guard: fails if a `figma-sync/*` branch's diff touches `tokens/protected-tokens.json`. |
| `tokens/alias-debt-baseline.json` | Every pre-existing alias-debt fingerprint (dormant collisions, Component alias-target gaps) as of this guardrail work. New fingerprints not in this list fail; fixed ones falling off the list is fine. |
| `scripts/generate-prism-css.mjs` | Refactored (behavior-preserving) to export a pure `buildGeneratedCss(rootDir)` — needed so the staleness check can compute "what should be generated" without writing to disk or shelling out. |
| `scripts/validate-protected-tokens.mjs` | New. Protected-token gate + description/value consistency + generated-output staleness + rendered-token smoke checks (nav background, primary action colour, primary text colour), all derived from `protected-tokens.json`. |
| `scripts/validate-alias-debt.mjs` | New. Baselined alias-regression detection (wraps `validate-prism-tokens.mjs`'s own findings plus a new semantic-to-primitive drift check), and a separate, non-blocking "emitted but unused primitives" report. |
| `scripts/generate-sync-report.mjs` | New. Composes one reviewable report (changed tokens, protected status, description consistency, alias changes, generated-file changes, required reviewer action) from the checks above. |
| `scripts/figma-sync.mjs` | Minimal, additive: a new gate stage runs `checkProposedProtectedChanges()` against the snapshot's proposed values before any branch is created. A blocked protected-token change aborts the entire sync, leaving the working tree untouched. |
| `.github/workflows/prism-token-ci.yml` | Runs the new guardrail scripts (including the self-approval guard, with full git history fetched so it can diff against the PR's base) and the new test suite, in addition to the existing structural validation. |
| `tests/token-guardrails/*.test.mjs` | New, using `node:test` (no new dependency) — see below. |

## PR topology for this branch

`feature/figma-token-guardrails` is based on, and its eventual PR must target, `poc/prism-figma-pipeline` — **not** `main`. Once that PR merges into `poc/prism-figma-pipeline`:

- The royalBlue.700 fix and every guardrail here become part of `poc/prism-figma-pipeline` automatically — no separate, standalone royalBlue.700 correction is needed on PR #3 (`poc/prism-figma-pipeline → main`), since PR #3's diff is computed against whatever `poc/prism-figma-pipeline` currently contains.
- PR #3's existing "blocked, red royalBlue.700" comment can then be re-evaluated and removed once its checks pass with the fix in place.
- PR #5 (`feature/px-create-edit-shell`, stacked on `poc/prism-figma-pipeline`) rebases/updates automatically for the same reason — it is also just a ref pointing at commits built on top of the same base branch.

PR #4 (`figma-sync/2026-08-27-0904`) is intentionally left untouched by this work. It should be recommended for closure as superseded only *after* this guardrail PR has merged into `poc/prism-figma-pipeline` and that branch's corrected token values are confirmed — not before, and not as part of this phase.

## Known, deliberate scope limits

- The "rendered-token smoke checks" resolve values statically from the generated CSS string (following `var()` indirection), not from a live browser's computed styles — there is no browser-automation harness in this repo's own test/CI infrastructure to drive that honestly. This is the same "reasonable interpretation, documented rather than overclaimed" approach used elsewhere in this repo for visual verification.
- `runAliasDebtChecks` shells out to the real `scripts/validate-prism-tokens.mjs`, which enforces large token-count floors (154/136/668/38/20) — the test suite covers its *decision logic* (baseline diffing) and its two new checks directly with lightweight fixtures, plus one integration test against the real repository's actual token corpus, rather than fabricating a floor-satisfying synthetic corpus for every fixture.
- Fixing the pre-existing alias debt itself (dormant collisions, the five `color/focus/ring` Component-alias gaps) was explicitly out of scope for this phase — it is baselined, not silently required to be zero.
- `scripts/generate-sync-report.mjs` exists and is fully tested, but is **not yet wired into** `scripts/figma-sync.mjs`'s actual PR-body construction (which still builds its own, simpler body inline) — that integration is a follow-up, not done silently or claimed as complete here.
- No `CODEOWNERS` file exists in this repository yet — creating one requires real GitHub usernames/teams this work doesn't have authority to invent. The recommendation above is documented as a repository-configuration action for a human with that authority to take, not implemented as a file here.
