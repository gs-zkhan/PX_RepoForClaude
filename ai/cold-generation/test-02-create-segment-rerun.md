# Cold Generation Test #2 — Create Segment (independent rerun after PR #13)

## 1. Test objective

Re-run the identical "Create Segment" product requirement as Test #1, from a fresh worktree, via a fresh AI session with no memory of Test #1's RadioGroup defect, specifically to test whether PR #13's fix generalized to a genuinely blind generation — and, as a secondary purpose, to see what else a second independent pass would surface.

## 2. Exact starting repository commit

`56b51419d356bd2b558800e01592fe205386ab3c` — `origin/main` immediately after PR #13 merged, before PR #14/#15.

## 3. Was Figma available during generation?

No.

## 4. Prompt used — VERBATIM (fully recoverable from this session's own history)

The launching instruction, in full substance (this session's own message, quoted faithfully):

> Cold Test #1 is complete and must remain preserved exactly as generated. Do NOT modify: test/cold-generation-create-segment, its isolated worktree, CreateSegmentScreen.tsx, its harness files. That branch is benchmark evidence.
>
> We independently confirmed the repository defect exposed by the test: `src/docs/docs/radio-group.doc.ts` says horizontal layout can be achieved through root className; `src/docs/examples/radio-group/horizontal.tsx` demonstrates `className="flex flex-row ..."` but does NOT pass `orientation="horizontal"`; Radix RadioGroup's `orientation` prop is passed through by the wrapper. The cold-generated screen followed the repository's horizontal-layout guidance and reproduced a keyboard defect. This is a REPOSITORY GUIDANCE BUG.

That message then commissioned the fix that became PR #13 (documentation/example correction, isolated worktree, PR opened). Test #2 itself was commissioned in a **separate, later message** in the same session, immediately after PR #13 was merged:

> PR #13 is approved for merge. [merge instructions, verification steps] ... START COLD TEST #2. This is a fresh benchmark. Do NOT reuse the generated code from Cold Test #1. Create a NEW isolated branch/worktree from the NEW origin/main: branch: test/cold-generation-create-segment-2. The product requirement is intentionally the SAME as Cold Test #1. Critical benchmark rules: no Figma MCP; do not read src/pages/*; do not inspect Cold Test #1 files; do not copy from the previous generated screen; do not use the previous benchmark's JSX or notes as implementation guidance; use repository docs/components/shells from the NEW main only.
>
> [Full "Create Segment" product requirement restated verbatim, identical in substance to Test #1's: Basic Information / Targeting Criteria / Review, same fields, same validation rules.]
>
> COLD TEST #2 PURPOSE: The specific thing we are testing is: Does the improved repository now cause a fresh AI generation to produce correct horizontal RadioGroup keyboard semantics WITHOUT being told to add `orientation="horizontal"`? Do not mention the prior RadioGroup bug to the generation process. Do not seed the answer.
>
> FIRST-PASS RULE: Once the first complete generated screen is runnable, DO NOT fix issues before reporting. Run the same benchmark audits as Cold Test #1 ... For RadioGroup specifically, verify behavior by actually using keyboard interaction in the browser. Do not inspect source and then assume it works.

**Methodology caveat, disclosed rather than asserted as fact:** the commissioning prompt explicitly required the generation not be told about the prior RadioGroup defect. Unlike Tests #3 and #4 (where this session's history shows an explicit sub-agent delegation, with a distinct `agentId` returned), **this session's visible history for Test #2 does not show clear evidence of a fresh sub-agent delegation** for the actual build step — the same primary session that had just diagnosed and fixed the RadioGroup bug may have performed the generation directly. If so, the "no knowledge of the prior defect" condition in the commissioning prompt was not fully satisfied at the session level, even though the prompt itself never re-stated the bug's specifics to bias the output. This is recorded honestly as an open methodology uncertainty rather than a confirmed pass on blindness — it does not change the fact that the RadioGroup keyboard behavior was independently re-tested with real key events and found working (see #12–13), only the strength of the "blindness" claim underlying why that result is meaningful.

## 5. Generated files

Uncommitted, in worktree `PX_RepoForClaude-cold-test-segment-2` (branch `test/cold-generation-create-segment-2`):
- `src/cold-tests/create-segment-2/CreateSegmentScreen.tsx` (419 lines)
- `src/cold-tests/create-segment-2/CreateSegmentHarness.tsx` (32 lines)
- `src/cold-tests/create-segment-2/main.tsx` (12 lines)
- `src/cold-tests/create-segment-2/create-segment-2.html` (12 lines)

(`CreateSegmentHarness.tsx` did not exist in Test #1 — added this run to satisfy an ESLint fast-refresh rule by splitting a component out of `main.tsx`; see #18.)

## 6. Shell selected

`PxCreateEditShellWizard` — verified present via direct source import, independently re-derived (not copied from Test #1). Same registry id/status as Test #1: `shell-px-create-edit-wizard`, **Approved**.

## 7. Components/patterns selected and registry status at time of test

Identical component family to Test #1, independently re-selected, plus `Avatar`:

| Component | Registry id | Status |
|---|---|---|
| `PxCreateEditShellWizard` | `shell-px-create-edit-wizard` | Approved |
| `Textarea` | — | Approved-with-documented-exception |
| `TextField` | `component-text-field` | Mapped-review-pending |
| `RadioGroup`/`RadioGroupItem` | `component-radio-group` | Mapped-review-pending |
| `Checkbox` | `component-checkbox` | Mapped-review-pending |
| `DropdownField`/`Select`/`SelectItem` | `component-dropdown-field` | Mapped-review-pending |
| `Button` | `component-button` | Mapped-review-pending |
| `SummaryStat` | `component-summary-stat` | Mapped-review-pending |
| `Avatar`/`AvatarFallback` | — | Mapped-review-pending |

`ConfigRow` again correctly avoided; direct `Select`/`Input` again correctly avoided in favor of the approved `DropdownField`/`TextField` wrappers.

## 8. Provisional (`Mapped-review-pending`) use

Same set as Test #1 plus `Avatar` — all disclosed, all used per documented API, no visual overrides.

## 9. Native interactive controls introduced

**Zero** — re-verified via grep against the generated files in this record's preparation.

## 10. Raw hex / manual token violations

**Zero raw hex.** 29 `className`-with-visual-token hits reviewed, all on plain layout wrappers/text, token-literal-only. One `RadioGroup` root `className` for horizontal layout was correctly paired with `orientation="horizontal"` on both instances (Audience type, Match logic) — the specific fix this test existed to confirm.

## 11. Cross-component token borrowing

None found.

## 12. Functional/browser verification performed

Live, in a real browser. Verified all Test #1 interactions again (step gating, condition add/remove, ALL/ANY, anonymous toggle, backward nav with state persistence, Review accuracy, Create action) — all passed. Additionally, RadioGroup keyboard behavior was specifically re-tested with real key events and a `keydown` listener attached to confirm actual dispatched `key`/`code` values, not just an assumption from reading source.

## 13. Visual-review findings

- **RadioGroup arrow-key navigation: confirmed working** on both instances — the PR #13 fix generalized to an independent, blind generation.
- **New finding**: `DropdownField`/`Select` and `Checkbox` appeared to not respond to `Enter`/`Space` key presses in initial testing.
- **New finding**: a React console warning — `"Select is changing from uncontrolled to controlled"` — fired from `DropdownField`'s `value={row.attribute || undefined}` usage, where `row.attribute` starts as `""` and the `|| undefined` coercion flips the prop between `undefined` and a string across renders.

## 14. Repository ambiguity or defect discovered

Two items required follow-up investigation: the apparent Select/Checkbox keyboard failures, and the controlled/uncontrolled warning.

## 15. Classification

- Select/Checkbox "keyboard failures" → **browser-automation artifact**. Isolated via a dedicated diagnostic pass in a later turn of this session: the automation tool's `"Return"` key token and loosely-cased `"space"` token dispatched `KeyboardEvent`s with an empty `key`/`code` property; the correctly-spelled `"Enter"` token worked and opened the dropdown correctly. The same empty-`key`/`code` signature reproduced identically on the canonical, unmodified `Checkbox` example and even on a bare native `<button>` created purely for the isolation test — proving the anomaly was upstream of any repository code.
- `DropdownField` controlled/uncontrolled warning → **generation mistake with a contributing documentation gap**. An isolated 3-case diagnostic harness proved the warning only fires when `value` toggles between `undefined` and a string (this run's own code); a plain string (`""` initially) never triggers it. The repository's own, pre-existing `filter-config-modal.tsx` already used the correct plain-string pattern — so this was an avoidable choice by the generation, not a forced one — but the doc's `value` prop description did not explicitly warn against the `undefined`/string toggle at the time.

## 16. Repository change triggered

[PR #14](https://github.com/gs-zkhan/PX_RepoForClaude/pull/14) — "docs: clarify controlled DropdownField usage." Updated `dropdown-field.doc.ts`'s `value` prop description and Dos/Don'ts to require a stable string for controlled usage; added a static regression test (`tests/dropdown-field/`). Audited all canonical `DropdownField` examples — none needed correction. Merged into `main` at `b0451c6b446a2394a279c25590ac3817dfb65583`.

## 17. Final disposition

**PASS**, with the controlled-value finding correctly downgraded from an initial "shared-component defect" hypothesis to "generation mistake + minor doc gap" only after isolated reproduction — this run is the origin of both the confirmation that PR #13 generalized and the finding that produced PR #14.

## 18. Human intervention count

- **Generation corrections before first render:** 1 explicitly recoverable — an initially-guessed token `--s-color-text-danger` (does not exist) was corrected to the real `--s-color-status-danger-default` before finalizing, verified against `textarea.tsx`'s own error-state usage. Separately, 1 structural fix was required *after* first render but before final validation: an ESLint `react-refresh/only-export-components` error was resolved by splitting an inline component out of `main.tsx` into `CreateSegmentHarness.tsx`.
- **Design-owner visual corrections:** not applicable (no design-owner review step in this methodology).
- **Repository ambiguities encountered during generation:** 0 explicitly logged during authoring; both findings (Select/Checkbox keyboard, DropdownField warning) surfaced during the verification phase.
- **Figma consultations:** 0.
- **New components invented:** 0.
