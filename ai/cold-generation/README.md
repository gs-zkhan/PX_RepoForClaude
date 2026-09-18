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
| #5 | Segment Detail (single-record detail/drilldown, before-state) | Fourth architecture, first test of this anatomy — functionally correct, but no sanctioned shell existed for it; `PxListShell` used as an unconfirmed judgment call. Also surfaced a real `DropdownMenuItem` icon-source defect already live in production | [PR #18](https://github.com/gs-zkhan/PX_RepoForClaude/pull/18) (icon fix + gap documentation), [PR #19](https://github.com/gs-zkhan/PX_RepoForClaude/pull/19) (`PxDetailDrilldownShell` implemented) |
| #6 | Segment Detail, independent rerun after `PxDetailDrilldownShell` (after-state) | Same archetype as #5, fresh/blind agent, no Figma — independently selected the new `PxDetailDrilldownShell` via anatomy-based registry guidance alone, with no fallback judgment call and no new gap found | None — clean pass, no repository change required |
| #7 | Account Explorer (List + Detail/Drilldown), v1.1 registry state — first test with the real production screen physically hidden from the worktree | Fifth architecture (list-plus-drilldown, entity = Account) — independently selected `PxListShell`/`PxDetailDrilldownShell`, `TableFrame`, `StatsRow`/`SummaryStat` (max-4 rule followed), the Product Surface Rule, and `TableCustomizationMenu` (correctly reasoning through `decision-dropdown-menu-scoped-composition`). Found a real registry double standard: direct screen-level `Popover` usage for the canonical `FilterBar`+`FilterDropdownPanel` pattern was technically `Implemented-unmapped`/disallowed, despite matching `user-explorer.tsx` exactly and despite Popover already being an undocumented dependency of four approved components | [PR #25](https://github.com/gs-zkhan/PX_RepoForClaude/pull/25) — initially **PARTIAL**, now **PASS** retroactively, with no change to the generated screen (see [Retroactive fix: Test #7](#retroactive-fix-test-7-popover-eligibility) below) |

See the individual test records for full detail:
- [`test-01-create-segment.md`](./test-01-create-segment.md)
- [`test-02-create-segment-rerun.md`](./test-02-create-segment-rerun.md)
- [`test-03-feature-adoption-analytics.md`](./test-03-feature-adoption-analytics.md)
- [`test-04-segments-list.md`](./test-04-segments-list.md)
- [`test-05-segment-detail.md`](./test-05-segment-detail.md)
- [`test-06-segment-detail-rerun.md`](./test-06-segment-detail-rerun.md)
- [`test-07-account-explorer-v1.1.md`](./test-07-account-explorer-v1.1.md)

## Before/after: Test #5 → Test #6

This pair is the clearest available evidence that repository hardening measurably changed AI generation behavior, not merely that two isolated tests produced different outcomes:

1. **Test #5** (base `9b434785…`) — no sanctioned single-record detail/drilldown shell existed. A fresh agent correctly identified the gap, disclosed it honestly, and made an unconfirmed judgment call (`PxListShell`) rather than inventing a new shell or silently mis-selecting one. Disposition: **PARTIAL**.
2. **Repository hardening** — [PR #18](https://github.com/gs-zkhan/PX_RepoForClaude/pull/18) fixed the `DropdownMenuItem` icon defect Test #5 also surfaced and documented the shell gap as a decision record requiring design-owner input (deliberately not picking a shell itself). The design owner then brought Figma's Detail/Drilldown page into scope and directed [PR #19](https://github.com/gs-zkhan/PX_RepoForClaude/pull/19), which implemented `PxDetailDrilldownShell` as a thin composition of already-existing primitives and registered it in `ai/shell-registry.md`, design-owner Approved.
3. **Test #6** (base `8f70900a…`, immediately after PR #19) — a fresh, blind agent, with no memory of Test #5 and no Figma access, regenerated the same archetype and **independently selected `PxDetailDrilldownShell`** purely from `ai/shell-registry.md`'s anatomy description — no naming hint, no coaching, no fallback judgment call required. Disposition: **PASS**.

The controlled variable across this pair is the repository itself, not the prompt or the agent: both tests used the same archetype and the same fresh/blind-agent/no-Figma methodology. The only thing that changed between them is that the repository gained a registered, Approved shell for this archetype — which is what changed the outcome from an honestly-disclosed judgment call to a clean, registry-traceable selection.

## Retroactive fix: Test #7 (Popover eligibility)

Test #7 (see [`test-07-account-explorer-v1.1.md`](./test-07-account-explorer-v1.1.md)) is the first record in this directory where a repository fix upgrades a test's own disposition **in place**, rather than requiring a fresh rerun like the Test #5 → Test #6 pair above. The distinction matters for how much this record can be trusted to claim:

1. **Test #7, as generated.** A fresh, blind agent — with the real `src/pages/account-explorer.tsx` physically hidden from its worktree — independently selected `PxListShell`/`PxDetailDrilldownShell`, `TableFrame`, `StatsRow`/`SummaryStat` (correctly capped at 4 per row), the Product Surface Rule, and `TableCustomizationMenu` (correctly reasoning through the existing `decision-dropdown-menu-scoped-composition`). It also reproduced `user-explorer.tsx`'s own canonical `Popover`+`PopoverAnchor`+`PopoverContent` composition for anchoring `FilterBar`+`FilterDropdownPanel` — a pattern that, on direct registry lookup, turned out to be technically disallowed: `component-popover` sat in the identical `Implemented-unmapped`/`Unmapped`/`Pending` posture as `component-dropdown-menu`, but with no scoped-composition decision covering it, unlike DropdownMenu. Disposition at the time: **PARTIAL**.
2. **Repository hardening.** A follow-up repo-wide Popover eligibility audit found the same primitive already relied on internally, undocumented, by four approved/approved-with-exception components (`component-color-picker`, `component-notification`, `component-rte-field`, `component-dashboard-widget-card`), and unflagged at screen level in the canonical reference page itself. [PR #25](https://github.com/gs-zkhan/PX_RepoForClaude/pull/25) added `decision-popover-scoped-composition`, mirroring the DropdownMenu decision's structure, without changing `component-popover`'s own status or any component/source code.
3. **Test #7's disposition, reconsidered.** PR #25's second clause narrowly sanctions exactly the `FilterBar`+`FilterDropdownPanel` anchoring composition Test #7's generated screen already used. Nothing about the generated file needed to change — only the registry's own bookkeeping did. Disposition is recorded as **PASS**, retroactively, as of PR #25.

**Why this is not the same claim as a Test #5/#6-style rerun:** #5 → #6 independently reconfirmed, with a *second* fresh agent run against the hardened repository, that the fix generalizes to a brand-new generation. Test #7's upgrade to PASS confirms only that the *one specific composition it already produced* is now correctly covered by policy — it does not by itself demonstrate that a fresh agent, run again today, would make every one of the same correct choices Test #7 made. A Test #8-style independent rerun would be required to make that broader claim, and has not been performed.

## Preserved evidence

Each test's generated code remains uncommitted in its own dedicated git worktree, preserved as benchmark evidence and never merged:

| Test | Worktree | Branch | Base commit |
|---|---|---|---|
| #1 | `PX_RepoForClaude-cold-test-segment` | `test/cold-generation-create-segment` | `a62d4c6878306975b97230c4c632e39752b029a0` |
| #2 | `PX_RepoForClaude-cold-test-segment-2` | `test/cold-generation-create-segment-2` | `56b51419d356bd2b558800e01592fe205386ab3c` |
| #3 | `PX_RepoForClaude-cold-test-feature-adoption` | `test/cold-generation-feature-adoption-analytics` | `b0451c6b446a2394a279c25590ac3817dfb65583` |
| #4 | `PX_RepoForClaude-cold-test-segments-list` | `test/cold-generation-segments-list` | `b0451c6b446a2394a279c25590ac3817dfb65583` |
| #5 | `PX_RepoForClaude-cold-test-segment-detail` | `test/cold-generation-segment-detail` | `9b434785716b7291e5c04967618e356b6931b466` |
| #6 | `PX_RepoForClaude-cold-test-segment-detail-rerun` | `test/cold-generation-segment-detail-rerun` | `8f70900a73f4a90ecc90e70286c8399a86a56915` |
| #7 | `PX-cold-test-account-explorer` | `test/cold-gen-account-explorer` | `87fd3ebfc0a96cf51f2362b34c109ef7c6260d4b` |

These worktrees are local-only working trees, not remote branches with committed content — the "base commit" is the `origin/main` SHA each worktree's branch was created from; the generated screen files exist only as uncommitted changes within that worktree. This record was written from that live evidence plus this repository's own commit/PR history; it does not itself contain the generated code.

Test #7 additionally required physically hiding an existing product file (`src/pages/account-explorer.tsx`) from its worktree — moved, uncommitted, to a quarantine path entirely outside the worktree tree — since prior tests' "no access to an existing finished screen" condition was enforced by instruction alone, not by making the file physically unavailable. See [`test-07-account-explorer-v1.1.md`](./test-07-account-explorer-v1.1.md) §4 for the full isolation method.

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
