# Project End Goal

The end goal is to build an AI-readable, code-first PX design system on top of ShadCN and Radix. ShadCN/Radix provide reusable behaviour and accessibility, while Prism tokens, icons, typed components and PX-specific patterns provide the product's visual identity and interaction rules.

The repository should become the authoritative source for generating complete PX interfaces through prompting alone, without requiring Figma for future design work. AI should be able to understand the approved components, variants, layouts, patterns and usage constraints, and produce screens that consistently look and behave like Gainsight PX.

The architecture must also remain portable across products: PX, Community, Skilljar or other products should be able to share the same ShadCN/Radix behavioural foundation while applying their own themes, tokens, icons and product patterns. This should make future repository consolidation and cross-product reuse significantly easier.

Every implementation decision must be measured against this goal.

---

# Figma Source of Truth

This repository must reference **only one** Figma file:

- **`U3D8WMBVFl9LvAZyLHhm24` — "Prism V1 - ShadCN"** — the current, approved file. All Shad Repo tokens (`tokens/*.json`), component extractions ([`ai/component-manifests/EXTRACTION_REPORT.md`](./ai/component-manifests/EXTRACTION_REPORT.md)), and shells ([`ai/shell-registry.md`](./ai/shell-registry.md)) were sourced from this file. Always use this file key when calling Figma MCP tools (`get_design_context`, `get_metadata`, `get_screenshot`) for this repo.

**Never reference these files for Shad Repo work:**

- `Wh9XaMTl94yKMa0bYCQbrM` — "Prism - AI Design System of PX" — superseded/old. This is a separate design system source used by the unrelated `prism-ds` Claude Code kit repo; it is not the source for this repo's tokens or components.
- `9ynHgauCIjtayjS92xHLrk` — retired PX-AI-DS-V2 file — never use, per the design team.

If a Figma link or node without an explicit file key is provided, or the file key doesn't match `U3D8WMBVFl9LvAZyLHhm24`, stop and confirm with the user before pulling design context — do not silently assume which file is intended.

---

# Prism Component Composition Contract

## Purpose

This repository is an AI-readable code design system.

The implementation architecture is:

```
ShadCN/Radix behavioural foundation
→ Prism tokens and icons
→ approved typed Prism code components
→ composed Prism patterns
→ PX product screens
```

Figma is a visual extraction and validation reference during migration.

Figma components must not be copied into React as separate local implementations.

---

## Stop and Ask Rule

When a required component, asset, token, or pattern is not found in the project:

1. Stop.
2. Report exactly what is missing and what it is needed for.
3. Ask the user — they will provide the answer, direction, or asset.
4. Do not proceed until direction is received.

Do not create a substitute, workaround, or local implementation unilaterally.

This applies to: components, icons, illustrations, tokens, layout patterns, API decisions, and classification of new elements.

---

## Mandatory Composition Rule

When implementing any pattern, feature, or screen:

1. Search the repository for an existing approved component before writing JSX or styling.
2. Reuse the existing component whenever it provides the required semantic role.
3. Compose patterns from approved components.
4. Never recreate an existing component with:
   - a native element
   - local Tailwind visual classes
   - copied Figma values
   - copied code from an old repository
   - a second wrapper with duplicated visual rules

**Correct:**

```tsx
<Button>Save</Button>
<Button variant="secondary">Cancel</Button>
<StatusLabel variant="active">Active</StatusLabel>
<PrismIcon name="calendar" size={24} />
```

**Incorrect — native element with manual visual classes:**

```tsx
<button className="h-8 rounded-full bg-blue-600 px-4">Save</button>
```

**Incorrect — approved component with visual overrides:**

```tsx
<Button className="h-8 rounded-full bg-blue-600 px-4">Save</Button>
```

**Incorrect — local duplicate component:**

```tsx
const EmptyStateButton = (...) => ...
```

---

## Pattern Ownership

A pattern may control only composition-level properties:

- layout direction, placement, alignment, wrapping
- responsive arrangement
- spacing between child components
- visibility rules
- content and product-specific behaviour

A pattern must **not** override a child component's:

- height, width intrinsic to the component
- padding, radius, border
- typography, text colour, icon colour
- background
- hover, focus, active, selected, disabled, loading, destructive styling

Those properties belong to the child component and its Prism tokens.

A pattern may pass only approved typed props: `variant`, `size`, `disabled`, `loading`, `selected`, `state`, `density`.

Do not use `className` to simulate a missing component variant.

---

## Component Lookup Gate

Before implementing any UI element:

1. Search `src/components/ui`.
2. Search the component catalogue or documentation.
3. Search existing patterns and screens.
4. Inspect the approved component API.
5. Inspect its token dependencies.
6. Reuse it when found.

If multiple matching components exist, stop and report the duplication.

If no approved component exists, stop and ask. Do not implement until direction is received.

---

## Figma Rule

Figma defines intended visual appearance and anatomy. Figma does not author runtime React components.

Do not:

- extract React code from Figma plugins
- copy nested Figma components into local React components
- reproduce Figma values with arbitrary Tailwind classes
- import legacy Prism component code from another repository
- treat a Figma component instance as a reason to create another code component

Translate Figma into the existing code-system architecture.

---

## Token Ownership

Use this priority order:

1. Component token belonging to the current component
2. Semantic token
3. Primitive token
4. Verified raw constant only when no token exists

Never use another component's token as a permanent shortcut.

**Prohibited cross-component token examples:**

- Checkbox focus token inside Table
- Table disabled icon token inside Pagination
- Status Label typography inside Pagination
- Button colour tokens inside an Empty State wrapper

When a required token is missing, stop and report:

- component and property/state
- Figma value
- recommended token path and alias
- affected files

Do not silently borrow a token from another component.

---

## No Visual Overrides on Approved Components

When using approved components inside patterns or screens:

- Do not pass classes that alter their visual recipe.
- Do not target their internal DOM through parent selectors.
- Do not use descendant selectors to restyle them.
- Do not use `!important`.
- Do not add inline styles for visual properties.
- Do not duplicate their hover or focus behaviour.

Allowed `className` on an approved component instance is limited to pattern placement only:

- `order`, flex/grid placement, `self-alignment`, responsive visibility, non-visual data hooks

Prefer a wrapper element for layout rather than applying layout classes directly to the component.

---

## Visual Parity Check

Whenever a pattern contains an approved component also demonstrated elsewhere in the same app:

1. Compare the nested instance against the reference instance.
2. Confirm identical: height, padding, radius, typography, icon size, colours, hover, focus, disabled state.
3. Any difference must come from an approved prop or token.
4. If the difference comes from local styling, treat it as a defect.

Example: An Empty State primary action must render identically to the validated `<Button>` instance elsewhere in the app.

---

## Composition Audit Before Completion

Before declaring a pattern or screen complete, run:

```bash
grep -RInE '<button|<input|<select|<textarea' <changed-pattern-files>

grep -RInE 'className=.*(bg-|text-|border-|rounded-|h-|w-|px-|py-|p-)' <changed-pattern-files>

grep -RInE 'function .*Button|const .*Button|function .*Input|const .*Input' src

grep -RIn 'lucide-react' src

grep -RInE '#[0-9A-Fa-f]{3,8}' src/components --exclude=prism-generated.css
```

Review every result. Native elements are allowed only when:

- no approved component exists
- native semantics are intentionally required
- the decision is documented

For every approved child component used by the pattern, report: component imported, props used, whether `className` was applied, whether any visual override was applied, token dependencies. The expected visual override count is zero.

---

## Duplication Failure Conditions

Stop and report before proceeding if any of these occur:

- an existing component is being recreated
- a pattern adds visual classes to an approved child
- a local component duplicates an approved component
- Figma and code component anatomy differ substantially
- a required component prop is missing
- a required component token is missing
- legacy code is being considered as a shortcut
- a parent selector changes a child component's visual recipe
- a second implementation is proposed because composing the existing API is inconvenient

Do not solve API limitations with local styling. Propose an improvement to the approved component API instead.

---

## Definition of Done

A pattern or screen is complete only when:

- approved components are reused
- no duplicate component implementation exists
- no child visual recipe is overridden locally
- all styling ownership is correct
- every visual value comes through the correct token layer
- Figma fidelity is achieved through composition
- keyboard and accessibility behaviour is preserved
- the pattern can be understood and generated without Figma
- another product could reuse the behavioural foundation with another theme

---

## Reporting Requirement

At the end of every pattern or screen task, include a section named **Component Composition Audit** reporting:

- approved components reused
- new components created and why each was necessary
- native interactive elements introduced
- `className` overrides on approved components
- cross-component token references
- duplicate implementations found
- unresolved API or token gaps

If any prohibited item is present, do not declare the work complete.


---

# Reusable Shells

The authoritative registry of extracted PX shells lives at [`ai/shell-registry.md`](./ai/shell-registry.md). Every new page-level layout must start from a shell listed there before adding page content.

## Shell reuse rules

Shell selection is **anatomy-based, never name-based** — a screen's product name (e.g. "Feature Adoption") never determines its shell; its actual anatomy does. Two screens can share a product name while requiring different shells if their anatomy differs.

- **List-type pages** — any screen whose anatomy is a single tabular list, master surface, or filterable dataset (Audience Explorer, Accounts, Engagements, Segments, and every other table-driven PX screen, e.g. a table/list-shaped "Feature Adoption" view) MUST reuse `PxListShell` from `src/patterns/px-list-shell`. Do NOT rebuild the left rail, page header, or content padding — they are the shell's responsibility.
- Screens supply feature content via `children`, filters via the `filterSlider` slot, and header composition via the typed `header` prop.
- **Record create/edit forms** MUST reuse `PxCreateEditShell` from `src/patterns/px-create-edit-shell` — pick the tier per the Figma "Create · Edit Form" AI instructions (node `7128:873`): `PxCreateEditShellModal` for ≤6 fields with no branching, `PxCreateEditShellAccordion` for independent multi-section forms, `PxCreateEditShellWizard` only when a later step depends on an earlier one. Do NOT hand-roll a Modal + form fields, or a second sub-header/footer, for a create/edit screen — compose one of these three.
- **Analytics pages** — any screen built around Analytics secondary navigation, KPIs, and charts (e.g. an analytics-dashboard-shaped "Feature Adoption" view) MUST reuse `PxAnalyticsSecondaryNav` from `src/patterns/px-analytics-secondary-nav`, composed directly inside `PxMainContainer` as a sibling of `<main>` — this is one of the few contexts where composing `PxMainContainer` directly is correct; see `src/patterns/px-main-container/README.md`'s "Registry status" section.
- Do NOT re-add page padding, page background, or top-bar chrome inside `children` — the shell already applies `--p-space-300` on all four sides and `--s-color-surface-page` behind the content.
- Do NOT render `<PxShellRail>` or a hand-rolled top bar next to `<PxListShell>`. The shell already includes both.
- When Figma shows the two-bar header, pass any of `title`, `tabs`, `onBack`, `secondaryActions`, `titleChip`, `secondaryUtilities` — the Secondary Bar renders automatically. Pass `showSecondary={false}` to force a one-bar header.

Before proposing a NEW shell, check the registry first — if the target page fits an existing shell, reuse it and do not clone.

## Canonical application references

- **[`src/pages/user-explorer.tsx`](./src/pages/user-explorer.tsx)** is the canonical existing application reference for how a real PX screen composes shells, patterns, and approved components together (filtering, sorting, pagination, column customization, inline status editing, etc.). When building a new screen, study its architectural and composition lessons — but do not treat its specific visual layout (a single dense table page) as appropriate for every shell; a create/edit form, for example, has a materially different anatomy and should follow `PxCreateEditShell` instead.
