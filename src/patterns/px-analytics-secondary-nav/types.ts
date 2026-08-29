import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Public types for the PxAnalyticsSecondaryNav pattern.
//
// The API is deliberately semantic (sections/items/selection/callbacks), not
// visual — width, spacing and colours are owned entirely by the composed
// Accordion component and the row's own token bindings. See README.md for
// the full anatomy, Figma sources and known deviations.
// -----------------------------------------------------------------------------

export type PxAnalyticsNavItem = {
  id: string
  label: string
  /**
   * Real destination URL, when the consuming app has actual routing for
   * this sub-page. When present, the row renders as a real <a href> (link
   * semantics: browser history, open-in-new-tab, screen-reader "link"
   * role). When omitted, the row renders as a <button> that only changes
   * local application state via `onSelectItem` — this repo's own demo has
   * no real routes, matching PxShellRail's primary-nav precedent.
   */
  href?: string
}

export type PxAnalyticsNavSection = {
  id: string
  label: string
  /** 24px leading icon shown in the section's Accordion header. */
  icon: PrismIconName
  items: PxAnalyticsNavItem[]
}

export type PxAnalyticsSecondaryNavProps = {
  /**
   * Panel title shown in the expanded state's top title row, beside the
   * collapse button (Figma node 9576:16007, "Title" — e.g. "All Reports").
   * Not derived from `sections` — Figma shows this as its own literal
   * string, independent of any one section's label.
   */
  title: string
  /**
   * Fixed-order section list. Figma specifies a fixed product-workflow order
   * (Favorites → Audience → Features → Engagement) — the component renders
   * whatever order the caller supplies, it does not re-sort. Also drives the
   * collapsed state's icon rail (one icon per section, in the same order).
   */
  sections: PxAnalyticsNavSection[]
  /** The single currently-active sub-page item id, across all sections. */
  activeItemId?: string
  onSelectItem: (itemId: string, sectionId: string) => void
  /**
   * Controlled open-section state. Omit to let the component manage it
   * internally — it defaults to every section open, matching Figma's
   * "all sections start State=Open" rule.
   */
  openSectionIds?: string[]
  onOpenSectionIdsChange?: (ids: string[]) => void
  /**
   * Controlled collapsed state (Figma node 9576:15005, "Property 1=Expanded"
   * / "Property 1=Collapsed" — see README "Collapse/expand"). Omit to let
   * the component manage it internally (see `defaultCollapsed`).
   * Collapsing/expanding never resets `openSectionIds` or `activeItemId` —
   * section-open and selected-item state is preserved across both, by
   * construction (this component never unmounts, it only conditionally
   * renders a different subtree).
   */
  collapsed?: boolean
  /** Initial collapsed state when uncontrolled. Defaults to false (expanded), per Figma's default variant. */
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Placement only (e.g. flex sizing from a parent row) — never visual overrides. */
  className?: string
}
