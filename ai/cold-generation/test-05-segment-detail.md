# Test #5 — Segment Detail (single-record detail/drilldown, before-state)

**This is the before-state.** At the time of this test, no sanctioned shell existed for a single-record detail/summary page. The judgment call this test was forced to make, and the genuine gap it exposed, are what triggered the repository hardening recorded in [PR #18](https://github.com/gs-zkhan/PX_RepoForClaude/pull/18) and [PR #19](https://github.com/gs-zkhan/PX_RepoForClaude/pull/19) — see [`test-06-segment-detail-rerun.md`](./test-06-segment-detail-rerun.md) for the after-state and the [Before/after comparison](./README.md#before-after-test-5--test-6) in this directory's README.

## 1. Test objective

Evaluate whether the repository's own documentation (no Figma) is sufficient for a fresh AI session to generate a correct **single-record detail/summary page** — a fourth architectural archetype distinct from the three already tested (Create/Edit, Analytics, List/Table).

## 2. Starting commit

`9b434785716b7291e5c04967618e356b6931b466` — "Merge pull request #15 from gs-zkhan/docs/ai-readiness-registry-coherence" (`origin/main` at the time). Worktree: `PX_RepoForClaude-cold-test-segment-detail`, branch `test/cold-generation-segment-detail`.

## 3. Prompt

**Reconstructed, not verbatim.** The exact original prompt text is not recoverable from preserved evidence (no prompt transcript was checked in). Based on the generated screen's own anatomy and its in-code rationale comment, the requirement was described by anatomy/behavior — a single saved Segment's detail view (name, status, description, primary + contextual actions, summary stats, criteria, recent activity with filter/empty-state) — not by naming a shell or component.

## 4. No-Figma condition

Confirmed — the generated code's own rationale comment discusses only `ai/shell-registry.md` and `ai/figma-coverage.json`, with no Figma node references.

## 5. Shell selected: `PxListShell`

`PxListShell` was used, composing its Secondary Bar (`onBack`, `title`, `titleChip`, `secondaryActions`) as the record header, with generic page content in `children`.

### Why this was an unconfirmed judgment call

At the time, none of the three existing shell-registry rows (`PxListShell`, `PxCreateEditShell`, `PxAnalyticsSecondaryNav`) matched this anatomy: not a tabular list, not a create/edit form, not an Analytics dashboard. `PxMainContainer` could not be composed directly on a screen's own authority (per `decision-px-main-container-internal`) — only its registered consumers could. Of the three, `PxListShell` was judged the closest anatomical fit because its Secondary Bar API happened to supply the needed "record header" shape (title + status chip + primary action) and its `children` slot imposed no structural requirement to be a table — but the shell's own documented purpose restricts it to list-type anatomy **by convention**, not by any structural enforcement in the component itself. This mismatch between documented purpose and actual anatomy is exactly what made the choice a judgment call rather than a registry-confirmed answer, and the test explicitly flagged it as a genuine registry gap rather than silently resolving it.

## 6. Components/patterns used, with registry status at time of test

| Component | Status at time of test |
|---|---|
| `PxListShell` | Approved |
| `StatusLabel` | Approved |
| `SummaryStat` / `StatsRow` | Mapped-review-pending |
| `Chip` | Approved |
| `SplitButton` | Approved |
| `DropdownMenuItem` (via `SplitButton.menuContent`) | Implemented-unmapped, used only through `SplitButton`'s own documented composition path |
| `PrismIcon` | Approved |
| `DropdownField` | Mapped-review-pending |
| `SelectItem` | Approved |
| `DateFilter` | Mapped-review-pending |
| `Toggle` | Approved |
| `EmptyState` | Approved |
| `Table` family | Approved |

No native interactive controls were substituted for an available shared component; no raw hex/manual visual values were found in place of a token.

## 7. Composition audit

No duplicate component implementation was created. `DropdownMenuItem` was used only inside `SplitButton`'s `menuContent` slot, consistent with the established scoped-composition rule for `Implemented-unmapped` primitives consumed through an approved surface's own documented API (this precedent was later formalized as `decision-dropdown-menu-scoped-composition` in PR #15/#17 work). No `className` visual overrides were found on approved components in this screen — layout classes were confined to plain wrapper `div`/`section` elements, not applied to component instances themselves.

## 8. Browser verification

Rendered live via an isolated Vite entry (`src/cold-tests/segment-detail/`, never wired into `src/App.tsx`). Interactions exercised: back navigation, primary "Edit segment" action, `SplitButton` default action + menu items (Archive/Export/Delete), `DropdownField` event-type filter, `DateFilter` range, and the `Toggle`-driven empty-state swap (Table ↔ `EmptyState`) — all confirmed functional, logged to a local action log rendered on-screen (this harness has no backend).

## 9. Genuine findings

1. **Missing sanctioned Detail/Drilldown archetype.** No shell in `ai/shell-registry.md` covered a single-record detail/summary page; `PxListShell` had to be used as an unconfirmed judgment call, explicitly disclosed rather than silently resolved.
2. **`DropdownMenuItem` icon-source defect.** `DropdownMenuItem` hardcoded `<PrismIcon name={icon} size={16} />` with no `sourceSize`, so any icon lacking a dedicated 16px export (e.g. `export-document`) would silently fail to render. This was not limited to this test's generated code — `src/pages/user-explorer.tsx`, an already-shipped production page, exercised the same defect with `icon="email"`/`icon="export-document"`/`icon="id-card"`.

## 10. Resulting hardening

- **[PR #18](https://github.com/gs-zkhan/PX_RepoForClaude/pull/18)** — fixed the `DropdownMenuItem` icon defect (`sourceSize={24}`, matching the repository's ~20+ existing call sites for this same pattern) with a regression test (`tests/dropdown-menu/dropdown-menu.test.mjs`), and separately documented the shell gap as `decision-single-record-detail-page-gap` in `ai/figma-coverage.json` — explicitly **not** picking a shell, since that required a design-owner decision.
- **Figma Detail/Drilldown work** — a subsequent shell-completeness audit found that Figma's "Detail · Drilldown Page" (node `3187:11`), previously an empty, `Out of scope` canvas, now contained real design evidence. The design owner approved bringing this archetype into scope.
- **[PR #19](https://github.com/gs-zkhan/PX_RepoForClaude/pull/19)** — implemented `PxDetailDrilldownShell` as a thin composition of the existing `PxMainContainer` + `PxHeader` Secondary Bar capabilities, registered in `ai/shell-registry.md` and design-owner Approved (2026-09-07).

## 11. Final disposition: **PARTIAL**

The screen was functionally correct and passed live verification, but the test exposed two genuine repository gaps (one real component defect, one missing archetype) that prevented a clean, registry-confirmed first-pass result — per the benchmark rubric, this is the defining characteristic of `PARTIAL`, not `PASS` or `FAIL`.

## 12. Human-intervention count

Not confidently recoverable — no session transcript or correction log was preserved alongside the generated code. The generated screen's own rationale comment indicates the shell choice was disclosed as uncertain at generation time, but the exact number of self-corrections, if any, before first render is unknown.

## 13. Preserved evidence

| Worktree | Branch | Base commit |
|---|---|---|
| `PX_RepoForClaude-cold-test-segment-detail` | `test/cold-generation-segment-detail` | `9b434785716b7291e5c04967618e356b6931b466` |

Generated files (uncommitted, preserved only in the worktree above, not copied into this record):
- `src/cold-tests/segment-detail/SegmentDetailPage.tsx`
- `src/cold-tests/segment-detail/index.html`
- `src/cold-tests/segment-detail/main.tsx`
