# Test #6 — Segment Detail, independent rerun after `PxDetailDrilldownShell` (after-state)

**This is the after-state.** Test #5 (see [`test-05-segment-detail.md`](./test-05-segment-detail.md)) found no sanctioned shell for this exact archetype and had to fall back on `PxListShell` as an unconfirmed judgment call. This test reruns the same archetype — a fresh, blind agent, no memory of Test #5 or its findings — after the repository hardening triggered by that test ([PR #18](https://github.com/gs-zkhan/PX_RepoForClaude/pull/18), [PR #19](https://github.com/gs-zkhan/PX_RepoForClaude/pull/19)) had landed. See the [Before/after comparison](./README.md#before-after-test-5--test-6) in this directory's README.

## 1. Test objective

Verify, with a fresh/blind agent and no Figma, whether the newly-added `PxDetailDrilldownShell` is independently discoverable and correctly selected for a single-record detail/summary page purely from `ai/shell-registry.md`/`CLAUDE.md` anatomy guidance — with no hint, naming, or coaching toward that shell.

## 2. Starting commit

`8f70900a73f4a90ecc90e70286c8399a86a56915` — "Merge pull request #19 from gs-zkhan/feature/px-detail-drilldown-shell" (`origin/main` at the time, i.e. immediately after `PxDetailDrilldownShell` was merged and design-owner Approved). Worktree: `PX_RepoForClaude-cold-test-segment-detail-rerun`, branch `test/cold-generation-segment-detail-rerun`.

## 3. No-Figma / fresh-blind-agent condition

Confirmed on both counts — the generated code's own rationale comment references only `ai/shell-registry.md`'s Approved status for `PxDetailDrilldownShell`, with no Figma node references, and describes the shell selection as traced from registry anatomy guidance rather than assumed or named in the prompt.

## 4. Shell independently selected: `PxDetailDrilldownShell`

### Why anatomy-based registry guidance led to that choice

By this point `ai/shell-registry.md` carried a fourth row describing `PxDetailDrilldownShell`'s anatomy in registry language matching this screen exactly: "Generic single-record detail/drilldown page — Primary Bar inherited unchanged from the parent page; a drilldown-owned Secondary Bar (back arrow + record title in the left zone, optional tabs in the centre zone, optional drilldown-owned utilities/actions in the right zone); a flexible, scrollable, product-owned content region." A single saved Segment's read/detail view (name, status, description, actions, stats, criteria, activity) matches this anatomy directly, with no ambiguity or fallback reasoning required — unlike Test #5, where no row matched and a judgment call was necessary.

## 5. Components/patterns used, with registry status at time of test

| Component | Status at time of test |
|---|---|
| `PxDetailDrilldownShell` | Approved (design owner, 2026-09-07) |
| `Avatar` / `AvatarFallback` | Approved |
| `StatusLabel` | Approved |
| `SummaryStat` / `StatsRow` | Mapped-review-pending |
| `Chip` | Approved |
| `Divider` | Approved |
| `Card` | Mapped-review-pending |
| `EmptyState` | Approved |
| `Toggle` | Approved |
| `DropdownField` | Mapped-review-pending |
| `SelectItem` | Approved |
| `DateFilter` | Mapped-review-pending |
| `SplitButton` | Approved |
| `DropdownMenuItem` (via `SplitButton.menuContent`) | Implemented-unmapped, used only through `SplitButton`'s own documented composition path |
| `PrismIcon` | Approved |

No native interactive controls were substituted for an available shared component; no raw hex/manual visual values were found in place of a token; every provisional (`Mapped-review-pending`) component's use is disclosed in this table rather than silently treated as Approved.

## 6. Composition audit

No duplicate component implementation was created. `DropdownMenuItem` was used only inside `SplitButton`'s `menuContent` slot — the same scoped-composition pattern as Test #5, by this point formalized as `decision-dropdown-menu-scoped-composition`. No `className` visual overrides were found on approved components; layout classes were confined to plain wrapper `div`/`section` elements and one local, non-visual-override helper (`CriterionRow`, a layout-only label+content row, not a duplicate of any approved component).

## 7. Live functional verification

Rendered live via an isolated Vite entry (`src/cold-tests/segment-detail-rerun/`, never wired into `src/App.tsx`). Interactions exercised: `onBack`, primary "Edit segment" secondary action, `secondaryUtilities` (Duplicate/Share/Delete), `DateFilter` range selection, `DropdownField` grouping control, `SplitButton` default action ("Export CSV") + menu items (Export as CSV/PDF), and the `Toggle`-driven empty-state swap (activity cards ↔ `EmptyState`) — all confirmed functional.

## 8. No Figma consultation

Confirmed — no Figma MCP tool calls or node references appear anywhere in the generated code, its rationale comment, or its composition.

## 9. No evaluator coaching

Confirmed by construction — the fresh/blind-agent methodology (per `ai/cold-generation/README.md`'s benchmark methodology, item 4) required the requirement to be stated by anatomy/behavior only, never by naming `PxDetailDrilldownShell` or any other shell/component. The shell name does not appear in the reconstructed prompt framing; it appears only as the agent's own registry-traced conclusion in the generated code's rationale comment.

## 10. No new repo gap

No new repository ambiguity, defect, or missing capability was surfaced by this test. Every component and shell used was already registered with a known status, and the shell selection matched documented anatomy guidance with no fallback reasoning required.

## 11. Final disposition: **PASS**

Per the benchmark rubric: correct shell selection traceable to `ai/shell-registry.md` anatomy guidance, correct component reuse with registry status disclosed by direct lookup, zero native duplicate controls, zero raw hex/manual visual values, zero cross-component token borrowing, live functional verification passed for every stated interaction, no undocumented design-system assumption was required, and no unresolved judgment call was silently resolved either way (none arose).

## 12. Human-intervention count

Not confidently recoverable — no session transcript or correction log was preserved alongside the generated code. No repository change resulted from this test (unlike Test #5), which is itself evidence no repository-side correction was needed.

## 13. Preserved evidence

| Worktree | Branch | Base commit |
|---|---|---|
| `PX_RepoForClaude-cold-test-segment-detail-rerun` | `test/cold-generation-segment-detail-rerun` | `8f70900a73f4a90ecc90e70286c8399a86a56915` |

Generated files (uncommitted, preserved only in the worktree above, not copied into this record):
- `src/cold-tests/segment-detail-rerun/SegmentDetailScreen.tsx`
- `src/cold-tests/segment-detail-rerun/index.html`
- `src/cold-tests/segment-detail-rerun/mount.tsx`

Note: this worktree also carries an unrelated, preserved local modification to `.claude/launch.json` — not part of this test's evidence and left untouched.
