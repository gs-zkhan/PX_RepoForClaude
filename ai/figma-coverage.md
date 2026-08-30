# Figma → Repository Coverage Registry

Human-readable summary of [`figma-coverage.json`](./figma-coverage.json), cross-checked against [`figma-page-inventory.json`](./figma-page-inventory.json) — the checked-in, deterministic record of the complete 87-page Figma inventory (75 content pages + 12 category-divider separator pages), all MCP-verified. Validated by `scripts/validate-figma-coverage.mjs`:

```bash
node scripts/validate-figma-coverage.mjs
node --test "tests/figma-coverage/*.test.mjs"
```

Figma source: **file key `U3D8WMBVFl9LvAZyLHhm24`, "Prism V1 - ShadCN"**.

**Total entries: 99**

**Revision note (2026-08-28, full-inventory reconciliation):** this revision replaces the prior partial page baseline (23 pages) with the complete 75-page content inventory supplied by the user, MCP-verifies every one of the 75 nodes, links every registry entry to its owning page, resolves the majority of the previously-flagged "page-level citation missing" gap, and corrects one page mislabel discovered in the process (`1273:12` was recorded as "Date Filter page" — it is actually "Date · Time Picker", hosting Date Picker and Date Filter as sibling columns). See "What changed in this pass" below.

**Revision note (2026-08-29, separator-page correction):** the inventory previously recorded only 1 category-divider page (`20:2`) via an ad hoc, single-case exclusion. The Figma file actually contains 12 such divider pages, one per category section. All 12 were MCP-verified live (each a 0×0, zero-child `<canvas>` node) and added to `ai/figma-page-inventory.json` with an explicit `"kind": "separator"` field, replacing the old `exclusionReason` heuristic with a deterministic rule: a page is a separator only if its inventory entry declares `kind: "separator"` and its name matches the controlled convention `^──.*──+$` — never by inference from position or by resemblance. The validator now enforces: (a) content + separator page counts match `expectedContentPageCount`/`expectedSeparatorPageCount`/`expectedTotalPageCount` (75 + 12 = 87); (b) no duplicate node IDs across all 87 pages; (c) separator pages can never be cited as an owning page by any registry entry; (d) every non-separator page must have valid `kind: "content"` and an owning registry entry. No registry coverage decisions (statuses, categories, mappings) were changed in this pass.

**Revision note (2026-08-29, Analytics Secondary Navigation implemented):** `shell-analytics-secondary-nav` moves from `Missing` to `Mapped-review-pending` — implemented as the `PxAnalyticsSecondaryNav` pattern (`category` corrected from `Shell` to `Pattern`; the `id` string is kept as-is for stability). Total entry count is unchanged at 99. See `src/patterns/px-analytics-secondary-nav/README.md` for the full anatomy, API, and 6 documented known deviations from Figma's AI-instructions prose. Still **not** design-owner approved — visual review pending.

**Revision note (2026-08-29, Analytics Secondary Navigation approved):** `shell-analytics-secondary-nav` moves from `Mapped-review-pending` to `Approved` (`fidelityReview: Complete`, `visualReview: Approved`, `designOwnerApproval: { approved: true, date: "2026-08-29" }`). The design owner visually verified the expanded navigation, the selected-row tint, the collapsed variant, the collapse/expand control, and the collapsed-rail hover/focus flyout (including item selection from it). Total entry count is unchanged at 99; counts-by-status below updated (`Approved` 6→7, `Mapped-review-pending` 62→61). This approval covers `PxAnalyticsSecondaryNav` only — it does not change the status of `component-dropdown-menu`, `component-accordion`, or any other shared component this pattern composes.

**Revision note (2026-08-29, Link / Divider / Button Bulk Action / Button Split implemented):** four entries move from `Missing` to `Mapped-review-pending` — `component-link` (new `Link` component, `src/components/ui/link.tsx`), `component-divider` (new `Divider` component, `src/components/ui/divider.tsx`), `component-button-bulk-variant` (`variant="bulkAction"` added to the existing `Button`, purely additive), and `component-button-split-variant` (new `SplitButton` component, `src/components/ui/split-button.tsx`, composing `Button` + the existing `DropdownMenu` rather than a Button variant — see that entry's notes for why). `component-button`'s own `knownDeviations` updated to point at the now-implemented Bulk/Split entries instead of describing them as unimplemented. None of the four are design-owner approved — all `Mapped-review-pending`, `visualReview: Pending`. Total entry count unchanged at 99; counts-by-status below updated (`Mapped-review-pending` 61→65, `Missing` 10→6).

**Revision note (2026-08-29, Link / Divider / Button Bulk Action / Button Split approved):** the same four entries — `component-link`, `component-divider`, `component-button-bulk-variant`, `component-button-split-variant` — move from `Mapped-review-pending` to `Approved` (`fidelityReview: Complete`, `visualReview: Approved`, `designOwnerApproval: { approved: true, date: "2026-08-29" }`), after design-owner visual verification of this 4-item review batch. Total entry count unchanged at 99; counts-by-status below updated (`Approved` 7→11, `Mapped-review-pending` 65→61). These approvals are scoped to these four entries only — they do not change the status of `component-button` itself (still `Mapped-review-pending`, since Destructive-Split and the Figma-marked-PLANNED keyboard/focus-ring behaviour remain unreviewed), `component-dropdown-menu`, or any other shared component these items compose.

**Revision note (2026-08-29, Page Layout registry correction — independent of Card work):** `component-page-layout` moves from `Missing` to `Mapped-review-pending`. Independently re-verified live via `get_metadata` against page `3187:6` and AI Instructions `4214:26368` in a fresh session: all 4 documented arrangements (Default, With Third Pane, Full Width, Collapsed Nav) are functionally achievable via the existing `PxMainContainer` + `PxShellRail` + `PxHeader` + `ThirdPane` composed primitives — not a build gap. `fidelityReview`/`visualReview` remain `Pending` (this is a functional-coverage correction, not a design-owner approval) — `designOwnerApproval.approved` stays `false`. Three non-blocking, pre-existing geometry/role deviations recorded (rail collapsed width 48px vs. Figma's 64px; Third Pane width/role following its own dedicated component page rather than Page Layout's generic prose) — see the entry's `knownDeviations`. This correction is logically separate from, and precedes, any Card-component work in this branch. Total entry count unchanged at 99; counts-by-status below updated (`Mapped-review-pending` 61→62, `Missing` 6→5).

**Revision note (2026-08-29, Card and Dashboard Widget Card implemented):** two entries move from `Missing` to `Mapped-review-pending` — `component-card` (new `Card` component, `src/components/ui/card.tsx`; confirmed distinct from `CanvasCard`, `SummaryStat`, and `ConfigRow`) and `component-dashboard-widget-card` (new `DashboardWidgetCard` component, `src/components/ui/dashboard-widget-card.tsx`; confirmed distinct from `SummaryStat` and `CanvasCard`, and decoupled from any specific chart library via a `children` slot). Neither is design-owner approved — both `Mapped-review-pending`, `visualReview: Pending`. Two flagged, evidence-backed ambiguities recorded for design-owner input: Card's Figma page (`7611:395`) carries no AI Instructions/Dos-Don'ts frames in the approved file (anatomy derived from the 8 symbols' own screenshot-verified layout instead); Dashboard Widget Card's chart-type switcher reuses the existing, approved `ViewSwitcher` (`role="tablist"`) though Figma specifies `role="radiogroup"`. Total entry count unchanged at 99; counts-by-status below updated (`Mapped-review-pending` 62→64, `Missing` 5→3).

**Revision note (2026-08-30, Card and Dashboard Widget Card corrected — targeted fixes, no status change):** both entries remain `Mapped-review-pending`; `status`, `fidelityReview`, `visualReview`, and `designOwnerApproval` are unchanged, and neither is approved. Corrections applied: (1) re-enumerated Card's defining frame `7613:57` directly via `get_metadata` — its 8 symbols are not a full `Size × State × With Tags` product (Large never has SelectedMin/Empty; Small never has With Tags=true) — and replaced the independent `selected`/`minimized`/`empty`/`reorderable` booleans with a discriminated union on `size`, so invalid combinations no longer type-check; (2) screenshot-confirmed that Figma's "SelectedMin" symbol (`7621:3622`) renders the default 1px border, not the blue Selected border its name implies, and corrected the height/border mapping; (3) removed the invented Card `disabled` prop — no Disabled variant exists in the 8 audited symbols, and the prior implementation did not actually block keyboard activation of freeform trailing content; (4) removed the no-op `empty` boolean (previously `void empty`) — Empty is now a real, meaningful branch of the small `state` enum; (5) corrected the reorder-grip from an always-rendered decorative icon with a misleading `label="Reorder"` to a caller-supplied `reorderHandle` slot (undecorated by default, no operable-control claim); (6) resolved Dashboard Widget Card's chart-type-switcher ambiguity by treating Figma's `role="radiogroup"` requirement as authoritative rather than an open question — `ViewSwitcher` (`role="tablist"`) is no longer reused for this control; a new, isolated `DashboardWidgetChartTypeSwitcher` (`src/components/ui/dashboard-widget-chart-type-switcher.tsx`, built on `@radix-ui/react-radio-group`) was added instead, and `ViewSwitcher` itself remains unmodified and unreclassified; (7) replaced `onFilter`/`onShare` (which rendered hard-coded "Filter"/"Share" accessible labels while the docs claimed caller-supplied labels) with `filterAction`/`shareAction: { label, onClick }` objects so the API and documentation agree. Total entry count unchanged at 99; counts-by-status below unchanged (`Mapped-review-pending` 64, `Missing` 3) — this revision corrects implementation and documentation only, not registry status.

**Revision note (2026-08-30, second-pass correction — Card and Dashboard Widget Card, no status change):** both entries remain `Mapped-review-pending`, unapproved. (1) SelectedMin evidence upgraded from screenshot inference to Figma variable bindings: `get_variable_defs` on `7614:284` (Selected) returns `color/line/brand`, while `7621:3622` (SelectedMin) returns `color/line/default` — confirming SelectedMin is not a selected-state render despite its name; Card's `aria-pressed` logic was already correct, only the evidence backing it was strengthened. (2) `state="empty"` is now its own typed branch requiring `trailing` and rejecting `onSelect` at the type level — Figma has no Empty+Selected symbol among the 8 audited variants, and Empty's single-Add anatomy is not an existing selectable row. (3) A false claim that `ViewSwitcher` is "approved" (it is `Mapped-review-pending`, `visualReview: Pending`, unmodified) was found in three places (two source-file comments, one doc-page section) and corrected — the reason `DashboardWidgetChartTypeSwitcher` is isolated from ViewSwitcher was always the ARIA-role mismatch, never ViewSwitcher's review status. (4) `DashboardWidgetChartTypeSwitcher` no longer references any `--c-view-switcher-*` component token — re-checked Figma and found no dedicated chart-type-switcher instance or token set anywhere in the file (only a single static icon placeholder in the one example instance, `4445:51016`); replaced with the semantic tokens the AI Instructions' own Tokens list documents for this component (`card-widget/icon` / `card-widget/icon/hover`) plus the source-label's existing `color/action/primary/default`, removing the container pill chrome that had no Figma backing. Total entry count and counts-by-status unchanged.

**Revision note (2026-08-30, third-pass correction — Card review-prep, no status change):** `component-card` remains `Mapped-review-pending`, unapproved. (1) Renamed the public Card API value `state="selectedMin"` to `state="compact"` — no deprecated alias retained, since nothing in this branch is committed or published. Figma mapping is unchanged and documented: Figma's internal `State=SelectedMin` variant-property value on symbol `7621:3622` maps to the public `state="compact"`; `state="selected"` remains the only value that means selected. (2) The Validation Gallery and the Card doc's example previously showed only 6 of the 8 legal Figma variants — added the 2 missing Large-without-tags symbols (`7623:3921` Default, `7623:3929` Selected), so both review surfaces now show all 8/8: `7623:3891`, `7623:3906`, `7623:3921`, `7623:3929`, `7614:231`, `7614:284`, `7621:3622`, `7620:315`. Total entry count and counts-by-status unchanged.

**Revision note (2026-08-30, fourth-pass correction — Dashboard Widget Card design-owner review-prep, no status change):** `component-dashboard-widget-card` remains `Mapped-review-pending`, unapproved. (1) Title/subtitle typography and colour re-verified via `get_variable_defs` on the actual title (`4419:50529`) and subtitle (`4432:50619`) text nodes — the AI Instructions' summarized prose ("SemiBold 14px", "source-label → color/action/primary/default") does not match the real bindings (title: font.heading.small, SemiBold 16px/24, color/text/default; subtitle: font.label.small, Regular 12px/16/letter-spacing 0, color/text/subtle) — corrected to the full token sets plus a 4px (`--p-space-050`) gap. (2) Audited Share icon provenance end to end (IconButton → PrismIcon → `src/assets/icons/24/share.svg`) and found **no Share icon instance in any of the 3 defining Figma symbols** (`4432:50635`, `4432:50637`, `4445:50697` — each shows exactly 3 RHS icons: filter, PXAnalytics, more-vertical), despite the AI Instructions' prose listing "share/export icon" as a fixed action type; a `search_design_system` check returned zero approved-library hits. Kept the existing repo icon as-is but documented this as an open, unresolved evidence gap requiring explicit design-owner input — not silently resolved. (3) Chart-type icons corrected from 16px to the Figma-accurate 24px (matching sibling filter/overflow icons); no change to IconButton itself. (4) Keyboard Tab order re-verified via real Tab/Shift+Tab key presses from a neutral focus position: radiogroup → Filter → Share → Overflow confirmed correct both directions; a reported "starts at Filter" skip did not reproduce in this test and is flagged as unresolved/unreproduced rather than dismissed. Total entry count and counts-by-status unchanged.

**Revision note (2026-08-30, fifth-pass correction — Dashboard Widget Card, direct design-owner corrections, no status change):** `component-dashboard-widget-card` remains `Mapped-review-pending`, unapproved. Two corrections, both prompted by the design owner viewing the real Figma component directly (node 4432:50636): (1) **Chart-type switcher evidence overstatement, admitted and fixed** — the previously-documented two-option (line/bar) example was never actually observed in Figma. Re-inspected all 3 defining symbols' RHS icons directly via `get_metadata`: each shows exactly ONE static icon instance, `icons/24/PXAnalytics` — no second icon, no line/bar pair, no toggle. The two-option example was an assumption (extrapolated from the AI Instructions' radiogroup-accessibility requirement, plus borrowing the line/bar icon pair from this repo's own ViewSwitcher demo) that had been presented too confidently as Figma-verified. `chartTypeSwitcher` remains a generic slot; every reference to the 2-option example across the component, its doc, and the gallery now explicitly flags it as illustrative only, not Figma-verified, pending design-owner confirmation of the real option count/icons. (2) **Footer dropdown row — previously missing, now added.** Every prior example only showed plain placeholder text for `filterRow`, and it rendered directly below the header. Re-inspected the defining symbol's own footer frame (`4419:50511`, at y=220 of a 288px card — the bottom, not the top) directly via `get_metadata`: it holds exactly 3 "Dropdown" instances (2 grouped left, no icon; 1 pinned right, with a leading `icons/24/placeholder` icon — itself unfinalized in Figma). Fixed `filterRow` to render after `children` (bottom of the card) with a `justify-between` wrapper, and added real examples composing the already-approved `Select`/`SelectTrigger`/`SelectValue`/`SelectContent` in the correct 2-left/1-right layout, in both the Validation Gallery and the Design System Docs example. Total entry count and counts-by-status unchanged.

**Revision note (2026-08-30, sixth-pass correction — Dashboard Widget Card chart-type switcher, direct user correction with reference screenshots, no status change):** `component-dashboard-widget-card` remains `Mapped-review-pending`, unapproved. The fifth-pass fix for the chart-type switcher was itself still wrong: it rendered every option as an always-visible icon button in the header row. The user supplied two real screenshots showing the actual control: collapsed, it is a single trigger (the active option's icon + a small chevron, like a dropdown); expanded, it opens a small popover listing the options vertically, with the active one visually highlighted. Rebuilt `DashboardWidgetChartTypeSwitcher` as a `Popover` (existing, unmodified primitive) wrapping the same `role="radiogroup"` inside its content, so the AI Instructions' radiogroup requirement still governs the option list, just revealed behind a disclosure trigger rather than always visible. Re-verified live: the trigger is still a single Tab stop (Tab: trigger → Filter → Share → Overflow, and the reverse via Shift+Tab); clicking an option selects it, updates the trigger's icon, and closes the popover. The 4 example options (scatter/bar/line/number) match the screenshots; `icons/24/formula-number.svg` is used as the closest existing Prism asset for the "#"-style glyph shown (no dedicated hash icon exists in this repo) — flagged as an approximation, not an exact match. Total entry count and counts-by-status unchanged.

**Revision note (2026-08-30, design-owner approval — Card and Dashboard Widget Card):** the design owner completed visual review and approved both components. `component-card` moves from `Mapped-review-pending` to **`Approved`** (`fidelityReview: Complete`, `visualReview: Approved`, `designOwnerApproval: { approved: true, date: "2026-08-30" }`) — no outstanding exceptions; all 8 legal Figma variants, the `compact` rename, and the typed Empty-state restrictions were confirmed at time of approval. `component-dashboard-widget-card` moves from `Mapped-review-pending` to **`Approved-with-documented-exception`** (same fidelity/visual/date fields) — one accepted, documented exception: the 4th chart-type option uses the existing Prism `icons/24/formula-number.svg` asset as the design-owner-accepted approximation, because the repository has no dedicated matching `#`/hash asset; it is visually approved but must not be described as an exact Figma icon match. No other entry's status changed — `component-view-switcher`, `component-radio-group`, `component-canvas-card`, `component-summary-stat`, and `component-page-layout` all remain exactly as they were (`Mapped-review-pending` / `Implemented-unmapped`, per their own prior entries), confirmed unchanged. Total entry count unchanged at 99; counts-by-status updated (`Approved` 11→12, `Approved-with-documented-exception` 1→2, `Mapped-review-pending` 64→62).

---

## Precise summary language (per explicit correction request)

- **All 75 supplied content-page nodes are MCP-verified.** Every one was checked live via `get_metadata` in this session before being recorded — none were inferred from name or from a prior-session claim.
- **8 mappings remain intentionally unresolved** (status `Implemented-unmapped` — implemented in the repo, no Figma node ID captured for any of them, and none of the 75 supplied pages resolved them): Calendar, Canvas Card, Config Row, Drag Handle, Dropdown Menu, Filter Config Modal, Input, Popover.
- **62 mapped entries still require fidelity review** (status `Mapped-review-pending` — a real Figma node exists and repo implementation exists, but no recorded design-owner sign-off): see the full breakdown below.
- **3 entries are `Missing`** (Figma evidence exists, no repo implementation): RTE Field, Color Picker, Notification.
- Do not say there are no remaining unresolved mappings while any entry carries `Implemented-unmapped` or `Missing` — both are real, named, enumerated gaps, not silently dropped.

---

## What changed in this pass

- **Page-inventory baseline replaced**: 23 pages → complete 75-page content inventory (`ai/figma-page-inventory.json`, schema v2.0.0), organized into the same sections the user supplied (Foundations, Core primitives, Form and input, Feedback and status, Overlay and containment, Navigation, Data display, Selection/grouping, Patterns and shells, Explicitly out of scope, Illustrations and reference).
- **All 75 nodes MCP-verified live** via `get_metadata`, each recorded with tier `browser-verified-mcp-confirmed`.
- **~50 existing entries backfilled with page-level citations** they previously lacked (component-level node IDs existed, but no top-level page was recorded) — e.g. Text Field, Checkbox, Toggle, Accordion, Tree, Modal, Table, and many more.
- **9 entries moved out of `Implemented-unmapped`/`Unmapped`** into `Mapped-review-pending` now that a real page exists: Checkbox, Radio Group, Toggle, Search Bar, Status Label, Tooltip, Pagination, **Table**, Heatmap, World Map (10 total, see full list below).
- **1 page mislabel corrected**: node `1273:12` was recorded as "Date Filter page" — its canvas name is actually "Date · Time Picker", hosting Date Picker (DP-col) and Date Filter (DF-col) as sibling columns of one page. `component-date-picker` and `component-date-field` are now also linked to this page.
- **4 new shared-node exceptions documented**: the Chart page (`4964:6`, 8 chart components), the Date · Time Picker page (`1273:12`, 3 components), and the Filter Chip/Bar/Dropdown Panel page (`3421:5430`, 3 components) — each a legitimate one-page-hosts-several-siblings relationship, not accidental duplication.
- **9 new entries added**: 5 Foundation/token pages (Color, Typography, Spacing·Radius·Border, Elevation·Shadow, Grid·Layout) and 4 Component entries — 2 genuinely missing (Card generic-selectable, Dashboard Widget Card) and 2 previously-untracked-but-implemented components discovered via this pass's repo cross-checks (`PECDropdown` at `src/components/px-pec-dropdown.tsx`, whose own header comment already cited node `1747:29175` from a prior extraction; `PxShellRail` at `src/components/px-shell-rail.tsx`, node `3187:7`).
- **`component-table` — the highest-priority previously-unmapped gap — is now mapped** to node `20:34` ("Table"), moving from `Implemented-unmapped` to `Mapped-review-pending`.
- **Validator strengthened**: the "should not carry figmaNodes" check for `Unmapped`/`Not-applicable` entries now also checks `figmaPages` (closing a real gap this pass's own work exposed — two entries briefly held `Unmapped` + real page citations simultaneously before being corrected).

---

## Counts by status

| Status | Count |
| --- | --- |
| `Approved` | 12 |
| `Approved-with-documented-exception` | 2 |
| `Mapped-review-pending` | 62 |
| `Implemented-unmapped` | 8 |
| `Missing` | 3 |
| `Internal foundation` | 5 |
| `Legacy` | 1 |
| `Figma correction required` | 0 |
| `Out of scope` | 6 |

## Counts by category

| Category | Count |
| --- | --- |
| `Component` | 73 |
| `Shell` | 5 |
| `Pattern` | 4 |
| `Foundation/token` | 7 |
| `Illustration` | 2 |
| `Reference` | 2 |
| `Out of scope` | 6 |

---

## Already solved and approved (9)

| Entry | Approved | Notes |
| --- | --- | --- |
| `shell-px-list-shell` (PxListShell) | 2026-08-27 | Now also cites `Shell/List Page` (`3187:8`), the standalone pattern page, distinct from the assembled `Shell/ListPage` example (`7306:20074`) already on file. |
| `shell-px-create-edit-modal` | 2026-08-28 | |
| `shell-px-create-edit-accordion` | 2026-08-28 | |
| `shell-px-create-edit-wizard` | 2026-08-28 | |
| `component-textarea` (Textarea / Message Box) | 2026-08-28 | `Approved-with-documented-exception`. |
| `foundation-token-pipeline` | 2026-08-27 | |
| `foundation-color-tokens` (Color) | 2026-08-27 | New this pass — approval inherited from the existing protected-token approval record (royalBlue.700, neutral.800/900), not a new independent review of this specific page. |
| `component-card` (Card) | 2026-08-30 | All 8 legal Figma variants, the `compact` rename (mapped from Figma's `State=SelectedMin`), and the typed Empty-state restrictions were in place at approval. No exceptions. |
| `component-dashboard-widget-card` (Dashboard Widget Card) | 2026-08-30 | `Approved-with-documented-exception` — the 4th chart-type option uses `icons/24/formula-number.svg` as a design-owner-accepted approximation for a "#"/hash glyph this repo does not have; must not be described as an exact Figma icon match. |

## Implemented but needing mapping — full list (8 — `Implemented-unmapped`)

None of these were resolved by any of the 75 supplied pages. No candidate Figma page is known for any of them.

| Registry ID | Repo path | Why unresolved | Recommended next action |
| --- | --- | --- | --- |
| `component-calendar` | `src/components/ui/calendar.tsx` | Only an indirect divider-spacing token reference exists; no page identifies Calendar's own source. | Ask the user for the exact page/node. |
| `component-canvas-card` | `src/components/ui/canvas-card.tsx` | Anatomy verified by inspection, no captured node; confirmed distinct from the new `component-card` (generic selectable card). | Ask the user for the exact page/node. |
| `component-config-row` | `src/components/ui/config-row.tsx` | No node ID ever captured. | Ask the user for the exact page/node. |
| `component-drag-handle` | `src/components/ui/drag-handle.tsx` | No node ID ever captured. | Ask the user for the exact page/node. |
| `component-dropdown-menu` | `src/components/ui/dropdown-menu.tsx` | `EXTRACTION_REPORT.md` records `UNRESOLVED`/`null`; none of the 75 supplied pages named "Dropdown Menu". | Ask the user for the exact page/node. |
| `component-filter-config-modal` | `src/components/ui/filter-config-modal.tsx` | Named descriptively; explicitly distinct from Filter Dropdown Panel (now mapped via the shared Filter page). | Ask the user for the exact page/node. |
| `component-input` | `src/components/ui/input.tsx` | Internal composition primitive; likely never an independent Figma page. | Confirm with the user whether Figma models this as a standalone page before searching further. |
| `component-popover` | `src/components/ui/popover.tsx` | No node ID ever captured; none of the 75 supplied pages named "Popover". | Ask the user for the exact page/node. |

## Mapped but pending fidelity/design review — full list (60 — `Mapped-review-pending`)

A real Figma node/page mapping is established for every entry below; fidelity review and design-owner sign-off remain outstanding — not the mapping itself.

**Component (54):** Accordion, Avatar, Banner, Bar Chart, Breadcrumb, Button, Checkbox, Chip, Column Selector, Date Field, Date Filter, Date Picker, Donut Chart, Dropdown Field, Empty State, File Uploader, Filter Bar, Filter Chip, Filter Dropdown Panel, Gauge Chart, Heatmap, Input Number, Letter, Line Chart, Metric Bar, Modal, Pagination, Progress Bar, Radio Group, Search Bar, Segmented Bar, Select, Skeleton, Slider, Spinner, StatusLabel, StatusSelect, SummaryStat, Table Customization Menu, **Table**, Tabs, TextField, ThirdPane, Toast, Toggle, Tooltip, Tree, View Selector, View Switcher, Views, Wizard, World Map, PECDropdown, PxShellRail.

**Pattern (1):** **PxAnalyticsSecondaryNav** — new this pass (see below).

**Foundation/token (5):** Prism Icon set, Typography, Spacing · Radius · Border, Elevation · Shadow, Grid · Layout.

**Illustration (2):** Illustrations, Shell/Illustrations.

Newly moved into this bucket this pass (previously `Unmapped`/`Implemented-unmapped`): Checkbox, Radio Group, Toggle, Search Bar, Status Label, Tooltip, Pagination, **Table**, Heatmap, World Map. Newly moved this pass (previously `Missing`): **PxAnalyticsSecondaryNav** (`shell-analytics-secondary-nav`, category corrected `Shell` → `Pattern`) — implemented under `src/patterns/px-analytics-secondary-nav/`, composed entirely from the existing `Accordion`/`Tree` components; see its README for 6 documented known deviations from Figma's AI-instructions prose. Still not design-owner approved.

## Missing components and patterns (10)

| Entry | Figma evidence | Notes |
| --- | --- | --- |
| Link | `20:15`, verified | Unchanged from prior pass. |
| Divider | `20:18`, verified | Unchanged. |
| RTE Field | `1273:14`, verified | Unchanged. |
| Color Picker | `1273:11`, verified | Unchanged. |
| Notification | `1273:7`, verified | Unchanged; Figma's own AI Instructions still note "Out of scope for current release" as a nuance, not a reclassification. |
| Button — Bulk action variant | `20:10` (shared) | Unchanged. |
| Button — Split variant | `20:10` (shared) | Unchanged. |
| Page Layout (generic) | `3187:6`, verified | Unchanged — functionally covered by PxMainContainer/PxListShell under different naming. |
| **Card** (generic selectable) | `7611:395`, verified — new this pass | 8 variants (Size × State × With Tags). Confirmed distinct from `CanvasCard`. |
| **Dashboard Widget Card** | `20:27`, verified — new this pass | Analytics dashboard tile header (title + source label + chart-switcher + filter/share/overflow). No repo implementation under any name. |

## Explicit out-of-scope pages (6) — unchanged

Detail · Drilldown Page (`3187:11`), Loading · Skeleton States (`3187:13`), Administration Page (`20:40`), AI Insight Surface (`3187:14`), AI Prompt & Input (`3187:15`), Motion Tokens (`4279:2`) — all literally named "(Out of scope)"/"(Out of Scope)" in Figma, all present in the 75-page inventory under the "Explicitly out of scope" section.

## Figma corrections required (4) — unchanged

`fc-1`, `fc-2`, `fc-3`, `fc-4` — see prior revisions; all still open, all still Figma-side, none requiring repo action.

## Repository-only debt — unchanged from prior revisions

`audience-explorer.tsx` vs `user-explorer.tsx`; stale `px-list-shell` README; missing Chip/TableCustomizationMenu doc entries; stale `EXTRACTION_REPORT.md`; uniform `stable` docs-status distribution.

## Legacy items (1)

`page-audience-explorer-legacy`.

---

## Completeness check

### Total Figma pages: 87 (75 content + 12 separator — expected 75 + 12, reconciled)

### Separator pages excluded (12) and the deterministic separator rule

All 12 category-divider pages were MCP-verified live via `get_metadata`: each is a `<canvas>` node with 0×0 size and zero children, and each name matches the controlled separator naming convention (`^──.*──+$`).

| Node | Name |
| --- | --- |
| `20:2` | "── Foundations ──────────────────────" |
| `1278:6` | "── Core Primitives ──────────────────" |
| `1278:7` | "── Form & Input ─────────────────────" |
| `1278:8` | "── Feedback & Status ────────────────" |
| `1278:9` | "── Overlay & Containment ────────────" |
| `1278:10` | "── Navigation ───────────────────────" |
| `1278:11` | "── Data Display ─────────────────────" |
| `1278:12` | "── Selection & Grouping ─────────────" |
| `1278:13` | "── Patterns & Shells ─────────────────" |
| `4214:39586` | "── Out of scope ─────────────" |
| `1278:14` | "── Illustration & Brand ─────────────" |
| `20:42` | "── Reference ───────────────────────" |

**Deterministic separator rule** (replaces the prior single-case heuristic): a page is a separator if and only if (a) its inventory entry carries `"kind": "separator"`, and (b) its name matches the controlled naming convention above. Separator pages are recorded explicitly in the inventory, never require an owning registry entry, and — as of this pass — are structurally forbidden from ever being cited as an owning page by any registry entry (validator error if violated). This rule is narrow by design: it never excludes any of the 6 pages in the "Explicitly out of scope" section, which have real (if empty) canvases with Figma-authored "(Out of scope)" names — those remain `kind: "content"` pages, each with its own registry row and status `Out of scope`. Content and out-of-scope pages are never excluded merely because they sit next to a separator in Figma's page list.

No other page among the 75 content pages matched the separator rule.

### Content pages represented: 75 / 75

Every one of the 75 supplied pages is cited by at least one registry entry's `figmaPages` array — verified deterministically by the validator's page-inventory completeness check (0 failures). Where one Figma page legitimately hosts multiple repo components (Chart page → 8 chart components; Date · Time Picker → 3 date components; Filter Chip/Bar/Dropdown Panel → 3 filter components; Modal → Modal/Footer/Backdrop; Shell/MainContainer, Shell/Create · Edit Form → the shells), that sharing is declared in `sharedNodeIds` with a `primaryOwner` and reason — not left implicit.

### Content pages explicitly out of scope: 6 (see above)

### Content pages still unresolved: 0

All 75 supplied pages resolved to an owning entry. The 8 remaining `Implemented-unmapped` components and 2 of the 11 `Missing` items (`Card`, `Dashboard Widget Card` are now resolved — the *other* 9 `Missing` items are resolved-with-evidence-but-no-repo-code, not unresolved-evidence) have **no page among the 75 supplied** — their gap is "no candidate page was supplied," not "a supplied page failed to resolve."

### Registry entries with exact page ownership: 91 / 99

The 8 `Implemented-unmapped` entries are the only ones with zero `figmaPages`. Every other entry (91) — including all `Missing`, `Out of scope`, `Internal foundation`, `Reference`, and `Illustration` entries — carries at least one verified page citation.

### Registry entries still Implemented-unmapped (8, named)

Calendar, Canvas Card, Config Row, Drag Handle, Dropdown Menu, Filter Config Modal, Input, Popover — see the full table above for repo path, reason, and next action per entry.

### Intentional shared-page mappings (11, up from 8)

`3792:8575` (2), `3187:10` (4), `20:10` (3), `7403:2913` (2), `7128:873`/`7128:914` (3 each), `3796:2504` (2), `3791:1498`/`3791:1499` (Modal-family), **`4964:6` (8 — Chart family, new)**, **`1273:12` (3 — Date family, new)**, **`3421:5430` (3 — Filter family, new)**. Every one names a `primaryOwner` and a validator-checked exact owner set.

### Reference-only pages (2) — unchanged

`1552:3384` (Template), `7403:2913` (_Icons Source).

---

## Recommended implementation order for the next batch

1. Build the 2 remaining missing components (**Card**, **Dashboard Widget Card**) — both now have full Figma evidence and no blockers. **Analytics Secondary Navigation is done** (see the Pattern entry above) — get design-owner visual review on it next, not implementation.
2. Close fidelity-review debt on **Table** (`20:34`) first — it is the single highest-leverage newly-mapped component given how many screens depend on it, followed by Modal, Accordion, Button, and now **PxAnalyticsSecondaryNav**.
3. Ask the user for exact pages for the 8 remaining `Implemented-unmapped` components — none were resolved by this pass's 75-page inventory, so they are genuinely outside its scope, not overlooked.
4. Reconcile `audience-explorer.tsx` vs `user-explorer.tsx` — repository-only debt, unblocked by nothing Figma-side.
5. Decide on Bulk/Split button variants, Color Picker, Notification, RTE Field, Link, Divider — all fully evidenced, implementation is the only remaining step.
6. Address the 4 documented Figma corrections upstream with the design owner.
