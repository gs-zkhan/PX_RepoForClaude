# Cold Generation Test #8 — Create/Edit Account (Accordion tier)

## 1. Test objective

Test a genuinely blind generation of a Create/Edit Account form (9 fields: Account Name, Website, Industry, Plan, CSM Owner, ARR, Number of Seats, Health Status, Notes), asking a fresh agent to independently determine the correct `PxCreateEditShell` tier (Modal/Accordion/Wizard) purely from the repository's own documented tiering rule and this screen's actual field count/structure — never from the page's name.

## 2. Exact starting repository commit

`f81b884e00f50e4f2f3979a67ce576b7bbdc2710` — `origin/main` immediately after PR #26 merged (Test #7's benchmark record). Worktree: `PX-cold-test-create-edit-account`, branch `test/cold-gen-create-edit-account`.

## 3. Was Figma available during generation?

No — the generating agent was explicitly instructed not to use Figma tools/MCP unless the repository's own documentation said a specific decision couldn't be resolved without it. No Figma consultation occurred.

## 4. Blind-test isolation method

No existing product file needed hiding for this test (unlike Test #7) — there is no pre-existing Create/Edit Account page in this repository. Isolation instead relied on the same fresh-sub-agent-with-no-memory-of-prior-tests methodology, plus explicit rules forbidding the agent from reading anything under `src/pages/` or any prior cold-test artifact, to prevent it from copying an existing screen's structure as a template.

## 5. Prompt used (product requirement, embedded verbatim in the sub-agent brief)

> "Create a new Create/Edit Account experience. The user should be able to create a new account with these fields: Account Name, Website, Industry, Plan, CSM Owner, ARR, Number of Seats, Health Status, Notes. Use sensible field types based on the existing PX design system... The form needs a clear title, logical field grouping, a validation-ready field structure..., and appropriate primary/secondary actions... If the form's complexity requires multiple sections or steps, determine the correct Create/Edit shell/tier from the repository's own guidance... Do not pick a tier because of the page's name..."

The sub-agent was additionally required to produce a 4-point pre-implementation report (shell/tier + why, major shared components planned, every `Mapped-review-pending` component needed, any eligibility restriction/gap) before writing code.

## 6. Generated files

Uncommitted, in worktree `PX-cold-test-create-edit-account` (branch `test/cold-gen-create-edit-account`):
- `src/cold-tests/create-edit-account/CreateEditAccountForm.tsx` — the form, including its own trailing Component Composition Audit section
- `src/cold-tests/create-edit-account/create-edit-account-standalone-main.tsx` — standalone preview entry
- `cold-test-8-create-edit-account.html` — standalone HTML entry at the worktree root
- `.claude/launch.json` — one additive launch config entry (unused in practice — the agent's own report flags that `preview_start`'s named-config flow didn't pick it up in this environment, so the dev server was started directly instead)

No file under `src/pages/`, `src/components/`, `src/patterns/`, or any shared design-system file was touched.

## 7. Shell/tier independently selected: `PxCreateEditShellAccordion`

### Why

`ai/shell-registry.md`'s own tiering rule: Modal for ≤6 fields with no branching, Accordion for independent multi-section forms, Wizard only when a later step depends on an earlier one. 9 fields rules out Modal; no field depends on another, ruling out Wizard. Accordion is the only rule-compliant choice — verified independently against the actual registry text, not assumed. The agent grouped the 9 fields into 3 independent sections ("Account Overview," "Ownership & Commercials," "Health & Notes") using `AccordionItem`'s documented `leading`-badge anatomy (`Letter` component, numbered 1/2/3).

## 8. Components/patterns used, with registry status at time of test

Re-verified by direct `ai/figma-coverage.json` lookup during this record's preparation:

| Component | Status at time of test |
|---|---|
| `shell-px-create-edit-accordion` | Approved (design owner, 2026-08-28) |
| `component-textarea` | Approved-with-documented-exception |
| `component-accordion` | Mapped-review-pending |
| `component-letter` | Mapped-review-pending |
| `component-text-field` | Mapped-review-pending |
| `component-dropdown-field` | Mapped-review-pending |
| `component-select` (via `SelectItem`) | Mapped-review-pending |
| `component-input-number` | Mapped-review-pending |

**Judgment call, honestly disclosed, not an eligibility restriction:** Health Status uses `DropdownField` (plain picklist) rather than `StatusSelect` — independently confirmed during this record's preparation that `component-status-select` is *also* `Mapped-review-pending` (equally eligible), so this was a genuine semantic choice (StatusSelect's closed variant vocabulary has no health-specific terms), not something the eligibility policy forced.

**Composition helper, not an invented component:** `LabeledNumberField` (defined inline in the generated file) pairs a plain `<label>` with `<InputNumber>` for the ARR/Seats fields, exactly per `InputNumber`'s own documented interim guidance ("Wrap in FormField (or, until that exists in this repo, a plain `<label>`)...") — sets no visual recipe of its own, reuses the same semantic tokens `Textarea` already falls back to for the identical documented gap.

## 9. No component-eligibility restriction blocked anything

None found. All required capabilities existed with either `Approved`/`Approved-with-documented-exception` or `Mapped-review-pending` (disclosed) status; no `Implemented-unmapped`/`Legacy`/`Out of scope`/`Missing` component was needed for this screen.

## 10. Native interactive controls introduced

**Zero**, re-verified independently via `grep -nE '<button|<input|<select|<textarea'` against both generated files during this record's preparation. The only native element the file writes directly is `<label>` (inside `LabeledNumberField`) — not in the prohibited list, and the explicitly-documented interim pattern for `InputNumber`.

## 11. Raw hex / manual token violations

**Zero raw hex**, independently re-verified. `className`-with-visual-token hits are confined to plain layout `<div>`s and `LabeledNumberField`'s own label/helper typography (mirroring `Textarea`'s existing documented precedent) — never on an approved/provisional component's own instance.

## 12. Functional/browser verification performed

Live, in a real browser, against a dev server serving the standalone preview entry — independently re-confirmed by opening the still-running server myself and taking a screenshot of both an expanded and a collapsed accordion section. Verified: all 9 fields render with correct types; single-open accordion behaviour across all 3 sections; required-field error state on blur (Account Name); Create starts disabled and enables once Account Name/Industry/Plan/CSM Owner are filled; `InputNumber` steppers work; all four `DropdownField` menus open and select correctly; `Textarea` accepts input; title inline-edit commits on Enter/blur.

## 13. Repository ambiguity or defect discovered

None new. One real bug was introduced by the generating agent itself and self-corrected before its final report: initializing picklist state as `useState<string | undefined>(undefined)` triggered React's uncontrolled-to-controlled warning — `dropdown-field.doc.ts` already explicitly documents this exact pitfall ("keep passing a string on every render... use `value=\"\"`, not `value={undefined}`"). The agent found and fixed this itself during live verification, re-confirmed clean afterward.

## 14. Classification

**Claude misuse** (generation mistake), not a repository gap — the guidance already existed, explicit and unambiguous, in `dropdown-field.doc.ts`, and simply wasn't followed on the first pass. No shared-component defect, no missing pattern, no new documentation gap.

## 15. Repository change triggered

None from Test #8 directly. (This same v1.1 hardening pass separately closed the `PxHeader`→`component-input` inconsistency Test #8's own title-edit interaction had silently exercised without anyone flagging it at the time — see `decision-input-scoped-composition` in `ai/figma-coverage.json` and this pass's own PR.)

## 16. Final disposition: **PASS**

Per the benchmark rubric: correct shell/tier selection traceable to the documented tiering rule; correct component reuse with registry status verified by direct lookup; zero native duplicate controls; zero raw hex/manual visual overrides; zero cross-component token borrowing; live verification passed for every stated interaction; the one judgment call (Health Status via `DropdownField`) was honestly disclosed rather than silently resolved. The one real defect found (the `DropdownField` controlled-value warning) was self-corrected before the final report, and is classified as generation error, not a repository defect — consistent with the rubric's PASS criteria, not PARTIAL.

## 17. Human intervention count

- **Generation self-corrections before first render:** 1 explicitly recoverable — the uncontrolled-to-controlled `DropdownField` warning, found and fixed during the agent's own live verification pass.
- **Design-owner visual corrections:** not applicable.
- **Repository ambiguities encountered during generation:** 0 disclosed by the generating agent itself. (The `PxHeader`→`component-input` gap this screen's own title-edit feature exercised was found afterward, by a separate, subsequent audit — not by this test's own generating agent — mirroring exactly how Test #7's Popover finding was also surfaced only by a follow-up audit, not the generating agent's own real-time check.)
- **Figma consultations:** 0.
- **New components invented:** 0 (one non-visual composition helper, `LabeledNumberField`, following already-documented interim guidance — not counted as an invented component).

## 18. Preserved evidence

| Worktree | Branch | Base commit |
|---|---|---|
| `PX-cold-test-create-edit-account` | `test/cold-gen-create-edit-account` | `f81b884e00f50e4f2f3979a67ce576b7bbdc2710` |

Generated files (uncommitted, preserved only in the worktree above, not copied into this record, never merged into `main`):
- `src/cold-tests/create-edit-account/CreateEditAccountForm.tsx`
- `src/cold-tests/create-edit-account/create-edit-account-standalone-main.tsx`
- `cold-test-8-create-edit-account.html`
- `.claude/launch.json` (one additive, unused-in-practice entry)
