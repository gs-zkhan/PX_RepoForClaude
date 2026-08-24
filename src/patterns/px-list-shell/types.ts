import type * as React from "react"

import type { PxShellNavKey, PxShellRailMode } from "@/components/px-shell-rail"
import type { PrismIconName } from "@/components/ui/prism-icon"

// -----------------------------------------------------------------------------
// Public types for the PxListShell pattern
// -----------------------------------------------------------------------------
//
// The shell is a *layout* — feature-specific content (title, tabs, actions,
// filters, table data, pagination) is supplied by the calling screen via props
// and slots. See `PxListShell.tsx` and README for anatomy and rules.
// -----------------------------------------------------------------------------

export type PxHeaderUtility = {
  id: string
  icon: PrismIconName
  label: string
  onClick?: () => void
  disabled?: boolean
}

export type PxHeaderTab = {
  id: string
  label: string
  /** Optional numeric badge shown after the label. */
  badge?: number | string
  disabled?: boolean
}

export type PxHeaderActionVariant = "primary" | "secondary"

export type PxHeaderAction = {
  id: string
  label: string
  /**
   * Defaults: last action in the array → "primary", others → "secondary".
   * Pass explicitly to override.
   */
  variant?: PxHeaderActionVariant
  icon?: PrismIconName
  onClick?: () => void
  disabled?: boolean
}

export type PxHeaderProps = {
  // Primary Bar (always visible)
  moduleName: string
  /**
   * Centred slot in the Primary Bar. Typically a PEC (product/environment/
   * channel) context switcher, but the shell doesn't hard-code its shape.
   */
  primaryCenter?: React.ReactNode
  /** Right-side icon buttons in the Primary Bar. */
  primaryUtilities?: PxHeaderUtility[]
  /**
   * Right-most element in the Primary Bar — expected to be an <Avatar>.
   * Rendered after primaryUtilities and 24px of gap (space/300).
   */
  avatar?: React.ReactNode

  // Secondary Bar (optional)
  /**
   * When true, the Secondary Bar is rendered even if all secondary props are
   * empty. When omitted, the Secondary Bar auto-shows if any of the secondary
   * fields are provided.
   */
  showSecondary?: boolean

  /** Back-arrow handler. Renders the arrow when provided. */
  onBack?: () => void

  /** Page/record title shown in the Secondary Bar. */
  title?: string

  /**
   * Edit-pencil handler after the title. Renders the pencil when provided
   * and enables inline editing — clicking the pencil swaps the title for an
   * `<Input inline>`. Called with the committed value on blur or Enter; the
   * caller owns persisting it and updating `title`. Escape cancels without
   * calling this.
   */
  onEditTitle?: (newTitle: string) => void

  /** Optional chip after the title (e.g. environment). Typically a <Chip>. */
  titleChip?: React.ReactNode

  /** Tabs strip centred in the Secondary Bar. */
  tabs?: PxHeaderTab[]
  activeTabId?: string
  onTabChange?: (id: string) => void

  /** Right-side icon buttons in the Secondary Bar. */
  secondaryUtilities?: PxHeaderUtility[]

  /** Right-side pill buttons (after a divider). */
  secondaryActions?: PxHeaderAction[]
}

export type PxNavProps = {
  activeKey: PxShellNavKey
  onNavigate: (key: PxShellNavKey) => void
  /**
   * Pin state, lifted to the app root and passed through unchanged. Must be
   * threaded through every page that mounts this shell — if left uncontrolled,
   * each page owns its own <PxShellRail> instance and pin state resets to
   * "collapsed" whenever navigation unmounts one page and mounts another.
   */
  mode?: PxShellRailMode
  onModeChange?: (mode: PxShellRailMode) => void
}

export type PxListShellProps = {
  /** Left-rail state. Forwarded to <PxShellRail />. */
  nav: PxNavProps
  /** Two-bar Page Header configuration. */
  header: PxHeaderProps
  /**
   * Optional right-side 336px filter panel. Render <PxFilterSlider>…</> here
   * when the page has a filter surface visible alongside the table.
   */
  filterSlider?: React.ReactNode
  /**
   * Main content region. The shell adds 24px page-padding on all four sides
   * (space/300). Do NOT re-add page padding inside children.
   */
  children: React.ReactNode
}
