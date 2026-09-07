# PxDetailDrilldownShell

**Status:** Approved (design owner, 2026-09-07). See `ai/shell-registry.md` and `ai/figma-coverage.json`'s `outofscope-detail-drilldown-page` entry (id kept unchanged from its pre-implementation history for traceability — see that entry's own notes) for the current registry status.

## Purpose

A generic page-shell for any PX single-record detail/drilldown view — Account, Segment, Feature, Engagement, User, or any entity where the user navigates from a list into a single-record view. It is **not** an Account Explorer component, a Segment Detail component, or specific to any one entity — the entity name only ever appears in the `title` prop's runtime value, never in the shell's own structure or name.

Use it whenever a screen's anatomy is: a global PX header inherited unchanged from wherever the user navigated from, a drilldown-owned secondary header (back navigation + record title + optional tabs + optional contextual actions), and a flexible, scrollable content region showing record-specific detail.

**Do not use** for list/table pages (`PxListShell`), record-creation/edit forms (`PxCreateEditShell`), or Analytics dashboards (`PxAnalyticsSecondaryNav`) — those have their own registered shells with different anatomy.

## Figma sources

| Frame | Node ID | Note |
| --- | --- | --- |
| Detail · Drilldown Page 🟢 (canonical page) | `3187:11` | The dedicated, canonical Figma source for this archetype. Previously recorded in this repo as `Out of scope` / empty — now contains real, complete design evidence (verified live via MCP). |
| Shell / Detail Drilldown (instance) | `9665:57781` | The assembled shell instance on the canonical page — Left Navigation + PX Header + Content SLOT, matching `Shell/Nav+CompleteHeader`'s own anatomy. |
| Detail Drilldown AI Instructions | `9669:4541` | Full behavioral rules (header ownership, secondary-bar zone configuration, back-navigation semantics, CTA non-inheritance, naming discipline, layout constants). |
| Detail Drilldown Dos and Don'ts | `9669:4571` | Corroborates the AI Instructions frame; no conflicts found between the two. |
| Shell/MainContainer (page) — supporting/reference only | `3792:8575`, section "Detail/Drilldown" `9661:38956` | A near-identical duplicate of the same content embedded on the shared MainContainer page. Treated as supporting evidence only — **not** a separate registry-owned source; node `3187:11` is canonical. |

Also cross-referenced: `Shell/Nav+CompleteHeader` (`4191:15440`, on `3792:8575`) — the Detail Drilldown AI Instructions explicitly state this shell "is assembled from Shell/Nav+CompleteHeader — the same base shell used for all pages that need both primary and secondary header bars," confirming this is a configuration of the existing generic shell substrate, not a new one.

## Anatomy

```
PxDetailDrilldownShell
└── PxMainContainer                — rail + header + content row (existing, reused as-is)
    ├── PxShellRail                — left nav (existing, reused as-is)
    ├── PxHeader                   — Primary Bar (inherited, unchanged) + Secondary Bar (always shown)
    │   ├── Primary Bar            — moduleName / primaryCenter / primaryUtilities / avatar (from `header`, unchanged from parent page)
    │   └── Secondary Bar          — three zones, all via PxHeader's own existing props:
    │       ├── Left zone          — onBack (back arrow) + title (record title) + onEditTitle? (pencil) + titleChip?
    │       ├── Centre zone        — tabs? / activeTabId? / onTabChange? (omit for the Empty centre variant)
    │       └── Right zone         — secondaryUtilities? (icon buttons) + secondaryActions? (pill buttons) (omit both for the Empty right-zone variant)
    └── <main>                     — 24px padding (space/300), owns its own vertical scroll — children, entirely caller-defined
```

No new visual/header component was created. `PxHeader` (rendered by `PxMainContainer`) already exposes every field the Secondary Bar's three zones need — confirmed field-for-field against a live Figma screenshot of the `Shell / Detail Drilldown` instance (back arrow, "Record Title", info/duplicate/delete icon utilities, two pill actions).

## Required behavioral rules (from Figma's own AI Instructions and Dos/Don'ts — not implementation choices)

- **The PX Primary Bar remains the inherited/global page context.** It must match the parent page exactly (same module name, PEC trigger, RHS icons) — never add drilldown-specific actions, breadcrumbs, or branding to it.
- **Detail/Drilldown introduces its own Secondary Bar** — always shown (`showSecondary: true`), configured per the three zones above.
- **The Secondary Bar's left zone contains deterministic parent navigation + the record/detail title** — `onBack` + `title`, with an optional edit pencil (`onEditTitle`) and chip (`titleChip`).
- **Back navigation returns to the known parent surface — it is not generic browser-history behavior.** `onBack` must navigate to the specific parent list/page the user came from (e.g. "Accounts Explorer main list"), never a generic "go back."
- **Parent-page CTAs are not automatically inherited by a drilldown.** A parent list page's own actions (Create, Export, Bulk Edit, Filter) never carry over — the caller must not reuse them here.
- **Drilldown pages own their own contextual utilities/actions** — `secondaryUtilities`/`secondaryActions` are the drilldown's own (e.g. Edit record, Delete, Share), independent of whatever the parent page's header showed.
- **The content region is generic and product-owned.** The shell never assumes what `children` contains — summary stat cards, tables, charts, empty states, or anything else are entirely the composing screen's responsibility.
- **Never name or structure the reusable shell around a specific entity** such as Account, Segment, Feature, or Engagement — the entity name belongs only in the `title` prop's runtime value.
- **Account Explorer-specific cards/tables/metrics must not become shell anatomy.** Figma's own instructions reference an "Account Explorer example" as an illustrative content pattern only, not as this shell's own required content — and as of this implementation, no such example frames could be located in the Figma file at all (see the shell-completeness audit for details). This shell's own example fixture uses deliberately generic, non-entity-specific mock content for exactly this reason.

## Props

Full types live in [`types.ts`](./types.ts). Summary:

| Prop | Type | Role |
| --- | --- | --- |
| `nav` | `PxNavProps` | Forwarded to `<PxMainContainer>` — identical shape to every other shell's. |
| `header` | `Pick<PxHeaderProps, "moduleName" \| "primaryCenter" \| "primaryUtilities" \| "avatar">` | Primary-bar-only fields, inherited unchanged from the parent page. |
| `onBack` | `() => void` | Required. Deterministic navigation to the specific parent surface. |
| `title` | `string` | Record/detail title (Secondary Bar left zone). |
| `onEditTitle` | `(newTitle: string) => void?` | Optional edit-pencil handler — omit to hide the pencil. |
| `titleChip` | `ReactNode?` | Optional chip after the title. |
| `tabs` / `activeTabId` / `onTabChange` | `PxHeaderTab[]?` / `string?` / `(id) => void?` | Optional centre-zone tabs — omit for the Empty centre variant. |
| `secondaryUtilities` | `PxHeaderUtility[]?` | Drilldown-owned right-zone icon utilities — never inherited from the parent page. |
| `secondaryActions` | `PxHeaderAction[]?` | Drilldown-owned right-zone pill actions — never inherited from the parent page. |
| `children` | `ReactNode` | Content region — padding/scrolling handled by the shell. |
| `className` | `string?` | Placement only, applied to the content `<main>`. |

## Usage

```tsx
import { PxDetailDrilldownShell } from "@/patterns/px-detail-drilldown-shell"

export function SegmentDetailScreen() {
  const [nav, setNav] = React.useState<PxShellNavKey>("segments")

  return (
    <PxDetailDrilldownShell
      nav={{ activeKey: nav, onNavigate: setNav }}
      header={{ moduleName: "Segments" }}
      onBack={() => navigateToSegmentsList()}
      title="Enterprise Trial Users"
      titleChip={<StatusLabel variant="active">Active</StatusLabel>}
      secondaryActions={[{ id: "edit", label: "Edit segment", variant: "primary", onClick: onEdit }]}
    >
      <MySegmentDetailContent />
    </PxDetailDrilldownShell>
  )
}
```

## Design rules

1. Never render `<PxShellRail>` or `<PxHeader>` alongside `<PxDetailDrilldownShell>` — the shell already includes both via `PxMainContainer`.
2. Never re-apply page padding inside `children` — the shell already applies 24px on all four sides.
3. Never hard-code entity-specific content (Account/Segment/Engagement-specific cards, tables, or metrics) into this shell's own implementation — that belongs to the screen composing it.
4. `onBack` must navigate to the actual parent surface, never a generic browser-back action.
5. Do not force `secondaryUtilities`/`secondaryActions` to be non-empty — both are genuinely optional per Figma's own Empty-variant allowance.

## Token dependencies

Spacing: `--p-space-300` (content padding). All other visual tokens (Primary/Secondary Bar colors, typography, focus rings) are owned by `PxHeader`/`PxShellRail`/`PxMainContainer` — this pattern introduces no new tokens and borrows none across components.

## Component dependencies (all reused, none modified)

- `PxMainContainer` (`src/patterns/px-main-container`) — this is its 4th registered direct consumer, alongside `PxListShell`/`PxCreateEditShellAccordion`/`PxCreateEditShellWizard`/`PxAnalyticsSecondaryNav`.
- `PxHeader` (rendered by `PxMainContainer`, `src/patterns/px-list-shell/PxHeader.tsx`) — Secondary Bar's existing `onBack`/`title`/`onEditTitle`/`titleChip`/`tabs`/`activeTabId`/`onTabChange`/`secondaryUtilities`/`secondaryActions` props, unmodified.

## Component Composition Audit

- **Approved components reused:** `PxHeader` (via `PxMainContainer` — approved as part of `shell-px-list-shell`'s own repoPaths). `PxMainContainer` itself is **not** independently approved — its registry status remains `Internal foundation`; its use here is sanctioned because `PxDetailDrilldownShell` is now a registered, approved direct consumer (see `decision-px-main-container-internal`), the same relationship `PxListShell`/`PxCreateEditShell`/`PxAnalyticsSecondaryNav` already have with it.
- **New components created:** `PxDetailDrilldownShell` (pattern) — a thin composition, not a new visual/header component.
- **Native interactive elements introduced:** none.
- **`className` overrides on approved components:** none — the one `className` this pattern accepts is applied to its own content `<main>`, never to `PxMainContainer`/`PxHeader`'s own visual recipe.
- **Cross-component token references:** none — this pattern introduces no visual tokens of its own beyond the existing `--p-space-300` spacing primitive.
- **Duplicate implementations found:** none — no new header, no new sub-header, no new back-arrow control was built; every piece of the Secondary Bar anatomy already existed in `PxHeader`.
- **Unresolved API or token gaps:** none identified. The one open item from the shell-completeness audit — Figma's reference to "Account Explorer example" frames that could not be located anywhere in the file — does not block this generic shell's implementation, since those frames were always documented as illustrative content examples, never as required shell anatomy.
