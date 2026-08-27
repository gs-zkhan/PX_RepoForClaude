# PxMainContainer

**Status:** internal layout foundation, extracted and implemented, pending visual review — **not** an independently-approved page shell in its own right. Screens never reach for `PxMainContainer` directly; they use `PxListShell` or `PxCreateEditShell{Accordion,Wizard}`, both of which compose it. See "Relationship to Figma's Shell variants" and "Registry status" below.

## Purpose

`PxMainContainer` is the navigation + header + content anatomy shared by **every** full-page PX shell — the left rail, `PxHeader` (one or two bars, using its own existing logic), and a single unstyled content row. It was factored out of `PxListShell` so that list-specific behaviour (the 336px filter slider) doesn't leak into shells that have nothing to do with lists, like `PxCreateEditShellAccordion`/`PxCreateEditShellWizard`.

This is a pure layout primitive: it does not add padding, does not assume anything about `children`, and does not expose a filter slot. `PxListShell` = `PxMainContainer` + a padded `<main>` + an optional filter slider, composed as siblings inside the content row. The Create/Edit full-page tiers compose `PxMainContainer` directly with their own single content element.

## Figma sources

| Frame | Node ID | Note |
| --- | --- | --- |
| Shell/MainContainer 🟢 (page) | `3792:8575` | The page holding every PX shell variant as symbols. |
| Shell/Nav+PrimaryHeader | `3796:2273` | The lightest composed variant on that page ("Full page shell with left nav + PX Header... Use for detail or settings pages") — matches this component's own anatomy when only the Primary Bar is configured. |
| PX Shell AI Instructions | `4191:21696` | "Each shell combines a Left Navigation variant with a specific header pattern" — Figma's own framing of nav+header as the common substrate these variants are built from. |

Named `PxMainContainer`, not `PxAppShell`, to track Figma's own "MainContainer" vocabulary rather than inventing a new term for the same concept.

## Relationship to Figma's Shell variants

`Shell/MainContainer` (`3792:8575`) is a **page**, not a single component — it holds every PX shell variant as its own symbol: `Shell/NavOnly` (48px, no header), `Shell/NavExpanded`/`Shell/NavAdmin` (240px, no header), `Shell/Nav+PrimaryHeader` (nav + one header bar), `Shell/Nav+CompleteHeader`/`Shell/Nav+Tabs`/`Shell/Nav+SecNav` (nav + two-bar header variants), and `Shell/Modal`. Figma's own AI-instructions frame (`4191:21696`) describes these as each combining "a Left Navigation variant with a specific header pattern" — i.e. Figma itself already treats nav+header composition as the common substrate these variants are built from, rather than one fixed component.

`PxMainContainer` implements that substrate in code: rail + `PxHeader` (which already has its own one-or-two-bar logic) + one content row. It is not a 1:1 port of any single Figma symbol — its anatomy matches `Shell/Nav+PrimaryHeader` exactly when only the Primary Bar is configured, and matches the two-bar variants when a Secondary Bar is also configured (since that capability already lived in `PxHeader`, reused as-is here rather than duplicated).

## Registry status

Not given its own row in [`ai/shell-registry.md`](../../../ai/shell-registry.md) — that registry is for shells a **screen** starts from directly ("Every new page-level layout must start from a shell listed there"), and no screen composes `PxMainContainer` on its own. It is consumed exclusively by `PxListShell` and `PxCreateEditShellAccordion`/`PxCreateEditShellWizard`, both of which **are** registered there. Its own approval status is inherited from whichever of those consumers a given screen is reviewed through, not tracked independently.

## Anatomy

```
PxMainContainer
├── PxShellRail          — left nav (existing, reused as-is)
└── main column
    ├── PxHeader         — Primary Bar (mandatory) + Secondary Bar (auto-shows if configured)
    └── content row      — flex, min-h-0, full height, otherwise unstyled
        └── children     — entirely caller-defined; PxListShell puts a padded <main> + filterSlider
                            here, PxCreateEditShellAccordion/Wizard put their own single content div
```

## Props

| Prop | Type | Role |
| --- | --- | --- |
| `nav` | `PxNavProps` | Forwarded to `<PxShellRail>` — identical shape to `PxListShell`'s. |
| `header` | `PxHeaderProps` | Forwarded to `<PxHeader>` — identical shape to `PxListShell`'s. |
| `children` | `ReactNode` | The content row's contents — no padding, no filter slot, no assumptions. |
| `className` | `string?` | Placement only, applied to the outermost container. |

## Reuse verified: `PxHeader`'s Secondary Bar for Create/Edit sub-headers

Before reusing `PxHeader`'s Secondary Bar (built from Figma's `TableSecHeader`, nodes `9452:13655`/`13691`/`13699`) for the Create/Edit Form's own "sub-header bar," this was checked directly rather than assumed. `TableSecHeader`'s "BackArrow" variant (node `9452:13652`), pulled via `get_design_context`, has this exact anatomy: **arrow-left icon → editable Text-Field-shaped title → 16px edit-pencil icon → Chip** — a field-for-field match to the Create/Edit Form AI instructions' own sub-header spec ("LHS: back arrow · inline-editable record name field · optional edit pencil icon · optional status chip"). No separate Figma component instance for a Create/Edit-specific sub-header exists anywhere on the Create/Edit Form page (`3187:10`) — the spec is prose-only there. Given the concrete anatomy match and the absence of any distinct instance, `PxHeader`'s existing Secondary Bar is treated as the same shared component, not a coincidental lookalike — no separate sub-header pattern was built.

## Component dependencies (all reused)

- `PxShellRail` (`src/components/px-shell-rail.tsx`)
- `PxHeader`, `TooltipProvider` (`src/patterns/px-list-shell`, `src/components/ui/tooltip.tsx`)

## Component Composition Audit

- **Approved components reused:** `PxShellRail`, `PxHeader`, `TooltipProvider`.
- **New components created:** `PxMainContainer` (pattern) — necessary because the rail+header+content anatomy was previously only available bundled with `PxListShell`'s list-specific filter slot.
- **Native interactive elements introduced:** none.
- **`className` overrides on approved components:** none.
- **Cross-component token references:** none — `PxMainContainer` itself introduces no new visual tokens; `bg-[var(--s-color-surface-page)]` is copied verbatim from `PxListShell`'s own existing usage, not a new borrow.
- **Duplicate implementations found:** none — this is an extraction, not a duplicate; `PxListShell`'s own file no longer contains this anatomy inline.
- **Unresolved API or token gaps:** none identified.
