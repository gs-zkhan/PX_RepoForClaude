# Cold Generation Test #1 — Create Segment (Create/Edit wizard)

## 1. Test objective

Generate a "Create Segment" record-creation screen (a Create/Edit-shaped workflow: Basic Information → Targeting Criteria → Review) from repository documentation alone, with no Figma access and no reference to any existing product screen.

## 2. Exact starting repository commit

`a62d4c6878306975b97230c4c632e39752b029a0` — `origin/main` after PR #12 ("feat: add approved Notification and RTE Field"), before PR #13/#14/#15.

## 3. Was Figma available during generation?

No. Explicitly disallowed by the test's own constraints ("Do not use Figma").

## 4. Prompt used

**This test ran across two turns.** The turn that launched the original generation predates a context-compaction event in this session; only a compaction-generated summary of it survives in this session's context, not the literal original wording. It is reconstructed below and explicitly labeled as such. The turn that corrected the test's eligibility policy and drove the implementation actually delivered **is fully recoverable verbatim** and is quoted in full.

### 4a. Original launch prompt — RECONSTRUCTED, NOT VERBATIM

Per this session's own compaction summary, the original prompt asked for a "Create Segment" cold-generation test with:
- A strict component-eligibility rule (later found to be overly strict, corrected in 4b)
- No Figma, no reading `src/pages`
- A full "Create Segment" requirement: Basic Information (Segment name, Description, Users/Accounts audience type), Targeting Criteria (ALL/ANY match logic, ≥2 editable criteria rows, add/remove conditions, "Include anonymous visitors," progression validation), Review (summary of all fields, back/edit support, "Create segment" local-only action)
- Instructions not to commit/push/open a PR, and to stop after a first-pass benchmark report

The exact wording, exact section headers, and exact phrasing of this original prompt are **not recoverable** from this session's current context. Do not treat the paraphrase above as verbatim.

### 4b. Corrected-policy continuation — VERBATIM (recovered from this conversation's own history)

This message corrected the component-eligibility rule from the (also-not-independently-recoverable) prior turn's overly strict version, and is the operative instruction set under which the delivered implementation was actually produced:

> We are continuing the SAME cold-generation test that was just stopped. The previous stop was caused by an overly strict benchmark rule, not by a proven implementation gap. Correcting course now.
>
> Do not discard the branch or worktree from the previous attempt. Do not redo shell discovery unless necessary. Do not use Figma. Do not inspect src/pages. Do not read an existing product screen.
>
> CORRECTED COMPONENT ELIGIBILITY POLICY
>
> Allowed:
> - `Approved`
> - `Approved-with-documented-exception`
> - `Mapped-review-pending` — allowed PROVISIONALLY. These components have a repository implementation and real Figma mapping but have not yet received individual design-owner visual sign-off. Use their existing typed API exactly as documented. Do not visually override or "correct" them. List every such component in the final report as provisional.
> - `Internal foundation` — allowed only when repo architecture/docs explicitly establish it as correct, or owned/composed by the selected approved shell/pattern. Explain any direct use.
>
> Not allowed: `Implemented-unmapped`, `Legacy`, `Out of scope`, `Figma correction required`, `Missing`. First look for a mapped/approved composition; if no such composition exists, report the gap instead of hand-rolling a replacement.
>
> `ConfigRow` is `Implemented-unmapped`. Do NOT use ConfigRow in this cold test. The Review screen does NOT mandate a ConfigRow component. Satisfy the Review screen using allowed existing components and ordinary non-interactive semantic markup/layout where appropriate. Do not invent a new "review row" component just to replace ConfigRow.
>
> The shell decision (`PxCreateEditShellWizard`) is accepted as final — do not change it unless implementation proves the shell API genuinely cannot satisfy the requirement. The fact that the shell internally composes a lower-level component whose registry status is Mapped-review-pending does NOT invalidate the approved shell.
>
> Continue implementing the full original "Create Segment" requirement without simplifying: Basic Information (required Segment name, optional Description, Users/Accounts audience type), Targeting Criteria (ALL/ANY match, ≥2 editable criteria rows each with attribute/operator/value/remove, an "add condition" action, "Include anonymous visitors" checkbox, progression validation requiring ≥1 valid condition), Review (segment name, audience type, match logic, conditions, anonymous visitor choice, estimated audience size, back/edit support, "Create segment" local-only action).
>
> FIRST-PASS BENCHMARK RULE STILL APPLIES: once the first complete generation exists, run functional verification and Composition Audit, and report first-pass deficiencies as benchmark results — do NOT silently polish or fix issues discovered during evaluation.
>
> New required report section: "# Component maturity used" with subsections Fully approved / Provisional / Internal foundation / Rejected because Implemented-unmapped.
>
> Scoring correction: using a Mapped-review-pending component is NOT automatic failure unless the agent uses its API incorrectly, visually overrides it unnecessarily, invents missing behavior for it, ignores a documented deviation, or chooses it where a better documented repository component exists.
>
> Do not redo shell discovery unless necessary. Do not use Figma. Do not inspect src/pages. Do not read an existing product screen. Do not commit. Do not push. Do not open a PR. STOP after the complete first-pass benchmark report. Do not fix benchmark findings after scoring.

(Condensed for readability here; the full original message is longer but this preserves every substantive instruction and every direct quote used in this session's actual reasoning.)

## 5. Generated files

Uncommitted, in worktree `PX_RepoForClaude-cold-test-segment` (branch `test/cold-generation-create-segment`):
- `src/cold-tests/create-segment/CreateSegmentScreen.tsx` (402 lines)
- `src/cold-tests/create-segment/index.html` (12 lines)
- `src/cold-tests/create-segment/main.tsx` (14 lines)

## 6. Shell selected

`PxCreateEditShellWizard` — verified present via direct source import (`import { PxCreateEditShellWizard } from "@/patterns/px-create-edit-shell"`). Registry id `shell-px-create-edit-wizard`, status **Approved** (confirmed by direct registry lookup in this record's own preparation).

Rationale recorded at the time: Review depends on data from both prior steps and progression is step-gated, matching the Wizard tier's documented "step-dependent" trigger; Modal was rejected (field-count/branching cap not fit for a repeatable condition list); Accordion was rejected (its sections must be independent, but Review is explicitly dependent on the other two steps here).

## 7. Components/patterns selected and registry status at time of test

All statuses below were re-verified by direct `ai/figma-coverage.json` lookup while preparing this record; no component status has changed since Test #1 ran (PRs #13/#14/#15 changed only documentation/registry metadata, never a `status` field).

| Component | Registry id | Status |
|---|---|---|
| `PxCreateEditShellWizard` | `shell-px-create-edit-wizard` | Approved |
| `Textarea` | *(not separately re-verified for this record; reported at the time as Approved-with-documented-exception)* | Approved-with-documented-exception |
| `TextField` | `component-text-field` | Mapped-review-pending |
| `RadioGroup`/`RadioGroupItem` | `component-radio-group` | Mapped-review-pending |
| `Checkbox` | `component-checkbox` | Mapped-review-pending |
| `DropdownField`/`SelectItem` | `component-dropdown-field` | Mapped-review-pending |
| `Button` | `component-button` | Mapped-review-pending |
| `SummaryStat` | `component-summary-stat` | Mapped-review-pending |
| `IconButton` | `component-icon-button` | Internal foundation |

**`ConfigRow`** (`Implemented-unmapped`) was explicitly considered and rejected per the corrected policy — the Review step was instead built from plain semantic markup (`<dl>`/`<dt>`/`<dd>`/`<ul>`/`<li>`).

## 8. Provisional (`Mapped-review-pending`) use

`TextField`, `RadioGroup`/`RadioGroupItem`, `Checkbox`, `DropdownField`/`SelectItem`, `Button`, `SummaryStat` — all used per their documented typed APIs, disclosed as provisional in the original report, no visual overrides applied.

## 9. Native interactive controls introduced

**Zero** — re-verified in this record's preparation via `grep -RInE '<button|<input|<select|<textarea'` against the generated files: no matches.

## 10. Raw hex / manual token violations

**Zero** — re-verified via `grep -RInE '#[0-9A-Fa-f]{3,8}'`: no matches. 44 `className`-with-visual-token hits were found and reviewed at the time, all on plain layout wrapper elements using token literals (`var(--...)`), never on an approved component's own visual recipe.

## 11. Cross-component token borrowing

None found — every token literal used was semantic/primitive tier, no `--c-*` (component-owned) token borrowed from a different component's namespace.

## 12. Functional/browser verification performed

Performed live, in a real browser, against a dev server serving the isolated harness. Verified: step-1 name-required gating, step-2 condition validation (≥1 fully-valid condition required), condition add/remove, ALL/ANY toggle, anonymous-visitors checkbox toggle, backward navigation with state preserved, Review screen accuracy against entered state, the local-only "Create segment" success action. All passed.

## 13. Visual-review findings

One real, reproducible defect: **the horizontal `RadioGroup` instances (Audience type: Users/Accounts; Match logic: ALL/ANY) had broken keyboard navigation.** `ArrowDown`/`ArrowRight` did not move focus between options; DOM inspection confirmed "Accounts" carried `tabindex="-1"` and was unreachable via keyboard alone (though reachable by mouse). Root-caused to composing `className="flex flex-row ..."` for horizontal layout without the separate, real `orientation="horizontal"` prop Radix's roving-focus logic depends on — a composition the repository's own `radio-group.doc.ts` at the time permitted without warning of this specific pairing requirement.

A secondary, self-flagged (not fixed) observation: the condition-row wrapper divs used hand-styled border/radius/padding on a plain `<div>` rather than evaluating whether the approved `Card` component would have been a better-fit container — reported honestly as an unresolved judgment call, not corrected.

## 14. Repository ambiguity or defect discovered

The RadioGroup keyboard defect (see #13) is the primary finding. The `Card`-vs-hand-styled-div question is a secondary, unresolved observation.

## 15. Classification

- RadioGroup keyboard defect → **documentation ambiguity** (the component itself passes `orientation` straight through to Radix correctly; the doc/example simply never told an author that a horizontal `className` must be paired with `orientation="horizontal"`).
- `Card`-vs-div question → **unresolved judgment call**, disclosed, not classified further at the time.

## 16. Repository change triggered

[PR #13](https://github.com/gs-zkhan/PX_RepoForClaude/pull/13) — "docs: fix horizontal RadioGroup keyboard guidance." Corrected `radio-group.doc.ts`'s guidance and its canonical `horizontal.tsx` example to require `orientation="horizontal"` alongside a horizontal `className`; fixed the same pre-existing mistake found independently in `ValidationGallery.tsx` and `create-edit-shell-example.tsx`; added a static regression test (`tests/radio-group/`). Merged into `main` at `56b51419d356bd2b558800e01592fe205386ab3c`.

## 17. Final disposition

**Historical/negative fixture.** This run is preserved specifically *because* it demonstrates the defect that PR #13 fixed — its value is as a documented "before" state, not as a clean PASS example. At the time, scored 8/9 non-zero-tolerance criteria (accessibility failed for the RadioGroup reason above); no automatic-FAIL condition was triggered.

## 18. Human intervention count

- **Generation corrections before first render:** not confidently recoverable — this generation was performed directly within the primary session (pre-subagent-delegation era of this benchmark program), and no distinct log of "wrong code written, then self-corrected before first render" survives independent of the final delivered file.
- **Design-owner visual corrections:** not applicable — no design-owner review step exists in this benchmark methodology (distinct from the production Figma-approval process referenced elsewhere in this repository).
- **Repository ambiguities encountered during generation:** 0 explicitly logged during authoring; the RadioGroup defect was found during the *verification* phase, not disclosed as an authoring-time ambiguity.
- **Figma consultations:** 0 (disallowed and confirmed not used).
- **New components invented:** 0.
