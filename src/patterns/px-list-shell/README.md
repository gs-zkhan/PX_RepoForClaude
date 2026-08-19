# PxListShell

**Status:** extracted, implemented, pending visual review

## Purpose

`PxListShell` is the outermost layout for PX list-type pages — the container that composes:

- the shared left rail (`PxShellRail`)
- the two-bar Page Header (module name + PEC + utilities + optional back/title/tabs/actions)
- the main content region with 24 px page padding
- an optional right-side 336 px filter panel

Use it whenever a PX screen is dominated by a single tabular list, master surface, or filterable dataset — Audience Explorer, Engagements, Segments, Accounts, Feature Adoption, etc.

**Do not use** for modals, drawers, or full-canvas dashboards where the two-bar header is not present. For those cases keep the shell but pass `showSecondary={false}` on the header, or use a different pattern.

## Figma sources

| Frame | Node ID |
| --- | --- |
| Shell / MainContainer 🟢 | `3792:8575` |
| Shell / Page Header & Title 🟢 | `1273:19` |
| Shell / Filter Panel 🟢 | `20:36` |
| Assembled reference — Shell/ListPage | `7306:20074` |

## Anatomy

```
PxListShell
├── PxShellRail          — left nav (existing, reused as-is)
└── main column
    ├── PxHeader         — 96 px (Primary 48 + Secondary 48), shadow-100
    │   ├── Primary Bar
    │   │   ├── moduleName            (LHS)
    │   │   ├── primaryCenter slot    (PEC context switcher, centred)
    │   │   ├── primaryUtilities[]    (IconButton list)
    │   │   └── avatar slot           (right-most)
    │   └── Secondary Bar (optional)
    │       ├── onBack? · title · onEditTitle? · titleChip   (LHS)
    │       ├── tabs (centred, badge-capable)
    │       ├── secondaryUtilities[]  (IconButton list)
    │       ├── divider (20 px)
    │       └── secondaryActions[]    (Button — last = primary)
    └── content row
        ├── main (children)           — flex-1, flex-col, overflow-hidden, p-space/300 (see "Scrolling" below)
        └── filterSlider slot         — 336 px right pane, optional
```

## Scrolling

`main` no longer scrolls itself — it's `overflow-hidden` and a flex column, so `children` must fill its height (`h-full` on your page's outermost element) and own its own internal scroll. This matches Figma: the table's title bar, any Filter Bar/Filter Slider, and pagination all stay fixed in place — only the table **rows** scroll.

The pattern used by both Engagements and Audience Explorer:

```tsx
<section className="flex h-full flex-col overflow-hidden ...">
  {/* title bar — shrink-0, always visible */}
  <div className="shrink-0">...</div>

  {/* optional Filter Bar — shrink-0, always visible */}
  {filterBarOpen && <FilterBar ... />}

  <div className="flex min-h-0 flex-1">
    {/* table column */}
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Table>
          <TableHeader>...</TableHeader> {/* sticky top-0, built into the component */}
          <TableBody>...</TableBody>
        </Table>
      </div>
      <Pagination ... /> {/* shrink-0, always visible */}
    </div>

    {/* optional Filter Slider — shrink-0, fixed 772px, always visible */}
    {filterOpen && <PxFilterSlider ... />}
  </div>
</section>
```

`TableHeader` is `sticky top-0 z-10` by default (built into `src/components/ui/table.tsx`), so it stays pinned as long as its nearest scrolling ancestor is the `overflow-y-auto` div directly wrapping `<Table>` — not `main` itself.

## Props / slots

Full types live in [`types.ts`](./types.ts). Summary:

| Prop | Type | Role |
| --- | --- | --- |
| `nav.activeKey`   | `PxShellNavKey` | active rail item |
| `nav.onNavigate`  | `(key) => void` | rail selection callback |
| `header.moduleName`      | `string`         | primary bar title (18/24/600) |
| `header.primaryCenter`   | `ReactNode`      | PEC slot in primary bar |
| `header.primaryUtilities`| `PxHeaderUtility[]` | primary-bar icon buttons |
| `header.avatar`          | `ReactNode`      | right-most primary slot |
| `header.showSecondary`   | `boolean?`       | force-show the secondary bar |
| `header.onBack`          | `() => void`     | back arrow |
| `header.title`           | `string`         | secondary-bar page/record title |
| `header.onEditTitle`     | `() => void`     | edit-pencil handler |
| `header.titleChip`       | `ReactNode`      | chip after the title |
| `header.tabs`            | `PxHeaderTab[]`  | centred tabs with optional `badge` |
| `header.activeTabId`     | `string`         | selected tab id |
| `header.onTabChange`     | `(id) => void`   | tab selection callback |
| `header.secondaryUtilities` | `PxHeaderUtility[]` | secondary-bar icon buttons |
| `header.secondaryActions`   | `PxHeaderAction[]`  | right-side pill buttons (last defaults to primary) |
| `filterSlider`   | `ReactNode`      | optional right 336 px `<PxFilterSlider>` |
| `children`       | `ReactNode`      | page content (padding is handled by the shell) |

## Usage

```tsx
import { PxListShell, PxFilterSlider } from "@/patterns/px-list-shell"

export function AccountsList() {
  const [nav, setNav] = React.useState<PxShellNavKey>("audience")
  const [tab, setTab] = React.useState("all")

  return (
    <PxListShell
      nav={{ activeKey: nav, onNavigate: setNav }}
      header={{
        moduleName: "Accounts",
        primaryCenter: <PecSwitcher />,
        primaryUtilities: [
          { id: "messages", icon: "bubble",    label: "Messages" },
          { id: "apps",     icon: "dashboard", label: "Apps"     },
        ],
        avatar: <Avatar size="medium"><AvatarFallback>ZK</AvatarFallback></Avatar>,
        title: "All accounts",
        tabs: [
          { id: "all",      label: "All",      badge: 248 },
          { id: "active",   label: "Active",   badge: 191 },
          { id: "inactive", label: "Inactive", badge: 57  },
        ],
        activeTabId: tab,
        onTabChange: setTab,
        secondaryActions: [
          { id: "export", label: "Export",      variant: "secondary" },
          { id: "new",    label: "New account", icon: "add" },
        ],
      }}
      filterSlider={
        <PxFilterSlider canApply={false} onAddFilter={() => setFilterOpen(true)} />
      }
    >
      <MyAccountsTable />
    </PxListShell>
  )
}
```

## Supported states

- **Primary-only header** — omit every secondary field; the secondary bar is not rendered.
- **Full two-bar header** — pass any secondary prop (`title`, `tabs`, `secondaryActions`, `onBack`, …).
- **Filter slider open** — pass a `<PxFilterSlider>` node; content column narrows automatically.
- **Filter slider empty** — pass `<PxFilterSlider onAddFilter={…} />` with no children.
- **Filter slider with rows** — pass filter row children to `<PxFilterSlider>`.

## Design rules

1. Never render `PxShellRail` or `PxHeader` alongside `<PxListShell>` — the shell already includes both.
2. Never re-apply page padding inside `children` — the shell adds 24 px on all four sides.
3. Overlays (Modal, Drawer, Third Pane) are siblings of the shell, not `children`.
4. Never override the visual recipe of `Button`, `IconButton`, or `Avatar` from inside a screen that uses the shell.
5. The Primary Bar is mandatory. The Secondary Bar auto-shows only when a secondary prop is set.
6. Filter Slider width is fixed at 336 px — do not customise.

## Token dependencies

Colours: `--s-color-surface-page`, `--s-color-surface-default`, `--s-color-line-default`, `--s-color-text-default`, `--s-color-text-subtle`, `--s-color-text-selected`, `--s-color-line-brand`, `--s-color-surface-selected`, `--s-color-surface-sunken`.

Spacing: `--p-space-100`, `--p-space-200`, `--p-space-300`.

Radius: `--p-radius-100`, `--p-radius-150`, `--p-radius-full`.

Typography: `--p-font-size-h4/h5/h6/h7`, matching line-heights, `--p-font-weight-regular/medium/semi-bold`.

Effect: `--e-shadow-100`, `--e-shadow-focus`.

## Component dependencies (all reused)

- `PxShellRail` (`src/components/px-shell-rail.tsx`)
- `IconButton`, `Button`, `PrismIcon`, `Avatar`, `TooltipProvider` (all in `src/components/ui/`)

`PxHeader`, `PxFilterSlider`, and the internal `TabsStrip` are new. The tabs implementation is intentionally internal to the shell so the pattern owns the 48 px bar alignment; promote to `src/components/ui/tabs.tsx` when a second usage site appears.

## Known limitations

- Tabs overflow into a "More" dropdown when the centre cell narrows — not yet implemented. The current strip clips instead.
- `StatusLabel` is not yet a component in this repo, so the example page uses a compact inline pill. Replace with `<StatusLabel variant="open">` when it lands.
- `PxShellRail` is currently 56 px wide, not the DS-canonical 48 px. Handled outside this pattern.

## Component Composition Audit

- **Approved components reused:** `PxShellRail`, `Button`, `IconButton`, `PrismIcon`, `Avatar`, `TooltipProvider`, `Table*`, `Pagination`, `DropdownMenu*` (all in the example).
- **New components created:** `PxListShell` (pattern), `PxHeader` (pattern-owned), `PxFilterSlider` (pattern-owned), `TabsStrip` (internal — no standalone `Tabs` component exists yet).
- **Native interactive elements introduced:** the tabs in `PxHeader` and `PxFilterSlider` are native `<button role="tab">`. Justified: no `Tabs` component exists in this repo, and Prism DS spec for the Primary Tab pattern (border-indicator, badge-capable) is what the shell needs. Escalate to a shared `Tabs` component when a second consumer arrives.
- **`className` overrides on approved components:** none applied to `Button`, `IconButton`, `Avatar`. `PrismIcon` receives colour classes only (allowed — icon colour follows `currentColor`).
- **Cross-component token references:** none. All values come from primitive `--p-*` or semantic `--s-*` / effect `--e-*` tokens.
- **Duplicate implementations found:** none. The old inline `PxShellTopBar` in `audience-explorer.tsx` remains only for the legacy Audience Explorer route; new screens should use `PxListShell` per CLAUDE.md.
- **Unresolved API or token gaps:** (1) `StatusLabel` component missing — flagged in Known Limitations. (2) `Tabs` component missing — kept internal for now.
