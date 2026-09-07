# Cold Generation Evaluation Record

This directory is the permanent, checked-in record of the repository's cold-generation benchmark program — a series of tests asking an AI to build a complete PX screen from repository documentation alone (component docs, shell registry, `CLAUDE.md`, `ai/figma-coverage.json`), with **no access to Figma** and **no access to any existing finished product screen or prior test's output**, then verifying the result live in a browser.

The purpose is to answer one question repeatedly, across different screen architectures: **can an AI reliably produce a correct, composition-compliant PX screen from this repository's own guidance, with no other source of truth?**

Each test's generated code lives, uncommitted, in its own preserved git worktree (see "Preserved evidence" below) — it is not copied into this directory. This directory holds the durable *record* of what happened: what was asked, what was produced, what was verified, what went wrong, and what repository change (if any) resulted.

## Benchmark progression

| Test | Screen / architecture | Outcome | Triggered |
|---|---|---|---|
| #1 | Create Segment (Create/Edit wizard) | Real defect found: horizontal `RadioGroup` had broken keyboard navigation because `orientation="horizontal"` wasn't paired with the horizontal layout `className` | [PR #13](https://github.com/gs-zkhan/PX_RepoForClaude/pull/13) |
| #2 | Create Segment, independent rerun after PR #13 | RadioGroup fix independently confirmed working (blind rerun, no memory of the bug). New finding: `DropdownField`'s controlled `value` prop toggling between `undefined` and a string triggered a React warning | [PR #14](https://github.com/gs-zkhan/PX_RepoForClaude/pull/14) |
| #3 | Feature Adoption (Analytics dashboard) | First test of a materially different architecture (Analytics, not Create/Edit) — passed functionally, but exposed shell-naming ambiguity, a stale `PxMainContainer` consumer list, an undiscoverable `DashboardWidgetChartTypeSwitcher`, and two agent-side registry-lookup mistakes | [PR #15](https://github.com/gs-zkhan/PX_RepoForClaude/pull/15) |
| #4 | Segments (List/Table/Filter/Bulk-action) | Third architecture, passed functionally. Surfaced the same `DropdownMenu` scoped-composition question independently (fixed by PR #15) and a still-open `SearchBar` width-convention question (not yet fixed) | [PR #15](https://github.com/gs-zkhan/PX_RepoForClaude/pull/15) (partial); `SearchBar` question open |

See the individual test records for full detail:
- [`test-01-create-segment.md`](./test-01-create-segment.md)
- [`test-02-create-segment-rerun.md`](./test-02-create-segment-rerun.md)
- [`test-03-feature-adoption-analytics.md`](./test-03-feature-adoption-analytics.md)
- [`test-04-segments-list.md`](./test-04-segments-list.md)

## Preserved evidence

Each test's generated code remains uncommitted in its own dedicated git worktree, preserved as benchmark evidence and never merged:

| Test | Worktree | Branch | Base commit |
|---|---|---|---|
| #1 | `PX_RepoForClaude-cold-test-segment` | `test/cold-generation-create-segment` | `a62d4c6878306975b97230c4c632e39752b029a0` |
| #2 | `PX_RepoForClaude-cold-test-segment-2` | `test/cold-generation-create-segment-2` | `56b51419d356bd2b558800e01592fe205386ab3c` |
| #3 | `PX_RepoForClaude-cold-test-feature-adoption` | `test/cold-generation-feature-adoption-analytics` | `b0451c6b446a2394a279c25590ac3817dfb65583` |
| #4 | `PX_RepoForClaude-cold-test-segments-list` | `test/cold-generation-segments-list` | `b0451c6b446a2394a279c25590ac3817dfb65583` |

These worktrees are local-only working trees, not remote branches with committed content — the "base commit" is the `origin/main` SHA each worktree's branch was created from; the generated screen files exist only as uncommitted changes within that worktree. This record was written from that live evidence plus this repository's own commit/PR history; it does not itself contain the generated code.

## Benchmark methodology

A cold-generation test is only valid evidence about the *repository* — not about a specific AI session's memory or a specific automation tool's quirks — if it follows this method:

1. **Fresh worktree, declared base.** Create a new git worktree on a new branch, checked out from a specific, recorded `origin/main` SHA. Never reuse or modify a prior test's worktree.
2. **Fresh context, no memory of prior tests.** The generation must be performed by an AI session (or delegated sub-agent) with no memory of this benchmark program, prior test results, or prior defects found. A session that already knows "the RadioGroup bug" cannot blindly re-test whether the fix generalizes — delegate to a fresh sub-agent when the primary session is contaminated.
3. **No Figma**, unless the test's explicit, stated purpose is to evaluate Figma-assisted generation. The default mode evaluates whether the repository's own checked-in documentation is sufficient on its own.
4. **Describe the product requirement by anatomy and behavior, not by naming the desired shell/component.** State what the screen needs to do and what data it shows — never "use PxListShell" or "use DashboardWidgetCard." The test is invalid evidence about shell/component *selection* if the answer is handed to the generator.
5. **Require direct registry lookup before using any component** — search `ai/figma-coverage.json` by both `id` and `name` (a prior test misreported a component as "absent" by searching incompletely) and quote the exact `status`/`figmaMappingStatus`/`designOwnerApproval` found, rather than inferring status from a parent/consumer component.
6. **Prefer `Approved`/`Approved-with-documented-exception` components.** Use `Mapped-review-pending` components provisionally when needed — call this out explicitly in the report, use their exact documented API, and never visually override them. `Internal foundation` components may be composed directly only when a registered, approved consumer's own documentation explicitly requires that composition (quote the evidence). `Implemented-unmapped`/`Legacy`/`Out of scope`/`Missing` components must not be used directly; if an approved surface's own documented public API requires passing that disallowed primitive's content through a slot (e.g. `DropdownMenuItem` into `SplitButton.menuContent`), that is covered by the approved surface's own review — using anything else from that disallowed primitive independently is not.
7. **Reject a native duplicate control** (`<button>`, `<input>`, `<select>`, `<textarea>`) wherever an approved/provisional shared component already owns that interactive role.
8. **Reject any invented token, icon, API, or design-system capability.** If a requirement genuinely needs something the repository doesn't have, report the gap — do not hand-roll a substitute.
9. **Verify live in a real browser**, not by reading the generated source and assuming it works. Exercise every stated interaction.
10. **Distinguish browser-automation artifacts from genuine defects before reporting either.** If a keyboard action appears not to work, attach a real `keydown` listener and inspect the actual `key`/`code` the automation tool dispatched — some tools mismap certain key-name tokens (e.g. an empty `key` for `"Return"` while the correctly-spelled `"Enter"` works). Reproduce the same probe against an unmodified, pre-existing component or a bare native element before concluding the *repository* is at fault.
11. **Disclose judgment calls and unresolved findings honestly.** A test's value comes from what it can't confidently resolve, not just what it confirms — report ambiguous compliance calls (e.g. "is this `className` a placement convention or a visual override?") and any finding you couldn't fully verify, rather than asserting a confident answer either way.

## PASS / PARTIAL / FAIL rubric

**Automatic FAIL** if any of the following occurred, regardless of anything else in the run:
- A native interactive control replaces an available shared component.
- A disallowed-status component (`Implemented-unmapped`/`Legacy`/`Out of scope`/`Missing`) is used directly, without going through an approved consumer's own documented composition path.
- An invalid typed API is used (a prop that doesn't exist, a value outside a documented enum, etc.).
- A token, icon, component, or design-system capability is invented.
- The wrong shell is selected despite clear, documented anatomy guidance pointing to a different one.

**PASS** requires all of:
- Correct shell selection, justified by the screen's actual anatomy and traceable to `ai/shell-registry.md`/`CLAUDE.md`.
- Correct component reuse, with registry status verified by direct lookup rather than assumed.
- Zero native duplicate controls.
- Zero raw hex / manual visual values where a token exists.
- Zero cross-component token borrowing.
- Live functional verification passes for every stated interaction.
- No undocumented design-system assumption was required to complete the screen.
- Any unresolved judgment call is honestly disclosed in the report, not silently resolved either way.

**PARTIAL**: the screen is fundamentally correct and passes functional verification, but the test exposes a genuine new repository/documentation/capability gap that prevented a clean first-pass result (e.g. a real component defect, a documentation contradiction, a missing pattern) — the repository, not the generation, is what needs to change next.

**FAIL**: none of the automatic-FAIL conditions is required to reach FAIL — a test that cannot produce a working screen at all without violating the eligibility rules, or that requires a disallowed capability with no compliant workaround, also fails.

## Standard fields recorded per test

Every test record in this directory follows the same 18-field structure — test objective, exact starting commit, Figma availability, prompt (verbatim or clearly labeled as reconstructed), generated files, shell selected, components/patterns with registry status at time of test, provisional (`Mapped-review-pending`) usage, native controls introduced, raw hex/token violations, cross-component token borrowing, functional/browser verification performed, visual-review findings, repository ambiguity or defect discovered, classification of each finding (genuine repo defect / documentation ambiguity / generation mistake / browser-automation artifact / known capability gap), repository change triggered (with PR number), final disposition (PASS/PARTIAL/FAIL/historical fixture), and a human-intervention count (generation self-corrections before first render, design-owner visual corrections, repository ambiguities encountered, Figma consultations, new components invented) — reported honestly as "not confidently recoverable" wherever the underlying evidence doesn't support a precise count.
