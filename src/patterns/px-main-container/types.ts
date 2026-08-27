import type * as React from "react"

import type { PxHeaderProps, PxNavProps } from "@/patterns/px-list-shell"

// -----------------------------------------------------------------------------
// Public types for the PxMainContainer pattern
// -----------------------------------------------------------------------------
//
// PxMainContainer is the common navigation + header + content anatomy shared
// by every full-page PX shell — rail, PxHeader (one or two bars, per its own
// existing showSecondary logic), and a single raw content row. It carries no
// list-specific or form-specific behaviour: no filter slot, no assumption
// about what lives in `children`. See PxMainContainer.tsx and the README for
// Figma sources and the exact anatomy this factors out of PxListShell.
// -----------------------------------------------------------------------------

export type PxMainContainerProps = {
  /** Left-rail state. Forwarded to <PxShellRail />. */
  nav: PxNavProps
  /** Full two-bar Page Header configuration — identical surface to PxListShell's header prop. */
  header: PxHeaderProps
  /**
   * The content row rendered below the header, full height, unstyled by this
   * component (no padding, no background beyond the page surface). Callers
   * own everything inside — a single padded <main>, a <main> plus a filter
   * panel side by side, or anything else with the same "one flex row" shape.
   */
  children: React.ReactNode
  className?: string
}
