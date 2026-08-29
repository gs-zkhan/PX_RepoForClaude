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

---

## Precise summary language (per explicit correction request)

- **All 75 supplied content-page nodes are MCP-verified.** Every one was checked live via `get_metadata` in this session before being recorded — none were inferred from name or from a prior-session claim.
- **8 mappings remain intentionally unresolved** (status `Implemented-unmapped` — implemented in the repo, no Figma node ID captured for any of them, and none of the 75 supplied pages resolved them): Calendar, Canvas Card, Config Row, Drag Handle, Dropdown Menu, Filter Config Modal, Input, Popover.
- **61 mapped entries still require fidelity review** (status `Mapped-review-pending` — a real Figma node exists and repo implementation exists, but no recorded design-owner sign-off): see the full breakdown below.
- **11 entries are `Missing`** (Figma evidence exists, no repo implementation): Link, Divider, RTE Field, Color Picker, Notification, Button — Bulk variant, Button — Split variant, Page Layout, Analytics Secondary Navigation, Card (generic selectable), Dashboard Widget Card.
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
| `Approved` | 6 |
| `Approved-with-documented-exception` | 1 |
| `Mapped-review-pending` | 61 |
| `Implemented-unmapped` | 8 |
| `Missing` | 11 |
| `Internal foundation` | 5 |
| `Legacy` | 1 |
| `Figma correction required` | 0 |
| `Out of scope` | 6 |

## Counts by category

| Category | Count |
| --- | --- |
| `Component` | 73 |
| `Shell` | 6 |
| `Pattern` | 3 |
| `Foundation/token` | 7 |
| `Illustration` | 2 |
| `Reference` | 2 |
| `Out of scope` | 6 |

---

## Already solved and approved (7)

| Entry | Approved | Notes |
| --- | --- | --- |
| `shell-px-list-shell` (PxListShell) | 2026-08-27 | Now also cites `Shell/List Page` (`3187:8`), the standalone pattern page, distinct from the assembled `Shell/ListPage` example (`7306:20074`) already on file. |
| `shell-px-create-edit-modal` | 2026-08-28 | |
| `shell-px-create-edit-accordion` | 2026-08-28 | |
| `shell-px-create-edit-wizard` | 2026-08-28 | |
| `component-textarea` (Textarea / Message Box) | 2026-08-28 | `Approved-with-documented-exception`. |
| `foundation-token-pipeline` | 2026-08-27 | |
| `foundation-color-tokens` (Color) | 2026-08-27 | New this pass — approval inherited from the existing protected-token approval record (royalBlue.700, neutral.800/900), not a new independent review of this specific page. |

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

## Mapped but pending fidelity/design review — full list (61 — `Mapped-review-pending`)

A real Figma node/page mapping is established for every entry below; fidelity review and design-owner sign-off remain outstanding — not the mapping itself.

**Component (54):** Accordion, Avatar, Banner, Bar Chart, Breadcrumb, Button, Checkbox, Chip, Column Selector, Date Field, Date Filter, Date Picker, Donut Chart, Dropdown Field, Empty State, File Uploader, Filter Bar, Filter Chip, Filter Dropdown Panel, Gauge Chart, Heatmap, Input Number, Letter, Line Chart, Metric Bar, Modal, Pagination, Progress Bar, Radio Group, Search Bar, Segmented Bar, Select, Skeleton, Slider, Spinner, StatusLabel, StatusSelect, SummaryStat, Table Customization Menu, **Table**, Tabs, TextField, ThirdPane, Toast, Toggle, Tooltip, Tree, View Selector, View Switcher, Views, Wizard, World Map, PECDropdown, PxShellRail.

**Foundation/token (5):** Prism Icon set, Typography, Spacing · Radius · Border, Elevation · Shadow, Grid · Layout.

**Illustration (2):** Illustrations, Shell/Illustrations.

Newly moved into this bucket this pass (previously `Unmapped`/`Implemented-unmapped`): Checkbox, Radio Group, Toggle, Search Bar, Status Label, Tooltip, Pagination, **Table**, Heatmap, World Map.

## Missing components and patterns (11)

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
| Analytics Secondary Navigation | `3351:3925`, verified | Unchanged — see prior readiness assessment. |
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

1. Build **Analytics Secondary Navigation** and the 2 new missing components (**Card**, **Dashboard Widget Card**) — all three now have full Figma evidence and no blockers.
2. Close fidelity-review debt on **Table** (`20:34`) first — it is the single highest-leverage newly-mapped component given how many screens depend on it, followed by Modal, Accordion, Button.
3. Ask the user for exact pages for the 8 remaining `Implemented-unmapped` components — none were resolved by this pass's 75-page inventory, so they are genuinely outside its scope, not overlooked.
4. Reconcile `audience-explorer.tsx` vs `user-explorer.tsx` — repository-only debt, unblocked by nothing Figma-side.
5. Decide on Bulk/Split button variants, Color Picker, Notification, RTE Field, Link, Divider — all fully evidenced, implementation is the only remaining step.
6. Address the 4 documented Figma corrections upstream with the design owner.
