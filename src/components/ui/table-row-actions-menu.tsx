import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// -----------------------------------------------------------------------------
// TableRowActionsMenu — the per-row "more actions" (⋮) kebab menu inside a
// Table row's action cell.
//
// Figma source: Table page (20:34), "_Table/Body Cell" frame, the
// Type=More/State=Default|Hover|Selected symbol (node 1886:71) — the row-level
// action trigger is real, documented Table anatomy ("Hover reveals the More
// icon" per the page's own Behaviour row). The specific menu contents once
// opened are feature-owned (per the page's own Pairs-With note: "editing
// happens in a Third Pane or Modal opened from the row action") — this
// component owns only the trigger + menu shell, never the item set.
//
// Extracted from src/pages/user-explorer.tsx and
// src/pages/engagements-list-example.tsx, both of which previously hand-
// rolled an identical DropdownMenu/DropdownMenuTrigger/DropdownMenuContent
// composition directly at screen level — a real, undeclared dependency on
// component-dropdown-menu (Implemented-unmapped). This component is the
// sanctioned internal composition (see decision-dropdown-menu-scoped-
// composition's 2026-09-18 amendment): screens compose this component and
// pass DropdownMenuItem/DropdownMenuSeparator as `children` (the same
// caller-supplies-leaf-content pattern already established by SplitButton's
// `menuContent` prop), never DropdownMenu/DropdownMenuTrigger/
// DropdownMenuContent directly.
// -----------------------------------------------------------------------------

type TableRowActionsMenuProps = {
  /** Accessible name for the trigger, e.g. `Actions for ${row.name}`. */
  label: string
  /** Menu alignment against the trigger. Defaults to "end", matching every existing call site. */
  align?: "start" | "center" | "end"
  /** DropdownMenuItem / DropdownMenuSeparator elements. */
  children: React.ReactNode
}

function TableRowActionsMenu({ label, align = "end", children }: TableRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton icon="more-vertical" label={label} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

export { TableRowActionsMenu }
export type { TableRowActionsMenuProps }
