# PX Shell Registry

Authoritative list of reusable PX page shells extracted from Figma into this repository. Every new list-, master-, form-, or dashboard-style PX screen **must** start from one of these shells before adding page-specific content.

| Shell | Purpose | Figma source | Implementation | Example | Visual review | Approved |
| --- | --- | --- | --- | --- | --- | --- |
| `PxListShell` | Two-bar header + left rail + content region + optional 336 px right filter slider. For any list-driven PX page (Audiences, Accounts, Segments, Engagements, Feature Adoption). | [Shell/MainContainer 3792-8575](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=3792-8575), [Page Header 1273-19](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=1273-19), [Filter Panel 20-36](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=20-36) | [`src/patterns/px-list-shell/PxListShell.tsx`](../src/patterns/px-list-shell/PxListShell.tsx) | [`src/pages/engagements-list-example.tsx`](../src/pages/engagements-list-example.tsx) — rendered when the `engagements` rail item is selected | Approved (design owner, 2026-08-27) | Yes |
| `PxCreateEditShell` (Modal / Accordion / Wizard) | Three record-creation/edit tiers: `PxCreateEditShellModal` (≤6 fields), `PxCreateEditShellAccordion` (independent multi-section, full-page), `PxCreateEditShellWizard` (step-dependent, full-page). The Accordion/Wizard tiers compose `PxMainContainer` directly (rail + header stay visible) — not `PxListShell`, so they never inherit its filter-slider slot or list-page semantics. | [Shell/Create · Edit Form 3187-10](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=3187-10), [Popup example 3796-2503](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=3796-2503), [Accordion example 3796-2504](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=3796-2504), [Wizard example 3802-3615](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=3802-3615) (Figma layer name says "Accordion" — content/position confirm this is the Wizard tier) | [`src/patterns/px-create-edit-shell/`](../src/patterns/px-create-edit-shell/) | [`src/pages/create-edit-shell-example.tsx`](../src/pages/create-edit-shell-example.tsx) — also embedded live in the Validation Gallery's "Create · Edit Shell" section | Approved (design owner, 2026-08-28) | Yes |

**`PxMainContainer`** (`src/patterns/px-main-container`) is the shared rail+header+content-row foundation both rows above compose — it is deliberately **not** listed as its own row here, since no screen starts from it directly (see its own README's "Registry status" section for why).

## Design-owner approval history

- **2026-08-27** — `PxListShell` approved as production-safe.
- **2026-08-28** — `PxCreateEditShell` (all three tiers — Modal, Accordion, Wizard) approved as production-safe, after a design review that corrected: Accordion's expanded-row hover scope and 24px subtitle-to-content gap, on-material's lack of a special background/container, and Modal's header separation (no border/shadow), 4px title-to-microcopy gap, microcopy typography/colour tokens, and 272px/184px minimum heights. Verified live: header height 72px (with microcopy) / 56px (without), 24px left/right header padding, both exact. See [`src/components/ui/accordion.tsx`](../src/components/ui/accordion.tsx) and [`src/components/ui/modal.tsx`](../src/components/ui/modal.tsx) for the corrected implementation, and [`src/docs/docs/accordion.doc.ts`](../src/docs/docs/accordion.doc.ts) / [`src/docs/docs/modal.doc.ts`](../src/docs/docs/modal.doc.ts) for the corrected documentation. `PxListShell` was not part of this design review and remains approved as of 2026-08-27.

## Legend

- **Visual review**: Pending / In review / Approved. Do not mark Approved without explicit sign-off from the design owner.
- **Approved**: `Yes` means the shell is production-safe; `No` means it may only be used behind the Validation Gallery or as a demo route.

## Adding a new shell

1. Extract the Figma frame using `get_metadata` + `get_design_context` (see `CLAUDE.md`).
2. Reuse existing components (`src/components/ui`) — never recreate an approved component.
3. Place the shell under `src/patterns/<shell-name>/` with `<ShellName>.tsx`, `types.ts`, `index.ts`, and `README.md`.
4. Provide one example page under `src/pages/` proving the shell composes.
5. Add a row here and add a rule to `CLAUDE.md` telling Claude to reuse the shell for that page type.
