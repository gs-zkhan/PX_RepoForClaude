# PxCreateEditShell

**Status:** extracted, implemented, **approved (design owner, 2026-08-28)** — all three tiers (Modal, Accordion, Wizard) visually reviewed and approved. The design review also corrected the shared `Accordion`/`Modal` components themselves (expanded-row hover scope, 24px subtitle-to-content gap, on-material's lack of a special background/container, Modal header separation/spacing/typography, and Modal/ModalConfirmation minimum heights) — see [`ai/shell-registry.md`](../../../ai/shell-registry.md#design-owner-approval-history) for the full correction list and verified measurements.

## Purpose

`PxCreateEditShell` covers the three approved surface tiers for record creation and editing, per Figma's Create · Edit Form AI instructions: **Modal** (≤6 fields, no branching), **Accordion** (multi-section, full-page, sections are independent), and **Wizard** (multi-step, full-page, a later step depends on an earlier one). The same tier is used for both Create and Edit — the only differences are field pre-population and the primary CTA's label ("Create"/"Add" on create, always "Save" on edit — never "Update").

Three thin, purpose-specific components share the same underlying plumbing rather than being unrelated implementations:

- `PxCreateEditShellModal` composes the existing `<Modal>`/`<ModalFooter>`.
- `PxCreateEditShellAccordion` and `PxCreateEditShellWizard` both compose `<PxMainContainer>` (`src/patterns/px-main-container` — rail + header + one content row, keeping the rail + primary header visible, per "Shell remains visible") and configure `PxHeader`'s Secondary Bar as the sub-header the spec calls for, plus a shared `<PxCreateEditFooter>` sticky footer. They compose `PxMainContainer` directly rather than `PxListShell` — this shell has nothing to do with lists, so it does not inherit `PxListShell`'s `filterSlider` slot or any list-page semantics.

Field content is always supplied by the calling screen via `children`, composed from existing approved field components (`TextField`, `Textarea`, `DropdownField`, `DateField`, `RadioGroup`) — this shell never knows or cares what fields a given form needs.

## Figma sources

| Frame | Node ID |
| --- | --- |
| Shell/Create · Edit Form 🟢 (page) | `3187:10` |
| Create Edit Form AI Instructions | `7128:873` |
| Create Edit Form Dos and Don'ts | `7128:914` |
| Assembled reference — Create/Edit on a Popup ("Add Weblink") | `3796:2503` |
| Modal instance (Size=Small, Microcopy=Off) | `3791:1498` |
| Modal Footer instance (Width=Large, Buttons=2-Button) | `3791:1499` |
| Messagebox (multi-line field — see "Textarea" below) | `3137:126` |
| Assembled reference — Create/Edit with Accordion | `3796:2504` |
| Assembled reference — Create/Edit with Wizard ⚠️ | `3802:3615` |

⚠️ Node `3802:3615`'s Figma **layer name** reads "Create/Edit with Accordion" — a copy-paste artifact. Its actual content (a `Wizard` step sidebar + empty content pane) and its position directly under the "Create/Edit with Wizard" text label (node `3802:3614`) make it unambiguously the Wizard tier. Implemented per content and position, not the stale name — flagged for a Figma-side rename.

## Anatomy

```
PxCreateEditShellModal
└── Modal (size, title)
    ├── children (caller's field content, scroll-if-needed)
    └── ModalFooter (Cancel + primary CTA)

PxCreateEditShellAccordion / PxCreateEditShellWizard
└── PxMainContainer (src/patterns/px-main-container)
    ├── PxShellRail          — left nav (existing, reused as-is)
    └── PxHeader
        ├── Primary Bar      — moduleName / primaryCenter / primaryUtilities / avatar
        └── Secondary Bar    — configured as the sub-header (verified match — see below):
            ├── onBack · title (inline-editable) · titleChip   (LHS)
            └── secondaryUtilities[] · Cancel · primary CTA    (RHS)
    └── children (this shell's own content, inside PxMainContainer's content row)
        ├── Accordion:  padded <Accordion>/<AccordionItem> sections, each with a numbered
        │               <Letter> badge (caller-composed)
        │               — or —
        │   Wizard:  <Wizard> step sidebar (240px, shell-owned) + a blank flexible spacer +
        │            a 336px content pane pinned to the right edge (caller-composed),
        │            matching Figma's own measured placement
        └── PxCreateEditFooter — sticky bottom bar: Cancel + primary CTA
```

## Known Figma inconsistencies (flagged for design-owner review)

1. **Accordion example frame omits the sub-header/footer.** The assembled "Create/Edit with Accordion" frame (`3796:2504`) shows only the nav, primary header, and 4 collapsed accordion rows — no sub-header bar, no sticky footer. The written AI instructions state both are "Present on all full-page forms (Accordion and Stepper)." Implemented per the written instructions (the more complete, explicit source) — kept deliberately.
2. **Wizard sidebar width mismatch.** The written spec states "Stepper sidebar: 240px fixed width," but the assembled example frame (`3802:3615`) measures the sidebar at 156px. Implemented at the written 240px, kept deliberately as the correct spec value — the 156px measurement is what needs a Figma-side correction.
3. **Footer shadow token name.** The spec calls the sticky footer's shadow "shadow/100 (upward)," but `--e-shadow-100` is actually a downward-cast shadow in this repo's generated tokens (the same one `PxHeader` uses below itself). `--e-shadow-inverse` is the token that actually produces the upward visual result the spec describes (the same one `ModalFooter` already uses for the identical reason) — kept, since it matches the written *intent* even though the literal token name in the spec doesn't.
4. **Stale Wizard layer name.** Node `3802:3615` is named "Create/Edit with Accordion" in Figma but is unambiguously the Wizard tier by content and position (see Figma sources table). Documented, not renamed — this needs a Figma-side fix.
5. **Wizard content-pane placement.** Figma's assembled frame parks its 336px "Content" instance flush against the right edge of the content area, leaving a large blank gap between it and the sidebar, rather than immediately adjacent to it. Matched exactly (sidebar → blank flexible spacer → 336px content pane pinned right) per explicit direction, even though it produces an unusual amount of empty space — see `PxCreateEditShellWizard.tsx`.

## Sub-header reuse — verified, not assumed

Before reusing `PxHeader`'s Secondary Bar for this spec's "sub-header bar," I checked whether Figma's `TableSecHeader` (the component `PxHeader`'s Secondary Bar is built from, nodes `9452:13655`/`13691`/`13699`) and the Create/Edit Form's own sub-header are actually the same thing. No separate Figma component instance for a Create/Edit-specific sub-header exists anywhere on the Create/Edit Form page (`3187:10`) — the spec describes it only in prose. Pulling `TableSecHeader`'s "BackArrow" variant (node `9452:13652`) directly, its anatomy is: arrow-left icon → editable Text-Field-shaped title → 16px edit-pencil icon → Chip — a field-for-field match to this spec's "back arrow · inline-editable record name · optional edit pencil icon · optional status chip." Given the concrete anatomy match and the absence of any distinct instance to contrast it against, `PxHeader`'s existing Secondary Bar is treated as the same shared component. See `src/patterns/px-main-container/README.md` for the full comparison.

## Props / slots

Full types live in [`types.ts`](./types.ts).

**`PxCreateEditShellModal`**

| Prop | Type | Role |
| --- | --- | --- |
| `open` / `onOpenChange` | `boolean` / `(open) => void` | Forwarded to `<Modal>`. |
| `size` | `"small" \| "medium" \| "large"` | ≤4 fields / 5–6 fields / complex — default `"small"`. |
| `title` | `string` | States the action, never the record name (e.g. "Add Weblink", "Edit Account"). |
| `onCancel` | `() => void` | Footer Cancel handler. |
| `primaryAction` | `{ label, onClick, disabled? }` | Footer primary CTA. Start `disabled` until required fields are valid. |
| `children` | `ReactNode` | Field content. |

**`PxCreateEditShellAccordion` / `PxCreateEditShellWizard`** (both extend `PxCreateEditPageProps`)

| Prop | Type | Role |
| --- | --- | --- |
| `nav` | `PxNavProps` | Forwarded to `<PxMainContainer>`. |
| `header` | `Pick<PxHeaderProps, "moduleName" \| "primaryCenter" \| "primaryUtilities" \| "avatar">` | Primary-bar-only fields. |
| `onBack` | `() => void` | Sub-header back arrow — required. |
| `title` | `string` | Inline-editable record name (placeholder: "Untitled [Object]"). |
| `onEditTitle` | `(newTitle: string) => void?` | Commits the inline-edited title. |
| `titleChip` | `ReactNode?` | Optional chip after the title (e.g. a status chip on Edit). |
| `secondaryUtilities` | `PxHeaderUtility[]?` | Sub-header RHS contextual icons. Never put Delete/Archive here directly — route destructive actions through a ⋮ overflow item. |
| `onCancel` | `() => void` | Cancel handler, used by both the sub-header and the sticky footer. |
| `primaryAction` | `{ label, onClick, disabled? }` | Primary CTA, used by both the sub-header and the sticky footer. |
| `children` | `ReactNode` | Accordion: sections. Wizard: the active step's content pane. |

**`PxCreateEditShellWizard`** additionally: `steps: WizardStep[]`, `onStepClick?: (id) => void`.

## Usage

```tsx
import { PxCreateEditShellModal } from "@/patterns/px-create-edit-shell"
import { TextField } from "@/components/ui/text-field"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function AddWeblinkModal({ open, onOpenChange, onSave }: Props) {
  const [title, setTitle] = React.useState("")
  const valid = title.trim().length > 0

  return (
    <PxCreateEditShellModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Weblink"
      onCancel={() => onOpenChange(false)}
      primaryAction={{ label: "Save", onClick: onSave, disabled: !valid }}
    >
      <div className="flex flex-col gap-[var(--p-space-300)]">
        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea label="Description" />
        <Textarea label="URL" />
        <RadioGroup defaultValue="new-tab" className="flex flex-row gap-4">
          {/* ... */}
        </RadioGroup>
      </div>
    </PxCreateEditShellModal>
  )
}
```

See [`src/pages/create-edit-shell-example.tsx`](../../pages/create-edit-shell-example.tsx) for a full worked example of all three tiers.

## Supported states

- **Modal — Small/Medium/Large** — pass `size`; footer button size follows automatically (matches `ModalFooter`'s own size mapping).
- **Accordion — collapsed/expanded sections** — controlled via the caller's own `<Accordion value=... onValueChange=...>`.
- **Wizard — active/pending/completed steps** — controlled via the caller's own `steps` array; only `"completed"` steps are clickable (back-navigation), per `<Wizard>`'s own rule.
- **Create vs Edit** — same surface, different `title`/`primaryAction.label` values passed by the caller; no separate shell-level mode flag.
- **Disabled primary CTA** — pass `primaryAction.disabled` while required fields are invalid, per the "primary CTA starts disabled" rule.

## Design rules

1. Never render `PxShellRail`, `PxHeader`, `PxListShell`, or a second sub-header alongside `PxCreateEditShellAccordion`/`PxCreateEditShellWizard` — `PxMainContainer` already includes the rail and header, and these shells have nothing to do with `PxListShell`'s list/filter semantics.
2. Never place destructive actions (Delete, Archive, Duplicate) in the sticky footer or the sub-header's primary action group — route them through a `secondaryUtilities` overflow item instead.
3. The modal title always states the action, never the record name — the name belongs in a field inside the body.
4. Never override the visual recipe of `Modal`, `ModalFooter`, `Accordion`, `Wizard`, or `Button` from inside a screen that uses this shell.

## Token dependencies

Colours: `--s-color-surface-page`, `--s-color-surface-default`, `--s-color-line-default`, `--s-color-text-default`, `--s-color-text-subtle`, `--s-color-text-subtlest`, `--s-color-status-danger-default`, `--s-color-status-success-default`.

Spacing: `--p-space-025`, `--p-space-050`, `--p-space-100`, `--p-space-150`, `--p-space-200`, `--p-space-300`.

Radius: `--p-radius-100`.

Typography: `--t-font-label-small-*`, `--p-font-size-medium`, `--p-font-line-height-medium`, `--p-font-size-small`, `--p-font-line-height-small`, `--p-font-weight-regular`.

Effect: `--e-shadow-inverse`.

**Token gap:** no `--c-textarea-*` / `--c-messagebox-*` component tokens exist yet (see [`textarea.tsx`](../../components/ui/textarea.tsx) header comment for the full explanation and recommended token names) — `Textarea` uses semantic/primitive tokens directly rather than borrowing `TextField`'s component tokens.

## Component dependencies (all reused)

- `PxMainContainer` (rail + header + content row), `PxHeader` (via `PxMainContainer`'s `header` prop) — `src/patterns/px-main-container`, `src/patterns/px-list-shell`
- `Modal`, `ModalFooter` — `src/components/ui/modal.tsx`
- `Accordion`, `AccordionItem` — `src/components/ui/accordion.tsx`
- `Letter` — `src/components/ui/letter.tsx` (numbered Accordion section badges, via `AccordionItem`'s `leading` prop)
- `Wizard` — `src/components/ui/wizard.tsx`
- `Button` — `src/components/ui/button.tsx` (used by the pattern-owned `PxCreateEditFooter`)
- Field components used by the example screen only (not by the shell itself): `TextField`, `Textarea` (new), `DropdownField`, `DateField`, `RadioGroup`/`RadioGroupItem`

`PxCreateEditFooter` is a pattern-owned composition helper (like `PxHeader`/`PxFilterSlider` in `px-list-shell`) — it composes `Button` rather than duplicating button markup, and cannot reuse `ModalFooter` as-is because that component's radius/height/shadow are Modal-specific (see `PxCreateEditFooter.tsx` header comment).

## Component Composition Audit

- **Approved components reused:** `PxMainContainer`, `PxHeader` (via `PxMainContainer`), `Modal`, `ModalFooter`, `Accordion`, `AccordionItem`, `Letter`, `Wizard`, `Button`.
- **New components created:**
  - `Textarea` (`src/components/ui/textarea.tsx`) — a genuine gap: no multiline-input component existed anywhere in `src/components/ui`. Matches Figma's "Messagebox" (node `3137:126`) anatomy and the same label/required/info-icon/helper-text/state/a11y API shape as `TextField`. Explicitly approved before building.
  - `PxMainContainer` (pattern, `src/patterns/px-main-container`) — the rail+header+content anatomy factored out of `PxListShell` so it doesn't carry list-specific semantics.
  - `PxCreateEditShellModal`, `PxCreateEditShellAccordion`, `PxCreateEditShellWizard` (pattern) and `PxCreateEditFooter` (pattern-owned composition helper) — the shell itself.
- **API extension (not a local workaround):** `AccordionItem` gained a new, separate `leading?: ReactNode` prop (kept distinct from the existing `icon?: PrismIconName` rather than widening `icon` into a union, so nothing has to branch on `typeof icon === "string"` at runtime), so a standalone `<Letter>` can be passed as a numbered section badge (Figma's own Accordion example numbers its 4 sections). This is the "propose an improvement to the approved component API instead of solving with local styling" path — `AccordionItem` itself now supports this, rather than a wrapper reproducing its header row locally.
- **Native interactive elements introduced:** the `<textarea>` element inside the new `Textarea` component — a native element is intentionally required here (there is no Radix multiline-input primitive to build on, matching how `TextField` itself wraps a native `<input>` via `Input`).
- **`className` overrides on approved components:** none applied to `Modal`, `ModalFooter`, `Accordion`, `AccordionItem`, `Letter`, `Wizard`, or `Button`. `PxMainContainer`'s `header` prop is configured (not overridden) with data this shell computes.
- **Cross-component token references:** none — see "Token gap" above for the one place a component-token layer is genuinely missing (resolved with semantic/primitive tokens instead of borrowing another component's token).
- **Duplicate implementations found:** none. `PxCreateEditFooter` is a new, pattern-owned component (not a duplicate of `ModalFooter`) because their geometry and elevation genuinely differ, as documented in its header comment.
- **Unresolved API or token gaps:** the `Textarea` component-token gap above. The Wizard sidebar width (240px) and content-pane placement, the Accordion example frame's missing sub-header/footer, and the stale Wizard layer name are documented Figma-side corrections needed, not gaps in this implementation.
