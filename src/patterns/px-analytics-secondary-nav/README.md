# PxAnalyticsSecondaryNav

**Status:** **Visual Review: Approved** · **Approved for AI use: Yes** · **Approval date: 2026-08-29**. The design owner visually verified the expanded navigation, the selected-row tint, the collapsed variant, the collapse/expand control, and the collapsed-rail hover/focus flyout (including item selection from it) — see `ai/shell-registry.md` and `ai/figma-coverage.json` for the recorded approval evidence. This approval covers `PxAnalyticsSecondaryNav` only; it does not newly approve `DropdownMenu`, `Accordion`, `IconButton`, or any other shared component this pattern composes — their own approval status is unchanged.

## Purpose

A fixed-width (312px), full-height, non-scrolling vertical navigation panel listing Analytics sub-pages, grouped into independently-collapsible sections, with its own collapse/expand control. It sits beside the primary `PxShellRail` (typically collapsed, 48px) as a sibling column inside `PxMainContainer`'s content row — exactly analogous to how `PxListShell` places its `filterSlider` beside `<main>`.

## Figma sources

| Frame | Node ID | Note |
| --- | --- | --- |
| Secondary Left Navigation - Analytics (frame with both variants) | `9576:15005` | **Authoritative source for collapse/expand** — the design owner updated this frame directly; supersedes an earlier revision's guesswork. |
| Property 1=Expanded (symbol) | `3397:2451` | 312×664. Default variant. |
| Property 1=Collapsed (symbol) | `9576:15105` | 56×664. |
| Title (row, inside the Expanded symbol) | `9576:16007` | "All Reports" text + the collapse button — see "Collapse and expand" below. |
| Shell/Analytics/Secondary-Left Navigation 🟢 (page) | `3351:3925` | Owning page for the pre-collapse/expand anatomy (sections, rows, tokens). |
| Analytics Left Navigation AI Instructions | `4214:33403` | Purpose/states/tokens/sizing/accessibility prose (sections/rows only — predates collapse/expand). |
| Analytics Left Navigation Dos and Don'ts | `4214:33428` | Do/Don't rules (sections/rows only). |
| Shell/Nav+SecNav (MainContainer variant) | `4191:21173` | Verified: instances this same component beside a collapsed (48px) primary rail. |
| icons/filled/chevron-leftmenu-collapse-filled (`491:83`) / -expand-filled (`491:82`) | — | The collapse/expand glyphs, used exactly as Figma shows them (permanently-filled blue circle, not a hover-only treatment). |

All node IDs MCP-verified live — see `ai/figma-coverage.json`'s `shell-analytics-secondary-nav` entry. Full design-system docs page: `src/docs/docs/px-analytics-secondary-nav.doc.ts` (Design System Docs → Navigation).

## Anatomy

```
PxAnalyticsSecondaryNav — expanded (default; 312px, full height, own right border, no scroll of its own)
├── Title row (node 9576:16007): `title` text (16px/24px semibold — --t-font-heading-small-*)
│   on the left, a 24x24 collapse IconButton on the right, 16px padding (--p-space-200), justify-between
└── one <Accordion> wrapper per section (independent open state, NOT one exclusive group)
    └── <AccordionItem type="on-material" size={48} contentPadding={false}>
        ├── icon (24px) + label (semibold 14px) + chevron — unmodified
        └── one NavRow per sub-page — real <a href> when the item has one, otherwise <button>
            (see "Semantic decision" below — NOT Tree/TreeItem)

PxAnalyticsSecondaryNav — collapsed (56px wide, full height)
├── 56px expand-button cell (chevron-leftmenu-expand-filled)
└── one 56x56 CollapsedSectionRow per section, in section order (node 9576:16362) —
    hover or focus opens a DropdownMenu flyout (node 9576:17185) listing that section's
    items; click/Enter calls the same onSelectItem as the expanded rows (see
    "Collapsed-menu hover flyout" below)
```

Fixed section order (per product workflow, "do not reorder without product sign-off"): **Favorites → Audience → Features → Engagement** (the first section was renamed from "Reports" to "Favorites" when the design owner updated the frame — the panel-level `title` ["All Reports"] now carries the "Reports" naming instead).

## API

```ts
type PxAnalyticsNavItem = { id: string; label: string; href?: string }
type PxAnalyticsNavSection = { id: string; label: string; icon: PrismIconName; items: PxAnalyticsNavItem[] }

type PxAnalyticsSecondaryNavProps = {
  title: string                       // panel title, e.g. "All Reports" — node 9576:16007
  sections: PxAnalyticsNavSection[]
  activeItemId?: string
  onSelectItem: (itemId: string, sectionId: string) => void
  openSectionIds?: string[]           // omit to let the component manage it (defaults: all open)
  onOpenSectionIdsChange?: (ids: string[]) => void
  collapsed?: boolean                 // omit to let the component manage it (see defaultCollapsed)
  defaultCollapsed?: boolean          // default false (expanded), per Figma's default variant
  onCollapsedChange?: (collapsed: boolean) => void
  className?: string                  // placement only
}
```

The API is semantic — title, sections, items, selection, callbacks, collapse — never raw visual configuration. `href` is optional per item: supply it when your app has a real route for that sub-page (renders a real `<a>`); omit it when selection only changes local application state (renders a `<button>`). `collapsed`/`openSectionIds`/`activeItemId` are three fully independent state slices — collapsing/expanding never resets section-open or selected-item state, by construction (the component never unmounts, it only conditionally renders a different subtree of the same instance).

## Semantic decision: navigation rows, not a tree

**This is a corrected decision.** An earlier revision of this component reused the shared `Tree`/`TreeItem` primitive for the sub-page rows, for visual convenience. That was wrong: Figma's AI Instructions specify `role="menuitem"/"link"` + `aria-current="page"`, not `role="tree"/"treeitem"` + `aria-selected`; and reusing `Tree` would have required a breaking, non-opt-in keyboard-focusability change to every `TreeItem` in the repo. `tree.tsx` is **fully reverted** to its original, pre-existing state.

**Resolution:** rows render as real navigation elements — real `<a href={item.href}>` when the item supplies a destination URL, otherwise `<button type="button">` (matching `PxShellRail`'s own primary-nav precedent) — both with `aria-current="page"` on the active row, native Tab order (no roving `tabindex`), and focus restoration to a section's own header if a collapse removes the row that held focus.

## Selected-row colour — accepted by design owner

The active row's light tint background is **confirmed token-driven**: `bg-[var(--c-tree-branch-selected)]` in `NavRow` — not a hard-coded hex. **Design owner reviewed and accepted this as visually correct**, explicitly declining the primary-blue alternative the AI-instructions prose had named. Kept unchanged. See Deviation Ledger #2.

## Scroll ownership — resolved by design-owner decision

**This panel never scrolls independently and never acquires its own scrollbar.** Implemented as `overflow-hidden` on the panel's outer `<nav>` (not `overflow-y-auto`) — clips rather than scrolls or spills into the content area. Only the caller's own content area scrolls (`overflow-auto`, unchanged). Scoped entirely to `PxAnalyticsSecondaryNav.tsx`'s own className — `PxMainContainer`, `PxListShell`, `PxCreateEditShell`, and `user-explorer.tsx` have zero lines changed, re-verified live.

## Collapse and expand — a design-owner extension, now matched exactly to an authoritative Figma update

**This is a NEW requirement, added after the original Analytics Figma frame was authored.** The design owner subsequently updated the actual Figma frame (`9576:15005`) to show both variants directly — that update is now the authoritative source for this feature's icon and placement, superseding an earlier, unconfirmed guess (which used the wrong icon and the wrong placement — both corrected below against the live frame, not guessed again).

**Icon — corrected.** The collapse/expand glyph uses `IconButton`'s new `iconStyle="filled"` to render `chevron-leftmenu-collapse-filled` / `-expand-filled` directly — the exact same asset as Figma node `491:83`, wired into the sized icon folder at `src/assets/icons/filled/24/`. These assets bake in a **permanent** blue circle + white chevron (not a hover-only treatment) — confirmed against the actual updated Figma frame, which renders the button blue at rest, not just on hover. This matches an existing, established repo precedent: `success-filled`/`warning-filled`/`danger-filled`/`information-filled` all bake in a fixed colour the same way. No new SVG was drawn, no icon path was hard-coded. The earlier revision's `IconButton` `variant="primary"` (a token-driven hover-only blue) is **reverted** — unnecessary now that the icon itself supplies the colour, and it does not match Figma's actual (permanently-coloured) rendering.

**Placement — corrected.** The design owner's updated frame shows a dedicated **Title row** (node `9576:16007`) at the very top of the panel — "All Reports" text on the left, the 24×24 collapse button on the right, `justify-between`, 16px padding. This is a NEW panel-level `title` prop, not a slot on any accordion section. The earlier revision's guess (embedding the button in the first accordion's own header via a new `trailing` prop) is **reverted** — that `AccordionItem` extension has been fully removed, since the real anatomy needs no such slot.

**Collapsed state — corrected.** The design owner's frame (`9576:15105`) shows a full **56px icon rail**, not a lone button: a 24×24 expand button at the top, followed by one 24px decorative icon per section (in section order), 24px gaps, all centered, 16px vertical padding. Implemented exactly. This supersedes an earlier "no persistent mini-rail" avoidance — that reasoning applied only in the absence of Figma evidence for this feature; this frame is that evidence, supplied directly by the design owner. The per-section icons carry no interaction (Figma shows none) and are marked `aria-hidden` (decorative only).

**Expanded state:**
- The button sits in the Title row, `aria-label="Collapse secondary navigation"`, `aria-expanded={true}`, `aria-controls` pointing at the nav panel's own `id`.
- Clicking it collapses **only** this panel — the 48px primary rail is untouched (separate component, never conditionally hidden by `PxMainContainer`).

**Collapsed state:**
- The entire panel (title, every accordion, every row) is removed from the DOM, the tab order, and the accessibility tree (a plain conditional `return`).
- The icon rail remains: `aria-label="Expand secondary navigation"`, `aria-expanded={false}`, same `aria-controls`.
- Clicking the expand button restores the panel with its **prior** section-open and selected-item state untouched.

**Focus management (verified, not assumed):** collapsing moves focus to the (newly-mounted) expand button; expanding moves focus back to the (newly-mounted) collapse button — unconditional, since the only way to reach either toggle is by activating the currently-visible button, which is always the element about to unmount.

**State ownership:** `collapsed` is a fully independent state slice from `openSectionIds`/`activeItemId` — same component instance, same hooks, never reset by the other.

**`PxMainContainer`: no change needed.** Verified: `src/patterns/px-main-container/PxMainContainer.tsx` has zero lines changed.

## Collapsed-menu hover flyout — a further Figma-evidenced extension

**Request:** "When the menu is collapsed and we hover on the menu item [it] will show the respective accordion content ... as a fly out and click on that will load the respective page." The design owner supplied a direct Figma frame for this behaviour: **"Collapsed Menu Hover behaviour" (`9576:17226`)**, instancing the collapsed rail symbol (`9576:16362`) plus an absolutely-positioned **FlyOut** frame (`9576:17185`) showing the hovered section's items flush against the rail's right edge.

**Reuse decision:** the FlyOut's own tokens (`dropdown/menu/background`, `dropdown/menu/item/*`, and a shadow matching `--e-shadow-500`) are an **exact match** for this repo's existing, already-approved `DropdownMenu`/`DropdownMenuTrigger`/`DropdownMenuContent`/`DropdownMenuItem` (`src/components/ui/dropdown-menu.tsx`, `--c-dropdown-menu-*` token family) — reused directly rather than building a bespoke overlay. `dropdown-menu.tsx` itself is **unmodified**, only newly consumed.

**Anatomy correction (superseding an earlier, simpler reading):** frame `9576:16362` is a more detailed anatomy spec than the plain `Property 1=Collapsed` symbol used for the base collapsed rail — each section icon sits in its own **56×56px cell** (`h-14 w-full items-center justify-center`, no gap, no outer padding), not a bare 24px icon with 24px gaps. The hovered/active cell's background is `--s-color-surface-selected` (`#E9F8FA`), an existing semantic token — no new token needed.

**Behaviour:**
- Hovering **or focusing** a section's 56×56 cell opens a flyout listing that section's items (same `sections[].items` data as the expanded accordion — no separate data model).
- Clicking (or Enter-selecting) an item calls the same `onSelectItem(itemId, sectionId)` callback the expanded rows use — it does **not** expand the panel (Figma doesn't show that, and it wasn't requested).
- Only one flyout is open at a time; state (`openFlyoutId`) lives on the **parent** `PxAnalyticsSecondaryNav`, not per-row, so opening one section's flyout always closes any other.
- A short (150ms) close-delay lets the pointer travel diagonally from the icon into the flyout without it closing first — WCAG 1.4.13 **Hoverable**. The flyout stays open until dismissed by mouse-leave, blur, Escape, an outside click, or a selection — **Persistent**. Escape (Radix's own handling), moving focus away, or clicking outside all close it — **Dismissible**.
- `modal={false}` on the `DropdownMenu` root: a hover-triggered flyout must not trap focus or disable pointer events elsewhere on the page the way a click-opened modal menu would.

**Keyboard-reopen guard (a real bug found and fixed during verification):** Radix returns focus to the trigger button whenever its content closes (`onCloseAutoFocus`'s default behavior) — for **every** close path (Escape, outside click, item select, and this row's own hover/blur-driven close), not just one of them. Without a guard, that synthetic refocus immediately re-fires the trigger's `onFocus` handler and reopens the flyout, making every close path silently no-op. Fixed by watching the `open` prop itself in an effect (not gating inside individual close handlers, which only caught some paths): when `open` flips `true → false`, a `suppressReopenRef` blocks `onOpenIntent` for 300ms — long enough to outlast Radix's exit-animation (~150ms) before the focus-return actually happens, verified via live instrumentation, not assumed.

**Verified live (mouse and keyboard, this round):**
- Hover open/close, including the delayed close after moving the pointer away.
- Tab-to-focus opens the flyout; Tab away or Escape closes it and returns focus to the trigger (`aria-label`d section button).
- Mutual exclusion: Tabbing from one section's open flyout to the next section's trigger opens the new one and closes the old one.
- `ArrowDown`/`ArrowUp` roving focus and `Enter` selection inside an open flyout (standard Radix menu keyboard model — unmodified) correctly call `onSelectItem` and close the flyout.
- No regression in any other `DropdownMenu` consumer (`engagements-list-example.tsx`, `user-explorer.tsx`, `modal.tsx`, `PxFilterSlider.tsx`, `PxHeader.tsx`, `banner.tsx`, `table-customization-menu.tsx`, `date-filter.tsx`, `chip.tsx`, `third-pane.tsx`, `file-uploader.tsx`, `filter-config-modal.tsx`, `filter-dropdown-panel.tsx`) — `dropdown-menu.tsx` itself has zero lines changed.

### Manual regression verification log (no component-interaction harness exists in this repo)

This repository has no React component-interaction test runner (no `vitest`/`jest`/`@testing-library/react`/Playwright/Cypress — only plain `node --test` scripts validating JSON/token logic, see `tests/figma-coverage/`, `tests/token-guardrails/`). Per repo direction, one was **not** introduced solely to cover this timing-sensitive flyout behaviour. Instead, the exact interaction sequence below was executed live (real browser, real DOM events, state read directly from `document.activeElement`/`getComputedStyle`/`data-state`, not just screenshots) and must be re-run by hand after any future change to `PxAnalyticsSecondaryNav.tsx`'s flyout logic (`openFlyout`, `scheduleCloseFlyout`, `closeFlyoutNow`, `CollapsedSectionRow`'s `suppressReopenRef` effect):

1. **Escape closes without reopening.** Collapse the panel → `Tab` to a section icon (flyout opens, confirm `[role="menu"][data-state="open"]` exists) → press `Escape` → confirm the menu element is fully removed from the DOM (not just `data-state="closed"`) and `document.activeElement` is the section's own trigger button. Re-check after an additional 1s wait — must still be closed (catches the suppression-window-too-short regression).
2. **Item selection closes without reopening.** With a flyout open, `ArrowDown` to an item, press `Enter` → confirm the menu unmounts, `onSelectItem` fired (content area / `activeItemId` updated to the selected item), and it stays closed after a 1s wait.
3. **Moving focus to another collapsed section opens only that section.** With one section's flyout open, press `Tab` → confirm `document.querySelectorAll('[role="menu"]')` returns exactly **one** element, and it belongs to the newly-focused section (check its item text), not the previous one.
4. **Collapse/expand preserves selection and section state.** Expand the panel, select a non-default item in one section (e.g. "Funnel"), close a different section's accordion (e.g. "Features"), collapse the panel, then expand it again → confirm the previously-selected item is still active (highlighted, content area shows it) and the previously-closed section is still closed — both survive the round trip, since the component never unmounts, it only conditionally renders a different subtree of the same instance.
5. **Hover-away close, independent of keyboard.** Hover a section icon (flyout opens), move the pointer to a neutral point on the page, wait >150ms → confirm the flyout closes and stays closed (catches a regression where the close-then-focus-return loop was only fixed for the `onOpenChange`-driven paths and not the plain hover-timeout path — the actual bug found and fixed this round, see "Keyboard-reopen guard" above).

All five were executed and passed on 2026-08-29 against the current implementation (post-fix). Steps 1, 2, and 5 are the ones the 300ms `suppressReopenRef` window directly protects — if a future change reduces or removes that window, re-running step 1 or 5 with an added `wait(400)` before the final check is the fastest way to catch the regression.

## Composition rules

1. Render this as a **sibling of `<main>`** inside `PxMainContainer`'s content row, positioned **before** the main content:
   ```tsx
   <PxMainContainer nav={nav} header={header}>
     <PxAnalyticsSecondaryNav title="All Reports" sections={sections} activeItemId={activeItemId} onSelectItem={onSelectItem} />
     <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto p-[var(--p-space-300)]">
       {children}
     </main>
   </PxMainContainer>
   ```
2. Never render `PxShellRail`, `PxHeader`, or a second copy of this component as siblings outside `PxMainContainer`.
3. Never re-add page padding around this component — edge-to-edge inside the content row by design.
4. Never re-add `overflow-y-auto`/scrolling to this component — see "Scroll ownership" above.
5. This is unrelated to `PxHeader`'s "Secondary Bar" — coincidental naming only.

## Dos and Don'ts

- **Do** use `type="on-material"` for every section's Accordion — never off-material/off-material-shadow inside this nav.
- **Do** supply `href` on any item with a real destination URL.
- **Do** mark exactly one item as active (`activeItemId`) — never multiple.
- **Do** let the content area own scrolling — never this panel.
- **Do** render the collapsed state as the full icon rail Figma specifies (expand button + one icon per section) — not a lone button.
- **Don't** mix section open states on first load — all sections default to open.
- **Don't** grow any single section past ~6 items without product sign-off.
- **Don't** reorder the sections without product sign-off.
- **Don't** add `role="menuitem"` to a row outside a real `role="menu"` container.
- **Don't** couple `collapsed` to `openSectionIds`/Accordion state.

## Deviation ledger

| # | Figma evidence | Implementation | Classification | Approval required? |
| --- | --- | --- | --- | --- |
| 1 | AI Instructions: 312px width "matches the expanded (240px) Left Navigation inner content width." | 312px width, implemented exactly. Real geometry shows a collapsed (48px) rail, not expanded. | Real discrepancy, in Figma's prose only — the implemented value already matches geometry. | No. |
| 2 | AI Instructions: active item fill = `color/action/primary/default` (`#0369E9`). | `--c-tree-branch-selected` (light tint), `Tree`'s own selected token. | **ACCEPTED BY DESIGN OWNER.** Confirmed token-driven, not hard-coded. | No — resolved. |
| 3 | AI Instructions: on-material header horizontal padding should bind `--c-accordion-padding-on-material` (8px). | Corrected in `AccordionItem`, scoped to `type="on-material"`. Verified no effect on the approved `PxCreateEditShellAccordion` (default off-material). | Real discrepancy, resolved. | No. |
| 4 | AI Instructions: "scrolls as part of the Left Navigation column... does not scroll independently." | **RESOLVED BY DESIGN-OWNER DECISION** — `overflow-hidden`, only the content area scrolls. | Design-owner decision recorded. | No. |
| 5 | AI Instructions/anatomy reference an icon named `FeaturePX`. | Confirmed via exact vector-path comparison; wired into `src/assets/icons/24/feature-px.svg`. | Resolved — missing wiring step. | No. |
| 6 | AI Instructions: `role="menuitem"`/`role="link"` + `aria-current="page"`. | Real `<a>`/`<button>` + `aria-current`. | Resolved to match Figma exactly. | No. |
| 7 | Frame `9576:15005` (design owner's own update) — Title row `9576:16007` + Collapsed rail `9576:15105`, icons `491:83`/`491:82`. | Title row with `title` prop + collapse button; 56px icon rail when collapsed; `chevron-leftmenu-*-filled` icons via `IconStyle="filled"`. | **New design-owner extension, now implemented directly against authoritative Figma evidence** — an earlier revision's icon and placement were both wrong (guessed without this frame) and are corrected here. | No — implemented exactly as shown. |
| 8 | Frame `9576:17226` ("Collapsed Menu Hover behaviour") — collapsed symbol `9576:16362` + FlyOut `9576:17185`. | Each collapsed-rail section icon is a 56×56 `DropdownMenu` trigger; hover/focus opens a flyout of that section's items, reusing `DropdownMenu`/`DropdownMenuItem` directly (exact token match). | **New design-owner extension, implemented directly against the supplied Figma frame.** Superseded the earlier, simpler collapsed-cell reading (24px icon + gaps) with the more detailed 56×56-cell anatomy this frame confirms. | No — implemented exactly as shown. |

**Summary: 0 open items.** Every deviation is resolved, accepted, or implemented exactly as the design owner's updated Figma frame specifies.

## Token and asset reuse (not a cross-component override)

`NavRow` reuses `Tree`'s row-level tokens (`--c-tree-branch-*`, `--t-tree-font-default-*`) directly — Figma's own Tree/Item symbols define this row's visual recipe; only the component wrapper (and its treeitem role) was dropped, not the tokens. The collapse/expand control reuses the exact Figma-sourced filled-chevron assets (permanently-coloured, matching this repo's existing filled-icon precedent) rather than inventing a new colour treatment.

## `IconButton` API extension (icon-button.tsx)

- `iconStyle?: "line" | "filled"` (default `"line"`, unchanged for every existing consumer) — passed straight through to `PrismIcon`. Needed because the collapse/expand glyphs are published only in the filled set.
- `React.forwardRef` (purely additive — no existing consumer passes a `ref` today) so the collapse/expand control can move focus to the counterpart button on toggle.
- The earlier `variant="primary"` prop (added, then reverted this pass) is gone — the icon itself now supplies all the colour, so no button-level colour variant is needed.

## `accordion.tsx` — fully reverted to its pre-`trailing` state

An earlier revision added a `trailing?: React.ReactNode` prop to `AccordionItem` to host the collapse button inside the first section's header. That was based on a guessed placement; the design owner's actual updated frame shows a dedicated Title row instead, which needs no such slot. `trailing` has been **fully removed** — `accordion.tsx` is back to exactly its state before that extension (only the earlier, independently-verified `contentPadding` prop and on-material padding fix remain).

## `tree.tsx` — fully reverted, no changes

`tree.tsx` is byte-for-byte its original, pre-existing state. This pattern does not use `Tree`/`TreeItem`.

## Component dependencies

- `Accordion`, `AccordionItem` (`src/components/ui/accordion.tsx`) — extended with `contentPadding` and the on-material padding fix only (no `trailing`).
- `IconButton` (`src/components/ui/icon-button.tsx`) — extended with `iconStyle` and `forwardRef` (no `variant`).
- `PrismIcon` (via `AccordionItem`'s `icon` prop, `IconButton`'s glyph, and the collapsed rail's section icons) — unmodified; resolves `feature-px` and the filled chevrons from the sized icon set.
- `DropdownMenu`/`DropdownMenuTrigger`/`DropdownMenuContent`/`DropdownMenuItem` (`src/components/ui/dropdown-menu.tsx`) — **unmodified**, newly consumed for the collapsed-rail hover flyout.
- `Tree`/`TreeItem` (`src/components/ui/tree.tsx`) — **not used**, unmodified.

## Component Composition Audit

- **Approved components reused:** `Accordion`, `AccordionItem`, `IconButton`, `PrismIcon`, `DropdownMenu`/`DropdownMenuTrigger`/`DropdownMenuContent`/`DropdownMenuItem`.
- **New components created:** `PxAnalyticsSecondaryNav` (pattern), its internal `NavRow` row renderer, and its internal `CollapsedSectionRow` (collapsed-rail hover-flyout trigger).
- **Native interactive elements introduced:** `<a>`/`<button>` row elements (see "Semantic decision"); a plain `<button>` per collapsed-rail cell (the `DropdownMenuTrigger`).
- **`className` overrides on approved components:** none — `DropdownMenuContent`'s `className="w-max min-w-[160px]"` sets flyout width only (no visual-recipe override; matches the pattern's own existing placement-only convention).
- **Cross-component token references:** `NavRow` reuses `Tree`'s row-level tokens directly (deliberate, see "Token and asset reuse").
- **Duplicate implementations found:** none — the flyout reuses `DropdownMenu` rather than building a bespoke overlay (see "Collapsed-menu hover flyout").
- **Unresolved API or token gaps:** none. Every item in the Deviation Ledger is resolved, accepted, or implemented exactly per the design owner's own Figma update.
