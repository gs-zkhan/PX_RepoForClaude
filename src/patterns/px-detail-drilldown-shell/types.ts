import type * as React from "react"

import type {
  PxHeaderAction,
  PxHeaderProps,
  PxHeaderTab,
  PxHeaderUtility,
  PxNavProps,
} from "@/patterns/px-list-shell"

// -----------------------------------------------------------------------------
// Public types for the PxDetailDrilldownShell pattern
// -----------------------------------------------------------------------------
//
// Generic page-shell for any PX single-record detail/drilldown view (Account,
// Segment, Feature, Engagement, User, or any entity where the user navigates
// from a list into a single-record view) — never entity-specific. See
// PxDetailDrilldownShell.tsx and the README for Figma sources and anatomy.
// -----------------------------------------------------------------------------

export type PxDetailDrilldownShellProps = {
  /** Left-rail state, forwarded to <PxMainContainer>. */
  nav: PxNavProps
  /**
   * Primary-bar-only fields, inherited unchanged from the parent list page —
   * same module name, PEC trigger, and RHS icons the user just navigated
   * from. Never add drilldown-specific content to the Primary Bar.
   */
  header: Pick<PxHeaderProps, "moduleName" | "primaryCenter" | "primaryUtilities" | "avatar">
  /**
   * Back-arrow handler in the Secondary Bar's left zone. Required — every
   * drilldown has a known parent surface. This is deterministic navigation
   * back to that specific parent (e.g. the list page the user came from),
   * never generic browser-history "back".
   */
  onBack: () => void
  /** Record/detail title shown next to the back arrow (e.g. "Acme Corp"). */
  title: string
  /**
   * Optional edit-pencil handler for the title. Omit to hide the pencil
   * entirely — Figma explicitly allows the BackArrow zone's edit icon to be
   * hidden when not needed for the context.
   */
  onEditTitle?: (newTitle: string) => void
  /** Optional chip after the title (e.g. a status chip). Omit to hide it. */
  titleChip?: React.ReactNode
  /**
   * Optional center-zone tabs (e.g. "Overview" / "Users" / "Features").
   * Omit entirely for the Empty center-zone variant — most drilldowns won't
   * need this.
   */
  tabs?: PxHeaderTab[]
  activeTabId?: string
  onTabChange?: (id: string) => void
  /**
   * Drilldown-owned contextual icon utilities in the Secondary Bar's right
   * zone (e.g. info, duplicate). These are never inherited from the parent
   * list page's own utilities — the drilldown supplies its own or omits
   * this entirely for the Empty right-zone variant.
   */
  secondaryUtilities?: PxHeaderUtility[]
  /**
   * Drilldown-owned pill actions in the Secondary Bar's right zone (e.g.
   * Edit record, Delete, Share). These are never inherited from the parent
   * list page's own actions (Create, Export, Bulk Edit, Filter do not carry
   * over) — omit entirely for the Empty right-zone variant.
   */
  secondaryActions?: PxHeaderAction[]
  /**
   * Drilldown-specific content — entirely caller-defined and product-owned
   * (summary stat cards, health scores, tables, usage charts, empty states,
   * etc.). The shell applies 24px padding (space/300) and owns scrolling;
   * never re-add page padding inside children. This generic shell must
   * never hard-code entity-specific content (e.g. Account Explorer cards) —
   * that belongs to the screen composing this shell, not the shell itself.
   */
  children: React.ReactNode
  className?: string
}
