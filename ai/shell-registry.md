# PX Shell Registry

Authoritative list of reusable PX page shells extracted from Figma into this repository. Every new list-, master-, form-, or dashboard-style PX screen **must** start from one of these shells before adding page-specific content.

| Shell | Purpose | Figma source | Implementation | Example | Visual review | Approved |
| --- | --- | --- | --- | --- | --- | --- |
| `PxListShell` | Two-bar header + left rail + content region + optional 336 px right filter slider. For any list-driven PX page (Audiences, Accounts, Segments, Engagements, Feature Adoption). | [Shell/MainContainer 3792-8575](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=3792-8575), [Page Header 1273-19](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=1273-19), [Filter Panel 20-36](https://www.figma.com/design/U3D8WMBVFl9LvAZyLHhm24/Prism-V1---ShadCN?node-id=20-36) | [`src/patterns/px-list-shell/PxListShell.tsx`](../src/patterns/px-list-shell/PxListShell.tsx) | [`src/pages/engagements-list-example.tsx`](../src/pages/engagements-list-example.tsx) — rendered when the `engagements` rail item is selected | Pending | No |

## Legend

- **Visual review**: Pending / In review / Approved. Do not mark Approved without explicit sign-off from the design owner.
- **Approved**: `Yes` means the shell is production-safe; `No` means it may only be used behind the Validation Gallery or as a demo route.

## Adding a new shell

1. Extract the Figma frame using `get_metadata` + `get_design_context` (see `CLAUDE.md`).
2. Reuse existing components (`src/components/ui`) — never recreate an approved component.
3. Place the shell under `src/patterns/<shell-name>/` with `<ShellName>.tsx`, `types.ts`, `index.ts`, and `README.md`.
4. Provide one example page under `src/pages/` proving the shell composes.
5. Add a row here and add a rule to `CLAUDE.md` telling Claude to reuse the shell for that page type.
