# Cold Generation Test #7 — Account Explorer (List + Detail/Drilldown, v1.1 registry state)

## 1. Test objective

Test a genuinely blind generation of an Account Explorer screen — a list-driven landing page (summary metrics + sortable/searchable/filterable account table) plus a single-record detail/drilldown, opened by clicking an account name — using only this repository's checked-in guidance, with the real production `src/pages/account-explorer.tsx` implementation physically hidden from the generating agent so it could not inspect or reuse it. This is the first cold-generation test of this exact archetype (list-plus-drilldown, entity = Account) against the v1.1 shared-system-audit registry state, and the first to include a full repo-wide eligibility audit of every shared component the generated screen touched.

## 2. Exact starting repository commit

`87fd3ebfc0a96cf51f2362b34c109ef7c6260d4b` — "Merge pull request #24 from gs-zkhan/fix/work-in-progress-surface" (`origin/main` at the time, identical to local `main`, verified via `git fetch` + `git rev-parse` with zero divergence). Worktree: `PX-cold-test-account-explorer`, branch `test/cold-gen-account-explorer`.

## 3. Was Figma available during generation?

No. The generating agent was explicitly instructed not to use Figma tools unless the repository's own docs said a gap must be resolved via Figma; no Figma MCP tool calls or node references appear anywhere in the generated code or its rationale comments.

## 4. Blind-test isolation method

Before the generating agent was ever invoked:

1. A new git worktree was created from `main` at the commit above, on a new branch (`git worktree add -b test/cold-gen-account-explorer "<path>" main`) — a genuinely separate working directory sharing the same `.git` object store, not a fork or clone.
2. `src/pages/account-explorer.tsx` was **moved** — not deleted or overwritten — from that worktree's `src/pages/` directory to `/Users/zkhan/Office Work/.cold-test-quarantine/account-explorer.tsx`, a location entirely outside the worktree's directory tree. This was a plain, uncommitted filesystem `mv`, local to that one worktree only — fully reversible, and touching neither `main` nor the file's git history (the object remains intact and recoverable from `main` and from git history at all times).
3. The generating agent was explicitly instructed to operate only inside the worktree path, never to look outside it, never to consult git history/other branches/`git show` for the missing file, and to treat the file "as if it never existed."
4. `App.tsx` was deliberately left untouched inside the worktree — it still imports the now-missing `account-explorer.tsx` for its "accounts" nav route, which is a known, expected, harmless breakage confined to that one unrelated route; the generating agent was told to verify its own new page via a standalone preview entry (a second `.html` + `main.tsx`-style entry point, mirroring this repo's own existing `standalone.html`/`docs-standalone-main.tsx` pattern) rather than the full `App.tsx` shell, so the dangling import was never exercised.
5. `main` and the rest of the repository's shared design-system code (`src/components/ui`, `src/patterns`, `ai/`, `tests/`, docs, examples) were confirmed untouched both before and after the test via `git diff --stat main` inside the worktree, which showed exactly one line: the single quarantined file's deletion.

The generating agent's own final report confirms it never read, searched for, or referenced `account-explorer.tsx` (or any file by that name) via any means — no git history, `git show`, other branches, or the quarantine path.

## 5. Original natural-language prompt

The generating agent was a fresh sub-agent, briefed with the user's own product requirement embedded verbatim, plus explicit isolation and reporting instructions. The embedded product requirement, quoted exactly as given by the user:

> "Read the repository instructions and understand how the PX design system is intended to be used. Do not use Figma unless the repository explicitly tells you that a required design decision cannot be resolved from the repo. Create an Account Explorer page using the existing PX design system in this repo. At the top, show a useful set of account summary metrics. Below that, show a table listing all accounts. The account name should be a hyperlink. Add other columns that make sense for an Account Explorer page. When I click an account name, open a drilldown page for that account. The drilldown should have a back arrow to return to Account Explorer and should show more detailed analytics and account information. Use existing components, patterns, shells, and design-system rules already documented in this repo. Do not invent new components or styling if an existing approved pattern/component can be used. Start with a sensible first version — I will review the screen visually and refine the product content after I see it."

The sub-agent was additionally required to produce a 6-point pre-implementation report (shell for landing, shell for drilldown, major shared components/patterns planned, table-toolbar capabilities discovered, any Component Eligibility Policy restriction blocking something it would otherwise use, and whether any gap forced a stop-and-ask) before writing code, and was told explicitly not to name `account-explorer.tsx`, not to look for it, and to implement in a clearly-named new file instead.

## 6. Generated files

Uncommitted, in worktree `PX-cold-test-account-explorer` (branch `test/cold-gen-account-explorer`):
- `src/pages/account-explorer-blind-test.tsx` — the screen (list view + drilldown view), including its own trailing Component Composition Audit section
- `src/account-explorer-blind-test-main.tsx` — standalone preview entry, mirroring `standalone.html`/`docs-standalone-main.tsx`
- `account-explorer-blind-test.html` — standalone HTML entry at the worktree root
- `.claude/launch.json` — one additive launch config (port 5190) alongside the existing entry; the existing entry was not modified

`App.tsx`/`main.tsx`/`index.html` were read only, never edited.

## 7. Shells independently selected

- **Landing page: `PxListShell`** — justified by the agent as anatomy-based: a single sortable/searchable/filterable account dataset with a metrics strip above it, matching `ai/shell-registry.md`'s own row for this shell, which names "Accounts" as an explicit example. Status **Approved** (design owner, 2026-08-27).
- **Drilldown: `PxDetailDrilldownShell`** — justified as a single-record, read-focused, non-tabular view; the shell's own README lists "Account" as an example entity. Status **Approved** (design owner, 2026-09-07). Back arrow, title, status chip, and tabs all reuse `PxHeader`'s existing Secondary Bar props (`onBack`, `title`, `titleChip`, `tabs`, `activeTabId`, `onTabChange`) — no new header/back-navigation control was built.

Both selections were reached via anatomy-based registry reasoning, with no shell name given or hinted at in the embedded product requirement.

## 8. Components/patterns used, with registry status at time of test

Re-verified by direct `ai/figma-coverage.json` lookup during this record's preparation (statuses as of the base commit / immediately before PR #25):

| Component | Registry id | Status at time of test |
|---|---|---|
| `PxListShell` | `shell-px-list-shell` | Approved |
| `PxDetailDrilldownShell` | `outofscope-detail-drilldown-page` | Approved |
| `Link` | `component-link` | Approved |
| `SummaryStat` / `StatsRow` | `component-summary-stat` | Mapped-review-pending |
| `TableFrame` | `component-table-frame` | Mapped-review-pending |
| `Table` (+ parts) | `component-table` | Mapped-review-pending |
| `TableCustomizationMenu` | `component-table-customization-menu` | Mapped-review-pending |
| `SearchBar` | `component-search-bar` | Mapped-review-pending |
| `FilterBar` | `component-filter-bar` | Mapped-review-pending |
| `FilterDropdownPanel` | `component-filter-dropdown-panel` | Mapped-review-pending |
| `Pagination` | `component-pagination` | Mapped-review-pending |
| `StatusLabel` | `component-status-label` | Mapped-review-pending |
| `Chip` | `component-chip` | Mapped-review-pending |
| `LineChart` | `component-line-chart` | Mapped-review-pending |
| `Avatar` / `AvatarFallback` | `component-avatar` | Mapped-review-pending |
| `Button` | `component-button` | Mapped-review-pending |
| `Popover` / `PopoverAnchor` / `PopoverContent` | `component-popover` | **Implemented-unmapped — see finding below** |

**Correctly avoided:** the agent's own report explicitly reasoned through `decision-dropdown-menu-scoped-composition` and correctly did not import `DropdownMenu` directly — no per-row "more actions" menu and no `StatusSelect`-based inline status editing exist on this screen, since both would require a direct `DropdownMenu` import outside its four named scoped consumers. `TableCustomizationMenu` was used directly, with the agent explicitly citing that its own internal `DropdownMenu` use is one of those four named exceptions.

## 9. Provisional (`Mapped-review-pending`) use

All thirteen `Mapped-review-pending` components in the table above are disclosed in the generated file's own trailing Component Composition Audit section, each used per its documented public API with no invented prop, variant, or visual override.

## 10. Native interactive controls introduced

**Zero** — independently re-verified in this record's preparation via `grep -nE '<button|<input|<select|<textarea'` against both generated files.

## 11. Raw hex / manual token violations

**Zero raw hex.** Five `className`-with-visual-token hits, independently re-verified: four are plain layout wrapper `<div>`s (flex/gap/padding using `--p-space-*` semantic tokens, one border-top divider using `--s-color-line-default`), and one is a `PopoverContent className="w-[320px]"` width constraint — identical in kind to the same constraint already present on `src/pages/user-explorer.tsx`'s own `PopoverContent` usage. None target an approved/provisional component's own visual recipe.

## 12. Cross-component token borrowing

None found.

## 13. Functional/browser verification performed

Live, in a real browser, against a dev server serving the standalone preview entry (`http://localhost:5190/account-explorer-blind-test.html`; left running by the sub-agent at the end of its run). Verified: list page renders (4 summary stat cards, 10 sortable columns, 40 paginated accounts); clicking an account name opens the drilldown (back arrow, title, health chip, Overview/Activity tabs, 4 top stats, 4 account-info fields, session trend line chart, recent-activity table); the back arrow returns to the exact prior list state; search filters the table and updates the toolbar's filtered count; sorting a column re-orders rows with the sort-direction indicator shown; opening the filter bar and applying a Health = "At Risk" picklist filter narrows the table to exactly the accounts matching the top-of-page At-Risk summary stat; the column-customization menu opens and shows Arrange Columns + Row Density controls. All interactions passed.

## 14. Visual-review findings

None beyond the eligibility finding below — no rendering defects, no console errors, no missing-icon warnings were reported.

## 15. Repository ambiguity or defect discovered — the Popover eligibility finding

The generated screen imported `Popover`, `PopoverAnchor`, and `PopoverContent` directly at screen level to anchor its `FilterBar`+`FilterDropdownPanel` filter-editing panel to a clicked chip — the exact same composition already used, unflagged, in `src/pages/user-explorer.tsx` (`page-user-explorer-canonical`), the file `CLAUDE.md`'s own "Canonical application references" section and `decision-canonical-page` designate as the reference architecture a new screen should study and reuse.

A follow-up repo-wide audit (conducted after the generating agent's own report, not by the generating agent itself — see Section 18) found `component-popover` registered with **`status: Implemented-unmapped`**, **`figmaMappingStatus: Unmapped`** (zero `figmaNodes`), **`fidelityReview`/`visualReview: Pending`**, never independently design-owner approved — the identical eligibility posture as `component-dropdown-menu`, which CLAUDE.md's Component Eligibility Policy places in the "Not directly usable for screen generation" bucket. Unlike `component-dropdown-menu`, which has an explicit decision (`decision-dropdown-menu-scoped-composition`) naming four sanctioned internal consumers, `component-popover` had **no equivalent decision**, despite already being an internal dependency of four approved/approved-with-exception components (`component-color-picker`, `component-notification`, `component-rte-field`, `component-dashboard-widget-card` via `DashboardWidgetChartTypeSwitcher`) — none of which listed `component-popover` in their own `dependencies` array, even though `component-dashboard-widget-card`'s own `knownDeviations` text already stated its chart-type switcher "is built on Popover instead" of `DropdownMenu`.

## 16. Classification

**Documentation/registry-policy gap, not a generation mistake.** The generating agent faithfully reproduced the canonical reference page's own established composition pattern; the miss was that neither the agent's own compliance check nor the registry itself flagged Popover's eligibility before use. This is the same *class* of tension Test #4 first surfaced for `DropdownMenu`/`SplitButton` (an Approved component's internal reliance on an `Implemented-unmapped` primitive, discovered by a cold-generation test rather than a design review) — but this time for a primitive Test #4's generation didn't happen to touch, and one degree more severe: the generating agent had *already* correctly reasoned through and avoided the DropdownMenu version of this exact tension, but did not extend the same eligibility check to Popover, which sits in an identical registry posture.

## 17. Repository change triggered

[PR #25](https://github.com/gs-zkhan/PX_RepoForClaude/pull/25) — added `decision-popover-scoped-composition` to `ai/figma-coverage.json`, with two clauses: (1) an approved-internal-consumer clause recording `component-popover` in the `dependencies` array of the four already-approved consumers named above, mirroring `decision-dropdown-menu-scoped-composition`'s own structure; (2) a canonical screen-level filter-composition clause narrowly sanctioning direct screen-level `Popover`+`PopoverAnchor`+`PopoverContent` composition specifically to anchor `FilterBar`+`FilterDropdownPanel`, citing `page-user-explorer-canonical`/`src/pages/user-explorer.tsx` as the grounding evidence. `component-popover`'s own entry was left untouched (`status: Implemented-unmapped`, `figmaMappingStatus: Unmapped`, `designOwnerApproval: false`) — this is a scoped-composition exception, not a promotion of Popover itself. No component/source code changed; `npm run figma-coverage:validate` (100 entries, 0 errors/warnings), `npm run test:figma-coverage` (41/41), and `npm run test:registry-coherence` (30/30) all passed against the fix.

## 18. Final disposition

**Initially PARTIAL, now PASS as of PR #25 — without any change to the generated screen.**

- **Why initially PARTIAL:** per this benchmark's own rubric, PARTIAL applies when "the screen is fundamentally correct and passes functional verification, but the test exposes a genuine new repository/documentation/capability gap that prevented a clean first-pass result." Every shell/component selection, every eligibility check the agent did perform (DropdownMenu), every toolbar capability, the max-4 `StatsRow` cap, and the Product Surface Rule were all independently discovered and correctly followed — but the direct Popover usage was, at the time, technically outside the Component Eligibility Policy's own rules (an `Implemented-unmapped` primitive used directly by a fresh screen, with no scoped-composition decision covering it) — a genuine registry gap, not a defect in the generated screen's actual behavior or visual correctness.
- **Why PR #25 changes this to PASS without touching the generated file:** PR #25's second clause explicitly and narrowly sanctions exactly the composition the generated screen used — Popover anchoring `FilterBar`+`FilterDropdownPanel`, grounded in the same canonical-reference-page evidence this test already relied on. The generated screen's code did not need to change; only the registry's own bookkeeping did. This is a **methodologically distinct pattern** from the Test #5 → Test #6 pair recorded in this directory's README: #5/#6 required an independent *rerun* of a fresh agent against the hardened repository to confirm the fix generalizes; Test #7's disposition is instead retroactively upgraded in place, because the fix is a registry-only decision that directly covers the one specific composition this one test already produced — it does not, by itself, confirm a future fresh agent would make the same correct choice again (that would require a Test #8-style rerun, not yet performed).

Per the automatic-FAIL checklist: no native control was substituted, no disallowed-status component was used except the flagged Popover case (now resolved), no invalid API was used, and no capability was invented — so FAIL was never in play.

## 19. Human intervention count

- **Generation self-corrections before first render:** 1 explicitly recoverable — one `react-refresh/only-export-components` ESLint finding in the standalone entry file (a local component defining `useState`), fixed with a documented `eslint-disable-next-line` at the time of generation.
- **Design-owner visual corrections:** not applicable — no design-owner review of this specific artifact occurred.
- **Repository ambiguities encountered during generation:** 0 disclosed *by the generating agent itself* — the Popover finding was surfaced by a separate, subsequent repo-wide audit performed after the agent's own final report, not caught by the agent's own real-time compliance check. This is recorded honestly as a methodological note: the agent's own eligibility-checking rigor was inconsistent (thorough for `DropdownMenu`, absent for `Popover`), which is itself part of what Section 16 above classifies.
- **Figma consultations:** 0.
- **New components invented:** 0.

## 20. Preserved evidence

| Worktree | Branch | Base commit |
|---|---|---|
| `PX-cold-test-account-explorer` | `test/cold-gen-account-explorer` | `87fd3ebfc0a96cf51f2362b34c109ef7c6260d4b` |

Generated files (uncommitted, preserved only in the worktree above, not copied into this record, and never merged into `main`):
- `src/pages/account-explorer-blind-test.tsx`
- `src/account-explorer-blind-test-main.tsx`
- `account-explorer-blind-test.html`
- `.claude/launch.json` (one additive entry)

The quarantined original file remains at `/Users/zkhan/Office Work/.cold-test-quarantine/account-explorer.tsx` (uncommitted move, outside the worktree, fully intact) — restore it to `PX-cold-test-account-explorer/src/pages/account-explorer.tsx` before discarding this worktree if the isolation itself needs to be undone for any reason.
