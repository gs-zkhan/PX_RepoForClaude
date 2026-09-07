# Cold Generation Test #4 — Segments (List/Table/Filter/Bulk-action)

## 1. Test objective

Test a third architecture, distinct from both Create/Edit (Tests #1/#2) and Analytics (Test #3): a list-management screen with search, multi-field filtering, sortable table, row selection with bulk actions, per-row action menus, pagination, and an empty state.

## 2. Exact starting repository commit

`b0451c6b446a2394a279c25590ac3817dfb65583` — `origin/main` immediately after PR #14 merged, before PR #15 (same base commit as Test #3 — no `main` movement occurred between the two tests).

## 3. Was Figma available during generation?

No.

## 4. Prompt used — VERBATIM (fully recoverable from this session's own history)

> We are now running COLD GENERATION TEST #4 against the current canonical PX repository. This must be independent of Cold Tests #1, #2, and #3.
>
> BASELINE: Start from latest origin/main. Run: git fetch origin. Record the exact origin/main SHA. Create a NEW isolated worktree/branch: test/cold-generation-segments-list. Do not modify main. Do not reuse any previous cold-test worktree.
>
> PURPOSE: Cold Tests #1/#2 tested Create/Edit. Cold Test #3 tested Analytics. Cold Test #4 must test a third architecture: LIST / TABLE / FILTERING / BULK ACTIONS. Question: Can an AI receive a plain product requirement and generate a correct PX list-management screen using only the reusable architecture encoded in the repo?
>
> STRICT COLD-TEST RULES: YOU MUST NOT: use Figma; read any file under src/pages/; inspect any previous cold-test worktree; copy an existing product/list page; read ValidationGallery page-level compositions; invent components, props, variants, tokens, or icons; use native interactive controls where a shared component exists; use Implemented-unmapped/Legacy/Out-of-scope/Missing components; hand-roll a replacement for a disallowed shared capability; borrow another component's component-owned tokens. Mapped-review-pending components are provisionally allowed. Internal foundation components are allowed only when explicitly justified by repo architecture.
>
> WHAT YOU MAY READ: CLAUDE.md; ai/shell-registry.md; ai/figma-coverage.json; PxListShell README/docs; typed docs for every chosen component; component source only when API behavior must be confirmed; real Prism icon assets; token definitions only for existence checks. Do not read src/pages.
>
> PRODUCT REQUIREMENT: Create a PX screen: SEGMENTS. Purpose: Allow a product manager to browse, filter, select, and manage saved audience segments. Page title: Segments. Supporting description: "Create and manage reusable audience segments."
>
> [Full requirement: A. Page/shell — determine correct shell from repo guidance, do not preselect; page title, description, primary "Create Segment" action. B. Search and filtering — search placeholder "Search segments"; filters Status (Active/Draft/Archived), Created by (Me/Team/System), Type (Behavioral/Account/Imported); use repo's appropriate filter/search patterns, do not invent a bespoke filter system if FilterBar/FilterChip or equivalent already owns this. C. Table — ≥8 realistic rows, columns Segment/Type/Users/Status/Created by/Last updated/Actions, example names given (Power Users, Trial Users, Enterprise Accounts, At-Risk Users, New Users - 7 Days, Admin Users, EMEA Customers, Inactive Users); determine correct reusable Table anatomy from repo docs. D. Sorting — Segment, Users, Last updated, using actual table capabilities, don't invent a sort API. E. Row selection — individual + select-all; bulk-action affordance using the repo's existing bulk-action pattern/component when selection exists: Duplicate/Archive/Delete, don't invent a bulk-action UI. F. Row actions — Edit/Duplicate/Archive per row via an appropriate existing menu/action component. G. Pagination — mock 48 total segments, 10 rows/page, page nav + page-size change if the shared API supports it, don't invent unsupported behavior. H. Empty state — "No segments found" when filters/search produce zero results, use existing EmptyState if eligible. I. Interaction — full checklist of every behavior, no backend/API required.]
>
> DISCOVERY FIRST: Before coding, determine: 1. correct shell 2. table component 3. search component 4. filter architecture 5. filter chip/bar components 6. bulk-action component 7. row action/menu component 8. pagination component 9. status display component 10. empty-state component 11. valid icons 12. all registry statuses. If a required capability only exists as Implemented-unmapped or otherwise disallowed: STOP and report the repository gap. Do not substitute a native or bespoke replacement.
>
> [Isolated harness under src/cold-tests/segments-list/, first-pass benchmark rule, functional verification list, composition audit greps, validation, 15-criterion scorecard with automatic-FAIL conditions, and exact required report structure all specified in full — omitted here for length but followed in full at the time.]

## 5. Generated files

Uncommitted, in worktree `PX_RepoForClaude-cold-test-segments-list` (branch `test/cold-generation-segments-list`):
- `src/cold-tests/segments-list/SegmentsListScreen.tsx` (461 lines)
- `src/cold-tests/segments-list/data.ts` (129 lines)
- `src/cold-tests/segments-list/main.tsx` (17 lines)
- `src/cold-tests/segments-list/index.html` (12 lines)

Generation was delegated to a fresh sub-agent with no memory of Tests #1–#3, briefed with an explicit instruction to search the registry rigorously by both `id` and `name` before concluding a component's status, in direct response to the registry-lookup mistakes found in Test #3.

## 6. Shell selected

`PxListShell` — verified present via direct source import (`import { PxListShell } from "@/patterns/px-list-shell"`). Registry: shell registry row, status **Approved** (design owner, 2026-08-27). No shell-naming ambiguity this time — both `CLAUDE.md` and `ai/shell-registry.md` (at the time) named "Segments" as a `PxListShell` example, and the requirement's own anatomy (table + filters + pagination) matched unambiguously.

## 7. Components/patterns selected and registry status at time of test

Re-verified by direct `ai/figma-coverage.json` lookup during this record's preparation (all statuses confirmed unchanged since the test ran):

| Component | Registry id | Status |
|---|---|---|
| `PxListShell` | shell-registry.md row | Approved |
| `Button` (bulkAction variant) | `component-button-bulk-variant` | Approved |
| `SplitButton` (split variant) | `component-button-split-variant` | Approved |
| `Button` (default) | `component-button` | Mapped-review-pending |
| `SearchBar` | `component-search-bar` | Mapped-review-pending |
| `FilterBar`/`FilterChip`/`FilterDropdownPanel` | `component-filter-bar`/`-chip`/`-dropdown-panel` | Mapped-review-pending |
| `Table` (+ parts) | `component-table` | Mapped-review-pending |
| `Checkbox` | `component-checkbox` | Mapped-review-pending |
| `StatusLabel` | `component-status-label` | Mapped-review-pending |
| `Pagination` | `component-pagination` | Mapped-review-pending |
| `PrismIcon` | `foundation-prism-icon` | Mapped-review-pending |

**Correctly avoided:** `DropdownMenu`/`Popover` (`component-dropdown-menu`, `component-popover`), both **Implemented-unmapped**, confirmed by direct registry lookup. Neither was imported directly by the generated screen; `DropdownMenuItem` was passed only into `SplitButton`'s own documented `menuContent` prop (verified directly in `split-button.tsx`: the prop's own comment reads "Content rendered inside the dropdown (typically DropdownMenuItem elements)," and `SplitButton` internally wraps caller-supplied `menuContent` in its own `DropdownMenuContent`) — fulfilling an Approved component's real contract, not independently instantiating a disallowed one.

## 8. Provisional (`Mapped-review-pending`) use

`Button` (default), `SearchBar`, `FilterBar`/`FilterChip`/`FilterDropdownPanel`, `Table`, `Checkbox`, `StatusLabel`, `Pagination`, `PrismIcon` — all disclosed, all used per documented API. `StatusLabel` (not `StatusSelect`) was correctly chosen since the Status column is display-only, not inline-editable.

## 9. Native interactive controls introduced

**Zero** — re-verified via grep in this record's preparation.

## 10. Raw hex / manual token violations

**Zero raw hex.** 10 `className`-with-visual-token hits reviewed, all on plain layout wrappers/page copy, except one: `<SearchBar className="w-[320px]" />` — flagged by the test's own report as a **borderline compliance call**, since `SearchBar` forwards its `className` prop directly onto its internal `Input` element rather than a placement-safe outer wrapper (confirmed by reading `search-bar.tsx` in this session), and `CLAUDE.md`'s allowed-`className` list doesn't explicitly cover intrinsic width for this case. Not resolved as compliant or non-compliant — disclosed as open.

## 11. Cross-component token borrowing

None found.

## 12. Functional/browser verification performed

Live, in a real browser, against a dev server serving the isolated harness. Verified: search filtering, all three filters (apply + clear), sort (Users column, ascending), individual + select-all selection, bulk-action-bar appear/disappear on selection, row action menu (Edit/Duplicate/Archive via `SplitButton`), pagination (page nav + page-size change), empty state (reach + recover), zero console errors/warnings, zero missing-icon warnings. All passed. **Reported to the user separately, after the original test run, as visually successful** when the dev server was started on request and shown in a browser pane — that follow-up viewing did not re-run the full interaction checklist, only confirmed the screen renders.

## 13. Visual-review findings

Functionally clean pass. Keyboard testing of `FilterChip`'s `Enter` activation was attempted; when it appeared not to work, the test isolated the cause by creating a bare native `<button onclick>` with no framework code and dispatching the identical key — the native button's `onclick` also never fired, and the raw event showed `key:"Enter", code:""` — and explicitly reported this as **unresolved rather than confidently cleared or confidently broken**, since a second automation-tool cross-check wasn't completed in the time available.

## 14. Repository ambiguity or defect discovered

- No dedicated bulk-action-bar container/pattern component exists in the repository (`button.doc.ts` itself documents the `bulkAction` variant as carrying no selection/visibility behavior of its own).
- `component-dropdown-menu`'s `Implemented-unmapped` status was, in practice, already relied upon internally by an Approved component (`SplitButton`) — the same class of tension Test #3 first surfaced with `DashboardWidgetChartTypeSwitcher`/`ViewSwitcher`.
- `SearchBar`'s `className` forwarding behavior and whether a fixed-width usage is placement-safe or a visual-recipe risk.
- The `FilterChip` `Enter`-key behavior, left genuinely unresolved.

## 15. Classification

- Bulk-action-bar gap → **known capability gap**, deferred; compensated correctly with a layout-only wrapper around the Approved `Button` bulkAction variant, not a new component.
- `DropdownMenu` scoped-reliance tension → **documentation ambiguity** (real, since partially fixed).
- `SearchBar` width convention → **documentation ambiguity**, still open, not yet addressed by any PR.
- `FilterChip` `Enter` behavior → **unresolved** — most likely a **browser-automation artifact** (matches the exact failure signature — empty `key`/`code` — independently identified as a tool defect in Test #2's diagnostic), but the test itself declined to assert this conclusively without a second cross-check, and this record does not overturn that caution.

## 16. Repository change triggered

[PR #15](https://github.com/gs-zkhan/PX_RepoForClaude/pull/15) — added `component-dropdown-menu` to the `dependencies` array of `component-button-split-variant` (among the two other entries named in Test #3), formalizing the scoped-composition relationship this test surfaced independently. The `SearchBar` width-convention question and the bulk-action-bar capability gap were **not** addressed by PR #15 and remain open.

## 17. Final disposition

**PASS**, with two items honestly left open rather than resolved either way: the `SearchBar` `className` compliance question, and the `FilterChip` keyboard-activation question. Neither rises to an automatic-FAIL condition (no native control was substituted, no disallowed component was used directly, no invalid API, no invented capability).

## 18. Human intervention count

- **Generation corrections before first render:** 1 explicitly recoverable — one unused `eslint-disable` directive was found and removed during the test's own validation pass.
- **Design-owner visual corrections:** not applicable.
- **Repository ambiguities encountered during generation:** 1 explicitly disclosed during generation — the tension between `component-dropdown-menu`'s disallowed status and `SplitButton`'s own documented requirement to supply `DropdownMenuItem` content, reasoned through and disclosed before proceeding, rather than either blocking or silently working around it.
- **Figma consultations:** 0.
- **New components invented:** 0.
